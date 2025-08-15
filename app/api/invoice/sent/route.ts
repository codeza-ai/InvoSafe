import { supabaseAdmin } from "@/db/connect";
import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
    try{
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if(!token || !token.gstin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // Fetching invoice requests
        const {data: invoices, error: dbError} = await supabaseAdmin
            .from("invoices")
            .select("*")
            .eq("sender_gstin", token.gstin)
            .eq("status", "requested");

        if (dbError) {
            return NextResponse.json({ error: "Database error: " + dbError.message }, { status: 500 });
        }
        if (!invoices || invoices.length === 0) {
            return NextResponse.json({ message: "No invoice requests found" }, { status: 404 });
        }

        return NextResponse.json(invoices, { status: 200 });
    }catch (error) {
        return NextResponse.json({ error: "Error :" + error}, { status: 401 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token || !token.gstin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const invoiceId = searchParams.get("id");

        if (!invoiceId) {
            return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
        }

        // Deleting the invoice request
        const { error: deleteError } = await supabaseAdmin
            .from("invoices")
            .delete()
            .eq("id", invoiceId)
            .eq("sender_gstin", token.gstin);

        if (deleteError) {
            return NextResponse.json({ error: "Database error: " + deleteError.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Invoice request deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error :" + error }, { status: 500 });
    }
}