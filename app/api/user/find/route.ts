import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { supabaseAdmin } from "@/db/connect";

export async function POST(req: NextRequest) {
    try{
        // Check authentication using JWT token
        const token = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
        });
        
        if (!token || !token.gstin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { gstin } = await req.json();

        if (!gstin) {
            return NextResponse.json(
                { error: "GSTIN is required" },
                { status: 400 }
            );
        }

        // Fetch user by GSTIN
        const { data: user, error } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("gstin", gstin)
            .single();
        if(!user){
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        if (error) {
            console.error("Error fetching user:", error);
            return NextResponse.json(
                { error: "Failed to fetch user. The GSTIN could be incorrect." },
                { status: 404 }
            );
        }
        // Only send necessary user details
        const userResponse = {
            user_id: user.user_id,
            gstin: user.gstin,
            business_name: user.business_name,
            business_email: user.business_email,
            business_address: user.business_address,
            business_description: user.business_description,
            mobile_number: user.mobile_number,
            profile_url: user.profile_url
        };

        return NextResponse.json({ user: userResponse }, { status: 200 });
    }
    catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}