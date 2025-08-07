import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      gstin: string;
      user_id: string;
      business_name: string;
      profile_url?: string | null;
      mobile_number?: string;
      email?: string;
      business_address?: string;
      business_description?: string;
      business_email?: string;
    } & DefaultSession["user"];
  }

  interface User {
    gstin: string;
    user_id: string;
    business_name: string;
    profile_url?: string | null;
    mobile_number?: string;
    email?: string;
    business_address?: string;
    business_description?: string;
    business_email?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    gstin: string;
    user_id: string;
    business_name: string;
    profile_url?: string;
  }
}
