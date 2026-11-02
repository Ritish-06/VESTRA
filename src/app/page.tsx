"use client";

import React, { useState, useRef } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import dynamic from "next/dynamic";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
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
  DoorOpen,
} from "lucide-react";

const ProductInspectorCanvas = dynamic(
  () => import("@/components/3d/ProductInspectorCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center text-[#C5A880] gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#C5A880]/30 border-t-[#C5A880] animate-spin" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#78716C]">
          Calibrating Centerpiece...
        </span>
      </div>
    ),
  }
);

export default function LandingPage() {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWardrobeStore();
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [isEnteringStore, setIsEnteringStore] = useState(false);

  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroCenterpieceRef = useRef<HTMLDivElement>(null);

  const heroProduct = PRODUCTS[0];
  const featuredPieces = PRODUCTS.slice(0, 4);

  // Cinematic "Enter the Store" Transition Sequence
  const handleEnterStore = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isEnteringStore) return;
    setIsEnteringStore(true);
    sounds.playGarmentInspect();

    // GSAP Coordinated Camera Push Sequence
    const tl = gsap.timeline({
      onComplete: () => {
        router.push("/wardrobe");
      },
    });

    if (heroContainerRef.current && heroCenterpieceRef.current) {
      tl.to(heroContainerRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: "power2.inOut",
      });
      tl.to(
        heroCenterpieceRef.current,
        {
          scale: 2.2,
          opacity: 0,
          duration: 0.8,
          ease: "expo.in",
        },
        "-=0.4"
      );
    } else {
      router.push("/wardrobe");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      {/* --- Section 1: Cinematic Editorial Hero (Enter the Store) --- */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F4F0E8] via-[#FAF8F5] to-[#FAF8F5]">
        {/* Soft Alabaster Atmospheric Ambient Blooms */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C5A880]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Left Hero Narrative */}
          <div ref={heroContainerRef} className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#1C1917]/[0.08] text-[#9A7B4F] text-xs font-mono tracking-widest uppercase shadow-sm">
              <Sparkles size={12} className="text-[#C5A880] animate-pulse" />
              <span>VESTRA Haute Couture Atelier</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-normal tracking-tight text-[#1C1917] leading-[1.08]">
              The Future of <br />
              <span className="italic font-serif gold-gradient-text font-medium">
                Digital Fashion
              </span>
            </h1>

            <p className="font-serif text-lg sm:text-xl text-[#9A7B4F] tracking-wide italic">
              Your Wardrobe. Your World. Your Style.
            </p>

            <p className="text-xs sm:text-sm text-[#78716C] max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-light">
              Step beyond flat catalog grids into an authentic spatial fashion house. Browse garments hanging on virtual brass rails, inspect tactile micro-weaves under studio illumination, and explore bespoke tailored silhouettes.
            </p>

            {/* Prominent "Enter the Store" CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleEnterStore}
                disabled={isEnteringStore}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-[#FAF8F5] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
              >
                <DoorOpen size={16} className="text-[#C5A880]" />
                <span>{isEnteringStore ? "Entering Showroom..." : "Enter the Fashion Store"}</span>
                <ArrowRight size={14} className="text-[#C5A880]" />
              </button>

              <NextLink
                href="/explore"
                onClick={() => sounds.playClick()}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-[#F4F0E8] text-[#1C1917] border border-[#1C1917]/10 font-medium text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Compass size={15} className="text-[#9A7B4F]" />
                <span>Explore Collections</span>
              </NextLink>
            </div>

            {/* Highlights Bar */}
            <div className="pt-6 border-t border-[#1C1917]/[0.08] flex items-center justify-center lg:justify-start gap-6 text-[11px] text-[#78716C] font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#9A7B4F]" /> Physical Rail Physics
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#9A7B4F]" /> Dynamic Fabric Shaders
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#9A7B4F]" /> Generative AI Stylist
              </span>
            </div>
          </div>

          {/* Right Hero Interactive 3D Turntable Card */}
          <div
            ref={heroCenterpieceRef}
            className="lg:col-span-5 h-[460px] sm:h-[520px] rounded-3xl bg-gradient-to-b from-[#1C1917] to-[#121110] border border-[#1C1917]/20 relative overflow-hidden shadow-2xl flex flex-col group text-white"
          >
            {/* Viewport Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] px-3 py-1 rounded-full bg-black/60 border border-[#C5A880]/30 font-mono backdrop-blur-md">
                3D Centerpiece Preview
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
            <div className="p-5 bg-[#141312]/95 backdrop-blur-md border-t border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#C5A880] font-mono">
                  {heroProduct.collectionName}
                </span>
                <h3 className="font-serif text-base text-white font-medium">
                  {heroProduct.name}
                </h3>
                <span className="font-serif text-xs text-[#C5A880] font-bold">
                  ${heroProduct.price.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setInspectingProduct(heroProduct);
                    sounds.playGarmentInspect();
                  }}
                  className="px-4 py-2 rounded-full bg-white/[0.1] hover:bg-[#C5A880] hover:text-[#1C1917] text-white text-xs font-medium tracking-wider transition-all flex items-center gap-1.5"
                >
                  <Eye size={12} />
                  <span>Inspect 3D</span>
                </button>

                <button
                  onClick={() => {
                    addItem(heroProduct, heroProduct.colorways[0], heroProduct.sizes[0], 1);
                  }}
                  className="w-9 h-9 rounded-full bg-[#C5A880] text-[#1C1917] flex items-center justify-center hover:bg-[#E6D5B8] transition-colors shadow-md"
                  title="Quick Add to Bag"
                >
                  <ShoppingBag size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Spatial Showroom Concept --- */}
      <section className="py-24 bg-[#F4F0E8] border-y border-[#1C1917]/[0.06] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono">
              Spatial Paradigm Shift
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1C1917] font-medium">
              Not a Catalog. A Physical Showroom.
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
              Traditional online fashion confines couture to 2D flat squares. VESTRA restores the sensory tactile weight, spatial perspective, and movement of a real garment rack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mode A Teaser Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#1C1917]/[0.08] relative overflow-hidden group hover:border-[#C5A880] transition-all flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center text-[#9A7B4F]">
                  <Sliders size={22} />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#9A7B4F]">
                  Experience Mode 01
                </span>
                <h3 className="font-serif text-2xl text-[#1C1917] font-medium">
                  The Interactive Clothing Rail
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Smooth horizontal drag physics with natural garment sway. Click any wooden hanger to lift the silhouette forward from the rack under directional studio spotlighting.
                </p>
              </div>

              <div className="pt-4 border-t border-[#1C1917]/[0.06]">
                <NextLink
                  href="/wardrobe"
                  className="inline-flex items-center gap-2 text-xs text-[#1C1917] font-semibold tracking-wider uppercase group-hover:text-[#9A7B4F]"
                >
                  <span>Launch Rail Experience</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#C5A880]" />
                </NextLink>
              </div>
            </div>

            {/* Mode B Teaser Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#1C1917]/[0.08] relative overflow-hidden group hover:border-[#C5A880] transition-all flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center text-[#9A7B4F]">
                  <Layers size={22} />
                </div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#9A7B4F]">
                  Experience Mode 02
                </span>
                <h3 className="font-serif text-2xl text-[#1C1917] font-medium">
                  The Walk-In Penthouse Boutique
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Explore a full 3D luxury salon with polished black marble reflections, back-lit translucent onyx wall panels, and rotating centerpiece pedestal displays.
                </p>
              </div>

              <div className="pt-4 border-t border-[#1C1917]/[0.06]">
                <NextLink
                  href="/wardrobe"
                  className="inline-flex items-center gap-2 text-xs text-[#1C1917] font-semibold tracking-wider uppercase group-hover:text-[#9A7B4F]"
                >
                  <span>Enter Boutique Showroom</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#C5A880]" />
                </NextLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Curated Runway Highlights --- */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-6 border-b border-[#1C1917]/[0.08]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono">
              The Permanent Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-medium mt-1">
              Curated Archival Pieces
            </h2>
          </div>

          <NextLink
            href="/explore"
            className="text-xs text-[#1C1917] hover:text-[#9A7B4F] flex items-center gap-1.5 transition-colors font-medium tracking-wider uppercase"
          >
            <span>View Full Archive ({PRODUCTS.length})</span>
            <ArrowRight size={13} className="text-[#C5A880]" />
          </NextLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPieces.map((p) => {
            const isWishlisted = isInWishlist(p.id);
            return (
              <div
                key={p.id}
                className="group rounded-2xl bg-white border border-[#1C1917]/[0.08] hover:border-[#C5A880]/60 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div className="aspect-[3/4] w-full bg-[#18181e] relative overflow-hidden">
                  <img
                    src={p.images.hero}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-[#1C1917]/10 flex items-center justify-center text-[#1C1917] hover:text-[#9A7B4F] transition-colors"
                    aria-label="Save to wishlist"
                  >
                    <Heart
                      size={14}
                      className={isWishlisted ? "fill-[#C5A880] text-[#9A7B4F]" : ""}
                    />
                  </button>

                  <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => {
                        setInspectingProduct(p);
                        sounds.playGarmentInspect();
                      }}
                      className="flex-1 py-2 rounded-full bg-[#1C1917]/90 backdrop-blur-md border border-[#1C1917] hover:bg-[#2A2725] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye size={12} className="text-[#C5A880]" />
                      <span>Inspect 3D</span>
                    </button>
                    <button
                      onClick={() => addItem(p, p.colorways[0], p.sizes[0], 1)}
                      className="w-9 h-9 rounded-full bg-[#1C1917] text-white flex items-center justify-center hover:bg-[#C5A880] hover:text-[#1C1917] transition-colors flex-shrink-0 shadow-sm"
                    >
                      <ShoppingBag size={13} />
                    </button>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#9A7B4F] font-mono">
                      {p.collectionName}
                    </span>
                    <h3 className="font-serif text-base text-[#1C1917] font-medium mt-1 truncate">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-[#78716C] mt-0.5 truncate italic">
                      {p.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#1C1917]/[0.06] flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-[#1C1917]">
                      ${p.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#78716C] font-mono">
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
      <section className="py-24 bg-[#F4F0E8] border-t border-[#1C1917]/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono">
              Couture Engineering
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#1C1917] font-medium">
              The Four Pillars of VESTRA
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#1C1917]/[0.08] space-y-3 shadow-sm">
              <span className="text-xs font-mono text-[#9A7B4F]">01 // RAIL PHYSICS</span>
              <h3 className="font-serif text-lg text-[#1C1917] font-medium">Tactile Clothing Rails</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Smooth horizontal rail drag with natural garment sways, collisions, and wooden hanger acoustics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#1C1917]/[0.08] space-y-3 shadow-sm">
              <span className="text-xs font-mono text-[#9A7B4F]">02 // FABRIC TELEMETRY</span>
              <h3 className="font-serif text-lg text-[#1C1917] font-medium">3D Turntable & Zoom</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Calibrated normal maps and PBR shaders reproducing silk sheen, cashmere loft, and calfskin grain.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#1C1917]/[0.08] space-y-3 shadow-sm">
              <span className="text-xs font-mono text-[#9A7B4F]">03 // VIRTUAL TRY-ON</span>
              <h3 className="font-serif text-lg text-[#1C1917] font-medium">Modular Avatar Studio</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Layer outerwear over silks and trousers on stylized haute mannequins with full 360° inspection.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#1C1917]/[0.08] space-y-3 shadow-sm">
              <span className="text-xs font-mono text-[#9A7B4F]">04 // ATELIER AI</span>
              <h3 className="font-serif text-lg text-[#1C1917] font-medium">Conversational Couturier</h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Contextual AI stylist that formulates complete red-carpet, keynote, and gallery ensembles on demand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 5: Brand Manifesto Quote Banner --- */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 text-center relative bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full border border-[#C5A880] flex items-center justify-center text-[#9A7B4F] mx-auto text-sm font-serif">
            V
          </div>
          <blockquote className="font-serif text-2xl sm:text-4xl text-[#1C1917] font-light italic leading-snug">
            &ldquo;We believe the future of fashion does not belong in static squares. True luxury is three-dimensional, kinetic, and deeply personal.&rdquo;
          </blockquote>
          <p className="text-xs uppercase tracking-[0.3em] text-[#9A7B4F] font-mono">
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
