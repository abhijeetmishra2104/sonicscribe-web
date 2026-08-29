import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

/**
 * Returns the currently authenticated user.
 * Works for the web app (NextAuth cookie) and the mobile app (Bearer JWT),
 * which uses it to restore a session on launch and detect expired tokens.
 */
export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: auth.email },
    select: { id: true, name: true, email: true, image: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
