"use client";

import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { Product, Colorway } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import {
  Orbit,
  Eye,
  ShoppingBag,
  Sliders,
  Check,
  ChevronLeft,
  ChevronRight,
  Box,
  Image as ImageIcon,
  ArrowUpRight,
  RotateCw,
} from "lucide-react";

const ProductInspectorCanvas = dynamic(
  () => import("@/components/3d/ProductInspectorCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center text-[#8C7352] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#B49A75]/30 border-t-[#B49A75] animate-spin" />
        <span className="text-[10px] uppercase tracking-[0.22em] font-mono text-[#77736C]">
          Calibrating Spatial Orbit...
        </span>
      </div>
    ),
  }
);

export interface OrbitCapsule {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  manifesto: string;
  atmosphereNote: string;
  palette: string[];
  matchFn: (p: Product, idx: number) => boolean;
}

export const ORBIT_CAPSULES: OrbitCapsule[] = [
  {
    id: "essential-forms",
    code: "01",
    name: "Essential Forms",
    subtitle: "Pure Architectural Proportions & Tailored Volume",
    manifesto:
      "Stripped of ornament to foreground seam geometry, canvas shoulder structure, and elongated vertical drape.",
    atmosphereNote: "GALLERY WING A • DAYLIGHT TRAVERTINE",
    palette: ["#25241F", "#E5DFD3", "#9E9B95", "#B49A75"],
    matchFn: (p, idx) =>
      p.category === "tailoring" ||
      p.category === "trousers" ||
      p.tags.includes("Essential") ||
      idx % 4 === 0,
  },
  {
    id: "after-hours",
    code: "02",
    name: "After Hours",
    subtitle: "Nocturnal Mulberry Silk & Bias Evening Couture",
    manifesto:
      "Fluid evening silhouettes cut on a 45-degree bias to catch low gallery light with liquid surface luster.",
    atmosphereNote: "GALLERY WING B • VELVET & ALABASTER",
    palette: ["#1C1B19", "#6E5A4F", "#C5A880", "#F0EDE6"],
    matchFn: (p, idx) =>
      p.audience === "WOMEN" ||
      p.fabric.weave.toLowerCase().includes("silk") ||
      p.name.toLowerCase().includes("gown") ||
      idx % 4 === 1,
  },
  {
    id: "modern-heritage",
    code: "03",
    name: "Modern Heritage",
    subtitle: "Storm-Bonded Gabardine & Archival Outerwear",
    manifesto:
      "Monumental coats and weather-sealed tailoring re-engineered from European archival patterns for contemporary cities.",
    atmosphereNote: "GALLERY WING C • BRUSHED CHAMPAGNE",
    palette: ["#2A2823", "#8C7352", "#D4C9B8", "#F8F6F1"],
    matchFn: (p, idx) =>
      p.category === "outerwear" ||
      p.collectionId === "nocturne" ||
      idx % 4 === 2,
  },
  {
    id: "future-classics",
    code: "04",
    name: "Future Classics",
    subtitle: "Modular Cashmere, Sculpted Leather & Icons",
    manifesto:
      "Tactile knitwear, full-grain calfskin, and seasonless objects designed to anchor a permanent digital and physical wardrobe.",
    atmosphereNote: "GALLERY WING D • MONOLITH STONE",
    palette: ["#25241F", "#77736C", "#B49A75", "#FFFFFF"],
    matchFn: (p, idx) =>
      p.category === "tops" ||
      p.category === "accessories" ||
      p.category === "footwear" ||
      idx % 4 === 3,
  },
];

interface FashionOrbitExperienceProps {
  products: Product[];
  onInspectProduct?: (product: Product) => void;
}

