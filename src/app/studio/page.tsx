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
      <div className="w-full h-full flex flex-col items-center justify-center text-[#c5a880] gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#c5a880]/30 border-t-[#c5a880] animate-spin" />
        <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#9ca3af]">
          Sculpting 3D Avatar Rig...
        </span>
      </div>
    ),
  }
);
import { PRODUCTS } from "@/data/products";
import { STYLIST_PROMPTS } from "@/data/stylistPresets";
import { Product } from "@/types/product";
import { AvatarModelType, OutfitLook } from "@/types/wardrobe";
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
  Trash2,
  Check,
  Layers,
  ArrowRight,
  UserCheck,
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
  const [activeCategoryTab, setActiveCategoryTab] = useState<"outerwear" | "top" | "trousers">("outerwear");

  const avatarOptions: { id: AvatarModelType; label: string; desc: string; color: string }[] = [
    { id: "haute_obsidian", label: "Haute Obsidian", desc: "Mirror Noir Mannequin", color: "#111116" },
    { id: "editorial_slate", label: "Editorial Slate", desc: "Smoked Matte Titanium", color: "#4a4c54" },
    { id: "minimalist_marble", label: "Minimalist Marble", desc: "Greek Alabaster Stone", color: "#e6e2da" },
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
    <div className="min-h-screen bg-[#070709] text-[#f5f4f0] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      {/* Main Studio Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left Side: 3D Virtual Try-On Mannequin Canvas */}
        <div className="w-full lg:w-7/12 h-[540px] sm:h-[620px] lg:h-auto rounded-3xl bg-gradient-to-b from-[#111115] to-[#09090c] border border-white/[0.08] relative overflow-hidden flex flex-col shadow-2xl">
          {/* Header Overlay */}
          <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] px-3 py-1 rounded-full bg-black/40 border border-[#c5a880]/30 backdrop-blur-md font-mono flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#c5a880]" />
                Virtual Fitting Room
              </span>
            </div>

            {/* Turntable Auto-Rotate */}
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                onClick={() => {
                  setAutoRotate(!autoRotate);
                  sounds.playClick();
                }}
                className={`text-xs px-3 py-1 rounded-full border backdrop-blur-md flex items-center gap-1.5 transition-colors ${
                  autoRotate
                    ? "bg-[#c5a880]/20 border-[#c5a880] text-[#c5a880]"
                    : "bg-black/30 border-white/10 text-[#9ca3af] hover:text-white"
                }`}
              >
                <RotateCw size={12} className={autoRotate ? "animate-spin" : ""} />
                <span className="text-[11px]">360° Turntable</span>
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
            />
          </div>

          {/* Bottom Avatar Switcher Dock */}
          <div className="p-4 bg-[#0a0a0d]/90 backdrop-blur-md border-t border-white/[0.06] flex items-center justify-between gap-2 z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#9ca3af] font-mono hidden sm:inline">
              Avatar Silhouette:
            </span>
            <div className="flex items-center gap-2">
              {avatarOptions.map((av) => (
                <button
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`px-3 py-1 rounded-full text-xs flex items-center gap-2 border transition-all ${
                    selectedAvatar === av.id
                      ? "bg-white/10 text-white border-[#c5a880] shadow-sm"
                      : "text-[#9ca3af] border-white/5 hover:border-white/20"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/30"
                    style={{ backgroundColor: av.color }}
                  />
                  <span>{av.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => clearLook()}
              className="text-xs text-[#9ca3af] hover:text-red-400 p-1 transition-colors flex items-center gap-1"
              title="Reset All Layers"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Strip Layers</span>
            </button>
          </div>
        </div>

        {/* Right Side: Outfit Mix-and-Match Controller & Curator */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between space-y-6">
          {/* Layer Selector Tabs */}
          <div className="p-6 rounded-3xl bg-[#0e0e12] border border-white/[0.08] shadow-xl space-y-5">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono">
                Layering Matrix
              </span>
              <h2 className="font-serif text-2xl text-white font-medium mt-1">
                Curate Your Silhouette
              </h2>
            </div>

            {/* Category Sub-tabs */}
            <div className="flex gap-2 border-b border-white/[0.06] pb-3">
              <button
                onClick={() => {
                  setActiveCategoryTab("outerwear");
                  sounds.playClick();
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeCategoryTab === "outerwear"
                    ? "bg-[#c5a880] text-[#0b0b0c] font-bold"
                    : "text-[#9ca3af] hover:text-white bg-white/[0.03]"
                }`}
              >
                Outerwear ({outerwearProducts.length})
              </button>
              <button
                onClick={() => {
                  setActiveCategoryTab("top");
                  sounds.playClick();
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeCategoryTab === "top"
                    ? "bg-[#c5a880] text-[#0b0b0c] font-bold"
                    : "text-[#9ca3af] hover:text-white bg-white/[0.03]"
                }`}
              >
                Tops & Silks ({topProducts.length})
              </button>
              <button
                onClick={() => {
                  setActiveCategoryTab("trousers");
                  sounds.playClick();
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  activeCategoryTab === "trousers"
                    ? "bg-[#c5a880] text-[#0b0b0c] font-bold"
                    : "text-[#9ca3af] hover:text-white bg-white/[0.03]"
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
                    className={`p-2.5 rounded-xl border text-left flex gap-3 transition-all ${
                      isSelected
                        ? "bg-[#c5a880]/15 border-[#c5a880] shadow-[0_0_15px_rgba(197,168,128,0.2)]"
                        : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="w-12 h-14 rounded-lg bg-[#18181e] overflow-hidden flex-shrink-0 relative">
                      <img
                        src={p.images.hero}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-xs text-white truncate">
                          {p.name}
                        </h4>
                        <p className="text-[10px] text-[#9ca3af] truncate">
                          {p.category}
                        </p>
                      </div>
                      <span className="text-xs font-serif text-[#c5a880] font-bold">
                        ${p.price.toLocaleString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick-load Pre-Curated Runway Looks */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9ca3af] font-mono block mb-2">
              Atelier Curated Combinations
            </span>
            <div className="flex flex-wrap gap-2">
              {STYLIST_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => loadOutfitLook(prompt.recommendedLook)}
                  className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#c5a880]/20 hover:border-[#c5a880]/50 border border-white/10 text-xs text-white/90 transition-colors"
                >
                  {prompt.recommendedLook.name}
                </button>
              ))}
            </div>
          </div>

          {/* Total Ensemble Summary & Action Buttons */}
          <div className="p-6 rounded-3xl bg-[#0e0e12] border border-white/[0.08] shadow-xl space-y-4">
            <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#9ca3af] font-mono">
                  Ensemble Valuation
                </span>
                <p className="text-xs text-[#9ca3af]">
                  {currentPieces.length} {currentPieces.length === 1 ? "piece" : "pieces"} layered
                </p>
              </div>
              <span className="font-serif text-2xl font-bold text-[#c5a880]">
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
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#c5a880]"
              />
              <button
                type="submit"
                disabled={currentPieces.length === 0}
                className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wider flex items-center gap-1.5 transition-colors ${
                  currentPieces.length === 0
                    ? "opacity-40 cursor-not-allowed bg-white/5 text-[#9ca3af]"
                    : "bg-white/[0.08] hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white"
                }`}
              >
                {savedSuccess ? <Check size={14} className="text-emerald-400" /> : <BookmarkCheck size={14} />}
                <span>{savedSuccess ? "Saved" : "Save Look"}</span>
              </button>
            </form>

            {/* Acquire Ensemble Button */}
            <button
              onClick={handleAcquireEntireLook}
              disabled={currentPieces.length === 0}
              className={`w-full py-3.5 rounded-full font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-lg ${
                currentPieces.length === 0
                  ? "opacity-40 cursor-not-allowed bg-white/10 text-[#9ca3af]"
                  : "bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0b0b0c] hover:shadow-[0_0_25px_rgba(197,168,128,0.3)]"
              }`}
            >
              <ShoppingBag size={15} />
              <span>Acquire Entire Look ({currentPieces.length} items)</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

