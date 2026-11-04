"use client";

import React, { useState, useMemo } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import FashionProductCard from "@/components/ui/FashionProductCard";
import InteractiveSlider from "@/components/ui/InteractiveSlider";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { Heart, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlistIds, recentlyViewedIds } = useWardrobeStore();
  const { products } = useCatalog();
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  const sourceProducts = products.length ? products : PRODUCTS;
  const savedProducts = sourceProducts.filter((p) => wishlistIds.includes(p.id));

  const recentlyViewedProducts = useMemo(() => {
    return (recentlyViewedIds || [])
      .map((id) => sourceProducts.find((p) => p.id === id || p.slug === id))
      .filter(Boolean) as Product[];
  }, [recentlyViewedIds, sourceProducts]);

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-16">
        <div className="pb-8 border-b border-[#E5E0D7] flex flex-col sm:flex-row items-baseline justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C7352] font-mono">
              Private Client Vault
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#25241F] font-medium mt-1">
              Curated Wishlist
            </h1>
          </div>
          <p className="text-xs text-[#77736C] tabular-nums">
            {savedProducts.length} {savedProducts.length === 1 ? "design" : "designs"} reserved for consultation
          </p>
        </div>

        {savedProducts.length === 0 ? (
          <div className="text-center py-24 my-8 rounded-3xl bg-white border border-[#E5E0D7] shadow-2xs max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full border border-[#E5E0D7] flex items-center justify-center text-[#8C7352] mx-auto bg-[#F8F6F1]">
              <Heart size={22} />
            </div>
            <h2 className="font-serif text-xl text-[#25241F]">Your Vault is Empty</h2>
            <p className="text-xs text-[#77736C] max-w-sm mx-auto">
              Browse the 3D Wardrobe or Catalog to save your favorite haute couture silhouettes.
            </p>
            <NextLink
              href="/wardrobe"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25241F] text-white text-xs font-semibold hover:bg-[#38362F] transition-colors"
            >
              <span>Explore 3D Wardrobe</span>
              <ArrowRight size={14} className="text-[#B49A75]" />
            </NextLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedProducts.map((p) => (
              <FashionProductCard
                key={p.id}
                product={p}
                onInspect={(prod) => setInspectingProduct(prod)}
              />
            ))}
          </div>
        )}

        {recentlyViewedProducts.length > 0 && (
          <div className="pt-12 border-t border-[#E5E0D7]">
            <InteractiveSlider
              eyebrow="Your Viewing Dossier"
              title="Recently Viewed Creations"
              subtitle="Continue exploring garments you recently inspected."
            >
              {recentlyViewedProducts.map((p) => (
                <FashionProductCard
                  key={`wish-recent-${p.id}`}
                  product={p}
                  onInspect={(prod) => setInspectingProduct(prod)}
                  compact
                />
              ))}
            </InteractiveSlider>
          </div>
        )}
      </main>

      {/* Product Inspector Modal */}
      {inspectingProduct && (
        <ProductInspectorModal
          product={inspectingProduct}
          onClose={() => setInspectingProduct(null)}
        />
      )}

      <Footer />
    </div>
  );
}
