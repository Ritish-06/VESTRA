"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/types/product";
import { OutfitLook } from "@/types/wardrobe";
import { sounds } from "@/utils/soundEffects";
import {
  User,
  Sliders,
  BookmarkCheck,
  Heart,
  Eye,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Edit3,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const {
    wardrobeItems,
    removeWardrobeItem,
    savedOutfits,
    deleteOutfitLook,
    loadOutfitLook,
    styleProfile,
  } = useWardrobeStore();

  const { addItem } = useCartStore();
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"wardrobe" | "outfits" | "preferences">("wardrobe");

  return (
    <div className="min-h-screen bg-[#070709] text-[#f5f4f0] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
        {/* Profile Card Header */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#111116] to-[#0a0a0d] border border-white/[0.08] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-2 border-[#c5a880] p-1 bg-[#181820] flex items-center justify-center text-[#c5a880] text-2xl font-serif">
              {styleProfile.name[0]}
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl text-white font-medium">
                  {styleProfile.name}
                </h1>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/30">
                  {styleProfile.loyaltyTier}
                </span>
              </div>
              <p className="text-xs text-[#9ca3af] mt-1">
                Aesthetic DNA: <span className="text-white">{styleProfile.aesthetic}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-[#6b7280] mt-2">
                <span>Height: {styleProfile.heightCm} cm</span>
                <span>•</span>
                <span>Tailored Size: {styleProfile.typicalSize}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NextLink
              href="/wardrobe"
              className="px-4 py-2 rounded-full bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold hover:bg-[#e6d5b8] transition-colors flex items-center gap-1.5"
            >
              <Sliders size={13} />
              <span>Launch 3D Wardrobe</span>
            </NextLink>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-white/[0.08] pb-4">
          <button
            onClick={() => {
              setActiveTab("wardrobe");
              sounds.playClick();
            }}
            className={`pb-2 text-sm font-medium transition-colors border-b-2 -mb-[18px] flex items-center gap-2 ${
              activeTab === "wardrobe"
                ? "text-[#c5a880] border-[#c5a880]"
                : "text-[#9ca3af] border-transparent hover:text-white"
            }`}
          >
            <Sliders size={15} />
            <span>My Virtual Wardrobe Rail ({wardrobeItems.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("outfits");
              sounds.playClick();
            }}
            className={`pb-2 text-sm font-medium transition-colors border-b-2 -mb-[18px] flex items-center gap-2 ${
              activeTab === "outfits"
                ? "text-[#c5a880] border-[#c5a880]"
                : "text-[#9ca3af] border-transparent hover:text-white"
            }`}
          >
            <BookmarkCheck size={15} />
            <span>Saved Custom Ensembles ({savedOutfits.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("preferences");
              sounds.playClick();
            }}
            className={`pb-2 text-sm font-medium transition-colors border-b-2 -mb-[18px] flex items-center gap-2 ${
              activeTab === "preferences"
                ? "text-[#c5a880] border-[#c5a880]"
                : "text-[#9ca3af] border-transparent hover:text-white"
            }`}
          >
            <Sparkles size={15} />
            <span>Style DNA & Measurements</span>
          </button>
        </div>

        {/* Tab 1: Virtual Wardrobe Rail Collection */}
        {activeTab === "wardrobe" && (
          <div>
            {wardrobeItems.length === 0 ? (
              <div className="text-center py-20 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                <p className="font-serif text-lg text-white">Your rail is empty</p>
                <p className="text-xs text-[#9ca3af]">
                  Inspect pieces in our 3D showroom and select &ldquo;Hang in Wardrobe&rdquo;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wardrobeItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-[#0e0e12] border border-white/[0.06] hover:border-white/15 transition-all flex flex-col justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-24 rounded-xl bg-[#18181e] overflow-hidden flex-shrink-0 relative">
                        <img
                          src={item.product.images.hero}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase tracking-wider text-[#c5a880] font-mono">
                          Hanger #{item.hangerPosition + 1}
                        </span>
                        <h3 className="font-serif text-base text-white font-medium truncate mt-0.5">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-[#9ca3af] mt-0.5">
                          Size: {item.selectedSize} • {item.selectedColor.name}
                        </p>
                        <span className="text-xs font-serif text-[#c5a880] font-bold block mt-1">
                          ${item.product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/[0.04] flex items-center justify-between">
                      <button
                        onClick={() => {
                          setInspectingProduct(item.product);
                          sounds.playGarmentInspect();
                        }}
                        className="text-xs text-[#c5a880] hover:underline flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>Inspect in 3D</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            addItem(item.product, item.selectedColor, item.selectedSize, 1);
                          }}
                          className="px-3 py-1 rounded-full bg-white/[0.08] hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white text-xs transition-colors"
                        >
                          Acquire
                        </button>
                        <button
                          onClick={() => removeWardrobeItem(item.id)}
                          className="text-[#9ca3af] hover:text-red-400 p-1"
                          title="Remove from wardrobe rail"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Outfits */}
        {activeTab === "outfits" && (
          <div className="space-y-6">
            {savedOutfits.length === 0 ? (
              <div className="text-center py-20 rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                <p className="font-serif text-lg text-white">No custom ensembles saved yet</p>
                <p className="text-xs text-[#9ca3af]">
                  Visit the Virtual Try-On Studio to mix and match garments and save your favorite combinations.
                </p>
                <NextLink
                  href="/studio"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold hover:bg-[#e6d5b8] transition-colors"
                >
                  <span>Go to Virtual Studio</span>
                  <ArrowRight size={14} />
                </NextLink>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedOutfits.map((outfit) => (
                  <div
                    key={outfit.id}
                    className="p-6 rounded-2xl bg-[#0e0e12] border border-white/[0.06] space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#c5a880] font-mono">
                          {outfit.occasion}
                        </span>
                        <h3 className="font-serif text-lg text-white font-medium mt-0.5">
                          {outfit.name}
                        </h3>
                        <p className="text-xs text-[#9ca3af] mt-1">{outfit.description}</p>
                      </div>
                      <span className="font-serif text-base font-bold text-[#c5a880]">
                        ${outfit.totalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/[0.04]">
                      <button
                        onClick={() => {
                          loadOutfitLook(outfit);
                          router.push("/studio");
                        }}
                        className="px-4 py-1.5 rounded-full bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#e6d5b8] transition-colors"
                      >
                        <Sliders size={12} />
                        <span>Load on 3D Avatar</span>
                      </button>

                      <button
                        onClick={() => deleteOutfitLook(outfit.id)}
                        className="text-xs text-[#9ca3af] hover:text-red-400 p-1 flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Style DNA & Measurements */}
        {activeTab === "preferences" && (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#0e0e12] border border-white/[0.08] shadow-xl space-y-6">
            <h3 className="font-serif text-xl text-white font-medium">
              Atelier Style DNA & Calibration
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-[#9ca3af]">Aesthetic Silhouette Preference</span>
                <span className="text-white font-medium">{styleProfile.aesthetic}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-[#9ca3af]">Height Specification</span>
                <span className="text-white font-mono">{styleProfile.heightCm} cm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-[#9ca3af]">Typical Tailored Size</span>
                <span className="text-white font-mono">{styleProfile.typicalSize}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.04]">
                <span className="text-[#9ca3af]">Private Membership Tier</span>
                <span className="text-[#c5a880] font-mono font-bold">{styleProfile.loyaltyTier}</span>
              </div>
              <div className="py-2">
                <span className="text-[#9ca3af] block mb-2">Signature Palette:</span>
                <div className="flex items-center gap-2">
                  {styleProfile.favoritePalette.map((col, idx) => (
                    <span
                      key={idx}
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: col }}
                    />
                  ))}
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
        />
      )}

      <Footer />
    </div>
  );
}
