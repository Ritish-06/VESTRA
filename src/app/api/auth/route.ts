import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession, getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true, phone: true },
  });

  return NextResponse.json({ authenticated: true, user });
}

export async function POST(request: Request) {
  try {
    const { action, email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email address and password required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    if (action === "register") {
      const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists." },
          { status: 400 }
        );
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: {
          name: name?.trim() || "Valued Client",
          email: cleanEmail,
          passwordHash,
          role: "CUSTOMER",
        },
      });

      await createSession({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      return NextResponse.json({
        success: true,
        message: "Private membership created.",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    }

    // Default: Login
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials provided." },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials provided." },
        { status: 401 }
      );
    }

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      message: "Session authenticated.",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("[api/auth error]", error);
    return NextResponse.json(
      { success: false, error: "Authentication protocol failed." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  await deleteSession();
  return NextResponse.json({ success: true, message: "Session signed out." });
}
