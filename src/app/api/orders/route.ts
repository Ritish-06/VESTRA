import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Atelier Order Dispatch API online.",
  });
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    if (!orderData.shippingAddress || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order payload." },
        { status: 400 }
      );
    }

    const orderNumber = `VST-${Math.floor(100000 + Math.random() * 900000)}`;

    const confirmedOrder = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      nfcAuthenticationId: `NFC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    };

    return NextResponse.json({
      success: true,
      message: "Atelier order authenticated and scheduled for tailoring.",
      order: confirmedOrder,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process order." },
      { status: 500 }
    );
  }
}

