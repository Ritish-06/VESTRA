/* eslint-disable no-console */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { PRODUCTS, COLLECTIONS } from "../src/data/products";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const CATEGORY_LABELS: Record<string, string> = {
  outerwear: "Outerwear",
  tailoring: "Tailoring",
  tops: "Tops & Knitwear",
  trousers: "Trousers",
  dresses: "Dresses",
  footwear: "Footwear",
  accessories: "Accessories",
};

/** Deterministic demo stock: mostly healthy, a few low-stock and one sold-out size. */
function stockFor(productIndex: number, colorIndex: number, sizeIndex: number): number {
  if (productIndex === 4 && colorIndex === 2 && sizeIndex === 0) return 0; // sold out example
  if ((productIndex + colorIndex + sizeIndex) % 7 === 0) return 2; // low stock
  return 6 + ((productIndex * 3 + colorIndex * 5 + sizeIndex) % 9);
}

async function main() {
  console.log("Seeding VESTRA catalog…");

  // Categories
  const categoryIds: Record<string, string> = {};
  let order = 0;
  for (const [slug, name] of Object.entries(CATEGORY_LABELS)) {
    const c = await prisma.category.upsert({
      where: { slug },
      update: { name, sortOrder: order },
      create: { slug, name, sortOrder: order },
    });
    categoryIds[slug] = c.id;
    order++;
  }

  // Collections
  for (const c of COLLECTIONS) {
    const data = {
      name: c.name,
      season: c.season,
      tagline: c.tagline,
      description: c.description,
      coverImage: c.coverImage,
      palette: c.palette,
    };
    await prisma.collection.upsert({ where: { id: c.id }, update: data, create: { id: c.id, ...data } });
  }

  // Products, variants, inventory
  for (const [pi, p] of PRODUCTS.entries()) {
    const data = {
      slug: p.slug,
      name: p.name,
      subtitle: p.subtitle,
      description: p.description,
      editorialQuote: p.editorialQuote,
      categoryId: categoryIds[p.category],
      collectionId: p.collectionId || null,
      audience: p.audience,
      garmentType: p.category,
      price: p.price,
      compareAtPrice: p.originalPrice ?? null,
      geometryType: p.geometryType,
      modelUrl: p.modelUrl ?? null,
      details: p.details,
      careInstructions: p.careInstructions,
      tags: p.tags,
      fabric: p.fabric as object,
      images: p.images as object,
      dimensions: p.threeDimensions as object,
      rating: p.rating,
      reviewCount: p.reviewCount,
      isNew: !!p.isNew,
      isBestseller: !!p.isBestseller,
      isLimited: !!p.isLimited,
      sortOrder: pi,
    };
    await prisma.product.upsert({ where: { id: p.id }, update: data, create: { id: p.id, ...data } });

    for (const [ci, color] of p.colorways.entries()) {
      for (const [si, size] of p.sizes.entries()) {
        const sku = `${p.id}-${color.id}-${size}`.toUpperCase().replace(/[^A-Z0-9]+/g, "-");
        const variant = await prisma.productVariant.upsert({
          where: { productId_colorId_size: { productId: p.id, colorId: color.id, size } },
          update: { colorName: color.name, colorHex: color.hex, colorThree: color.threeColor, sku },
          create: {
            productId: p.id,
            colorId: color.id,
            colorName: color.name,
            colorHex: color.hex,
            colorThree: color.threeColor,
            size,
            sku,
          },
        });
        await prisma.inventory.upsert({
          where: { variantId: variant.id },
          update: {},
          create: { variantId: variant.id, quantity: stockFor(pi, ci, si) },
        });
      }
    }
  }

  // Coupons
  const coupons = [
    { code: "VESTRA10", description: "10% off your first atelier order", discountPct: 10, minSubtotal: 0 },
    { code: "HAUTE20", description: "20% off orders above ₹1,50,000", discountPct: 20, minSubtotal: 150000 },
  ];
  for (const c of coupons) {
    await prisma.coupon.upsert({ where: { code: c.code }, update: c, create: c });
  }

  // Admin account
  const adminEmail = (process.env.SEED_ADMIN_EMAIL || "admin@vestra.store").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "ADMIN" },
      create: { email: adminEmail, name: "VESTRA Atelier Admin", passwordHash, role: "ADMIN" },
    });
    console.log(`Admin account ready: ${adminEmail}`);
  } else {
    console.log("SEED_ADMIN_PASSWORD not set — skipping admin account.");
  }

  const [products, variants] = await Promise.all([prisma.product.count(), prisma.productVariant.count()]);
  console.log(`Done. ${products} products, ${variants} variants.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

