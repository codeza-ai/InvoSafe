import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/db/connect";

export const authOptions: NextAuthOptions = {
  providers: [
    // Set up credentials-based authentication
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        gstin: { label: "GST Number", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // Function to authorize user based on credentials
      async authorize(credentials, request) {
        // console.log(credentials);
        // return null;
        if(!credentials?.gstin || !credentials?.password){
          throw new Error("GST Number and Password are required");
        }
        try {
          const { data: userData, error: userError } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("gstin", credentials.gstin)
            .single();

          if(userError) {
            console.error("Error fetching user");
            throw new Error("Failed to fetch user data");
          }

          if (!userData) {
            console.error("User not found");
            return null;
          }
          // Check if the password matches
          const isPasswordValid = await bcrypt.compare(credentials.password, userData.password);
          if (!isPasswordValid) {
            console.error("Invalid password");
            return null;
          }
          // If password is valid, return user data

          const user =  {  
            id: userData.user_id, // Required by NextAuth
            gstin: userData.gstin,
            user_id: userData.user_id,
            business_name: userData.business_name,
            profile_url: userData.profile_url || null,
            mobile_number: userData.mobile_number || null,
            business_email: userData.business_email || null,
            business_address: userData.business_address || null,
            business_description: userData.business_description || null,
          };
          return user as NextAuthUser;
          
        }catch (error) {
          console.error("Error during authorization:", error);
          throw new Error("Error while fetching user data");
        }
      },
    }),
  ],
  callbacks: {
    // Callback to handle JWT token
    // This function is called whenever a JWT token is created or updated
    // It can be used to add custom properties to the token
    async jwt({ token, user}) {
      // If user data is available, add it to the token
      if(user) {
        token.gstin = user.gstin as string;
        token.user_id = user.user_id as string;
        token.business_name = user.business_name as string; 
        token.profile_url = user.profile_url as string;
        token.mobile_number = user.mobile_number as string;
        token.business_email = user.business_email as string;
        token.business_address = user.business_address as string;
        token.business_description = user.business_description as string;
      }
      return token;
    },
    // Callback to handle session
    // This function is called whenever a session is accessed
    // It can be used to modify the session object
    async session({ session, token }) {
      // If token data is available, add it to the session
      if (token) {
        session.user.gstin = token.gstin as string;
        session.user.user_id = token.user_id as string;
        session.user.business_name = token.business_name as string;
        session.user.profile_url = token.profile_url as string | undefined;
        session.user.mobile_number = token.mobile_number as string | undefined;
        session.user.business_email = token.business_email as string | undefined;
        session.user.business_address = token.business_address as string | undefined;
        session.user.business_description = token.business_description as string | undefined;
      }
      return session;
    },
    // Callback to handle sign-in
    // This function is called when a user signs in
    // It can be used to perform additional checks or actions
    async signIn({ user, account, profile, email, credentials }) {
      return true;
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
    maxAge: 7 * 24 * 60 * 60, // Session expires in 7 days
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret for signing tokens
};
