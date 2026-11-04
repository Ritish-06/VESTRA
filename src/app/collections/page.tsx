"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import FashionOrbitExperience, { ORBIT_CAPSULES } from "@/components/ui/FashionOrbitExperience";
import AsymmetricalEditorialShowcase from "@/components/ui/AsymmetricalEditorialShowcase";
import LookbookHotspotSlider from "@/components/ui/LookbookHotspotSlider";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { Product } from "@/types/product";
import { sounds } from "@/utils/soundEffects";
import { ArrowRight, Orbit, Sparkles } from "lucide-react";

export default function CollectionsPage() {
  const { products } = useCatalog();
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [activeWorldFilter, setActiveWorldFilter] = useState<string>("all");

  const visibleCapsules =
    activeWorldFilter === "all"
      ? ORBIT_CAPSULES
      : ORBIT_CAPSULES.filter((c) => c.id === activeWorldFilter);

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full pt-28 pb-20 space-y-20">
        {/* Exhibition Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E5E0D7]">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#8C7352] font-mono">
                <Sparkles size={12} className="text-[#B49A75]" />
                <span>CURATORIAL EXHIBITION // SEASONAL ARCHIVES</span>
              </span>
              <h1 className="text-exhibition-display text-[#25241F] font-normal">
                Four Worlds of VESTRA
              </h1>
              <p className="text-xs sm:text-sm text-[#77736C] prose-measure">
                Rather than conventional seasonal categories, VESTRA organizes its archive into four permanent curatorial worlds: Essential Forms, After Hours, Modern Heritage, and Future Classics.
              </p>
            </div>

            {/* Chapter Quick-Jump Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveWorldFilter("all");
                  sounds.playClick();
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  activeWorldFilter === "all"
                    ? "bg-[#25241F] text-white border-[#25241F]"
                    : "bg-white text-[#77736C] border-[#E5E0D7] hover:text-[#25241F]"
                }`}
              >
                All Four Worlds
              </button>
              {ORBIT_CAPSULES.map((cap) => (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => {
                    setActiveWorldFilter(cap.id);
                    sounds.playClick();
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    activeWorldFilter === cap.id
                      ? "bg-[#25241F] text-white border-[#25241F]"
                      : "bg-white text-[#77736C] border-[#E5E0D7] hover:text-[#25241F]"
                  }`}
                >
                  {cap.code} • {cap.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Fashion Orbit Stage */}
        <FashionOrbitExperience
          products={products}
          onInspectProduct={(p) => setInspectingProduct(p)}
        />

        {/* Editorial Campaign Chapters for Each World */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {visibleCapsules.map((capsule, idx) => {
            const chapterProducts = products
              .filter((p, i) => capsule.matchFn(p, i))
              .slice(0, 4);
            const coverProduct = chapterProducts[0] || products[idx] || products[0];
            const isReversed = idx % 2 === 1;

            return (
              <section
                key={capsule.id}
                aria-label={`${capsule.name} Editorial Exhibition`}
                className="space-y-12 pt-8 border-t border-[#E5E0D7] first:border-t-0 first:pt-0"
              >
                {/* Chapter Hero Spread */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  <div
                    className={`lg:col-span-5 rounded-3xl bg-white border border-[#E5E0D7] p-8 sm:p-10 flex flex-col justify-between space-y-6 ${
                      isReversed ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7352] px-3 py-1 rounded-full bg-[#F8F6F1] border border-[#E5E0D7]">
                          WORLD {capsule.code}
                        </span>
                        <span className="text-[10px] font-mono text-[#77736C]">
                          {capsule.atmosphereNote}
                        </span>
                      </div>

                      <h2 className="text-exhibition-title text-[#25241F] font-normal">
                        {capsule.name}
                      </h2>

                      <p className="font-serif text-base text-[#8C7352] italic">
                        {capsule.subtitle}
                      </p>

                      <p className="text-xs text-[#77736C] leading-relaxed">
                        {capsule.manifesto}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#E5E0D7]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#77736C]">
                          Curatorial Palette
                        </span>
                        <div className="flex items-center gap-1.5">
                          {capsule.palette.map((color, i) => (
                            <span
                              key={i}
                              className="w-5 h-5 rounded-full border border-black/15"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <NextLink
                          href="/wardrobe"
                          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#25241F] hover:text-[#8C7352]"
                        >
                          <Orbit size={14} className="text-[#B49A75]" />
                          <span>Explore on 3D Rail</span>
                        </NextLink>
                        <NextLink
                          href="/explore"
                          className="inline-flex items-center gap-1.5 text-xs text-[#77736C] hover:text-[#25241F]"
                        >
                          <span>View All Pieces</span>
                          <ArrowRight size={13} />
                        </NextLink>
                      </div>
                    </div>
                  </div>

                  {/* Large Campaign Visual Plate */}
                  <div
                    className={`lg:col-span-7 min-h-[380px] sm:min-h-[460px] rounded-3xl overflow-hidden relative border border-[#E5E0D7] bg-[#F0EDE6] group ${
                      isReversed ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    {coverProduct && (
                      <img
                        src={coverProduct.images.hero}
                        alt={capsule.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#25241F]/75 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                      <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#DFD3C0]">
                        {capsule.atmosphereNote}
                      </span>
                      <p className="font-serif text-2xl sm:text-3xl font-normal mt-1">
                        {capsule.name} — {chapterProducts.length} Exhibition Works
                      </p>
                    </div>
                  </div>
                </div>

                {/* Asymmetrical Editorial Showcase for This World */}
                <AsymmetricalEditorialShowcase
                  products={chapterProducts}
                  onInspectProduct={(p) => setInspectingProduct(p)}
                />
              </section>
            );
          })}

          {/* Interactive Lookbook Finale */}
          <div className="pt-12 border-t border-[#E5E0D7] space-y-8">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#8C7352] block">
                INTERACTIVE CAMPAIGN SPREADS
              </span>
              <h2 className="text-exhibition-title text-[#25241F] font-normal mt-1">
                Shop the Editorial Lookbook
              </h2>
            </div>
            <LookbookHotspotSlider
              products={products}
              onInspectProduct={(p) => setInspectingProduct(p)}
            />
          </div>
        </div>
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
