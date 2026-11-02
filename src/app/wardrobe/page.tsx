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
import { sounds } from "@/utils/soundEffects";
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
} from "lucide-react";

export default function WardrobePage() {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist, addWardrobeItem } = useWardrobeStore();

  const [mode, setMode] = useState<"rail" | "boutique">("rail");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(PRODUCTS[0]);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [railOffset, setRailOffset] = useState(0);
  const [itemColors, setItemColors] = useState<Record<string, Colorway>>({});

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(PRODUCTS);
    } else {
      setFilteredProducts(PRODUCTS.filter((p) => p.category === selectedCategory));
    }
    setRailOffset(0);
  }, [selectedCategory]);

  const currentIndex = selectedProduct
    ? filteredProducts.findIndex((p) => p.id === selectedProduct.id)
    : 0;

  const handlePrev = () => {
    sounds.playHangerSlide();
    const newIdx = Math.max(0, currentIndex - 1);
    const prod = filteredProducts[newIdx];
    setSelectedProduct(prod);
    setRailOffset((prev) => prev + 0.58);
  };

  const handleNext = () => {
    sounds.playHangerSlide();
    const newIdx = Math.min(filteredProducts.length - 1, currentIndex + 1);
    const prod = filteredProducts[newIdx];
    setSelectedProduct(prod);
    setRailOffset((prev) => prev - 0.58);
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
    <div className="min-h-screen bg-[#070709] text-[#f5f4f0] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      {/* Main 3D Interactive Wardrobe Stage */}
      <main className="relative flex-1 w-full h-[88vh] min-h-[640px] pt-16 sm:pt-20">
        {/* Background ambient lighting glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#c5a880]/5 rounded-full blur-[140px] pointer-events-none" />

        {/* 3D Scene Viewport */}
        <div className="w-full h-full">
          <WardrobeCanvas
            products={filteredProducts}
            selectedProduct={selectedProduct}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              sounds.playGarmentInspect();
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
                  <div className="w-12 h-14 rounded-lg overflow-hidden bg-[#1a1a20] flex-shrink-0 border border-white/10 hidden xs:block">
                    {/* Thumbnail preview */}
                    <img
                      src={selectedProduct.images.hero}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
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
                        ${selectedProduct.price.toLocaleString()}
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

      <Footer />
    </div>
  );
}

