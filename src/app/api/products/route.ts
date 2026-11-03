import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const collection = searchParams.get("collection");
    const query = searchParams.get("q");

    const { products, collections } = await getCatalog();
    let filtered = [...products];

    if (category && category !== "all") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (collection && collection !== "all") {
      filtered = filtered.filter((p) => p.collectionId === collection);
    }

    if (query) {
      const q = query.toLowerCase().trim();
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
      collections,
    });
  } catch (error) {
    console.error("[products API error]", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve atelier catalog." },
      { status: 500 }
    );
  }
}
