"use client";

import React, { useState, useRef } from "react";
import NextLink from "next/link";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  Sparkles,
  Plus,
  Check,
  ArrowUpRight,
} from "lucide-react";

interface HotspotPin {
  id: string;
  xPercent: number;
  yPercent: number;
  label: string;
  product: Product;
}

interface LookbookSlide {
  id: string;
  season: string;
  title: string;
  subtitle: string;
  editorialNote: string;
  image: string;
  hotspots: HotspotPin[];
}

interface LookbookHotspotSliderProps {
  products: Product[];
  onInspectProduct?: (product: Product) => void;
}

export default function LookbookHotspotSlider({
  products,
  onInspectProduct,
}: LookbookHotspotSliderProps) {
  const { addItem } = useCartStore();
  const { recordProductView } = useWardrobeStore();

  const p0 = products[0];
  const p1 = products[1] || products[0];
  const p2 = products[2] || products[0];
  const p3 = products[3] || products[0];
  const p4 = products[4] || products[0];
  const p5 = products[5] || products[0];

  const slides: LookbookSlide[] = [
    {
      id: "look-01",
      season: "AUTUMN / WINTER • LOOK 01",
      title: "Architectural Monolith Tailoring",
      subtitle: "Parisian Courtyard Editorial",
      editorialNote:
        "Structured double-bonded gabardine and raw silk shirting designed to hold crisp geometric volume under natural daylight.",
      image:
        p0?.images?.hero ||
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=85",
      hotspots: [
        ...(p0
          ? [
              {
                id: "hs-1a",
                xPercent: 46,
                yPercent: 38,
                label: p0.name,
                product: p0,
              },
            ]
          : []),
        ...(p3
          ? [
              {
                id: "hs-1b",
                xPercent: 54,
                yPercent: 72,
                label: p3.name,
                product: p3,
              },
            ]
          : []),
      ],
    },
    {
      id: "look-02",
      season: "PRIVATE SALON • LOOK 02",
      title: "Fluid Mulberry Silk & Bias Drape",
      subtitle: "Milanese Palazzo Study",
      editorialNote:
        "Luminous liquid charmeuse and sculpted lapels that respond to movement with zero structural resistance.",
      image:
        p4?.images?.hero ||
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85",
      hotspots: [
        ...(p4
          ? [
              {
                id: "hs-2a",
                xPercent: 48,
                yPercent: 45,
                label: p4.name,
                product: p4,
              },
            ]
          : []),
        ...(p2
          ? [
              {
                id: "hs-2b",
                xPercent: 60,
                yPercent: 28,
                label: p2.name,
                product: p2,
              },
            ]
          : []),
      ],
    },
    {
      id: "look-03",
      season: "ATELIER ARCHIVE • LOOK 03",
      title: "Sculpted Wool & Calfskin Ensemble",
      subtitle: "Tokyo Gallery Nocturne",
      editorialNote:
        "Hand-burnished outerwear paired with precision-pleated tailoring for gallery openings and private collections.",
      image:
        p1?.images?.hero ||
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85",
      hotspots: [
        ...(p1
          ? [
              {
                id: "hs-3a",
                xPercent: 44,
                yPercent: 36,
                label: p1.name,
                product: p1,
              },
            ]
          : []),
        ...(p5
          ? [
              {
                id: "hs-3b",
                xPercent: 56,
                yPercent: 64,
                label: p5.name,
                product: p5,
              },
            ]
          : []),
      ],
    },
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string>(
    slides[0]?.hotspots[0]?.id || ""
  );
  const [addedId, setAddedId] = useState<string | null>(null);
  const pointerStartX = useRef<number | null>(null);

  const currentSlide = slides[currentSlideIndex] || slides[0];
  const activeHotspot =
    currentSlide.hotspots.find((h) => h.id === activeHotspotId) ||
    currentSlide.hotspots[0];

  const goToSlide = (nextIdx: number) => {
    const normalized = (nextIdx + slides.length) % slides.length;
    setCurrentSlideIndex(normalized);
    const firstHs = slides[normalized]?.hotspots[0]?.id || "";
    setActiveHotspotId(firstHs);
    sounds.playClick();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const deltaX = e.clientX - pointerStartX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        goToSlide(currentSlideIndex + 1);
      } else {
        goToSlide(currentSlideIndex - 1);
      }
    }
    pointerStartX.current = null;
  };

  const handleQuickAdd = (product: Product) => {
    addItem(product, product.colorways[0], product.sizes[0], 1, false);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section
      aria-label="Editorial Lookbook with Interactive Product Hotspots"
      className="w-full rounded-3xl bg-white border border-[#E5E0D7] overflow-hidden shadow-[0_14px_40px_-16px_rgba(37,36,31,0.08)]"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goToSlide(currentSlideIndex + 1);
        if (e.key === "ArrowLeft") goToSlide(currentSlideIndex - 1);
      }}
      tabIndex={0}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Editorial Lookbook Canvas with Clickable Hotspots */}
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className="lg:col-span-7 relative min-h-[460px] sm:min-h-[560px] bg-[#F0EDE6] overflow-hidden select-none"
        >
          {slides.map((slide, idx) => {
            const isCurrent = idx === currentSlideIndex;
            return (
              <div
                key={slide.id}
                aria-hidden={!isCurrent}
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  isCurrent
                    ? "opacity-100 scale-100 z-10"
                    : "opacity-0 scale-105 pointer-events-none z-0"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  width={900}
                  height={1100}
                  {...(idx === 0
                    ? { loading: "lazy" as const }
                    : { fetchPriority: "low" as const, loading: "lazy" as const })}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#25241F]/65 via-transparent to-[#25241F]/15" />

                {/* Interactive Hotspots */}
                {slide.hotspots.map((hs, hsIdx) => {
                  const isPinned = activeHotspot?.id === hs.id;
                  return (
                    <div
                      key={hs.id}
                      style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspotId(hs.id);
                          sounds.playClick();
                        }}
                        aria-label={`Inspect hotspot ${hsIdx + 1}: ${hs.label}`}
                        aria-expanded={isPinned}
                        className={`group relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                          isPinned
                            ? "bg-[#25241F] text-white ring-4 ring-white/80 scale-110 shadow-lg"
                            : "bg-white/95 text-[#25241F] hover:bg-[#25241F] hover:text-white ring-2 ring-[#B49A75]/60 shadow-md"
                        }`}
                      >
                        <Plus
                          size={15}
                          className={`transition-transform duration-300 ${
                            isPinned ? "rotate-45 text-[#B49A75]" : ""
                          }`}
                        />
                        <span className="sr-only">{hs.label}</span>
                      </button>

                      {/* Floating Hotspot Tag Pill */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspotId(hs.id);
                        }}
                        className={`mt-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shadow-md -translate-x-1/3 ${
                          isPinned
                            ? "bg-white text-[#25241F] border-[#B49A75] opacity-100 translate-y-0"
                            : "bg-white/85 text-[#25241F] border-[#E5E0D7] opacity-85 hover:opacity-100"
                        }`}
                      >
                        <span className="font-serif">{hs.product.name}</span>
                        <span className="ml-2 text-[#8C7352] font-bold">
                          {formatPrice(hs.product.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Top Left Badge */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/92 backdrop-blur-md border border-[#E5E0D7] text-[10px] uppercase tracking-[0.22em] text-[#25241F] font-mono font-semibold shadow-xs">
              Interactive Lookbook • Tap Hotspots
            </span>
          </div>

          {/* Bottom Overlay Title & Prev/Next Controls */}
          <div className="absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-4">
            <div className="text-white max-w-md">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#DFD3C0] block">
                {currentSlide.season}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-medium mt-0.5">
                {currentSlide.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToSlide(currentSlideIndex - 1)}
                aria-label="Previous lookbook spread"
                className="w-10 h-10 rounded-full bg-white/92 hover:bg-white text-[#25241F] border border-[#E5E0D7] flex items-center justify-center transition-colors shadow-md cursor-pointer"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => goToSlide(currentSlideIndex + 1)}
                aria-label="Next lookbook spread"
                className="w-10 h-10 rounded-full bg-white/92 hover:bg-white text-[#25241F] border border-[#E5E0D7] flex items-center justify-center transition-colors shadow-md cursor-pointer"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Active Hotspot Product Spotlight & Look Breakdown */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#F8F6F1] border-t lg:border-t-0 lg:border-l border-[#E5E0D7] space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7352]">
                <Sparkles size={12} className="text-[#B49A75]" />
                <span>Editorial Dossier</span>
              </span>
              <span className="text-[11px] font-mono text-[#77736C]">
                Look 0{currentSlideIndex + 1} / 0{slides.length}
              </span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#25241F] font-medium">
              {currentSlide.title}
            </h3>

            <p className="text-xs text-[#77736C] leading-relaxed">
              {currentSlide.editorialNote}
            </p>
          </div>

          {/* Spotlighted Hotspot Garment Card */}
          {activeHotspot && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E0D7] shadow-xs space-y-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C7352] px-2.5 py-0.5 rounded-full bg-[#F0EDE6] border border-[#E5E0D7]">
                  Selected Hotspot Piece
                </span>
                <span className="text-[10px] font-mono text-[#77736C]">
                  {activeHotspot.product.fabric.weightGsm} GSM • {activeHotspot.product.fabric.weave}
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <NextLink
                  href={`/product/${activeHotspot.product.slug || activeHotspot.product.id}`}
                  onClick={() => recordProductView(activeHotspot.product.id)}
                  className="w-20 h-24 rounded-xl bg-[#F0EDE6] overflow-hidden shrink-0 border border-[#E5E0D7]"
                >
                  <img
                    src={activeHotspot.product.images.hero}
                    alt={activeHotspot.product.name}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </NextLink>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7352] block">
                    {activeHotspot.product.collectionName}
                  </span>
                  <NextLink
                    href={`/product/${activeHotspot.product.slug || activeHotspot.product.id}`}
                    onClick={() => recordProductView(activeHotspot.product.id)}
                  >
                    <h4 className="font-serif text-base text-[#25241F] font-medium truncate hover:text-[#8C7352] transition-colors">
                      {activeHotspot.product.name}
                    </h4>
                  </NextLink>
                  <p className="text-[11px] text-[#77736C] line-clamp-1 italic mt-0.5">
                    {activeHotspot.product.subtitle}
                  </p>
                  <span className="font-serif text-sm font-bold text-[#25241F] block mt-1.5">
                    {formatPrice(activeHotspot.product.price)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#E5E0D7]">
                {onInspectProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      recordProductView(activeHotspot.product.id);
                      onInspectProduct(activeHotspot.product);
                      sounds.playGarmentInspect();
                    }}
                    className="flex-1 py-2.5 px-3 rounded-full bg-[#F8F6F1] hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye size={13} className="text-[#B49A75]" />
                    <span>Inspect 3D</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleQuickAdd(activeHotspot.product)}
                  className={`flex-1 py-2.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    addedId === activeHotspot.product.id
                      ? "bg-[#607B60] text-white"
                      : "bg-[#25241F] hover:bg-[#38362F] text-white"
                  }`}
                >
                  {addedId === activeHotspot.product.id ? (
                    <>
                      <Check size={13} />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={13} className="text-[#B49A75]" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <NextLink
                  href={`/product/${activeHotspot.product.slug || activeHotspot.product.id}`}
                  onClick={() => recordProductView(activeHotspot.product.id)}
                  className="w-9 h-9 rounded-full bg-white border border-[#E5E0D7] hover:border-[#B49A75] text-[#25241F] flex items-center justify-center transition-colors shrink-0"
                  title="Open Product Page"
                  aria-label="Open Product Page"
                >
                  <ArrowUpRight size={14} />
                </NextLink>
              </div>
            </div>
          )}

          {/* Hotspot Switcher Pills & Look Slide Indicators */}
          <div className="space-y-3 pt-2 border-t border-[#E5E0D7]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#77736C] block">
              Garments in This Look ({currentSlide.hotspots.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {currentSlide.hotspots.map((hs, i) => (
                <button
                  key={hs.id}
                  type="button"
                  onClick={() => {
                    setActiveHotspotId(hs.id);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    activeHotspot?.id === hs.id
                      ? "bg-[#25241F] text-white border-[#25241F]"
                      : "bg-white text-[#77736C] border-[#E5E0D7] hover:text-[#25241F]"
                  }`}
                >
                  0{i + 1} • {hs.product.name}
                </button>
              ))}
            </div>

            {/* Lookbook Spread Selector Dots */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`View lookbook spread ${idx + 1}`}
                    aria-current={idx === currentSlideIndex ? "true" : undefined}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSlideIndex
                        ? "w-8 bg-[#25241F]"
                        : "w-2.5 bg-[#E5E0D7] hover:bg-[#B49A75]"
                    }`}
                  />
                ))}
              </div>
              <NextLink
                href="/collections"
                className="text-[11px] font-medium text-[#8C7352] hover:text-[#25241F] underline transition-colors"
              >
                Explore All Lookbooks →
              </NextLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

