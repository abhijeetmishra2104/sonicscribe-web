import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This secret should match NEXTAUTH_SECRET in your .env file
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });

  const { pathname } = request.nextUrl;

  // Allow public paths
  if (pathname.startsWith("/api") || pathname === "/auth/signup") {
    console.log("Public path accessed:", pathname);
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected routes
  if (!token && pathname.startsWith("/upload")) {
    console.log("Unauthenticated access to protected route:", pathname);
    return NextResponse.redirect(new URL("/auth/signup", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*", "/uploaded-files/:path*"],
};
