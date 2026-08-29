import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/auth/signin") ||
    pathname.startsWith("/auth/signup") ||
    pathname.startsWith("/api/auth");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const isApiRoute = pathname.startsWith("/api/");

  // 2. Native/mobile clients authenticate with `Authorization: Bearer <jwt>`.
  //    This proxy runs on the edge runtime where `jsonwebtoken` is unavailable,
  //    so the signature is verified inside the route handler via `requireAuth`.
  //    Here we only let the request through to be checked there.
  if (isApiRoute) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.toLowerCase().startsWith("bearer ")) {
      return NextResponse.next();
    }
  }

  const token = await getToken({ req: request, secret });

  // 3. Block everything else if not logged in
  if (!token) {
    // API callers (web fetch and mobile alike) need a JSON 401, not an HTML redirect.
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

// 4. Apply to all routes.
//    Icon files must be excluded alongside favicon.ico — they are requested by
//    the browser on public pages, so redirecting them to sign-in breaks the
//    favicon and the Apple touch icon for logged-out visitors.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest.webmanifest).*)",
  ],
};
