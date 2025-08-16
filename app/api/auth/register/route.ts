import { supabaseAdmin } from "@/db/connect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { gstin, user_id, password, keyAttributes } = await request.json();

    if (!gstin || !password) {
      return NextResponse.json(
        { error: "GSTIN and password are required" },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    if (!keyAttributes) {
      return NextResponse.json(
        { error: "Key attributes not generated, please try again later." },
        { status: 400 }
      );
    }
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if the user already exists
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("gstin", gstin)
      .single();
    if (userError && userError.code !== "PGRST116") {
      return NextResponse.json(
        { error: "Failed to check existing user" },
        { status: 400 }
      );
    }
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const { data: business, error: businessError } = await supabaseAdmin
      .from("businesses")
      .select("*")
      .eq("gstin", gstin);

    if (!business || businessError) {
      console.error("Error fetching business:", businessError);
      return NextResponse.json(
        {
          error:
            "Failed to fetch business. The GSTIN could be incorrect or the service might be temporarily unavailable.",
        },
        { status: 404 }
      );
    }
    // Use a transaction to ensure atomicity
    const { data, error } = await supabaseAdmin.rpc('register_user_with_keys', {
      p_user_id: user_id,
      p_gstin: gstin,
      p_business_name: business?.[0]?.business_name,
      p_mobile_number: business?.[0]?.mobile_number,
      p_password: hashedPassword,
      p_business_address: business?.[0]?.business_address,
      p_business_description: business?.[0]?.business_description,
      p_encrypted_key: keyAttributes.encryptedKey,
      p_key_decryption_nonce: keyAttributes.keyDecryptionNonce,
      p_kek_salt: keyAttributes.kekSalt,
      p_ops_limit: keyAttributes.opsLimit,
      p_mem_limit: keyAttributes.memLimit,
      p_public_key: keyAttributes.publicKey,
      p_encrypted_secret_key: keyAttributes.encryptedSecretKey,
      p_secret_key_decryption_nonce: keyAttributes.secretKeyDecryptionNonce
    });

    if (error) {
      console.error("Error in atomic registration:", error);
      return NextResponse.json(
        { error: "Failed to register user and key attributes" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 400 }
    );
  }
}
