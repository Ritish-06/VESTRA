import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { calculateOrderPricing, CartItemInput } from "@/lib/pricing";
import { DeliveryMethodId, estimatedDeliveryRange } from "@/lib/commerce";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    }

    const where = session.role === "ADMIN" ? {} : { userId: session.userId };
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        payment: true,
        shipment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("[orders GET error]", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve orders." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      shippingAddress,
      deliveryMethod = "STANDARD",
      couponCode,
      idempotencyKey,
      paymentMethod = "TEST_MODE",
    } = body as {
      items: CartItemInput[];
      shippingAddress: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state?: string;
        postalCode: string;
        country: string;
      };
      deliveryMethod: DeliveryMethodId;
      couponCode?: string;
      idempotencyKey: string;
      paymentMethod?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "Shopping bag cannot be empty." }, { status: 400 });
    }

    if (!shippingAddress?.fullName || !shippingAddress?.email || !shippingAddress?.address) {
      return NextResponse.json({ success: false, error: "Incomplete shipping information." }, { status: 400 });
    }

    const key = idempotencyKey || `idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Prevent duplicate orders
    const existingOrder = await prisma.order.findUnique({
      where: { idempotencyKey: key },
      include: { items: true, payment: true, shipment: true },
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        order: existingOrder,
        message: "Order already authenticated and confirmed.",
      });
    }

    // Server-side authoritative price, total and inventory validation
    const pricing = await calculateOrderPricing(items, deliveryMethod, couponCode);
    if (!pricing.valid) {
      return NextResponse.json({ success: false, error: pricing.error }, { status: 400 });
    }

    const session = await getSession();
    const userId = session?.userId ?? null;
    const orderNumber = `VST-${Math.floor(100000 + Math.random() * 900000)}`;
    const deliveryRange = estimatedDeliveryRange(deliveryMethod);

    // Initial timeline tracking event
    const now = new Date();
    const trackingEvents = [
      {
        status: "PLACED",
        at: now.toISOString(),
        note: "Order placed and assigned to private atelier docket.",
      },
      {
        status: "CONFIRMED",
        at: now.toISOString(),
        note: "Payment verified. Atelier tailoring sequence scheduled.",
      },
    ];

    // Transactional creation in PostgreSQL
    const createdOrder = await prisma.$transaction(async (tx) => {
      // 1. Decrement inventory for each ordered variant
      for (const item of pricing.items) {
        await tx.inventory.update({
          where: { variantId: item.variantId },
          data: {
            quantity: { decrement: item.quantity },
          },
        });
      }

      // 2. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          idempotencyKey: key,
          userId,
          email: shippingAddress.email.toLowerCase().trim(),
          status: "CONFIRMED",
          subtotal: pricing.subtotal,
          discount: pricing.discount,
          shippingFee: pricing.shippingFee,
          total: pricing.total,
          currency: "INR",
          couponCode: pricing.couponApplied?.code || null,
          deliveryMethod,
          estimatedDelivery: deliveryRange.latest,
          shippingAddress: shippingAddress as object,
          items: {
            create: pricing.items.map((it) => ({
              productId: it.productId,
              variantId: it.variantId,
              productName: it.productName,
              colorName: it.colorName,
              size: it.size,
              image: it.image,
              unitPrice: it.unitPrice,
              quantity: it.quantity,
            })),
          },
          payment: {
            create: {
              provider: paymentMethod === "RAZORPAY" ? "RAZORPAY" : "TEST_MODE",
              amountPaise: pricing.total * 100,
              currency: "INR",
              status: "CAPTURED",
              isTestMode: true,
              providerPaymentId: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            },
          },
          shipment: {
            create: {
              carrier: "VESTRA Atelier Courier",
              trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
              status: "CONFIRMED",
              events: trackingEvents as object,
            },
          },
        },
        include: {
          items: true,
          payment: true,
          shipment: true,
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      message: "Order placed and confirmed in atelier archives.",
      order: createdOrder,
    });
  } catch (error) {
    console.error("[orders POST error]", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Order processing failed." },
      { status: 500 }
    );
  }
}
