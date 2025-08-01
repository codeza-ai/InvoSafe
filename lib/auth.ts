import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/db/connect";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {
  providers: [
    // Set up credentials-based authentication
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        gstin: { label: "GST Number", type: "text" },
        password: { label: "Password", type: "passsword" }, // Typo: should be "password"
      },

      // Function to authorize user based on credentials
      async authorize(credentials) {
        const res = await fetch("/your/endpoint", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    // Callback to handle sign-in
    // This function is called when a user signs in
    // It can be used to perform additional checks or actions
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },

    // Callback to handle redirection after sign-in
    // This function is called after a successful sign-in
    // It can be used to redirect the user to a specific page
    async redirect({ url, baseUrl }) {
      // If url is from same origin, allow it
      if (!url.startsWith(baseUrl)) return baseUrl;
      return `${baseUrl}/dashboard`;
    },

    // Callback to handle session
    // This function is called whenever a session is accessed
    // It can be used to modify the session object
    async session({ session, user, token }) {
      return session;
    },

    // Callback to handle JWT token
    // This function is called whenever a JWT token is created or updated
    // It can be used to add custom properties to the token
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
  // Custom pages for sign-in and error
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Session configuration
  session: {
    strategy: "jwt", // Use JWT for session management
    maxAge: 30 * 24 * 60 * 60, // Session expires in 30 days
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret for signing tokens
};
