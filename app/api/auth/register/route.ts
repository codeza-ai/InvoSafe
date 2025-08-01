import { supabaseAdmin } from "@/db/connect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { gstin, password } = await request.json();

    if (!gstin || !password) {
    }

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
    const {data, error} = await supabaseAdmin
        .from("users")
        .insert([{ gstin, password }]);

    if (error) {
        console.error("Error inserting user:", error);
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 400 }
        );
    }
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 400 }
    );
  }
}
