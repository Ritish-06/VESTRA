import { PRODUCTS } from "@/data/products";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070709] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border border-[#c5a880] animate-spin" />
        </div>
      }
    >
      <ProductDetailClient product={product} />
    </Suspense>
  );
}
