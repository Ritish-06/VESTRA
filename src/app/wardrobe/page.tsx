"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";

const WardrobeCanvas = dynamic(() => import("@/components/3d/WardrobeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-[#c5a880] gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-[#c5a880]/30 border-t-[#c5a880] animate-spin" />
      <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#9ca3af]">
        Calibrating 3D Wardrobe...
      </span>
    </div>
  ),
});
import { PRODUCTS } from "@/data/products";
import { Product, ProductCategory, Colorway } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import {
  Sliders,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  Heart,
  Layers,
  ArrowRight,
  Maximize2,
  List,
} from "lucide-react";

export default function WardrobePage() {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist, addWardrobeItem } = useWardrobeStore();
  const { products } = useCatalog();

  const [mode, setMode] = useState<"rail" | "boutique">("rail");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products.length ? products : PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || PRODUCTS[0]);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [railOffset, setRailOffset] = useState(() => -((0 - (PRODUCTS.length - 1) / 2) * 0.58));
  const [itemColors, setItemColors] = useState<Record<string, Colorway>>({});
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragStartOffset, setDragStartOffset] = useState<number>(0);

  const getOffsetForIndex = (idx: number, total: number) => {
    if (total <= 1) return 0;
    return -((idx - (total - 1) / 2) * 0.58);
  };

  useEffect(() => {
    const nextList =
      selectedCategory === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === selectedCategory);
    setFilteredProducts(nextList);
    const first = nextList[0] || null;
    setSelectedProduct(first);
    setRailOffset(getOffsetForIndex(0, nextList.length));
  }, [selectedCategory]);

  const currentIndex = selectedProduct
    ? Math.max(0, filteredProducts.findIndex((p) => p.id === selectedProduct.id))
    : 0;

  const selectByIndex = (idx: number) => {
    if (filteredProducts.length === 0) return;
    const clamped = Math.max(0, Math.min(filteredProducts.length - 1, idx));
    const prod = filteredProducts[clamped];
    setSelectedProduct(prod);
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

  // Mouse drag & wheel handlers for smooth rail gliding
  const handlePointerDown = (e: React.PointerEvent) => {
    if (mode !== "rail") return;
    setDragStartX(e.clientX);
    setDragStartOffset(railOffset);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (mode !== "rail" || dragStartX === null) return;
    const deltaPx = e.clientX - dragStartX;
    if (Math.abs(deltaPx) > 5) {
      const nextOffset = dragStartOffset + deltaPx * 0.0045;
      setRailOffset(nextOffset);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (mode !== "rail" || dragStartX === null) return;
    const deltaPx = e.clientX - dragStartX;
    setDragStartX(null);
    if (Math.abs(deltaPx) > 15 && filteredProducts.length > 0) {
      // Snap to nearest hanger index based on current railOffset
      const total = filteredProducts.length;
      const rawIdx = (total - 1) / 2 - railOffset / 0.58;
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

  const categories: { id: ProductCategory | "all"; label: string }[] = [
    { id: "all", label: "Complete Atelier" },
    { id: "outerwear", label: "Outerwear" },
    { id: "tailoring", label: "Tailoring" },
    { id: "tops", label: "Tops & Knitwear" },
    { id: "trousers", label: "Trousers" },
    { id: "dresses", label: "Evening Couture" },
  ];

  return (
    <div className="h-screen w-screen bg-[#070709] text-[#f5f4f0] flex flex-col overflow-hidden select-none relative">
      <Navbar />
      <CartDrawer />

      {/* Main 3D Interactive Wardrobe Stage */}
      <main
        className="relative flex-1 w-full h-full overflow-hidden pt-16 sm:pt-20 touch-pan-y cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        {/* Background ambient lighting glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#c5a880]/5 rounded-full blur-[140px] pointer-events-none" />

        {/* 3D Scene Viewport */}
        <div className="w-full h-full">
          <WardrobeCanvas
            products={filteredProducts}
            selectedProduct={selectedProduct}
            onSelectProduct={(p) => {
              const idx = filteredProducts.findIndex((item) => item.id === p.id);
              if (selectedProduct?.id === p.id) {
                // Clicking an already focused garment opens full 360° 3D inspection
                setInspectingProduct(p);
                sounds.playGarmentInspect();
              } else if (idx !== -1) {
                selectByIndex(idx);
                sounds.playGarmentInspect();
              } else {
                setSelectedProduct(p);
                sounds.playGarmentInspect();
              }
            }}
            mode={mode}
            railOffset={railOffset}
            itemColors={itemColors}
          />
        </div>

        {/* --- Top Controls Dock --- */}
        <div className="absolute top-20 sm:top-24 left-0 right-0 z-20 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Mode Switcher Pill */}
            <div className="pointer-events-auto flex items-center p-1 rounded-full bg-[#121216]/80 backdrop-blur-md border border-white/10 shadow-xl">
              <button
                onClick={() => {
                  setMode("rail");
                  sounds.playClick();
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all flex items-center gap-1.5 ${
                  mode === "rail"
                    ? "bg-[#c5a880] text-[#0b0b0c] font-semibold shadow-md"
                    : "text-[#9ca3af] hover:text-white"
                }`}
              >
                <Sliders size={13} />
                <span>The Clothing Rail</span>
              </button>

              <button
                onClick={() => {
                  setMode("boutique");
                  sounds.playClick();
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all flex items-center gap-1.5 ${
                  mode === "boutique"
                    ? "bg-[#c5a880] text-[#0b0b0c] font-semibold shadow-md"
                    : "text-[#9ca3af] hover:text-white"
                }`}
              >
                <Layers size={13} />
                <span>Walk-in Boutique</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="pointer-events-auto hidden md:flex items-center gap-1 p-1 rounded-full bg-[#121216]/60 backdrop-blur-md border border-white/10">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-white/10 text-[#c5a880] border border-[#c5a880]/30"
                      : "text-[#9ca3af] hover:text-white"
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
              className={`pointer-events-auto w-11 h-11 rounded-full bg-[#121216]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all ${
                currentIndex <= 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-[#c5a880] hover:text-[#0b0b0c] hover:scale-105 shadow-xl"
              }`}
              aria-label="Previous garment"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex >= filteredProducts.length - 1}
              className={`pointer-events-auto w-11 h-11 rounded-full bg-[#121216]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all ${
                currentIndex >= filteredProducts.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-[#c5a880] hover:text-[#0b0b0c] hover:scale-105 shadow-xl"
              }`}
              aria-label="Next garment"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* --- Bottom Spotlight Product HUD Bar --- */}
        {selectedProduct && (
          <div className="absolute bottom-6 left-0 right-0 z-20 pointer-events-none">
            <div className="max-w-4xl mx-auto px-4 pointer-events-auto">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#101014]/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Product Title & Fabric Info */}
                <div className="flex items-center gap-4 text-left w-full sm:w-auto">
                  <div
                    className="w-12 h-14 rounded-lg overflow-hidden bg-[#1a1a20] shrink-0 border border-white/10 hidden sm:block relative"
                    style={{
                      width: "48px",
                      height: "56px",
                      minWidth: "48px",
                      minHeight: "56px",
                      maxWidth: "48px",
                      maxHeight: "56px",
                    }}
                  >
                    {/* Thumbnail preview */}
                    <img
                      src={selectedProduct.images.hero}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] font-mono">
                        {selectedProduct.collectionName}
                      </span>
                      <span className="text-[10px] text-[#6b7280]">•</span>
                      <span className="text-[10px] text-[#9ca3af] font-mono">
                        Item {currentIndex + 1} of {filteredProducts.length}
                      </span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg text-white font-medium">
                      {selectedProduct.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-serif text-[#c5a880] font-bold">
                        {formatPrice(selectedProduct.price)}
                      </span>
                      <span className="text-[11px] text-[#9ca3af] hidden sm:inline">
                        — {selectedProduct.fabric.composition.split(",")[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Color dots & Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                  {/* Color dots switcher */}
                  <div className="flex items-center gap-1.5 mr-2">
                    {selectedProduct.colorways.map((col) => {
                      const active =
                        (itemColors[selectedProduct.id]?.id || selectedProduct.colorways[0].id) ===
                        col.id;
                      return (
                        <button
                          key={col.id}
                          onClick={() => handleColorChange(selectedProduct, col)}
                          className={`w-5 h-5 rounded-full border transition-all ${
                            active
                              ? "border-[#c5a880] scale-110 shadow-sm"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: col.hex }}
                          title={col.name}
                        />
                      );
                    })}
                  </div>

                  {/* 3D Product Inspector Button */}
                  <button
                    onClick={() => {
                      setInspectingProduct(selectedProduct);
                      sounds.playGarmentInspect();
                    }}
                    className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/10 text-xs font-medium tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <Eye size={13} className="text-[#c5a880]" />
                    <span>Inspect 3D</span>
                  </button>

                  {/* Direct Add to Bag Button */}
                  <button
                    onClick={() => {
                      const col = itemColors[selectedProduct.id] || selectedProduct.colorways[0];
                      addItem(selectedProduct, col, selectedProduct.sizes[0], 1);
                    }}
                    className="px-4 py-2 rounded-full bg-[#c5a880] hover:bg-[#e6d5b8] text-[#0b0b0c] text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <ShoppingBag size={13} />
                    <span>Acquire</span>
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

