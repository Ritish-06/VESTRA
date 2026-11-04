"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import FashionProductCard from "@/components/ui/FashionProductCard";
import InteractiveSlider from "@/components/ui/InteractiveSlider";
import LookbookHotspotSlider from "@/components/ui/LookbookHotspotSlider";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { Product } from "@/types/product";
import { ArrowRight } from "lucide-react";

export default function CollectionsPage() {
  const { products, collections } = useCatalog();
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-20">
        {/* Page Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C7352] font-mono">
            Seasonal Haute Drops
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#25241F] font-medium">
            Curated Collections & Lookbooks
          </h1>
          <p className="text-xs sm:text-sm text-[#77736C] leading-relaxed">
            Each collection is a focused architectural study in silhouette, drape geometry, and material provenance. Tap any lookbook hotspot or swipe through individual capsule releases.
          </p>
        </div>

        {/* Interactive Lookbook Hotspot Slider */}
        <LookbookHotspotSlider
          products={products}
          onInspectProduct={(p) => setInspectingProduct(p)}
        />

        {/* Collections Stack */}
        {collections.map((collection, idx) => {
          const collectionProducts = products.filter(
            (p) => p.collectionId === collection.id
          );

          return (
            <section
              key={collection.id}
              className="rounded-3xl bg-white border border-[#E5E0D7] shadow-2xs overflow-hidden p-6 sm:p-10 space-y-10"
            >
              {/* Collection Banner Header */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#8C7352] px-3 py-1 rounded-full bg-[#F0EDE6] border border-[#B49A75]/40 font-semibold">
                      {collection.season}
                    </span>
                    <span className="text-xs text-[#77736C] font-mono">
                      Collection 0{idx + 1}
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl text-[#25241F] font-medium">
                    {collection.name}
                  </h2>

                  <p className="font-serif text-base text-[#25241F]/80 italic">
                    &ldquo;{collection.tagline}&rdquo;
                  </p>

                  <p className="text-xs text-[#77736C] leading-relaxed max-w-xl">
                    {collection.description}
                  </p>

                  {/* Palette Swatches */}
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#77736C] font-mono mr-2">
                      Tone Palette:
                    </span>
                    {collection.palette.map((color, i) => (
                      <span
                        key={i}
                        className="w-5 h-5 rounded-full border border-[#25241F]/15 shadow-2xs"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 h-64 sm:h-72 rounded-2xl overflow-hidden relative border border-[#E5E0D7] editorial-reveal">
                  <img
                    src={collection.coverImage}
                    alt={collection.name}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#25241F]/75 via-transparent to-transparent flex items-end justify-between p-6">
                    <span className="text-xs font-serif text-white tracking-widest uppercase">
                      {collectionProducts.length} Bespoke Designs
                    </span>
                    <NextLink
                      href="/wardrobe"
                      className="text-[11px] font-medium text-[#DFD3C0] hover:text-white flex items-center gap-1"
                    >
                      <span>View on 3D Rail</span>
                      <ArrowRight size={12} />
                    </NextLink>
                  </div>
                </div>
              </div>

              {/* Interactive Horizontal Slider for Collection Pieces */}
              <div className="pt-6 border-t border-[#E5E0D7]">
                <InteractiveSlider
                  eyebrow={`Archive Capsule 0${idx + 1}`}
                  title={`Creations in ${collection.name}`}
                >
                  {collectionProducts.map((p) => (
                    <FashionProductCard
                      key={p.id}
                      product={p}
                      onInspect={(prod) => setInspectingProduct(prod)}
                    />
                  ))}
                </InteractiveSlider>
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
