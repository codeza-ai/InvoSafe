import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

// This handler is used for both GET and POST requests
// to handle authentication requests in Next.js API routes. 
export { handler as GET, handler as POST };
