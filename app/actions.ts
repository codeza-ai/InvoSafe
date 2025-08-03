"use server";

import { supabaseAdmin } from "@/db/connect";
import { Subscriber } from "@/db/types/subscriber";

export async function Subscribe(email: string) {
  const entry: Subscriber = {
    // Ensure the email is valid
    created_at : new Date().toISOString(),
    subscriber_email: email,
  };
  const { data, error } = await supabaseAdmin
    .from("subscribers")
    .insert([entry]);

  if (error) {
    console.error("Error subscribing:", error);
  }
}
