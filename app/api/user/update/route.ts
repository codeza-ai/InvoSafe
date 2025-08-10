//https://fxlianxlwekzkiqarlev.supabase.co/storage/v1/object/public/profile-pictures/

import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
import { supabaseAdmin } from "@/db/connect";

export async function POST(req: NextRequest) {
    try{
        const formData = await req.formData();

        const picture = formData.get("profilePicture") as File | null;
        const user_id = formData.get("userId") as string;
        const description = formData.get("description") as string;
        const email = formData.get("email") as string;

        if (!user_id) {
            return NextResponse.json(
                { error: "User ID is required." },
                { status: 400 }
            );
        }
        
        // Fetch user by user_id
        const { data: user, error: userFetchError } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("user_id", user_id)
            .single();

        if (userFetchError || !user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        let filePath = user.profile_url; // Keep existing profile URL by default

        // Handle file upload if a new picture is provided
        if (picture && picture.size > 0) {
            const fileExtension = picture.name.split(".").pop()?.toLowerCase();
            
            if (!fileExtension || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
                return NextResponse.json(
                    { error: "Invalid file type. Only images are allowed." },
                    { status: 400 }
                );
            }

            const fileName = `${user_id}.${fileExtension}`;
            filePath = `https://fxlianxlwekzkiqarlev.supabase.co/storage/v1/object/public/profile-pictures/${fileName}`;

            // Upload file to Supabase storage
            const { error: uploadError } = await supabaseAdmin.storage
                .from("profile-pictures")
                .upload(fileName, picture, {
                    upsert: true // This will overwrite existing file with same name
                });

            if (uploadError) {
                console.error("File upload error:", uploadError);
                return NextResponse.json(
                    { error: "File upload failed: " + uploadError.message },
                    { status: 500 }
                );
            }
        }

        // Update user profile in database
        const { error: updateError } = await supabaseAdmin
            .from("users")
            .update({
                profile_url: filePath,
                business_description: description || user.business_description,
                business_email: email || user.business_email
            })
            .eq("user_id", user_id);

        if (updateError) {
            console.error("Error updating user:", updateError);
            return NextResponse.json(
                { error: "Failed to update user profile: " + updateError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            message: "Profile updated successfully!",
            profile_url: filePath 
        }, { status: 200 });
    }
    catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ 
            error: "Internal Server Error: " + (error instanceof Error ? error.message : "Unknown error")
        }, { status: 500 });
    }
}