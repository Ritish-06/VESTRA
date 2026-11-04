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
import FashionProductCard from "@/components/ui/FashionProductCard";
import InteractiveSlider from "@/components/ui/InteractiveSlider";
import LookbookHotspotSlider from "@/components/ui/LookbookHotspotSlider";
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
  Compass,
  CheckCircle2,
  DoorOpen,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Check,
} from "lucide-react";

const ProductInspectorCanvas = dynamic(
  () => import("@/components/3d/ProductInspectorCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center text-[#B49A75] gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#B49A75]/30 border-t-[#B49A75] animate-spin" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#77736C]">
          Calibrating 3D Centerpiece...
        </span>
      </div>
    ),
  }
);

export default function LandingPage() {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { recentlyViewedIds, recordProductView } = useWardrobeStore();
  const { products } = useCatalog();

  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [isEnteringStore, setIsEnteringStore] = useState(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [heroAdded, setHeroAdded] = useState(false);

  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroCenterpieceRef = useRef<HTMLDivElement>(null);
  const heroTouchStartX = useRef<number | null>(null);

  const catalogList = products.length > 0 ? products : PRODUCTS;

  // Hero Campaign Slides paired with live 3D garments
  const heroCampaigns = useMemo(() => {
    const p0 = catalogList[0] || PRODUCTS[0];
    const p1 = catalogList[4] || catalogList[1] || p0;
    const p2 = catalogList[1] || catalogList[2] || p0;
    return [
      {
        id: "campaign-01",
        eyebrow: "CAMPAIGN 01 • AUTUMN / WINTER ATELIER",
        headlineTop: "The Future of",
        headlineAccent: "Digital Fashion",
        tagline: "Your Wardrobe. Your World. Your Style.",
        description:
          "Step beyond flat catalog grids into an authentic spatial fashion house. Browse garments hanging on sculpted oak and champagne rails, inspect tactile micro-weaves under studio illumination, and explore bespoke silhouettes.",
        backdropImage: p0.images.hero,
        product: p0,
      },
      {
        id: "campaign-02",
        eyebrow: "CAMPAIGN 02 • LIQUID SILK & EVENING COUTURE",
        headlineTop: "Sculpted Drape &",
        headlineAccent: "Luminous Silk",
        tagline: "Hand-Finished Bias Silhouettes in 360°",
        description:
          "Experience organic 6A-grade mulberry charmeuse and architectural evening gowns framed from shoulder to floor hem with calibrated studio lighting.",
        backdropImage: p1.images.hero,
        product: p1,
      },
      {
        id: "campaign-03",
        eyebrow: "CAMPAIGN 03 • MONOLITH BESPOKE TAILORING",
        headlineTop: "Architectural",
        headlineAccent: "Haute Tailoring",
        tagline: "Precision Canvas Construction & Tactile Weight",
        description:
          "Every lapel, pleat, and double-bonded seam is engineered for spatial inspection. Rotate, zoom into fabric grain, or try pieces onto our 3D atelier mannequin.",
        backdropImage: p2.images.hero,
        product: p2,
      },
    ];
  }, [catalogList]);

  const activeCampaign = heroCampaigns[heroSlideIndex] || heroCampaigns[0];
  const heroProduct = activeCampaign.product;

  // Auto-advance hero campaign slider unless paused or reduced-motion preferred
  useEffect(() => {
    if (heroPaused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroCampaigns.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroPaused, heroCampaigns.length]);

  const changeHeroSlide = (nextIdx: number) => {
    const normalized = (nextIdx + heroCampaigns.length) % heroCampaigns.length;
    setHeroSlideIndex(normalized);
    sounds.playClick();
  };

  // Category Slider Cards
  const categoryCards = useMemo(() => {
    return [
      {
        id: "dresses",
        title: "Dresses & Gowns",
        subtitle: "Bias-cut silk & evening silhouettes",
        count: catalogList.filter(
          (p) =>
            p.name.toLowerCase().includes("gown") ||
            p.name.toLowerCase().includes("dress") ||
            p.audience === "WOMEN"
        ).length,
        image: (catalogList[4] || catalogList[0]).images.hero,
        href: "/explore?filter=women",
      },
      {
        id: "outerwear",
        title: "Outerwear & Trench",
        subtitle: "Storm-bonded gabardine & wool coats",
        count: catalogList.filter((p) => p.category === "outerwear").length,
        image: catalogList[0].images.hero,
        href: "/explore?filter=outerwear",
      },
      {
        id: "tailoring",
        title: "Architectural Tailoring",
        subtitle: "Structured blazers & pleated form",
        count: catalogList.filter((p) => p.category === "tailoring").length,
        image: (catalogList[1] || catalogList[0]).images.hero,
        href: "/explore?filter=tailoring",
      },
      {
        id: "tops",
        title: "Tops & Fine Knitwear",
        subtitle: "Mulberry silk shirting & cashmere",
        count: catalogList.filter((p) => p.category === "tops").length,
        image: (catalogList[2] || catalogList[0]).images.hero,
        href: "/explore?filter=tops",
      },
      {
        id: "trousers",
        title: "Tailored Trousers",
        subtitle: "Wide-leg wool & elongated drape",
        count: catalogList.filter((p) => p.category === "trousers").length,
        image: (catalogList[3] || catalogList[0]).images.hero,
        href: "/explore?filter=trousers",
      },
      {
        id: "accessories",
        title: "Artisanal Accessories",
        subtitle: "Sculpted leather & brushed brass",
        count: catalogList.filter((p) => p.category === "accessories" || p.category === "footwear").length,
        image: (catalogList[5] || catalogList[0]).images.hero,
        href: "/explore?filter=accessories",
      },
      {
        id: "seasonal",
        title: "Seasonal Collections",
        subtitle: "Nocturne Monolith & Aether Silk drops",
        count: catalogList.length,
        image: (catalogList[6] || catalogList[0]).images.hero,
        href: "/collections",
      },
    ];
  }, [catalogList]);

  const featuredProducts = useMemo(() => catalogList.slice(0, 8), [catalogList]);

  const newArrivalsProducts = useMemo(() => {
    const flagged = catalogList.filter((p) => p.isNew);
    return flagged.length >= 4 ? flagged : [...flagged, ...catalogList.slice(0, 6)].slice(0, 7);
  }, [catalogList]);

  const recentlyViewedProducts = useMemo(() => {
    const mapped = (recentlyViewedIds || [])
      .map((id) => catalogList.find((p) => p.id === id || p.slug === id))
      .filter(Boolean) as Product[];
    return mapped.length > 0 ? mapped : catalogList.slice(0, 4);
  }, [recentlyViewedIds, catalogList]);

  // Cinematic "Enter the Store" Transition Sequence
  const handleEnterStore = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isEnteringStore) return;
    setIsEnteringStore(true);
    sounds.playGarmentInspect();

    const tl = gsap.timeline({
      onComplete: () => {
        router.push("/wardrobe");
      },
    });

    if (heroContainerRef.current && heroCenterpieceRef.current) {
      tl.to(heroContainerRef.current, {
        opacity: 0,
        y: -24,
        duration: 0.45,
        ease: "power2.out",
      });
      tl.to(
        heroCenterpieceRef.current,
        {
          scale: 1.15,
          opacity: 0,
          duration: 0.5,
          ease: "power3.inOut",
        },
        "-=0.35"
      );
    } else {
      router.push("/wardrobe");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      {/* --- Section 1: Interactive Hero Campaign Slider + 3D Showroom Centerpiece --- */}
      <section
        aria-label="Featured Fashion Campaigns"
        onPointerDown={(e) => {
          heroTouchStartX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (heroTouchStartX.current === null) return;
          const dx = e.clientX - heroTouchStartX.current;
          if (Math.abs(dx) > 60) {
            changeHeroSlide(dx < 0 ? heroSlideIndex + 1 : heroSlideIndex - 1);
          }
          heroTouchStartX.current = null;
        }}
        className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F0EDE6] via-[#F8F6F1] to-[#F8F6F1] border-b border-[#E5E0D7]"
      >
        {/* Subtle Editorial Campaign Photography Backdrop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {heroCampaigns.map((camp, idx) => {
            const isCurrent = idx === heroSlideIndex;
            return (
              <img
                key={camp.id}
                src={camp.backdropImage}
                alt={camp.headlineAccent}
                width={1600}
                height={1000}
                {...(idx === 0
                  ? { fetchPriority: "high" as const }
                  : { fetchPriority: "low" as const, loading: "lazy" as const })}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                  isCurrent ? "opacity-[0.09] scale-100" : "opacity-0 scale-105"
                }`}
              />
            );
          })}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F6F1] via-[#F8F6F1]/92 to-[#F8F6F1]/80" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center z-10">
          {/* Left Hero Campaign Narrative */}
          <div
            ref={heroContainerRef}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#E5E0D7] text-[#8C7352] text-[11px] font-mono tracking-widest uppercase shadow-2xs">
              <Sparkles size={12} className="text-[#B49A75]" />
              <span>{activeCampaign.eyebrow}</span>
            </div>

            <div key={activeCampaign.id} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-normal tracking-tight text-[#25241F] leading-[1.08]">
                {activeCampaign.headlineTop} <br />
                <span className="italic font-serif gold-gradient-text font-medium">
                  {activeCampaign.headlineAccent}
                </span>
              </h1>

              <p className="font-serif text-lg sm:text-xl text-[#8C7352] tracking-wide italic">
                {activeCampaign.tagline}
              </p>

              <p className="text-xs sm:text-sm text-[#77736C] max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                {activeCampaign.description}
              </p>
            </div>

            {/* Primary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                type="button"
                onClick={handleEnterStore}
                disabled={isEnteringStore}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25241F] hover:bg-[#38362F] active:scale-[0.99] text-white font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <DoorOpen size={16} className="text-[#B49A75]" />
                <span>{isEnteringStore ? "Entering Showroom..." : "Enter 3D Fashion Store"}</span>
                <ArrowRight size={14} className="text-[#B49A75]" />
              </button>

              <NextLink
                href="/explore"
                onClick={() => sounds.playClick()}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-[#F0EDE6] text-[#25241F] border border-[#E5E0D7] font-medium text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-2xs"
              >
                <Compass size={15} className="text-[#8C7352]" />
                <span>Explore Collections</span>
              </NextLink>
            </div>

            {/* Hero Campaign Slider Controls & Indicators */}
            <div className="pt-6 border-t border-[#E5E0D7] flex flex-wrap items-center justify-center lg:justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeHeroSlide(heroSlideIndex - 1)}
                  aria-label="Previous campaign slide"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => changeHeroSlide(heroSlideIndex + 1)}
                  aria-label="Next campaign slide"
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setHeroPaused((p) => !p)}
                  aria-label={heroPaused ? "Resume campaign slideshow" : "Pause campaign slideshow"}
                  className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#77736C] hover:text-[#25241F] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  title={heroPaused ? "Resume Slideshow" : "Pause Slideshow"}
                >
                  {heroPaused ? <Play size={13} /> : <Pause size={13} />}
                </button>

                <div className="flex items-center gap-1.5 ml-2" role="tablist" aria-label="Campaign slides">
                  {heroCampaigns.map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      role="tab"
                      aria-selected={idx === heroSlideIndex}
                      aria-label={`Campaign slide ${idx + 1}`}
                      onClick={() => changeHeroSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === heroSlideIndex
                          ? "w-8 bg-[#25241F]"
                          : "w-2.5 bg-[#E5E0D7] hover:bg-[#B49A75]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-[#77736C] font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#8C7352]" /> 3D Rail Physics
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[#8C7352]" /> Full Garment Framing
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero Interactive 3D Turntable Card */}
          <div
            ref={heroCenterpieceRef}
            onPointerDown={(e) => e.stopPropagation()}
            className="lg:col-span-5 h-[480px] sm:h-[530px] rounded-3xl bright-showroom border border-[#E5E0D7] relative overflow-hidden shadow-[0_18px_45px_-18px_rgba(37,36,31,0.12)] flex flex-col group text-[#25241F]"
          >
            {/* Viewport Badge */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2 pointer-events-none">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7352] px-3 py-1 rounded-full bg-white/92 border border-[#E5E0D7] font-mono backdrop-blur-md shadow-2xs">
                Interactive 3D Showroom
              </span>
              <span className="text-[10px] font-mono text-[#77736C] px-2.5 py-1 rounded-full bg-white/85 border border-[#E5E0D7]">
                0{heroSlideIndex + 1} / 0{heroCampaigns.length}
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
            <div className="p-5 bg-white/95 backdrop-blur-md border-t border-[#E5E0D7] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-[#8C7352] font-mono block">
                  {heroProduct.collectionName}
                </span>
                <NextLink
                  href={`/product/${heroProduct.slug || heroProduct.id}`}
                  onClick={() => recordProductView(heroProduct.id)}
                >
                  <h2 className="font-serif text-base text-[#25241F] font-medium truncate hover:text-[#8C7352] transition-colors">
                    {heroProduct.name}
                  </h2>
                </NextLink>
                <span className="font-serif text-xs text-[#25241F] font-bold tabular-nums">
                  {formatPrice(heroProduct.price)}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    recordProductView(heroProduct.id);
                    setInspectingProduct(heroProduct);
                    sounds.playGarmentInspect();
                  }}
                  className="px-4 py-2 rounded-full bg-[#F8F6F1] hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] text-xs font-medium tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye size={12} className="text-[#B49A75]" />
                  <span>Inspect 3D</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    addItem(heroProduct, heroProduct.colorways[0], heroProduct.sizes[0], 1, false);
                    setHeroAdded(true);
                    setTimeout(() => setHeroAdded(false), 1800);
                  }}
                  className={`px-3.5 h-9 rounded-full text-xs font-medium flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer ${
                    heroAdded
                      ? "bg-[#607B60] text-white"
                      : "bg-[#25241F] hover:bg-[#38362F] text-white"
                  }`}
                  title="Quick Add to Bag"
                >
                  {heroAdded ? (
                    <>
                      <Check size={13} />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={13} className="text-[#B49A75]" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Category Discovery Slider --- */}
      <section className="py-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <InteractiveSlider
          eyebrow="Curated Departments"
          title="Browse by Silhouette & Category"
          subtitle="Drag, swipe, or use arrow controls to explore dresses, tailoring, outerwear, silk tops, and seasonal capsules."
          itemWidthClass="w-[240px] sm:w-[265px] lg:w-[280px]"
          headerAction={
            <NextLink
              href="/explore"
              className="text-xs text-[#25241F] hover:text-[#8C7352] font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>All Categories</span>
              <ArrowRight size={13} className="text-[#B49A75]" />
            </NextLink>
          }
        >
          {categoryCards.map((cat) => (
            <NextLink
              key={cat.id}
              href={cat.href}
              onClick={() => sounds.playClick()}
              className="group block rounded-2xl bg-white border border-[#E5E0D7] hover:border-[#B49A75] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[4/5] w-full bg-[#F0EDE6] relative overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#25241F]/70 via-[#25241F]/15 to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono text-[#25241F] border border-[#E5E0D7]">
                  {cat.count} {cat.count === 1 ? "Piece" : "Pieces"}
                </span>
                <div className="absolute inset-x-4 bottom-4 text-white">
                  <h3 className="font-serif text-lg font-medium">{cat.title}</h3>
                  <p className="text-[11px] text-white/85 mt-0.5 line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            </NextLink>
          ))}
        </InteractiveSlider>
      </section>

      {/* --- Section 3: Featured Collection Slider --- */}
      <section className="py-20 bg-[#F0EDE6]/60 border-y border-[#E5E0D7]">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <InteractiveSlider
            eyebrow="The Permanent Archive"
            title="Featured Atelier Collection"
            subtitle="Hover any creation to inspect alternate views, select colorways, preview in 3D, or add directly to your shopping bag."
            headerAction={
              <NextLink
                href="/explore"
                className="text-xs text-[#25241F] hover:text-[#8C7352] font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>View Full Archive ({catalogList.length})</span>
                <ArrowRight size={13} className="text-[#B49A75]" />
              </NextLink>
            }
          >
            {featuredProducts.map((product) => (
              <FashionProductCard
                key={product.id}
                product={product}
                onInspect={(p) => setInspectingProduct(p)}
              />
            ))}
          </InteractiveSlider>
        </div>
      </section>

      {/* --- Section 4: Editorial Lookbook Slider with Clickable Hotspots --- */}
      <section className="py-24 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#8C7352] font-mono block">
              Shop the Runway Spread
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#25241F] font-medium mt-1">
              Interactive Editorial Lookbook
            </h2>
            <p className="text-xs text-[#77736C] mt-1 max-w-xl">
              Click the pulsing champagne pins on each editorial photograph to inspect fabric telemetry and shop individual garments in the ensemble.
            </p>
          </div>
          <NextLink
            href="/collections"
            className="text-xs text-[#25241F] hover:text-[#8C7352] font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>All Seasonal Lookbooks</span>
            <ArrowRight size={13} className="text-[#B49A75]" />
          </NextLink>
        </div>

        <LookbookHotspotSlider
          products={catalogList}
          onInspectProduct={(p) => setInspectingProduct(p)}
        />
      </section>

      {/* --- Section 5: New Arrivals Slider --- */}
      <section className="py-20 bg-[#F0EDE6]/60 border-y border-[#E5E0D7]">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <InteractiveSlider
            eyebrow="Latest Runway Editions"
            title="New Arrivals"
            subtitle="Newly released silhouettes freshly hung on our digital showroom rails."
            headerAction={
              <NextLink
                href="/explore?filter=new"
                className="text-xs text-[#25241F] hover:text-[#8C7352] font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Explore New Releases</span>
                <ArrowRight size={13} className="text-[#B49A75]" />
              </NextLink>
            }
          >
            {newArrivalsProducts.map((product) => (
              <FashionProductCard
                key={`new-${product.id}`}
                product={product}
                onInspect={(p) => setInspectingProduct(p)}
              />
            ))}
          </InteractiveSlider>
        </div>
      </section>

      {/* --- Section 6: Spatial Showroom Concept --- */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C7352] font-mono">
            Spatial Paradigm Shift
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#25241F] font-medium">
            Not a Catalog. A Physical Showroom.
          </h2>
          <p className="text-xs sm:text-sm text-[#77736C] leading-relaxed">
            Traditional online fashion confines couture to flat 2D thumbnails. VESTRA restores the tactile weight, full-length drape, and spatial movement of a real luxury garment rack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E0D7] relative overflow-hidden group hover:border-[#B49A75] transition-all flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-md">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F0EDE6] border border-[#B49A75]/40 flex items-center justify-center text-[#8C7352]">
                <Sliders size={22} />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7352]">
                Experience Mode 01
              </span>
              <h3 className="font-serif text-2xl text-[#25241F] font-medium">
                The Interactive Clothing Rail
              </h3>
              <p className="text-xs text-[#77736C] leading-relaxed">
                Smooth horizontal drag physics with natural garment sway on sculpted oak and champagne hangers. Click any hanger to frame the full silhouette from shoulder to hem.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E0D7]">
              <NextLink
                href="/wardrobe"
                className="inline-flex items-center gap-2 text-xs text-[#25241F] font-semibold tracking-wider uppercase group-hover:text-[#8C7352]"
              >
                <span>Launch 3D Rail Experience</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#B49A75]" />
              </NextLink>
            </div>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E0D7] relative overflow-hidden group hover:border-[#B49A75] transition-all flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-md">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F0EDE6] border border-[#B49A75]/40 flex items-center justify-center text-[#8C7352]">
                <Layers size={22} />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7352]">
                Experience Mode 02
              </span>
              <h3 className="font-serif text-2xl text-[#25241F] font-medium">
                The Architectural Salon & Try-On Studio
              </h3>
              <p className="text-xs text-[#77736C] leading-relaxed">
                Explore a bright travertine and alabaster 3D showroom or layer outerwear, tops, and trousers onto our interactive 3D mannequin in the Outfit Studio.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E0D7]">
              <NextLink
                href="/studio"
                className="inline-flex items-center gap-2 text-xs text-[#25241F] font-semibold tracking-wider uppercase group-hover:text-[#8C7352]"
              >
                <span>Open 3D Outfit Studio</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-[#B49A75]" />
              </NextLink>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 7: Recently Viewed Slider --- */}
      {recentlyViewedProducts.length > 0 && (
        <section className="py-20 bg-[#F0EDE6]/50 border-t border-[#E5E0D7]">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <InteractiveSlider
              eyebrow="Your Personal Archive History"
              title="Recently Viewed Creations"
              subtitle="Continue inspecting garments you recently explored across the showroom."
            >
              {recentlyViewedProducts.map((product) => (
                <FashionProductCard
                  key={`recent-${product.id}`}
                  product={product}
                  onInspect={(p) => setInspectingProduct(p)}
                  compact
                />
              ))}
            </InteractiveSlider>
          </div>
        </section>
      )}

      {/* --- Section 8: Brand Manifesto Quote Banner --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center relative bg-[#F8F6F1] border-t border-[#E5E0D7]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="w-12 h-12 rounded-full border border-[#B49A75] bg-white flex items-center justify-center text-[#8C7352] mx-auto text-sm font-serif shadow-2xs">
            V
          </div>
          <blockquote className="font-serif text-2xl sm:text-4xl text-[#25241F] font-light italic leading-snug">
            &ldquo;We believe the future of fashion does not belong in static squares. True luxury is three-dimensional, kinetic, and deeply personal.&rdquo;
          </blockquote>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8C7352] font-mono">
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
