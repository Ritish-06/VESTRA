import { NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    let filtered = [...PRODUCTS];

    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.collectionName.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      products: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to query atelier catalog." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: "Missing required product fields." },
        { status: 400 }
      );
    }

    // In a live production DB with Prisma:
    // const created = await prisma.product.create({ data: ... });
    return NextResponse.json({
      success: true,
      message: "Haute couture garment registered in atelier catalog.",
      product: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to register garment." },
      { status: 500 }
    );
  }
}

