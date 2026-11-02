import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { action, email, password, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address required." },
        { status: 400 }
      );
    }

    if (action === "register") {
      return NextResponse.json({
        success: true,
        message: "Private membership created.",
        user: {
          id: `usr_${Date.now()}`,
          name: name || "Valued Client",
          email,
          role: "CLIENT",
          membershipTier: "Atelier Haute Member",
        },
      });
    }

    // Default: Login
    return NextResponse.json({
      success: true,
      message: "Session authenticated.",
      user: {
        id: "usr_client_01",
        name: name || (email.split("@")[0].toUpperCase() + " • Private Client"),
        email,
        role: email.includes("admin") ? "ADMIN" : "CLIENT",
        membershipTier: "Atelier Haute Member",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Authentication protocol failed." },
      { status: 500 }
    );
  }
}

