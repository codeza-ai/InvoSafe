import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/db/connect";

export async function POST(request: NextRequest) {
  try {
    const { gstin } = await request.json();
    if (!gstin) {
      return NextResponse.json({ error: "GSTIN is required" }, { status: 400 });
    }

    // Fetch user by GSTIN
    const { data: keyAttributes, error } = await supabaseAdmin
      .from("key-attributes")
      .select("*")
      .eq("gstin", gstin)
      .single();
    if (!keyAttributes) {
      return NextResponse.json(
        { error: "User not found. Register first to use InvoSafe" },
        { status: 404 }
      );
    }
    if (error) {
      console.error("Error fetching key attributes:", error);
      return NextResponse.json(
        { error: "Error while fetching user details. Try later." },
        { status: 404 }
      );
    }
    // Only send necessary user details
    const userResponse = {
      encryptedKey: keyAttributes.encrypted_key,
      keyDecryptionNonce: keyAttributes.key_decryption_nonce,
      kekSalt: keyAttributes.kek_salt,
      opsLimit: keyAttributes.ops_limit,
      memLimit: keyAttributes.mem_limit,
      publicKey: keyAttributes.public_key,
      encryptedSecretKey: keyAttributes.encrypted_secret_key,
      secretKeyDecryptionNonce: keyAttributes.secret_key_decryption_nonce,
    };

    return NextResponse.json({ keyAttributes: userResponse }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}