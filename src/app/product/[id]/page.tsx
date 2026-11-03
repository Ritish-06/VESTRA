import { PRODUCTS } from "@/data/products";
import { getProductBySlug } from "@/lib/catalog";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  const params: { id: string }[] = [];
  for (const product of PRODUCTS) {
    params.push({ id: product.id });
    if (product.slug && product.slug !== product.id) {
      params.push({ id: product.slug });
    }
  }
  return params;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = (await getProductBySlug(id)) || PRODUCTS.find((p) => p.id === id || p.slug === id);

  if (!product) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#C5A880]/30 border-t-[#C5A880] animate-spin" />
        </div>
      }
    >
      <ProductDetailClient product={product} />
    </Suspense>
  );
}
