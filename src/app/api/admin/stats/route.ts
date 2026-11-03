import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Administrative authorization required." }, { status: 403 });
    }

    const [productCount, orderCount, userCount, orders, recentProducts] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { items: true, payment: true },
      }),
      prisma.product.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { variants: { include: { inventory: true } } },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    return NextResponse.json({
      success: true,
      stats: {
        productCount,
        orderCount,
        userCount,
        totalRevenue,
      },
      orders,
      products: recentProducts,
    });
  } catch (error) {
    console.error("[admin stats error]", error);
    return NextResponse.json({ success: false, error: "Failed to query atelier archives." }, { status: 500 });
  }
}
