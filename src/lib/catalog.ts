import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { stockKey } from "@/lib/commerce";
import { PRODUCTS, COLLECTIONS } from "@/data/products";
import type { Product, Collection, Colorway, FabricSpec, ProductCategory, GarmentGeometryType } from "@/types/product";

const productInclude = {
  collection: true,
  variants: { where: { isActive: true }, include: { inventory: true } },
} as const;

type DbProduct = Awaited<ReturnType<typeof loadRaw>>[number];

async function loadRaw(where: { isActive?: boolean } = { isActive: true }) {
  return prisma.product.findMany({
    where,
    include: productInclude,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

/** Map a database product (with variants + inventory) to the storefront `Product` shape. */
export function toStorefrontProduct(p: DbProduct): Product {
  const colorways: Colorway[] = [];
  const sizes: string[] = [];
  const stock: Record<string, number> = {};
  for (const v of p.variants) {
    if (!colorways.some((c) => c.id === v.colorId)) {
      colorways.push({ id: v.colorId, name: v.colorName, hex: v.colorHex, threeColor: v.colorThree });
    }
    if (!sizes.includes(v.size)) sizes.push(v.size);
    stock[stockKey(v.colorId, v.size)] = v.inventory?.quantity ?? 0;
  }
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle,
    audience: p.audience,
    careInstructions: p.careInstructions,
    modelUrl: p.modelUrl,
    stock,
    collectionId: p.collectionId ?? "",
    collectionName: p.collection?.name ?? "",
    category: p.garmentType as ProductCategory,
    price: p.price,
    originalPrice: p.compareAtPrice ?? undefined,
    isNew: p.isNew,
    isBestseller: p.isBestseller,
    isLimited: p.isLimited,
    description: p.description,
    editorialQuote: p.editorialQuote,
    details: p.details,
    fabric: p.fabric as unknown as FabricSpec,
    colorways,
    sizes,
    images: p.images as unknown as Product["images"],
    geometryType: p.geometryType as GarmentGeometryType,
    threeDimensions: p.dimensions as unknown as Product["threeDimensions"],
    rating: p.rating,
    reviewCount: p.reviewCount,
    tags: p.tags,
  };
}

/**
 * Active storefront catalog from PostgreSQL. Falls back to the bundled seed
 * catalog (read-only) if the database is unreachable so the showroom still renders.
 */
export const getCatalog = cache(async (): Promise<{ products: Product[]; collections: Collection[]; source: "db" | "fallback" }> => {
  try {
    const [rows, cols] = await Promise.all([loadRaw(), prisma.collection.findMany({ include: { _count: { select: { products: true } } } })]);
    const products = rows.map(toStorefrontProduct);
    const collections: Collection[] = cols.map((c) => ({
      id: c.id,
      name: c.name,
      season: c.season,
      tagline: c.tagline,
      description: c.description,
      coverImage: c.coverImage,
      palette: c.palette,
      productCount: c._count.products,
    }));
    return { products, collections, source: "db" };
  } catch (error) {
    console.error("[catalog] database unavailable, serving seed catalog:", (error as Error).message);
    return { products: PRODUCTS, collections: COLLECTIONS, source: "fallback" };
  }
});

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { products } = await getCatalog();
  return products.find((p) => p.slug === slug || p.id === slug) ?? null;
}

