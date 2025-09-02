import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db/connect";

export async function POST(request: NextRequest) {
  try {
    const { gstin } = await request.json();
    if (!gstin) {
      return NextResponse.json({ error: "GSTIN is required" }, { status: 400 });
    }

    // Fetch user by GSTIN
    const { data: recipient, error } = await supabaseAdmin
      .from("key-attributes")
      .select("public_key")
      .eq("gstin", gstin)
      .single();
    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found." },
        { status: 404 }
      );
    }
    if (error) {
      console.error("Error fetching recipient information: ", error);
      return NextResponse.json(
        { error: "Error while fetching user details. Try later." },
        { status: 404 }
      );
    }
    // Only send necessary recipient details
    const userResponse = {
      publicKey: recipient.public_key,
      gstin: gstin,
    };

    return NextResponse.json({ recipient: userResponse }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}