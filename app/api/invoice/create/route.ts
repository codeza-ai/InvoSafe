import { supabaseAdmin } from "@/db/connect";
import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { InvoiceSchema } from "@/db/types/invoice";

export async function POST(req: NextRequest) {
  try {
    // Check authentication using JWT token
    const token = await getToken({
      req,
      secret: process.env.NEXT_AUTH_SECRET,
    });
    
    if (!token || !token.gstin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    
    // Extract form fields (no validation here - handled on client)
    const senderGstin = formData.get("senderGstin") as string;
    const receiverGstin = formData.get("receiverGstin") as string;
    const amount = formData.get("amount") as string;
    const title = formData.get("title") as string;
    const invoiceNumber = formData.get("invoiceNumber") as string;
    const description = formData.get("description") as string;
    const invoiceDate = formData.get("invoiceDate") as string;
    const file = formData.get("invoiceFile") as File;
    const senderUserName = formData.get("senderUserName") as string;

    // Generate unique invoice ID
    const invoiceId = crypto.randomUUID();

    // Get receiver user ID and business name from GST number
    const { data: receiverUser } = await supabaseAdmin
      .from("users")
      .select("business_name")
      .eq("gstin", receiverGstin)
      .single();

    if (!receiverUser) {
      return NextResponse.json({ error: "Invalid receiver GST number" }, { status: 400 });
    }

    // Prepare invoice data
    const invoiceData = {
      invoice_id: invoiceId,
      sender_gstin: senderGstin,
      recipient_gstin: receiverGstin,
      amount: parseFloat(amount),
      status: "requested",
      invoice_date: invoiceDate,
      sender_name: senderUserName,
      recipient_name: receiverUser.business_name,
      title: title,
      description: description || null,
      invoice_number: invoiceNumber,
    };

    // Validate data with Zod schema
    const validatedData = InvoiceSchema.parse(invoiceData);
    if( !validatedData) {
      return NextResponse.json({ error: "Invalid invoice data" }, { status: 400 });
    }
    // Upload file to Supabase Storage if provided
    let filePath = null;
    if (file && file.size > 0) {
      const fileExtension = file.name.split('.').pop();
      filePath = `${senderGstin}/${invoiceId}.${fileExtension}`;
      
      const { error: uploadError } = await supabaseAdmin.storage
        .from("invoices")
        .upload(filePath, file);

      if (uploadError) {
        console.error("File upload error:", uploadError);
        return NextResponse.json({ error: "File upload failed" }, { status: 500 });
      }
    }

    // Create invoice entry in database
    const { data , error: dbError } = await supabaseAdmin
      .from("invoices")
      .insert([validatedData]);

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Invoice created successfully", 
      success: true,
    }, { status: 201 });

  } catch (error) {
    console.error("Invoice creation error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
