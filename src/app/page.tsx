"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import dynamic from "next/dynamic";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import FashionOrbitExperience from "@/components/ui/FashionOrbitExperience";
import AsymmetricalEditorialShowcase from "@/components/ui/AsymmetricalEditorialShowcase";
import FabricExplorerSection from "@/components/ui/FabricExplorerSection";
import LookbookHotspotSlider from "@/components/ui/LookbookHotspotSlider";
import InteractiveSlider from "@/components/ui/InteractiveSlider";
import FashionProductCard from "@/components/ui/FashionProductCard";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import {
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  ShoppingBag,
  Orbit,
  DoorOpen,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Check,
  ArrowDownRight,
} from "lucide-react";

const ProductInspectorCanvas = dynamic(
  () => import("@/components/3d/ProductInspectorCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center text-[#8C7352] gap-3">
        <div className="w-9 h-9 rounded-full border-2 border-[#B49A75]/30 border-t-[#B49A75] animate-spin" />
        <span className="text-[10px] uppercase tracking-[0.22em] font-mono text-[#77736C]">
          Initializing Spatial Atelier...
        </span>
      </div>
    ),
  }
);

export default function LandingPage() {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { recentlyViewedIds, recordProductView, wardrobeItems } = useWardrobeStore();
  const { products } = useCatalog();

  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [isEnteringStore, setIsEnteringStore] = useState(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [heroAdded, setHeroAdded] = useState(false);

  const entranceRef = useRef<HTMLDivElement>(null);
  const entranceStageRef = useRef<HTMLDivElement>(null);

  const catalogList = products.length > 0 ? products : PRODUCTS;

  const entranceInstallations = useMemo(() => {
    const p0 = catalogList[0] || PRODUCTS[0];
    const p1 = catalogList[4] || catalogList[1] || p0;
    const p2 = catalogList[1] || catalogList[2] || p0;
    return [
      {
        id: "installation-01",
        code: "EXHIBITION 01 // ESSENTIAL FORMS",
        headlineTop: "Beyond the",
        headlineAccent: "Digital Wardrobe",
        subtitle: "Your Wardrobe. Your World. Your Style.",
        curatorNote:
          "An interactive digital fashion house where garments exist inside a tactile 3D studio, collections unfold as architectural exhibitions, and every silhouette is inspected in 360°.",
        editorialImage: p0.images.hero,
        product: p0,
      },
      {
        id: "installation-02",
        code: "EXHIBITION 02 // AFTER HOURS",
        headlineTop: "Sculpted Silk &",
        headlineAccent: "Spatial Couture",
        subtitle: "Luminous 6A Mulberry Charmeuse in Motion",
        curatorNote:
          "Explore fluid evening drapery engineered for both physical presence and spatial inspection under calibrated daylight illumination.",
        editorialImage: p1.images.hero,
        product: p1,
      },
      {
        id: "installation-03",
        code: "EXHIBITION 03 // MODERN HERITAGE",
        headlineTop: "Architectural",
        headlineAccent: "Haute Tailoring",
        subtitle: "Precision Canvas Structure & Material Provenance",
        curatorNote:
          "Step inside our 3D wardrobe rail, compose layered ensembles on a virtual atelier mannequin, or orbit through seasonal capsules.",
        editorialImage: p2.images.hero,
        product: p2,
      },
    ];
  }, [catalogList]);

  const activeInstallation =
    entranceInstallations[heroSlideIndex] || entranceInstallations[0];
  const heroProduct = activeInstallation.product;

  useEffect(() => {
    if (heroPaused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % entranceInstallations.length);
    }, 6800);
    return () => clearInterval(timer);
  }, [heroPaused, entranceInstallations.length]);

  const changeInstallation = (nextIdx: number) => {
    const normalized =
      (nextIdx + entranceInstallations.length) % entranceInstallations.length;
    setHeroSlideIndex(normalized);
    sounds.playClick();
  };

  const curatedExhibitionPieces = useMemo(
    () => catalogList.slice(0, 4),
    [catalogList]
  );

  const recentlyViewedProducts = useMemo(() => {
    const mapped = (recentlyViewedIds || [])
      .map((id) => catalogList.find((p) => p.id === id || p.slug === id))
      .filter(Boolean) as Product[];
    return mapped.length > 0 ? mapped : catalogList.slice(0, 4);
  }, [recentlyViewedIds, catalogList]);

  const handleEnterWardrobe = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isEnteringStore) return;
    setIsEnteringStore(true);
    sounds.playGarmentInspect();

    const tl = gsap.timeline({
      onComplete: () => {
        router.push("/wardrobe");
      },
    });

    if (entranceRef.current && entranceStageRef.current) {
      tl.to(entranceRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.42,
        ease: "power2.out",
      });
      tl.to(
        entranceStageRef.current,
        {
          scale: 1.08,
          opacity: 0,
          duration: 0.46,
          ease: "power3.inOut",
        },
        "-=0.32"
      );
    } else {
      router.push("/wardrobe");
    }
  };

  const scrollToOrbit = () => {
    sounds.playClick();
    const el = document.getElementById("fashion-orbit");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      {/* =====================================================================
          ACT I — THE DIGITAL FASHION ENTRANCE (Architectural Studio Portal)
      ===================================================================== */}
      <section
        aria-label="VESTRA Digital Fashion Studio Entrance"
        className="relative min-h-[94dvh] flex flex-col justify-between pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F0EDE6] via-[#F8F6F1] to-[#F8F6F1] border-b border-[#E5E0D7]"
      >
        {/* Top Architectural Studio Coordinates Bar */}
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E5E0D7] text-[10px] font-mono uppercase tracking-[0.25em] text-[#77736C]">
          <span>VESTRA DIGITAL FASHION STUDIO // ARCHIVE EDITION</span>
          <span className="hidden sm:inline text-[#8C7352]">
            PARIS • TOKYO • MILAN • SPATIAL ATELIER
          </span>
          <span className="tabular-nums">
            WARDROBE VAULT: {wardrobeItems.length} PIECES HUNG
          </span>
        </div>

        {/* Main Asymmetrical Entrance Composition */}
        <div className="max-w-7xl mx-auto w-full my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left 6 Columns: Oversized Editorial Typography & Entrance Actions */}
          <div ref={entranceRef} className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E0D7] text-[#8C7352] text-[10px] font-mono tracking-[0.22em] uppercase shadow-2xs">
              <Sparkles size={12} className="text-[#B49A75]" />
              <span>{activeInstallation.code}</span>
            </div>

            <div
              key={activeInstallation.id}
              className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <h1 className="text-exhibition-display font-normal text-[#25241F]">
                {activeInstallation.headlineTop} <br />
                <span className="italic gold-gradient-text font-medium">
                  {activeInstallation.headlineAccent}
                </span>
              </h1>

              <p className="font-serif text-lg sm:text-xl text-[#8C7352] italic">
                {activeInstallation.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#77736C] prose-measure">
                {activeInstallation.curatorNote}
              </p>
            </div>

            {/* Primary Entrance Interactions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={handleEnterWardrobe}
                disabled={isEnteringStore}
                className="px-8 py-4 rounded-full bg-[#25241F] hover:bg-[#38362F] active:scale-[0.99] text-white font-semibold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <DoorOpen size={16} className="text-[#B49A75]" />
                <span>{isEnteringStore ? "Entering Studio..." : "Enter VESTRA 3D Wardrobe"}</span>
                <ArrowRight size={14} className="text-[#B49A75]" />
              </button>

              <button
                type="button"
                onClick={scrollToOrbit}
                className="px-7 py-4 rounded-full bg-white hover:bg-[#F0EDE6] text-[#25241F] border border-[#E5E0D7] hover:border-[#B49A75] font-medium text-xs tracking-[0.18em] uppercase flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
              >
                <Orbit size={15} className="text-[#8C7352]" />
                <span>Launch Fashion Orbit</span>
                <ArrowDownRight size={14} className="text-[#B49A75]" />
              </button>
            </div>

            {/* Installation Switcher & Pause Controls */}
            <div className="pt-6 border-t border-[#E5E0D7] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeInstallation(heroSlideIndex - 1)}
                  aria-label="Previous exhibition installation"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => changeInstallation(heroSlideIndex + 1)}
                  aria-label="Next exhibition installation"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setHeroPaused((p) => !p)}
                  aria-label={
                    heroPaused ? "Resume installation cycle" : "Pause installation cycle"
                  }
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#77736C] hover:text-[#25241F] flex items-center justify-center transition-colors cursor-pointer"
                >
                  {heroPaused ? <Play size={13} /> : <Pause size={13} />}
                </button>

                <div className="flex items-center gap-1.5 ml-2" role="tablist" aria-label="Exhibition installations">
                  {entranceInstallations.map((inst, idx) => (
                    <button
                      key={inst.id}
                      type="button"
                      role="tab"
                      aria-selected={idx === heroSlideIndex}
                      aria-label={`Installation ${idx + 1}`}
                      onClick={() => changeInstallation(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === heroSlideIndex
                          ? "w-8 bg-[#25241F]"
                          : "w-2.5 bg-[#E5E0D7] hover:bg-[#B49A75]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <NextLink
                href="/collections"
                className="text-[11px] font-mono uppercase tracking-widest text-[#8C7352] hover:text-[#25241F] flex items-center gap-1.5"
              >
                <span>Exhibition Index</span>
                <ArrowRight size={12} />
              </NextLink>
            </div>
          </div>

          {/* Right 6 Columns: Dual Architectural Stage (Editorial Portrait + Live 3D Turntable) */}
          <div
            ref={entranceStageRef}
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch"
          >
            {/* Editorial Campaign Plate (5 cols) */}
            <div className="sm:col-span-5 h-[360px] sm:h-[510px] rounded-3xl overflow-hidden border border-[#E5E0D7] bg-[#F0EDE6] relative group shadow-sm">
              {entranceInstallations.map((inst, idx) => {
                const isCurrent = idx === heroSlideIndex;
                return (
                  <img
                    key={inst.id}
                    src={inst.editorialImage}
                    alt={inst.product.name}
                    width={600}
                    height={850}
                    {...(idx === 0
                      ? { fetchPriority: "high" as const }
                      : { fetchPriority: "low" as const, loading: "lazy" as const })}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                      isCurrent ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    }`}
                  />
                );
              })}
              <div className="absolute inset-0 bg-gradient-to-t from-[#25241F]/70 via-transparent to-transparent flex flex-col justify-between p-4">
                <span className="self-start px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-mono uppercase tracking-widest text-[#25241F] border border-[#E5E0D7]">
                  Editorial Plate
                </span>
                <div className="text-white">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DFD3C0] block">
                    {heroProduct.fabric.weave}
                  </span>
                  <p className="font-serif text-sm font-medium mt-0.5">
                    {heroProduct.collectionName}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive 3D Showroom Centerpiece (7 cols) */}
            <div className="sm:col-span-7 h-[440px] sm:h-[510px] rounded-3xl bright-showroom border border-[#E5E0D7] relative overflow-hidden shadow-[0_18px_45px_-18px_rgba(37,36,31,0.12)] flex flex-col">
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2 pointer-events-none">
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#8C7352] px-3 py-1 rounded-full bg-white/92 border border-[#E5E0D7] font-mono backdrop-blur-md">
                  3D Spatial Stage
                </span>
                <span className="text-[10px] font-mono text-[#77736C] px-2.5 py-0.5 rounded-full bg-white/85 border border-[#E5E0D7]">
                  360° Interactive
                </span>
              </div>

              <div className="flex-1 w-full h-full">
                <ProductInspectorCanvas
                  product={heroProduct}
                  activeColorway={heroProduct.colorways[0]}
                  autoRotate={true}
                />
              </div>

              <div className="p-4 bg-white/95 backdrop-blur-md border-t border-[#E5E0D7] flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <NextLink
                    href={`/product/${heroProduct.slug || heroProduct.id}`}
                    onClick={() => recordProductView(heroProduct.id)}
                  >
                    <h2 className="font-serif text-sm text-[#25241F] font-medium truncate hover:text-[#8C7352] transition-colors">
                      {heroProduct.name}
                    </h2>
                  </NextLink>
                  <span className="font-serif text-xs text-[#25241F] font-bold tabular-nums">
                    {formatPrice(heroProduct.price)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      recordProductView(heroProduct.id);
                      setInspectingProduct(heroProduct);
                      sounds.playGarmentInspect();
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#F8F6F1] hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye size={12} className="text-[#B49A75]" />
                    <span>Inspect</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      addItem(heroProduct, heroProduct.colorways[0], heroProduct.sizes[0], 1, false);
                      setHeroAdded(true);
                      setTimeout(() => setHeroAdded(false), 1800);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                      heroAdded
                        ? "bg-[#607B60] text-white"
                        : "bg-[#25241F] hover:bg-[#38362F] text-white"
                    }`}
                  >
                    {heroAdded ? <Check size={12} /> : <ShoppingBag size={12} className="text-[#B49A75]" />}
                    <span>{heroAdded ? "Added" : "Acquire"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ACT II — THE FASHION ORBIT (Interactive Spatial Collection Explorer)
      ===================================================================== */}
      <FashionOrbitExperience
        products={catalogList}
        onInspectProduct={(p) => setInspectingProduct(p)}
      />

      {/* =====================================================================
          ACT III — ASYMMETRICAL EDITORIAL EXHIBITION (Curated Showcase)
      ===================================================================== */}
      <section
        aria-label="Asymmetrical Editorial Garment Showcase"
        className="py-24 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5E0D7]">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#8C7352] font-mono block">
              ARCHITECTURAL EXHIBITION // CURATED PLATES
            </span>
            <h2 className="text-exhibition-title text-[#25241F] font-normal">
              Selected Archival Silhouettes
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-[#77736C] max-w-sm">
              Hover any exhibition plate to reveal alternate drapery angles, test colorway tones, or launch the 3D studio.
            </p>
            <NextLink
              href="/explore"
              className="px-5 py-2.5 rounded-full bg-[#25241F] hover:bg-[#38362F] text-white text-xs font-medium tracking-wider uppercase flex items-center gap-2 shrink-0 transition-colors"
            >
              <span>Full Exhibition ({catalogList.length})</span>
              <ArrowRight size={13} className="text-[#B49A75]" />
            </NextLink>
          </div>
        </div>

        <AsymmetricalEditorialShowcase
          products={curatedExhibitionPieces}
          onInspectProduct={(p) => setInspectingProduct(p)}
        />
      </section>

      {/* =====================================================================
          ACT IV — FABRIC & MATERIALITY EXPLORER (Macro Loupe & Telemetry)
      ===================================================================== */}
      <div className="bg-[#F0EDE6]/60 border-y border-[#E5E0D7]">
        <FabricExplorerSection
          products={catalogList}
          onInspectProduct={(p) => setInspectingProduct(p)}
        />
      </div>

      {/* =====================================================================
          ACT V — INTERACTIVE LOOKBOOK COMPOSITION (Hotspot Story)
      ===================================================================== */}
      <section className="py-24 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#8C7352] font-mono block">
              STYLE COMPOSITION // INTERACTIVE LOOKBOOK
            </span>
            <h2 className="text-exhibition-title text-[#25241F] font-normal mt-1">
              Complete Ensemble Narratives
            </h2>
          </div>
          <NextLink
            href="/studio"
            className="text-xs text-[#25241F] hover:text-[#8C7352] font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Compose Your Own Outfit in 3D Studio</span>
            <ArrowRight size={13} className="text-[#B49A75]" />
          </NextLink>
        </div>

        <LookbookHotspotSlider
          products={catalogList}
          onInspectProduct={(p) => setInspectingProduct(p)}
        />
      </section>

      {/* =====================================================================
          ACT VI — DIGITAL WARDROBE & STYLE COMPOSITION CHAMBERS
      ===================================================================== */}
      <section className="py-20 bg-[#F0EDE6]/65 border-t border-[#E5E0D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-[#E5E0D7] hover:border-[#B49A75] transition-all flex flex-col justify-between space-y-6 shadow-2xs">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F8F6F1] border border-[#E5E0D7] flex items-center justify-center text-[#8C7352]">
                  <Sliders size={20} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7352] block">
                  CHAMBER 01 // 3D RAIL
                </span>
                <h3 className="font-serif text-2xl text-[#25241F] font-medium">
                  Interactive 3D Wardrobe
                </h3>
                <p className="text-xs text-[#77736C] leading-relaxed">
                  Slide garments along a sculpted oak and champagne rail with real-time sway physics and automatic full-length framing.
                </p>
              </div>
              <NextLink
                href="/wardrobe"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#25241F] hover:text-[#8C7352]"
              >
                <span>Enter 3D Wardrobe</span>
                <ArrowRight size={14} className="text-[#B49A75]" />
              </NextLink>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E5E0D7] hover:border-[#B49A75] transition-all flex flex-col justify-between space-y-6 shadow-2xs">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F8F6F1] border border-[#E5E0D7] flex items-center justify-center text-[#8C7352]">
                  <Layers size={20} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7352] block">
                  CHAMBER 02 // TRY-ON STUDIO
                </span>
                <h3 className="font-serif text-2xl text-[#25241F] font-medium">
                  Style Composition Studio
                </h3>
                <p className="text-xs text-[#77736C] leading-relaxed">
                  Combine outerwear, silk tops, and tailored trousers onto a 3D mannequin and save complete looks to your personal vault.
                </p>
              </div>
              <NextLink
                href="/studio"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#25241F] hover:text-[#8C7352]"
              >
                <span>Open Style Studio</span>
                <ArrowRight size={14} className="text-[#B49A75]" />
              </NextLink>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E5E0D7] hover:border-[#B49A75] transition-all flex flex-col justify-between space-y-6 shadow-2xs">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-[#F8F6F1] border border-[#E5E0D7] flex items-center justify-center text-[#8C7352]">
                  <Sparkles size={20} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7352] block">
                  CHAMBER 03 // AI COUTURIER
                </span>
                <h3 className="font-serif text-2xl text-[#25241F] font-medium">
                  Personal Atelier Stylist
                </h3>
                <p className="text-xs text-[#77736C] leading-relaxed">
                  Consult our contextual stylist to curate bespoke ensembles tailored to gallery openings, evening galas, or architectural travel.
                </p>
              </div>
              <NextLink
                href="/stylist"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#25241F] hover:text-[#8C7352]"
              >
                <span>Consult AI Stylist</span>
                <ArrowRight size={14} className="text-[#B49A75]" />
              </NextLink>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Archive Strip */}
      {recentlyViewedProducts.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <InteractiveSlider
            eyebrow="Personal Viewing Dossier"
            title="Recently Inspected Creations"
            subtitle="Resume inspecting silhouettes from your session."
          >
            {recentlyViewedProducts.map((product) => (
              <FashionProductCard
                key={`home-recent-${product.id}`}
                product={product}
                onInspect={(p) => setInspectingProduct(p)}
                compact
              />
            ))}
          </InteractiveSlider>
        </section>
      )}

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
