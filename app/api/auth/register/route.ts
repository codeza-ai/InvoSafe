import { supabaseAdmin } from "@/db/connect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { gstin, user_id, password } = await request.json();

    if (!gstin || !password) {
      return NextResponse.json(
        { error: "GSTIN and password are required" },
        { status: 400 }
      );
    }

    // Hash the password on the server side
    const hashedPassword = await bcrypt.hash(password, 10);

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
    const {data: business, error: businessError} = await supabaseAdmin
        .from("businesses")
        .select("*")
        .eq("gstin", gstin);

    if (businessError) {
      console.error("Error fetching business:", businessError);
      return NextResponse.json(
        { error: "Failed to fetch business. The GSTIN could be incorrect. Check the details." },
        { status: 404 }
      );
    }
    const {data : newUser, error: newUserError} = await supabaseAdmin
        .from("users")
        .insert([{ 
          user_id,
          gstin, 
          business_name: business?.[0]?.business_name,
          mobile_number: business?.[0]?.mobile_number,
          profile_url : null,
          password: hashedPassword, // Store the server-side hashed password
        }]);

    if (newUserError) {
      console.error("Error inserting user:", newUserError);
      return NextResponse.json(
        { error: "Failed to register user" },
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
