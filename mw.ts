// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard", "/profile"];
const authPages = ["/login", "/register"];

export default async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // If user is not signed in and tries to access a protected route
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is signed in and tries to access login/signup
  if (token && authPages.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
// export default async function withAuth(
//   middleware,
//   {
//     callbacks: {
//       authorized: async ({ token, request }) => {
//         // Allow access if the user is authenticated
//         return !!token;
//       },
//     }
//   }
// )

//
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};
