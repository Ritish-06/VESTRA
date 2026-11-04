"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";

const WardrobeCanvas = dynamic(() => import("@/components/3d/WardrobeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-[#8C7352] gap-3">
      <div className="w-9 h-9 rounded-full border-2 border-[#B49A75]/30 border-t-[#B49A75] animate-spin" />
      <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#77736C]">
        Preparing 3D Showroom...
      </span>
    </div>
  ),
});

import { PRODUCTS, COLLECTIONS } from "@/data/products";
import { Product, ProductCategory, Colorway } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import {
  Sliders,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  Heart,
  Layers,
  ArrowUpRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Sparkles,
  Grid,
} from "lucide-react";

export default function WardrobePage() {
  const { addItem } = useCartStore();
  const {
    toggleWishlist,
    isInWishlist,
    recordProductView,
    wardrobeItems,
    addWardrobeItem,
    removeWardrobeItem,
  } = useWardrobeStore();
  const { products, collections } = useCatalog();

  const catalogList = products.length ? products : PRODUCTS;
  const collectionList = collections.length ? collections : COLLECTIONS;

  const [mode, setMode] = useState<"rail" | "boutique" | "studio">("rail");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all" | "saved">("all");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(catalogList);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(catalogList[0]);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [railOffset, setRailOffset] = useState(() => -((0 - (catalogList.length - 1) / 2) * 0.58));
  const [itemColors, setItemColors] = useState<Record<string, Colorway>>({});
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragStartOffset, setDragStartOffset] = useState<number>(0);
  const [zoomOffset, setZoomOffset] = useState<number>(0);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [addedRailConfirm, setAddedRailConfirm] = useState<boolean>(false);

  const getOffsetForIndex = (idx: number, total: number) => {
    if (total <= 1) return 0;
    return -((idx - (total - 1) / 2) * 0.58);
  };

  useEffect(() => {
    let nextList = catalogList;
    if (selectedCategory === "saved") {
      const savedProductIds = new Set(wardrobeItems.map((item) => item.productId));
      nextList = nextList.filter((p) => savedProductIds.has(p.id));
    } else if (selectedCategory !== "all") {
      nextList = nextList.filter((p) => p.category === selectedCategory);
    }
    if (selectedCollection !== "all") {
      nextList = nextList.filter((p) => p.collectionId === selectedCollection);
    }
    setFilteredProducts(nextList);
    const first = nextList[0] || null;
    setSelectedProduct(first);
    if (first) {
      setSelectedSize(first.sizes[1] || first.sizes[0] || "M");
    }
    setRailOffset(getOffsetForIndex(0, nextList.length));
  }, [selectedCategory, selectedCollection, catalogList, wardrobeItems]);

  const currentIndex = selectedProduct
    ? Math.max(0, filteredProducts.findIndex((p) => p.id === selectedProduct.id))
    : 0;

  const selectByIndex = (idx: number) => {
    if (filteredProducts.length === 0) return;
    const clamped = Math.max(0, Math.min(filteredProducts.length - 1, idx));
    const prod = filteredProducts[clamped];
    setSelectedProduct(prod);
    recordProductView(prod.id);
    setRailOffset(getOffsetForIndex(clamped, filteredProducts.length));
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;
    sounds.playHangerSlide();
    selectByIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex >= filteredProducts.length - 1) return;
    sounds.playHangerSlide();
    selectByIndex(currentIndex + 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inspectingProduct) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, filteredProducts, inspectingProduct]);

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Mouse drag handlers for sliding the rail horizontally
  const handlePointerDown = (e: React.PointerEvent) => {
    if (mode !== "rail" || inspectingProduct) return;
    setDragStartX(e.clientX);
    setDragStartOffset(railOffset);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX === null || mode !== "rail" || inspectingProduct) return;
    const deltaX = (e.clientX - dragStartX) * 0.0045;
    const maxBound = Math.max(0.5, ((filteredProducts.length - 1) * 0.58) / 2 + 0.3);
    const nextOffset = Math.max(-maxBound, Math.min(maxBound, dragStartOffset + deltaX));
    setRailOffset(nextOffset);
  };

  const handlePointerUp = () => {
    if (dragStartX === null) return;
    setDragStartX(null);
    if (filteredProducts.length > 0) {
      const rawIdx = (filteredProducts.length - 1) / 2 - railOffset / 0.58;
      const nearestIdx = Math.round(rawIdx);
      sounds.playHangerSlide();
      selectByIndex(nearestIdx);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (mode !== "rail" || inspectingProduct) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 25) {
      if (delta > 0) handleNext();
      else handlePrev();
    }
  };

  const handleColorChange = (product: Product, color: Colorway) => {
    setItemColors((prev) => ({ ...prev, [product.id]: color }));
    sounds.playClick();
  };

  const categories: { id: ProductCategory | "all" | "saved"; label: string }[] = [
    { id: "all", label: "All Pieces" },
    { id: "saved", label: `Saved Wardrobe (${wardrobeItems.length})` },
    { id: "outerwear", label: "Outerwear" },
    { id: "tailoring", label: "Tailoring" },
    { id: "tops", label: "Tops & Knitwear" },
    { id: "trousers", label: "Trousers" },
    { id: "dresses", label: "Evening Couture" },
    { id: "accessories", label: "Accessories" },
  ];

  const isSelectedWishlisted = selectedProduct ? isInWishlist(selectedProduct.id) : false;
  const savedWardrobeEntry = selectedProduct
    ? wardrobeItems.find((w) => w.productId === selectedProduct.id)
    : undefined;
  const isSelectedInWardrobe = Boolean(savedWardrobeEntry);

  return (
    <div className="h-dvh w-full bg-[#F8F6F1] text-[#25241F] flex flex-col overflow-hidden select-none relative">
      <Navbar />
      <CartDrawer />

      {/* Main 3D / Studio Interactive Wardrobe Stage */}
      <main
        className="relative flex-1 w-full h-full overflow-hidden pt-16 sm:pt-20 touch-pan-y cursor-grab active:cursor-grabbing bright-showroom"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        {/* Subtle Warm Studio Daylight Diffusion */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[420px] bg-white/70 rounded-full blur-[120px] pointer-events-none" />

        {/* 3D Scene Viewport or Studio Rack Mode */}
        {mode === "studio" ? (
          <div className="w-full h-full flex flex-col justify-center px-4 sm:px-8 lg:px-12 pb-24 pt-14 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full">
              {/* Architectural Brushed Champagne Rail Line */}
              <div className="relative mb-6 hidden sm:flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#B49A75] border-2 border-white shadow-xs" />
                <div className="flex-1 h-[3px] bg-gradient-to-r from-[#B49A75]/60 via-[#8C7352] to-[#B49A75]/60 rounded-full" />
                <div className="w-3 h-3 rounded-full bg-[#B49A75] border-2 border-white shadow-xs" />
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-white/80 rounded-3xl border border-[#E5E0D7] p-8 max-w-lg mx-auto">
                  <p className="font-serif text-2xl text-[#25241F] mb-2">
                    Your Personal Wardrobe Rail is Empty
                  </p>
                  <p className="text-xs text-[#77736C] mb-5">
                    Save garments from the Fashion Orbit or Editorial Archive to curate your private rack.
                  </p>
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="px-5 py-2.5 rounded-full bg-[#25241F] text-[#F8F6F1] text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer"
                  >
                    Browse All Archive Pieces
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-5 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory no-scrollbar">
                  {filteredProducts.map((item, idx) => {
                    const isFocused = selectedProduct?.id === item.id;
                    const activeCol = itemColors[item.id] || item.colorways[0];
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          selectByIndex(idx);
                          setSelectedSize(item.sizes[1] || item.sizes[0] || "M");
                          sounds.playHangerSlide();
                        }}
                        className={`snap-center shrink-0 w-[250px] sm:w-[290px] rounded-3xl overflow-hidden border transition-all duration-500 cursor-pointer group bg-white ${
                          isFocused
                            ? "border-[#25241F] shadow-[0_24px_48px_-14px_rgba(37,36,31,0.18)] scale-[1.02]"
                            : "border-[#E5E0D7] opacity-75 hover:opacity-100"
                        }`}
                      >
                        <div className="relative aspect-[3/4] bg-[#EEEAE2] overflow-hidden">
                          <img
                            src={item.images.hero}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E5E0D7] text-[9px] font-mono uppercase tracking-[0.18em] text-[#25241F]">
                            0{idx + 1} • {item.category}
                          </div>
                          <div
                            className="absolute top-3 right-3 w-4 h-4 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: activeCol.hex }}
                            title={activeCol.name}
                          />
                        </div>
                        <div className="p-4">
                          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8C7352] block">
                            {item.collectionName}
                          </span>
                          <div className="flex items-baseline justify-between gap-2 mt-1">
                            <h4 className="font-serif text-base text-[#25241F] truncate">
                              {item.name}
                            </h4>
                            <span className="font-serif text-sm font-semibold text-[#25241F] shrink-0">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <WardrobeCanvas
              products={filteredProducts}
              selectedProduct={selectedProduct}
              onSelectProduct={(p) => {
                const idx = filteredProducts.findIndex((item) => item.id === p.id);
                if (selectedProduct?.id === p.id) {
                  setInspectingProduct(p);
                  sounds.playGarmentInspect();
                } else if (idx !== -1) {
                  selectByIndex(idx);
                  setSelectedSize(p.sizes[1] || p.sizes[0] || "M");
                  sounds.playGarmentInspect();
                } else {
                  setSelectedProduct(p);
                  setSelectedSize(p.sizes[1] || p.sizes[0] || "M");
                  sounds.playGarmentInspect();
                }
              }}
              mode={mode}
              railOffset={railOffset}
              itemColors={itemColors}
              zoomOffset={zoomOffset}
              resetTrigger={resetTrigger}
            />
          </div>
        )}

        {/* --- Top Controls Dock --- */}
        <div className="absolute top-20 sm:top-22 left-0 right-0 z-20 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-2.5">
            {/* Mode Switcher Pill & Camera Framing Controls */}
            <div className="pointer-events-auto flex flex-wrap items-center gap-2">
              <div className="flex items-center p-1 rounded-full bg-white/92 backdrop-blur-md border border-[#E5E0D7] shadow-xs">
                <button
                  onClick={() => {
                    setMode("rail");
                    sounds.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    mode === "rail"
                      ? "bg-[#25241F] text-white font-semibold shadow-xs"
                      : "text-[#77736C] hover:text-[#25241F]"
                  }`}
                >
                  <Sliders size={13} />
                  <span>3D Clothing Rail</span>
                </button>

                <button
                  onClick={() => {
                    setMode("boutique");
                    sounds.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    mode === "boutique"
                      ? "bg-[#25241F] text-white font-semibold shadow-xs"
                      : "text-[#77736C] hover:text-[#25241F]"
                  }`}
                >
                  <Layers size={13} />
                  <span>Walk-in Boutique</span>
                </button>

                <button
                  onClick={() => {
                    setMode("studio");
                    sounds.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    mode === "studio"
                      ? "bg-[#25241F] text-white font-semibold shadow-xs"
                      : "text-[#77736C] hover:text-[#25241F]"
                  }`}
                >
                  <Grid size={13} />
                  <span>Studio Rack</span>
                </button>
              </div>

              {/* Collection Selector */}
              <select
                value={selectedCollection}
                onChange={(e) => {
                  setSelectedCollection(e.target.value);
                  sounds.playClick();
                }}
                aria-label="Filter by collection"
                className="px-3.5 py-1.5 rounded-full bg-white/92 backdrop-blur-md border border-[#E5E0D7] text-xs font-medium text-[#25241F] shadow-xs focus:outline-none focus:border-[#B49A75] cursor-pointer"
              >
                <option value="all">All Collections</option>
                {collectionList.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>

              {/* Camera Zoom & Auto-Fit Reset Controls */}
              <div className="flex items-center p-1 rounded-full bg-white/92 backdrop-blur-md border border-[#E5E0D7] shadow-xs">
                <button
                  onClick={() => {
                    setZoomOffset((z) => Math.max(-1.0, +(z - 0.35).toFixed(2)));
                    sounds.playClick();
                  }}
                  className="p-1.5 rounded-full text-[#77736C] hover:text-[#25241F] hover:bg-[#F0EDE6] transition-colors cursor-pointer"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={() => {
                    setZoomOffset((z) => Math.min(1.6, +(z + 0.35).toFixed(2)));
                    sounds.playClick();
                  }}
                  className="p-1.5 rounded-full text-[#77736C] hover:text-[#25241F] hover:bg-[#F0EDE6] transition-colors cursor-pointer"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  onClick={() => {
                    setZoomOffset(0);
                    setResetTrigger((r) => r + 1);
                    if (selectedProduct) {
                      const idx = filteredProducts.findIndex((item) => item.id === selectedProduct.id);
                      if (idx !== -1) selectByIndex(idx);
                    }
                    sounds.playClick();
                  }}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium text-[#8C7352] hover:bg-[#F0EDE6] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Reset Camera Framing"
                >
                  <RotateCcw size={12} />
                  <span className="hidden sm:inline">Fit View</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="pointer-events-auto hidden md:flex items-center gap-1 p-1 rounded-full bg-white/92 backdrop-blur-md border border-[#E5E0D7] shadow-xs overflow-x-auto max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-[#F0EDE6] text-[#25241F] border border-[#B49A75] font-semibold"
                      : "text-[#77736C] hover:text-[#25241F]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- Left / Right Rail Navigation Controls (Rail Mode Only) --- */}
        {mode === "rail" && (
          <div className="absolute top-1/2 -translate-y-1/2 left-4 sm:left-8 right-4 sm:right-8 z-20 pointer-events-none flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className={`pointer-events-auto w-11 h-11 rounded-full bg-white/92 backdrop-blur-md border border-[#E5E0D7] flex items-center justify-center text-[#25241F] transition-all cursor-pointer ${
                currentIndex <= 0
                  ? "opacity-35 cursor-not-allowed"
                  : "hover:bg-[#25241F] hover:text-white hover:border-[#25241F] shadow-md"
              }`}
              aria-label="Previous garment"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex >= filteredProducts.length - 1}
              className={`pointer-events-auto w-11 h-11 rounded-full bg-white/92 backdrop-blur-md border border-[#E5E0D7] flex items-center justify-center text-[#25241F] transition-all cursor-pointer ${
                currentIndex >= filteredProducts.length - 1
                  ? "opacity-35 cursor-not-allowed"
                  : "hover:bg-[#25241F] hover:text-white hover:border-[#25241F] shadow-md"
              }`}
              aria-label="Next garment"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* --- Bottom Spotlight Product HUD Bar (Minimal & Non-Overlapping) --- */}
        {selectedProduct && (
          <div className="absolute bottom-5 left-0 right-0 z-20 pointer-events-none">
            <div className="max-w-4xl mx-auto px-4 pointer-events-auto">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E5E0D7] shadow-[0_14px_38px_-10px_rgba(37,36,31,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Product Title & Fabric Info */}
                <div className="flex items-center gap-3.5 text-left w-full sm:w-auto">
                  <div
                    className="w-12 h-14 rounded-lg overflow-hidden bg-[#F0EDE6] shrink-0 border border-[#E5E0D7] hidden sm:block relative"
                    style={{
                      width: "48px",
                      height: "56px",
                      minWidth: "48px",
                      minHeight: "56px",
                      maxWidth: "48px",
                      maxHeight: "56px",
                    }}
                  >
                    <img
                      src={selectedProduct.images.hero}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7352] font-mono font-semibold">
                        {selectedProduct.collectionName}
                      </span>
                      <span className="text-[10px] text-[#E5E0D7]">•</span>
                      <span className="text-[10px] text-[#77736C] font-mono">
                        Piece {currentIndex + 1} of {filteredProducts.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-base sm:text-lg text-[#25241F] font-medium">
                        {selectedProduct.name}
                      </h3>
                      <NextLink
                        href={`/product/${selectedProduct.slug || selectedProduct.id}`}
                        className="text-[11px] text-[#8C7352] hover:text-[#25241F] inline-flex items-center gap-0.5 font-medium transition-colors"
                        title="Open Full Product Page"
                      >
                        <span className="hidden md:inline">Details</span>
                        <ArrowUpRight size={12} />
                      </NextLink>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-serif text-[#8C7352] font-bold">
                        {formatPrice(selectedProduct.price)}
                      </span>
                      <span className="text-[11px] text-[#77736C] hidden sm:inline">
                        — {selectedProduct.fabric.name} • {selectedProduct.sizes.length} sizes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Color Swatches, Size Pills & Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-end">
                  {/* Color dots switcher */}
                  <div className="flex items-center gap-1.5 mr-1">
                    {selectedProduct.colorways.map((col) => {
                      const active =
                        (itemColors[selectedProduct.id]?.id || selectedProduct.colorways[0].id) ===
                        col.id;
                      return (
                        <button
                          key={col.id}
                          onClick={() => handleColorChange(selectedProduct, col)}
                          className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                            active
                              ? "border-[#B49A75] ring-2 ring-[#B49A75]/35 scale-110"
                              : "border-[#E5E0D7] opacity-75 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                          aria-label={`Select color ${col.name}`}
                        />
                      );
                    })}
                  </div>

                  {/* Compact Size Selector */}
                  <div className="hidden md:flex items-center gap-1 bg-[#F8F6F1] p-0.5 rounded-full border border-[#E5E0D7]">
                    {selectedProduct.sizes.slice(0, 4).map((sz) => {
                      const activeSz = (selectedSize || selectedProduct.sizes[0]) === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => {
                            setSelectedSize(sz);
                            sounds.playClick();
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-colors cursor-pointer ${
                            activeSz
                              ? "bg-[#25241F] text-[#F8F6F1] font-semibold"
                              : "text-[#77736C] hover:text-[#25241F]"
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>

                  {/* Save to Personal Wardrobe Toggle */}
                  <button
                    onClick={() => {
                      if (savedWardrobeEntry) {
                        removeWardrobeItem(savedWardrobeEntry.id);
                      } else {
                        const col = itemColors[selectedProduct.id] || selectedProduct.colorways[0];
                        const sz = selectedSize || selectedProduct.sizes[0];
                        addWardrobeItem(selectedProduct, col, sz);
                      }
                    }}
                    className={`px-3 py-2 rounded-full border text-[11px] font-medium tracking-wider flex items-center gap-1 transition-colors cursor-pointer ${
                      isSelectedInWardrobe
                        ? "bg-[#F0EDE6] border-[#B49A75] text-[#8C7352]"
                        : "bg-[#F8F6F1] border-[#E5E0D7] text-[#5C5850] hover:text-[#25241F]"
                    }`}
                    title={isSelectedInWardrobe ? "Remove from Wardrobe" : "Save to Personal Wardrobe"}
                  >
                    <Sparkles size={12} className="text-[#8C7352]" />
                    <span className="hidden lg:inline">
                      {isSelectedInWardrobe ? "In Wardrobe" : "+ Wardrobe"}
                    </span>
                  </button>

                  {/* Wishlist Toggle */}
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                      isSelectedWishlisted
                        ? "bg-[#F0EDE6] border-[#B49A75] text-[#8C7352]"
                        : "bg-[#F8F6F1] border-[#E5E0D7] text-[#77736C] hover:text-[#25241F]"
                    }`}
                    title={isSelectedWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                    aria-label="Toggle Wishlist"
                  >
                    <Heart size={14} className={isSelectedWishlisted ? "fill-[#B49A75]" : ""} />
                  </button>

                  {/* 3D Product Inspector Button */}
                  <button
                    onClick={() => {
                      setInspectingProduct(selectedProduct);
                      sounds.playGarmentInspect();
                    }}
                    className="px-3.5 py-2 rounded-full bg-[#F0EDE6] hover:bg-[#E5E0D7] text-[#25241F] border border-[#E5E0D7] text-xs font-medium tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye size={13} className="text-[#8C7352]" />
                    <span>Inspect 3D</span>
                  </button>

                  {/* Direct Add to Bag Button */}
                  <button
                    onClick={() => {
                      const col = itemColors[selectedProduct.id] || selectedProduct.colorways[0];
                      const sz = selectedSize || selectedProduct.sizes[0];
                      addItem(selectedProduct, col, sz, 1, false);
                      setAddedRailConfirm(true);
                      setTimeout(() => setAddedRailConfirm(false), 1800);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer ${
                      addedRailConfirm
                        ? "bg-[#607B60] text-white"
                        : "bg-[#25241F] hover:bg-[#38362F] text-white"
                    }`}
                  >
                    {addedRailConfirm ? (
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
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Inspector Modal */}
      {inspectingProduct && (
        <ProductInspectorModal
          product={inspectingProduct}
          onClose={() => setInspectingProduct(null)}
          initialColor={itemColors[inspectingProduct.id] || inspectingProduct.colorways[0]}
        />
      )}
    </div>
  );
}
