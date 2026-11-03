"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { useCartStore } from "@/store/useCartStore";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import { Heart, Trash2, Eye, ShoppingBag, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWardrobeStore();
  const { addItem } = useCartStore();
  const { products } = useCatalog();
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  const sourceProducts = products.length ? products : PRODUCTS;
  const savedProducts = sourceProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="pb-8 border-b border-[#1C1917]/[0.08] flex flex-col sm:flex-row items-baseline justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono">
              Private Client Vault
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1917] font-medium mt-1">
              Curated Wishlist
            </h1>
          </div>
          <p className="text-xs text-[#78716C]">
            {savedProducts.length} {savedProducts.length === 1 ? "design" : "designs"} reserved for consultation
          </p>
        </div>

        {savedProducts.length === 0 ? (
          <div className="text-center py-24 my-8 rounded-3xl atelier-card max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full border border-[#1C1917]/10 flex items-center justify-center text-[#9A7B4F] mx-auto bg-[#FAF8F5]">
              <Heart size={22} />
            </div>
            <h2 className="font-serif text-xl text-[#1C1917]">Your Vault is Empty</h2>
            <p className="text-xs text-[#78716C] max-w-sm mx-auto">
              Browse the 3D Wardrobe or Catalog to save your favorite haute couture silhouettes.
            </p>
            <NextLink
              href="/wardrobe"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold hover:bg-[#2A2725] transition-colors"
            >
              <span>Explore 3D Wardrobe</span>
              <ArrowRight size={14} className="text-[#C5A880]" />
            </NextLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {savedProducts.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl atelier-card overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-[3/4] w-full bg-[#FAF8F5] relative overflow-hidden">
                  <img
                    src={p.images.hero}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-[#1C1917]/10 flex items-center justify-center text-red-500 hover:text-black transition-colors shadow-xs"
                    title="Remove from vault"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#9A7B4F] font-mono">
                      {p.collectionName}
                    </span>
                    <NextLink href={`/product/${p.slug || p.id}`}>
                      <h3 className="font-serif text-base text-[#1C1917] font-medium mt-1 hover:text-[#9A7B4F] transition-colors">
                        {p.name}
                      </h3>
                    </NextLink>
                    <p className="text-xs font-serif text-[#9A7B4F] font-bold mt-1">
                      {formatPrice(p.price)}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#1C1917]/[0.06] grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setInspectingProduct(p);
                        sounds.playGarmentInspect();
                      }}
                      className="py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F4F0E8] text-[#1C1917] text-xs font-medium flex items-center justify-center gap-1 border border-[#1C1917]/10 transition-colors"
                    >
                      <Eye size={12} className="text-[#9A7B4F]" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => {
                        addItem(p, p.colorways[0], p.sizes[0], 1);
                      }}
                      className="py-1.5 rounded-lg bg-[#1C1917] hover:bg-[#2A2725] text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition-colors"
                    >
                      <ShoppingBag size={12} />
                      <span>Acquire</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

