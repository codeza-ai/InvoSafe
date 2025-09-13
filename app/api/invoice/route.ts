import { supabaseAdmin } from "@/db/connect";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if(!token || !token.gstin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { invoice_id, gstin} = await req.json();
        if(!invoice_id || !gstin) {
            return NextResponse.json({ error: "Missing invoice_id or gstin" }, { status: 400 });
        }
        // Fetching invoice where sender_gstin or receiver_gstin matches the gstin
        const { data: invoice, error: dbError } = await supabaseAdmin.rpc('get_invoice_details',{
            p_invoice_id : invoice_id,
            p_gstin: gstin
        });

        if (dbError) {
            return NextResponse.json({ error: "Database error: " + dbError.message }, { status: 500 });
        }
        if (!invoice) {
            return NextResponse.json({ message: "No invoice requests found" }, { status: 404 });
        }

        return NextResponse.json(invoice, { status: 200 });
    }catch (error) {
        return NextResponse.json({ error: "Error :" + error}, { status: 401 });
    }
}