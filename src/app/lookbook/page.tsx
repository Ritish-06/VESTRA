"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import LookbookHotspotSlider from "@/components/ui/LookbookHotspotSlider";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/commerce";
import { sounds } from "@/utils/soundEffects";
import { ArrowUpRight, Eye, ShoppingBag, Sliders, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function LookbookPage() {
  const { addItem } = useCartStore();
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  const lookbookSpreads = [
    {
      id: "spread-01",
      number: "SPREAD 01",
      title: "The Architectural Trench",
      subtitle: "Bonded Italian cotton • Monolithic lapels • Rain-resistant matte finish",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85",
      product: PRODUCTS[0],
      quote: "Sculpted geometry that responds to movement while maintaining rigid structure.",
      location: "Rue de Turenne, Paris Atelier",
    },
    {
      id: "spread-02",
      number: "SPREAD 02",
      title: "Midnight Raw Silk Fluidity",
      subtitle: "Heavy mulberry silk • Hand-rolled bias hem • Fluid evening drape",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85",
      product: PRODUCTS[4] || PRODUCTS[0],
      quote: "Liquid luxury created for evening salons and twilight movements.",
      location: "Palazzo Serbelloni, Milan",
    },
    {
      id: "spread-03",
      number: "SPREAD 03",
      title: "Double-Faced Cashmere Wrap",
      subtitle: "Mongolian unspun cashmere • Seamless needle-punching • 480 GSM",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1400&q=85",
      product: PRODUCTS[6] || PRODUCTS[1],
      quote: "Weightless thermal comfort engineered with zero synthetic blending.",
      location: "Aoyama Studio, Tokyo",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col justify-between selection:bg-[#B49A75]/25 selection:text-[#25241F]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full pt-20 sm:pt-24 pb-28 space-y-24">
        {/* Editorial Masthead */}
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E0D7] text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7352]">
            <Sparkles size={11} className="text-[#B49A75]" />
            <span>EDITORIAL VOL. IV // THE LOOKBOOK</span>
          </div>
          <h1 className="text-exhibition-display font-normal text-[#25241F] max-w-4xl mx-auto">
            Light, Form & Tactile Silhouette
          </h1>
          <p className="text-sm sm:text-base text-[#77736C] max-w-2xl mx-auto leading-relaxed">
            A photographic exploration of the VESTRA digital collection in natural light. Every garment is captured on location and recreated in 3D for spatial inspection.
          </p>
        </header>

        {/* Interactive Hotspot Feature Film */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LookbookHotspotSlider />
        </section>

        {/* Full-Bleed Editorial Spreads */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          <div className="border-t border-[#E5E0D7] pt-12">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7352] block mb-2">
              ARCHIVE SPREADS
            </span>
            <h2 className="text-exhibition-title text-[#25241F] font-normal">
              Field Studies & Spatial Portraits
            </h2>
          </div>

          {lookbookSpreads.map((spread, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <article
                key={spread.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Visual Frame */}
                <div
                  className={`lg:col-span-7 relative rounded-3xl overflow-hidden border border-[#E5E0D7] bg-[#EEEAE2] shadow-sm group ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="aspect-[4/5] sm:aspect-[16/11] overflow-hidden">
                    <img
                      src={spread.image}
                      alt={spread.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E5E0D7] text-[10px] font-mono uppercase tracking-[0.2em] text-[#25241F]">
                    {spread.number} // {spread.location}
                  </div>
                </div>

                {/* Editorial Content */}
                <div
                  className={`lg:col-span-5 space-y-6 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#8C7352] block">
                      {spread.product.collectionName}
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-[#25241F] font-normal leading-tight">
                      {spread.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#77736C] font-mono">
                      {spread.subtitle}
                    </p>
                  </div>

                  <blockquote className="border-l-2 border-[#B49A75] pl-4 italic text-sm text-[#5C5850] font-serif leading-relaxed">
                    &ldquo;{spread.quote}&rdquo;
                  </blockquote>

                  {/* Connected Garment Card */}
                  <div className="p-4 rounded-2xl bg-white border border-[#E5E0D7] flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8C7352]">
                        Featured Silhouette
                      </span>
                      <h4 className="font-serif text-base text-[#25241F] font-medium">
                        {spread.product.name}
                      </h4>
                      <span className="font-serif text-sm font-semibold text-[#8C7352]">
                        {formatPrice(spread.product.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setInspectingProduct(spread.product);
                          sounds.playGarmentInspect();
                        }}
                        className="p-2.5 rounded-full bg-[#F0EDE6] hover:bg-[#E5E0D7] text-[#25241F] transition-colors cursor-pointer"
                        title="Inspect in 3D"
                      >
                        <Eye size={14} className="text-[#8C7352]" />
                      </button>

                      <button
                        onClick={() => {
                          addItem(
                            spread.product,
                            spread.product.colorways[0],
                            spread.product.sizes[0],
                            1,
                            false
                          );
                          sounds.playClick();
                        }}
                        className="px-3.5 py-2 rounded-full bg-[#25241F] hover:bg-[#38362F] text-[#F8F6F1] text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag size={13} className="text-[#B49A75]" />
                        <span>Acquire</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <NextLink
                      href={`/product/${spread.product.slug || spread.product.id}`}
                      className="text-xs font-medium text-[#25241F] hover:text-[#8C7352] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Piece Specifications</span>
                      <ArrowUpRight size={13} />
                    </NextLink>

                    <NextLink
                      href="/wardrobe"
                      className="text-xs font-medium text-[#77736C] hover:text-[#25241F] inline-flex items-center gap-1 transition-colors"
                    >
                      <Sliders size={12} />
                      <span>View in 3D Rail</span>
                    </NextLink>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      {inspectingProduct && (
        <ProductInspectorModal
          product={inspectingProduct}
          onClose={() => setInspectingProduct(null)}
          initialColor={inspectingProduct.colorways[0]}
        />
      )}

      <Footer />
    </div>
  );
}
