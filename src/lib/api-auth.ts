import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";

export type AuthUser = {
  id?: string;
  email: string;
  name?: string | null;
};

/**
 * Resolves the current user from either:
 *  - the NextAuth session cookie (web app), or
 *  - an `Authorization: Bearer <token>` header signed with JWT_SECRET (mobile app).
 *
 * Returns null when neither is present/valid.
 */
export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  // 1. Mobile clients: bearer token issued by /api/auth/signin
  const authHeader = req.headers.get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    const payload = verifyJwt(token);
    if (payload && typeof payload === "object" && "email" in payload) {
      const claims = payload as { id?: string; email: string; name?: string | null };
      return { id: claims.id, email: claims.email, name: claims.name ?? null };
    }
    return null;
  }

  // 2. Web clients: NextAuth session cookie
  const nextAuthToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!nextAuthToken) return null;

  const sessionUser = (nextAuthToken.user ?? {}) as {
    id?: string;
    name?: string | null;
    email?: string | null;
  };

  const email = sessionUser.email ?? (nextAuthToken.email as string | undefined);
  if (!email) return null;

  return {
    id: sessionUser.id ?? (nextAuthToken.sub as string | undefined),
    email,
    name: sessionUser.name ?? null,
  };
}

/**
 * Convenience guard for API routes. Returns either the user or a ready-to-return
 * 401 response.
 */
export async function requireAuth(
  req: NextRequest
): Promise<{ user: AuthUser; response: null } | { user: null; response: NextResponse }> {
  const user = await getAuthUser(req);
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { user, response: null };
}