export default function FashionOrbitExperience({
  products,
  onInspectProduct,
}: FashionOrbitExperienceProps) {
  const { addItem } = useCartStore();
  const { addWardrobeItem, recordProductView } = useWardrobeStore();

  const [activeCapsuleId, setActiveCapsuleId] = useState<string>(ORBIT_CAPSULES[0].id);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [stageView, setStageView] = useState<"editorial" | "3d">("editorial");
  const [autoRotate3D, setAutoRotate3D] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<Colorway | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [addedToBag, setAddedToBag] = useState<boolean>(false);
  const [hungInWardrobe, setHungInWardrobe] = useState<boolean>(false);

  const activeCapsule = useMemo(
    () => ORBIT_CAPSULES.find((c) => c.id === activeCapsuleId) || ORBIT_CAPSULES[0],
    [activeCapsuleId]
  );

  const capsuleProducts = useMemo(() => {
    const matched = products.filter((p, i) => activeCapsule.matchFn(p, i));
    const list = matched.length >= 4 ? matched.slice(0, 6) : products.slice(0, 6);
    return list;
  }, [products, activeCapsule]);

  const activeProduct = capsuleProducts[activeNodeIndex] || capsuleProducts[0] || products[0];

  useEffect(() => {
    if (!activeProduct) return;
    setSelectedColor(activeProduct.colorways[0] || null);
    setSelectedSize(activeProduct.sizes[0] || "48 (M)");
  }, [activeProduct]);

  const handleSelectCapsule = (capsuleId: string) => {
    setActiveCapsuleId(capsuleId);
    setActiveNodeIndex(0);
    sounds.playClick();
  };

  const handleSelectNode = (idx: number) => {
    const normalized = (idx + capsuleProducts.length) % capsuleProducts.length;
    setActiveNodeIndex(normalized);
    const prod = capsuleProducts[normalized];
    if (prod) {
      recordProductView(prod.id);
    }
    sounds.playHangerSlide();
  };

  if (!activeProduct) return null;

  const currentColor = selectedColor || activeProduct.colorways[0];
  const currentSize = selectedSize || activeProduct.sizes[0];

  // Orbital satellite positions around the center (in degrees)
  const satelliteAngles = [-68, -24, 24, 68, 156, 204];

  return (
    <section
      id="fashion-orbit"
      aria-label="Fashion Orbit Interactive Exhibition"
      className="w-full py-20 sm:py-28 bg-[#F0EDE6]/65 border-y border-[#E5E0D7] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Architectural Header & Capsule World Selector */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#E5E0D7]">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-[#8C7352]">
              <Orbit size={13} className="text-[#B49A75]" />
              <span>SPATIAL EXHIBITION SYSTEM // FASHION ORBIT</span>
            </div>
            <h2 className="text-exhibition-title text-[#25241F] font-normal">
              Explore the Four Curatorial Worlds
            </h2>
            <p className="text-xs sm:text-sm text-[#77736C] prose-measure">
              Select a curatorial world below to arrange its archival garments around the central inspection stage. Click any orbital node to bring a silhouette into focus, switch between editorial photography and live 3D inspection, and compose your personal wardrobe.
            </p>
          </div>

          {/* 4 Capsule World Switcher Pills */}
          <div
            role="tablist"
            aria-label="Curatorial Fashion Worlds"
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto"
          >
            {ORBIT_CAPSULES.map((cap) => {
              const isSelected = cap.id === activeCapsule.id;
              return (
                <button
                  key={cap.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectCapsule(cap.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#25241F] text-white border-[#25241F] shadow-md"
                      : "bg-white text-[#25241F] border-[#E5E0D7] hover:border-[#B49A75]"
                  }`}
                >
                  <span
                    className={`text-[9px] font-mono tracking-widest uppercase block ${
                      isSelected ? "text-[#DFD3C0]" : "text-[#8C7352]"
                    }`}
                  >
                    WORLD {cap.code}
                  </span>
                  <span className="font-serif text-sm font-medium block mt-0.5 truncate">
                    {cap.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Capsule Manifesto Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-white border border-[#E5E0D7] shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#8C7352]">
                {activeCapsule.atmosphereNote}
              </span>
              <span className="text-[#E5E0D7]">•</span>
              <span className="text-[10px] font-mono text-[#77736C]">
                {capsuleProducts.length} Archival Silhouettes in Orbit
              </span>
            </div>
            <p className="text-xs text-[#25241F] italic font-serif">
              &ldquo;{activeCapsule.manifesto}&rdquo;
            </p>
          </div>

          {/* Tone Palette Specimen */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#77736C] mr-1">
              Capsule Tones:
            </span>
            {activeCapsule.palette.map((hex, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border border-black/15"
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>

        {/* Main Fashion Orbit Stage + Atelier Inspection Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left 7 Columns: The Interactive Orbital Ring & Central Garment Stage */}
          <div className="lg:col-span-7 rounded-3xl bright-showroom border border-[#E5E0D7] relative overflow-hidden min-h-[540px] sm:min-h-[620px] flex flex-col justify-between p-5 sm:p-7 shadow-[0_18px_45px_-20px_rgba(37,36,31,0.1)]">
            {/* Architectural Concentric Orbit Rings (Decorative SVG Geometry) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full border border-[#E5E0D7]" />
              <div className="absolute w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] rounded-full border border-dashed border-[#B49A75]/45" />
              <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-[0.3em] text-[#77736C]/60">
                00° ORBIT AXIS
              </span>
            </div>

            {/* Top Stage Bar: View Mode Toggle (Editorial Photo vs Live 3D) */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center p-1 rounded-full bg-white/94 backdrop-blur-md border border-[#E5E0D7] shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setStageView("editorial");
                    sounds.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    stageView === "editorial"
                      ? "bg-[#25241F] text-white"
                      : "text-[#77736C] hover:text-[#25241F]"
                  }`}
                >
                  <ImageIcon size={12} />
                  <span>Editorial Portrait</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStageView("3d");
                    sounds.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    stageView === "3d"
                      ? "bg-[#25241F] text-white"
                      : "text-[#77736C] hover:text-[#25241F]"
                  }`}
                >
                  <Box size={12} />
                  <span>3D Spatial Model</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {stageView === "3d" && (
                  <button
                    type="button"
                    onClick={() => setAutoRotate3D((r) => !r)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase border transition-colors flex items-center gap-1 cursor-pointer ${
                      autoRotate3D
                        ? "bg-[#25241F] text-white border-[#25241F]"
                        : "bg-white/90 text-[#25241F] border-[#E5E0D7]"
                    }`}
                  >
                    <RotateCw size={11} className={autoRotate3D ? "animate-spin" : ""} />
                    <span>360° Orbit</span>
                  </button>
                )}
                <span className="px-3 py-1.5 rounded-full bg-white/92 border border-[#E5E0D7] text-[10px] font-mono text-[#25241F] tabular-nums">
                  NODE 0{activeNodeIndex + 1} / 0{capsuleProducts.length}
                </span>
              </div>
            </div>

            {/* Central Focal Garment Stage + Surrounding Orbital Nodes */}
            <div className="relative flex-1 my-4 flex items-center justify-center">
              {/* Central Spotlight Frame */}
              <div className="relative z-10 w-[230px] sm:w-[280px] h-[320px] sm:h-[380px] rounded-3xl bg-white border border-[#E5E0D7] shadow-[0_20px_50px_-15px_rgba(37,36,31,0.16)] overflow-hidden group">
                {stageView === "editorial" ? (
                  <NextLink
                    href={`/product/${activeProduct.slug || activeProduct.id}`}
                    onClick={() => recordProductView(activeProduct.id)}
                    className="block w-full h-full relative"
                  >
                    <img
                      key={activeProduct.id}
                      src={activeProduct.images.hero}
                      alt={activeProduct.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#25241F]/65 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#DFD3C0]">
                        {activeCapsule.name}
                      </span>
                      <h3 className="font-serif text-base font-medium leading-snug">
                        {activeProduct.name}
                      </h3>
                    </div>
                  </NextLink>
                ) : (
                  <div className="w-full h-full bright-showroom">
                    <ProductInspectorCanvas
                      product={activeProduct}
                      activeColorway={currentColor}
                      autoRotate={autoRotate3D}
                    />
                  </div>
                )}
              </div>

              {/* Desktop Orbital Satellite Nodes Positioned Around the Central Stage */}
              <div className="hidden sm:block absolute inset-0 pointer-events-none">
                {capsuleProducts.map((nodeProd, idx) => {
                  const isCurrent = idx === activeNodeIndex;
                  const angleDeg = satelliteAngles[idx % satelliteAngles.length];
                  const angleRad = (angleDeg * Math.PI) / 180;
                  const radiusX = 225;
                  const radiusY = 145;
                  const offsetX = Math.sin(angleRad) * radiusX;
                  const offsetY = -Math.cos(angleRad) * radiusY * 0.65;

                  return (
                    <button
                      key={nodeProd.id}
                      type="button"
                      onClick={() => handleSelectNode(idx)}
                      style={{
                        transform: `translate(calc(-50% + ${Math.round(offsetX)}px), calc(-50% + ${Math.round(offsetY)}px))`,
                      }}
                      className={`pointer-events-auto absolute left-1/2 top-1/2 flex items-center gap-2 p-1.5 pr-3 rounded-full border backdrop-blur-md transition-all duration-300 cursor-pointer ${
                        isCurrent
                          ? "bg-[#25241F] text-white border-[#B49A75] scale-105 shadow-lg z-20"
                          : "bg-white/92 text-[#25241F] border-[#E5E0D7] hover:border-[#B49A75] hover:scale-105 shadow-sm z-10"
                      }`}
                      aria-label={`Orbit to ${nodeProd.name}`}
                    >
                      <img
                        src={nodeProd.images.hero}
                        alt={nodeProd.name}
                        loading="lazy"
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-black/10"
                      />
                      <div className="text-left max-w-[105px]">
                        <span
                          className={`text-[8px] font-mono uppercase block leading-none ${
                            isCurrent ? "text-[#DFD3C0]" : "text-[#8C7352]"
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <span className="font-serif text-[11px] font-medium block truncate">
                          {nodeProd.name.replace("VESTRA ", "")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Orbital Selector Strip & Rotation Controls */}
            <div className="relative z-20 flex items-center justify-between gap-3 pt-3 border-t border-[#E5E0D7]">
              <button
                type="button"
                onClick={() => handleSelectNode(activeNodeIndex - 1)}
                aria-label="Previous garment in orbit"
                className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] flex items-center justify-center transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Mobile / Compact Node Strip */}
              <div className="flex items-center gap-2 overflow-x-auto vestra-carousel py-1">
                {capsuleProducts.map((p, idx) => {
                  const isCurrent = idx === activeNodeIndex;
                  return (
                    <button
                      key={`strip-${p.id}`}
                      type="button"
                      onClick={() => handleSelectNode(idx)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium border whitespace-nowrap transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-[#25241F] text-white border-[#25241F]"
                          : "bg-white/90 text-[#77736C] border-[#E5E0D7] hover:text-[#25241F]"
                      }`}
                    >
                      0{idx + 1} • {p.name}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handleSelectNode(activeNodeIndex + 1)}
                aria-label="Next garment in orbit"
                className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] flex items-center justify-center transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right 5 Columns: Active Orbited Garment Inspection & Acquisition Dossier */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-[#E5E0D7] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7352]">
                  {activeProduct.collectionName} • ORBIT 0{activeNodeIndex + 1}
                </span>
                <span className="text-[10px] font-mono text-[#77736C]">
                  {activeProduct.fabric.weightGsm} GSM • {activeProduct.fabric.weave}
                </span>
              </div>

              <div>
                <NextLink
                  href={`/product/${activeProduct.slug || activeProduct.id}`}
                  onClick={() => recordProductView(activeProduct.id)}
                  className="group inline-flex items-baseline gap-2"
                >
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#25241F] font-medium group-hover:text-[#8C7352] transition-colors">
                    {activeProduct.name}
                  </h3>
                  <ArrowUpRight size={16} className="text-[#B49A75] shrink-0" />
                </NextLink>
                <p className="text-xs text-[#77736C] italic mt-1">{activeProduct.subtitle}</p>
                <p className="font-serif text-xl font-bold text-[#25241F] mt-3 tabular-nums">
                  {formatPrice(activeProduct.price)}
                </p>
              </div>

              <p className="text-xs text-[#77736C] leading-relaxed border-l-2 border-[#B49A75] pl-3.5">
                {activeProduct.description}
              </p>

              {/* Colorway Selection */}
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#77736C] block mb-2">
                  Tone Variant: <strong className="text-[#25241F]">{currentColor?.name}</strong>
                </span>
                <div className="flex items-center gap-2.5">
                  {activeProduct.colorways.map((col) => {
                    const isSelected = currentColor?.id === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => {
                          setSelectedColor(col);
                          sounds.playClick();
                        }}
                        aria-label={`Select colorway ${col.name}`}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#8C7352] ring-2 ring-[#B49A75]/40 scale-110"
                            : "border-black/15 opacity-75 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Tailored Size Selection */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#77736C] block mb-2">
                  Tailored Size: <strong className="text-[#25241F]">{currentSize}</strong>
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {activeProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setSelectedSize(sz);
                        sounds.playClick();
                      }}
                      className={`py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        currentSize === sz
                          ? "bg-[#25241F] text-white border-[#25241F]"
                          : "bg-[#F8F6F1] text-[#25241F] border-[#E5E0D7] hover:border-[#B49A75]"
                      }`}
                    >
                      {sz.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Provenance Mini-Grid */}
              <div className="p-3.5 rounded-2xl bg-[#F8F6F1] border border-[#E5E0D7] grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#77736C] block">
                    Composition
                  </span>
                  <span className="text-[#25241F] font-medium truncate block">
                    {activeProduct.fabric.composition}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#77736C] block">
                    Mill Origin
                  </span>
                  <span className="text-[#25241F] font-medium truncate block">
                    {activeProduct.fabric.origin}
                  </span>
                </div>
              </div>
            </div>

            {/* Acquisition & Wardrobe Actions */}
            <div className="space-y-2.5 pt-4 border-t border-[#E5E0D7]">
              <button
                type="button"
                onClick={() => {
                  addItem(activeProduct, currentColor, currentSize, 1, false);
                  setAddedToBag(true);
                  setTimeout(() => setAddedToBag(false), 1800);
                }}
                className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                  addedToBag
                    ? "bg-[#607B60] text-white"
                    : "bg-[#25241F] hover:bg-[#38362F] text-white"
                }`}
              >
                {addedToBag ? (
                  <>
                    <Check size={15} />
                    <span>Added to Shopping Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} className="text-[#B49A75]" />
                    <span className="tabular-nums">
                      Acquire Piece • {formatPrice(activeProduct.price)}
                    </span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addWardrobeItem(activeProduct, currentColor, currentSize);
                    setHungInWardrobe(true);
                    setTimeout(() => setHungInWardrobe(false), 2200);
                  }}
                  className="py-2.5 px-3 rounded-full bg-[#F8F6F1] hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {hungInWardrobe ? (
                    <>
                      <Check size={13} className="text-[#607B60]" />
                      <span className="text-[#607B60] font-semibold">In Wardrobe</span>
                    </>
                  ) : (
                    <>
                      <Sliders size={13} className="text-[#8C7352]" />
                      <span>Save to Wardrobe</span>
                    </>
                  )}
                </button>

                {onInspectProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      recordProductView(activeProduct.id);
                      onInspectProduct(activeProduct);
                      sounds.playGarmentInspect();
                    }}
                    className="py-2.5 px-3 rounded-full bg-[#F8F6F1] hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye size={13} className="text-[#8C7352]" />
                    <span>Full 3D Studio</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

