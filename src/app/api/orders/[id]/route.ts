import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: true,
        payment: true,
        shipment: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    const session = await getSession();

    // Check authorization:
    // 1. Admin
    // 2. Owner user
    // 3. Or valid guest token
    const isOwner = session && session.userId === order.userId;
    const isAdmin = session && session.role === "ADMIN";
    const hasValidToken = token && token === order.accessToken;

    if (!isOwner && !isAdmin && !hasValidToken) {
      return NextResponse.json(
        { success: false, error: "Authorization required to inspect this order." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("[orders/[id] GET error]", error);
    return NextResponse.json({ success: false, error: "Failed to load order." }, { status: 500 });
  }
}
