"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";

const VirtualMannequinCanvas = dynamic(
  () => import("@/components/3d/VirtualMannequinCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center text-[#8C7352] gap-3">
        <div className="w-9 h-9 rounded-full border-2 border-[#B49A75]/30 border-t-[#B49A75] animate-spin" />
        <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#77736C]">
          Sculpting 3D Avatar Rig...
        </span>
      </div>
    ),
  }
);
import { PRODUCTS } from "@/data/products";
import { STYLIST_PROMPTS } from "@/data/stylistPresets";
import { Product } from "@/types/product";
import { AvatarModelType } from "@/types/wardrobe";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { useCartStore } from "@/store/useCartStore";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import {
  Sparkles,
  ShoppingBag,
  BookmarkCheck,
  RotateCw,
  RotateCcw,
  Trash2,
  Check,
} from "lucide-react";

export default function StudioPage() {
  const {
    activeLook,
    selectedAvatar,
    setSelectedAvatar,
    setLookPiece,
    clearLook,
    loadOutfitLook,
    saveCurrentLookAsOutfit,
  } = useWardrobeStore();

  const { addItem } = useCartStore();
  const { products } = useCatalog();

  const [outfitName, setOutfitName] = useState("");
  const [occasionInput, setOccasionInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [activeCategoryTab, setActiveCategoryTab] = useState<"outerwear" | "top" | "trousers">("outerwear");

  const avatarOptions: { id: AvatarModelType; label: string; desc: string; color: string }[] = [
    { id: "minimalist_marble", label: "Minimalist Marble", desc: "Greek Alabaster Stone", color: "#EFECE6" },
    { id: "editorial_slate", label: "Warm Travertine", desc: "Honed Limestone", color: "#8C867B" },
    { id: "haute_obsidian", label: "Sculpted Bronze", desc: "Deep Charcoal Patina", color: "#38362F" },
  ];

  const sourceProducts = products.length ? products : PRODUCTS;
  const outerwearProducts = sourceProducts.filter(
    (p) => p.category === "outerwear" || p.category === "tailoring"
  );
  const topProducts = sourceProducts.filter(
    (p) => p.category === "tops" || p.category === "dresses"
  );
  const trouserProducts = sourceProducts.filter((p) => p.category === "trousers");

  const currentPieces = [
    activeLook.outerwear,
    activeLook.top,
    activeLook.trousers,
  ].filter(Boolean) as Product[];

  const ensembleTotal = currentPieces.reduce((acc, p) => acc + p.price, 0);

  const handleSaveOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPieces.length === 0) return;
    saveCurrentLookAsOutfit(
      outfitName || `Ensemble ${Date.now().toString().slice(-4)}`,
      occasionInput || "Private Salon"
    );
    setSavedSuccess(true);
    setOutfitName("");
    setOccasionInput("");
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAcquireEntireLook = () => {
    currentPieces.forEach((p) => {
      addItem(p, p.colorways[0], p.sizes[0], 1);
    });
    sounds.playChime();
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      {/* Main Studio Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left Side: Bright 3D Virtual Try-On Mannequin Canvas */}
        <div className="w-full lg:w-7/12 h-[540px] sm:h-[620px] lg:h-auto rounded-3xl bright-showroom border border-[#E5E0D7] relative overflow-hidden flex flex-col shadow-sm">
          {/* Header Overlay */}
          <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7352] px-3 py-1 rounded-full bg-white/90 border border-[#E5E0D7] backdrop-blur-xs font-mono font-semibold flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#B49A75]" />
                Virtual Fitting Room
              </span>
            </div>

            {/* Turntable Auto-Rotate & Reset View */}
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                onClick={() => {
                  setAutoRotate(!autoRotate);
                  sounds.playClick();
                }}
                className={`text-xs px-3 py-1 rounded-full border backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  autoRotate
                    ? "bg-[#25241F] border-[#25241F] text-white"
                    : "bg-white/90 border-[#E5E0D7] text-[#77736C] hover:text-[#25241F]"
                }`}
              >
                <RotateCw size={12} className={autoRotate ? "animate-spin" : ""} />
                <span className="text-[11px]">360° Turn</span>
              </button>

              <button
                onClick={() => {
                  setResetTrigger((prev) => prev + 1);
                  sounds.playClick();
                }}
                className="text-xs px-2.5 py-1 rounded-full border bg-white/90 border-[#E5E0D7] text-[#77736C] hover:text-[#25241F] hover:border-[#B49A75] backdrop-blur-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset Camera View"
              >
                <RotateCcw size={12} />
                <span className="text-[11px]">Reset</span>
              </button>
            </div>
          </div>

          {/* 3D Mannequin Viewport */}
          <div className="flex-1 w-full h-full">
            <VirtualMannequinCanvas
              avatarType={selectedAvatar}
              top={activeLook.top}
              outerwear={activeLook.outerwear}
              trousers={activeLook.trousers}
              autoRotate={autoRotate}
              resetTrigger={resetTrigger}
            />
          </div>

          {/* Bottom Avatar Switcher Dock */}
          <div className="p-4 bg-white/90 backdrop-blur-md border-t border-[#E5E0D7] flex flex-wrap items-center justify-between gap-2 z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#77736C] font-mono hidden sm:inline">
              Mannequin Finish:
            </span>
            <div className="flex items-center gap-2">
              {avatarOptions.map((av) => (
                <button
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`px-3 py-1 rounded-full text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                    selectedAvatar === av.id
                      ? "bg-[#F0EDE6] text-[#25241F] border-[#B49A75] font-semibold shadow-2xs"
                      : "bg-white text-[#77736C] border-[#E5E0D7] hover:border-[#B49A75]/60 hover:text-[#25241F]"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-[#25241F]/20"
                    style={{ backgroundColor: av.color }}
                  />
                  <span>{av.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => clearLook()}
              className="text-xs text-[#77736C] hover:text-[#B45C52] p-1 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset All Layers"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Clear Layers</span>
            </button>
          </div>
        </div>

        {/* Right Side: Outfit Mix-and-Match Controller & Curator */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between space-y-6">
          {/* Layer Selector Tabs */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E0D7] shadow-xs space-y-5">
            <div>
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#8C7352] font-mono font-semibold">
                Layering Matrix
              </span>
              <h2 className="font-serif text-2xl text-[#25241F] font-medium mt-1">
                Curate Your Silhouette
              </h2>
            </div>

            {/* Category Sub-tabs */}
            <div className="flex gap-2 border-b border-[#E5E0D7] pb-3">
              <button
                onClick={() => {
                  setActiveCategoryTab("outerwear");
                  sounds.playClick();
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategoryTab === "outerwear"
                    ? "bg-[#25241F] text-white font-semibold"
                    : "text-[#77736C] hover:text-[#25241F] bg-[#F8F6F1] border border-[#E5E0D7]"
                }`}
              >
                Outerwear ({outerwearProducts.length})
              </button>
              <button
                onClick={() => {
                  setActiveCategoryTab("top");
                  sounds.playClick();
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategoryTab === "top"
                    ? "bg-[#25241F] text-white font-semibold"
                    : "text-[#77736C] hover:text-[#25241F] bg-[#F8F6F1] border border-[#E5E0D7]"
                }`}
              >
                Tops & Silks ({topProducts.length})
              </button>
              <button
                onClick={() => {
                  setActiveCategoryTab("trousers");
                  sounds.playClick();
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategoryTab === "trousers"
                    ? "bg-[#25241F] text-white font-semibold"
                    : "text-[#77736C] hover:text-[#25241F] bg-[#F8F6F1] border border-[#E5E0D7]"
                }`}
              >
                Trousers ({trouserProducts.length})
              </button>
            </div>

            {/* Product selection grid for active tab */}
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {(activeCategoryTab === "outerwear"
                ? outerwearProducts
                : activeCategoryTab === "top"
                ? topProducts
                : trouserProducts
              ).map((p) => {
                const isSelected =
                  activeLook[activeCategoryTab]?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (isSelected) {
                        setLookPiece(activeCategoryTab, undefined);
                      } else {
                        setLookPiece(activeCategoryTab, p);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left flex gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#F0EDE6] border-[#B49A75] shadow-xs"
                        : "bg-[#F8F6F1] border-[#E5E0D7] hover:border-[#B49A75]/60"
                    }`}
                  >
                    <div className="w-12 h-14 rounded-lg bg-[#F0EDE6] overflow-hidden shrink-0 relative border border-[#E5E0D7]">
                      <img
                        src={p.images.hero}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-xs text-[#25241F] font-medium truncate">
                          {p.name}
                        </h4>
                        <p className="text-[10px] text-[#77736C] capitalize truncate">
                          {p.category}
                        </p>
                      </div>
                      <span className="text-xs font-serif text-[#8C7352] font-bold">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick-load Pre-Curated Runway Looks */}
          <div className="p-4 rounded-2xl bg-[#F0EDE6] border border-[#E5E0D7]">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7352] font-mono font-semibold block mb-2">
              Atelier Curated Combinations
            </span>
            <div className="flex flex-wrap gap-2">
              {STYLIST_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => loadOutfitLook(prompt.recommendedLook)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#25241F] hover:text-white border border-[#E5E0D7] text-xs text-[#25241F] transition-colors cursor-pointer"
                >
                  {prompt.recommendedLook.name}
                </button>
              ))}
            </div>
          </div>

          {/* Total Ensemble Summary & Action Buttons */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E0D7] shadow-xs space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#E5E0D7] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#77736C] font-mono">
                  Ensemble Valuation
                </span>
                <p className="text-xs text-[#77736C]">
                  {currentPieces.length} {currentPieces.length === 1 ? "piece" : "pieces"} layered
                </p>
              </div>
              <span className="font-serif text-2xl font-bold text-[#8C7352]">
                {formatPrice(ensembleTotal)}
              </span>
            </div>

            {/* Save Outfit Form */}
            <form onSubmit={handleSaveOutfit} className="flex gap-2">
              <input
                type="text"
                placeholder="Name your custom look (e.g. Venice Biennale)"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                className="flex-1 bg-[#F8F6F1] border border-[#E5E0D7] rounded-xl px-3.5 py-2 text-xs text-[#25241F] placeholder-[#77736C] focus:outline-none focus:border-[#B49A75]"
              />
              <button
                type="submit"
                disabled={currentPieces.length === 0}
                className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
                  currentPieces.length === 0
                    ? "opacity-40 cursor-not-allowed bg-[#F0EDE6] text-[#77736C]"
                    : "bg-[#F0EDE6] hover:bg-[#E5E0D7] border border-[#E5E0D7] text-[#25241F]"
                }`}
              >
                {savedSuccess ? <Check size={14} className="text-[#607B60]" /> : <BookmarkCheck size={14} className="text-[#8C7352]" />}
                <span>{savedSuccess ? "Saved" : "Save Look"}</span>
              </button>
            </form>

            {/* Acquire Ensemble Button */}
            <button
              onClick={handleAcquireEntireLook}
              disabled={currentPieces.length === 0}
              className={`w-full py-3.5 rounded-full font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                currentPieces.length === 0
                  ? "opacity-40 cursor-not-allowed bg-[#F0EDE6] text-[#77736C]"
                  : "bg-[#25241F] hover:bg-[#38362F] text-white"
              }`}
            >
              <ShoppingBag size={15} className="text-[#B49A75]" />
              <span>Add Entire Look to Bag ({currentPieces.length} items)</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
