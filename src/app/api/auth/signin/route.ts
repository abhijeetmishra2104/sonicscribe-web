import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { signJwt } from "@/lib/jwt"; // If you're managing your own JWTs
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Compare password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT (if not using NextAuth) — used by the React Native app
    const token = signJwt({ id: user.id, email: user.email, name: user.name }, "30d");

    // Never send the password hash back to the client
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };

    return NextResponse.json({ token, user: safeUser }, { status: 200 });
  } catch (err) {
    console.error("Signin route error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
