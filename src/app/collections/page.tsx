"use client";

import React, { useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import { COLLECTIONS, PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { sounds } from "@/utils/soundEffects";
import { Eye, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

export default function CollectionsPage() {
  const { addItem } = useCartStore();
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-[#070709] text-[#f5f4f0] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-24">
        {/* Page Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono">
            Seasonal Haute Drops
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-white font-medium">
            Curated Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
            Each collection is a focused architectural study in silhouette, drape geometry, and material provenance.
          </p>
        </div>

        {/* Collections Stack */}
        {COLLECTIONS.map((collection, idx) => {
          const collectionProducts = PRODUCTS.filter(
            (p) => p.collectionId === collection.id
          );

          return (
            <section
              key={collection.id}
              className="rounded-3xl bg-[#0d0d10] border border-white/[0.08] overflow-hidden shadow-2xl p-6 sm:p-10 space-y-8"
            >
              {/* Collection Banner Header */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#c5a880] px-3 py-1 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30">
                      {collection.season}
                    </span>
                    <span className="text-xs text-[#6b7280]">
                      Collection 0{idx + 1}
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium">
                    {collection.name}
                  </h2>

                  <p className="font-serif text-base text-white/90 italic">
                    &ldquo;{collection.tagline}&rdquo;
                  </p>

                  <p className="text-xs text-[#9ca3af] leading-relaxed max-w-xl">
                    {collection.description}
                  </p>

                  {/* Palette Swatches */}
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#6b7280] font-mono mr-2">
                      Tone Palette:
                    </span>
                    {collection.palette.map((color, i) => (
                      <span
                        key={i}
                        className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 h-64 sm:h-72 rounded-2xl overflow-hidden relative border border-white/10">
                  <img
                    src={collection.coverImage}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                    <span className="text-xs font-serif text-white tracking-widest uppercase">
                      {collectionProducts.length} Bespoke Designs
                    </span>
                  </div>
                </div>
              </div>

              {/* Pieces Grid for this Collection */}
              <div className="pt-6 border-t border-white/[0.06]">
                <h3 className="text-xs uppercase tracking-[0.25em] text-[#9ca3af] font-mono mb-4">
                  Archive Pieces in {collection.name}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {collectionProducts.map((p) => (
                    <div
                      key={p.id}
                      className="group p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#c5a880]/40 transition-all flex flex-col justify-between"
                    >
                      <div className="aspect-[3/4] w-full rounded-lg bg-[#18181e] overflow-hidden relative mb-3">
                        <img
                          src={p.images.hero}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={() => {
                            setInspectingProduct(p);
                            sounds.playGarmentInspect();
                          }}
                          className="absolute bottom-2 left-2 right-2 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye size={12} className="text-[#c5a880]" />
                          <span>Inspect in 3D</span>
                        </button>
                      </div>

                      <div>
                        <h4 className="font-serif text-sm text-white truncate">
                          {p.name}
                        </h4>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                          <span className="text-xs font-serif text-[#c5a880] font-bold">
                            ${p.price.toLocaleString()}
                          </span>
                          <button
                            onClick={() => {
                              addItem(p, p.colorways[0], p.sizes[0], 1);
                            }}
                            className="text-xs text-[#9ca3af] hover:text-white flex items-center gap-1"
                          >
                            <ShoppingBag size={12} />
                            <span>Acquire</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
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

