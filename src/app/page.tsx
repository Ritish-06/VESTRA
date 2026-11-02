"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorCanvas from "@/components/3d/ProductInspectorCanvas";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import { PRODUCTS, COLLECTIONS } from "@/data/products";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";
import {
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  ShoppingBag,
  Heart,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Maximize2,
} from "lucide-react";

export default function LandingPage() {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWardrobeStore();
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  // Hero featured piece (Monolith Bonded Trench)
  const heroProduct = PRODUCTS[0];
  const featuredPieces = PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#070709] text-[#f5f4f0] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      {/* --- Section 1: Cinematic Editorial Hero --- */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[#c5a880]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#c5a880]/40 text-[#c5a880] text-xs font-mono tracking-widest uppercase backdrop-blur-md">
              <Sparkles size={12} className="text-[#c5a880] animate-pulse" />
              <span>VESTRA Haute Couture 2026/27</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-normal tracking-tight text-white leading-[1.08]">
              The Future of <br />
              <span className="italic font-serif gold-gradient-text font-medium">
                Digital Fashion
              </span>
            </h1>

            <p className="font-serif text-lg sm:text-xl text-[#c5a880] tracking-wide italic">
              Your Wardrobe. Your World. Your Style.
            </p>

            <p className="text-xs sm:text-sm text-[#9ca3af] max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-light">
              Step beyond flat catalog grids into an immersive 3D spatial atelier. Swipe hanging garments along virtual brass rails, inspect tactile micro-weaves, style calibrated avatars, and consult your personal AI couturier.
            </p>

            {/* CTA Group */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <NextLink
                href="/wardrobe"
                onClick={() => sounds.playHangerSlide()}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0b0b0c] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2.5 hover:shadow-[0_0_35px_rgba(197,168,128,0.35)] hover:scale-[1.02] transition-all"
              >
                <Sliders size={16} />
                <span>Enter 3D Wardrobe</span>
              </NextLink>

              <NextLink
                href="/studio"
                onClick={() => sounds.playClick()}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-[#c5a880]/50 font-medium text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
              >
                <Sparkles size={15} className="text-[#c5a880]" />
                <span>Virtual Try-On Studio</span>
              </NextLink>
            </div>

            {/* Highlights Bar */}
            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-center lg:justify-start gap-6 text-[11px] text-[#9ca3af] font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#c5a880]" /> Real-time 3D Rails
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#c5a880]" /> Dynamic Fabric Shaders
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#c5a880]" /> Generative AI Stylist
              </span>
            </div>
          </div>

          {/* Right Hero Interactive 3D Turntable Card */}
          <div className="lg:col-span-5 h-[460px] sm:h-[520px] rounded-3xl bg-gradient-to-b from-[#141419] to-[#0a0a0c] border border-white/10 relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.8)] flex flex-col group">
            {/* Viewport Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] px-3 py-1 rounded-full bg-black/50 border border-[#c5a880]/30 font-mono backdrop-blur-md">
                Interactive Centerpiece
              </span>
            </div>

            {/* 3D Canvas */}
            <div className="flex-1 w-full h-full">
              <ProductInspectorCanvas
                product={heroProduct}
                activeColorway={heroProduct.colorways[0]}
                autoRotate={true}
              />
            </div>

            {/* Bottom Card Footer */}
            <div className="p-5 bg-[#0e0e12]/90 backdrop-blur-md border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#c5a880] font-mono">
                  {heroProduct.collectionName}
                </span>
                <h3 className="font-serif text-base text-white font-medium">
                  {heroProduct.name}
                </h3>
                <span className="font-serif text-xs text-[#c5a880] font-bold">
                  ${heroProduct.price.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setInspectingProduct(heroProduct);
                    sounds.playGarmentInspect();
                  }}
                  className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white text-xs font-medium tracking-wider transition-all flex items-center gap-1.5"
                >
                  <Eye size={12} />
                  <span>Inspect 3D</span>
                </button>

                <button
                  onClick={() => {
                    addItem(heroProduct, heroProduct.colorways[0], heroProduct.sizes[0], 1);
                  }}
                  className="w-9 h-9 rounded-full bg-[#c5a880] text-[#0b0b0c] flex items-center justify-center hover:bg-[#e6d5b8] transition-colors shadow-md"
                  title="Quick Add to Bag"
                >
                  <ShoppingBag size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: The 3D Wardrobe Concept Showcase --- */}
      <section className="py-24 bg-[#0a0a0d] border-y border-white/[0.06] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono">
              Spatial Paradigm Shift
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-medium">
              Not a Catalog. A Physical Showroom.
            </h2>
            <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
              Traditional online fashion confines couture to 2D flat squares. VESTRA restores the sensory tactile weight, spatial perspective, and movement of a real garment rack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mode A Teaser Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0f0f13] border border-white/[0.08] relative overflow-hidden group hover:border-[#c5a880]/50 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#c5a880]/15 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880]">
                  <Sliders size={22} />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#c5a880]">
                  Experience Mode 01
                </span>
                <h3 className="font-serif text-2xl text-white font-medium">
                  The Interactive Clothing Rail
                </h3>
                <p className="text-xs text-[#9ca3af] leading-relaxed">
                  Smooth horizontal drag physics with natural garment sway. Click any wooden hanger to lift the silhouette forward from the rack under directional studio spotlighting.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.05]">
                <NextLink
                  href="/wardrobe"
                  className="inline-flex items-center gap-2 text-xs text-[#c5a880] font-semibold tracking-wider uppercase group-hover:underline"
                >
                  <span>Launch Rail Experience</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </NextLink>
              </div>
            </div>

            {/* Mode B Teaser Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0f0f13] border border-white/[0.08] relative overflow-hidden group hover:border-[#c5a880]/50 transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#c5a880]/15 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880]">
                  <Layers size={22} />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#c5a880]">
                  Experience Mode 02
                </span>
                <h3 className="font-serif text-2xl text-white font-medium">
                  The Walk-In Penthouse Boutique
                </h3>
                <p className="text-xs text-[#9ca3af] leading-relaxed">
                  Explore a full 3D luxury salon with polished black marble reflections, back-lit translucent onyx wall panels, and rotating centerpiece pedestal displays.
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.05]">
                <NextLink
                  href="/wardrobe"
                  className="inline-flex items-center gap-2 text-xs text-[#c5a880] font-semibold tracking-wider uppercase group-hover:underline"
                >
                  <span>Enter Boutique Showroom</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </NextLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Curated Runway Highlights --- */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono">
              The Permanent Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium mt-1">
              Curated Archival Pieces
            </h2>
          </div>

          <NextLink
            href="/explore"
            className="text-xs text-[#c5a880] hover:text-white flex items-center gap-1.5 transition-colors font-medium tracking-wider uppercase"
          >
            <span>View Full Archive ({PRODUCTS.length})</span>
            <ArrowRight size={13} />
          </NextLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPieces.map((p) => {
            const isWishlisted = isInWishlist(p.id);
            return (
              <div
                key={p.id}
                className="group rounded-2xl bg-[#0e0e12] border border-white/[0.06] hover:border-white/15 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg"
              >
                <div className="aspect-[3/4] w-full bg-[#18181e] relative overflow-hidden">
                  <img
                    src={p.images.hero}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-[#c5a880] transition-colors"
                  >
                    <Heart
                      size={14}
                      className={isWishlisted ? "fill-[#c5a880] text-[#c5a880]" : ""}
                    />
                  </button>

                  <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => {
                        setInspectingProduct(p);
                        sounds.playGarmentInspect();
                      }}
                      className="flex-1 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/15 hover:border-[#c5a880] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye size={12} className="text-[#c5a880]" />
                      <span>Inspect 3D</span>
                    </button>
                    <button
                      onClick={() => addItem(p, p.colorways[0], p.sizes[0], 1)}
                      className="w-9 h-9 rounded-full bg-[#c5a880] text-[#0b0b0c] flex items-center justify-center hover:bg-[#e6d5b8] transition-colors flex-shrink-0"
                    >
                      <ShoppingBag size={13} />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#c5a880] font-mono">
                      {p.collectionName}
                    </span>
                    <h3 className="font-serif text-base text-white font-medium mt-1 truncate">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-[#9ca3af] mt-0.5 truncate italic">
                      {p.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/[0.04] flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-[#c5a880]">
                      ${p.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#6b7280] font-mono">
                      {p.fabric.weightGsm} GSM
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- Section 4: The 4 Atelier Pillars --- */}
      <section className="py-24 bg-[#0a0a0d] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono">
              Couture Engineering
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-medium">
              The Four Pillars of VESTRA
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.06] space-y-3">
              <span className="text-xs font-mono text-[#c5a880]">01 // RAIL PHYSICS</span>
              <h3 className="font-serif text-lg text-white font-medium">Tactile Clothing Rails</h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Smooth horizontal rail drag with natural garment sways, collisions, and wooden hanger acoustics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.06] space-y-3">
              <span className="text-xs font-mono text-[#c5a880]">02 // FABRIC TELEMETRY</span>
              <h3 className="font-serif text-lg text-white font-medium">3D Turntable & Zoom</h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Calibrated normal maps and PBR shaders reproducing silk sheen, cashmere loft, and calfskin grain.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.06] space-y-3">
              <span className="text-xs font-mono text-[#c5a880]">03 // VIRTUAL TRY-ON</span>
              <h3 className="font-serif text-lg text-white font-medium">Modular Avatar Studio</h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Layer outerwear over silks and trousers on stylized haute mannequins with full 360° inspection.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.06] space-y-3">
              <span className="text-xs font-mono text-[#c5a880]">04 // ATELIER AI</span>
              <h3 className="font-serif text-lg text-white font-medium">Conversational Couturier</h3>
              <p className="text-xs text-[#9ca3af] leading-relaxed">
                Contextual AI stylist that formulates complete red-carpet, keynote, and gallery ensembles on demand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 5: Brand Manifesto Quote Banner --- */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full border border-[#c5a880]/50 flex items-center justify-center text-[#c5a880] mx-auto text-sm font-serif">
            V
          </div>
          <blockquote className="font-serif text-2xl sm:text-4xl text-white font-light italic leading-snug">
            &ldquo;We believe the future of fashion does not belong in static squares. True luxury is three-dimensional, kinetic, and deeply personal.&rdquo;
          </blockquote>
          <p className="text-xs uppercase tracking-[0.3em] text-[#c5a880] font-mono">
            VESTRA Haute Atelier Manifesto • Paris • Tokyo • Milan
          </p>
        </div>
      </section>

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
