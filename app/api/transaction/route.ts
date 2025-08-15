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
            .from("transactions")
            .select("*")
            .eq("sender_gstin", token.gstin);

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
