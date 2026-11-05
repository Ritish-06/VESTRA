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
import { formatPrice } from "@/lib/commerce";
import { logoutAction } from "@/app/actions/auth";
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
        {/* Profile Card Header */}
        <div className="p-8 sm:p-10 rounded-3xl atelier-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full border-2 border-[#C5A880] p-1 bg-[#FAF8F5] flex items-center justify-center text-[#9A7B4F] text-2xl font-serif">
              {styleProfile.name[0]}
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1917] font-medium">
                  {styleProfile.name}
                </h1>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#C5A880]/15 text-[#9A7B4F] border border-[#C5A880]/30 font-semibold">
                  {styleProfile.loyaltyTier}
                </span>
              </div>
              <p className="text-xs text-[#78716C] mt-1">
                Aesthetic DNA: <span className="text-[#1C1917] font-medium">{styleProfile.aesthetic}</span>
              </p>
              <div className="flex items-center gap-4 text-xs text-[#78716C] mt-2">
                <span>Height: {styleProfile.heightCm} cm</span>
                <span>•</span>
                <span>Tailored Size: {styleProfile.typicalSize}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/auth", { method: "DELETE" });
                router.push("/login");
              }}
              className="px-4 py-2.5 rounded-full text-xs font-medium border border-[#1C1917]/20 hover:border-red-400 text-[#78716C] hover:text-red-600 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
            <NextLink
              href="/wardrobe"
              className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <Sliders size={13} className="text-[#C5A880]" />
              <span>Launch 3D Wardrobe</span>
            </NextLink>
          </div>
        </div>

        {/* Tab Navigation & Sub-Pages */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1C1917]/[0.08] pb-4">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab("wardrobe");
                sounds.playClick();
              }}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 -mb-[18px] flex items-center gap-2 cursor-pointer ${
                activeTab === "wardrobe"
                  ? "text-[#1C1917] border-[#C5A880] font-semibold"
                  : "text-[#78716C] border-transparent hover:text-[#1C1917]"
              }`}
            >
              <Sliders size={15} className={activeTab === "wardrobe" ? "text-[#9A7B4F]" : ""} />
              <span>Virtual Wardrobe Rail ({wardrobeItems.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("outfits");
                sounds.playClick();
              }}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 -mb-[18px] flex items-center gap-2 cursor-pointer ${
                activeTab === "outfits"
                  ? "text-[#1C1917] border-[#C5A880] font-semibold"
                  : "text-[#78716C] border-transparent hover:text-[#1C1917]"
              }`}
            >
              <BookmarkCheck size={15} className={activeTab === "outfits" ? "text-[#9A7B4F]" : ""} />
              <span>Saved Outfits ({savedOutfits.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("preferences");
                sounds.playClick();
              }}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 -mb-[18px] flex items-center gap-2 cursor-pointer ${
                activeTab === "preferences"
                  ? "text-[#1C1917] border-[#C5A880] font-semibold"
                  : "text-[#78716C] border-transparent hover:text-[#1C1917]"
              }`}
            >
              <Sparkles size={15} className={activeTab === "preferences" ? "text-[#9A7B4F]" : ""} />
              <span>Measurements</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <NextLink
              href="/profile/orders"
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#1C1917]/15 hover:border-[#1C1917] text-xs font-medium text-[#1C1917] transition-colors"
            >
              Orders & Dockets
            </NextLink>
            <NextLink
              href="/profile/addresses"
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#1C1917]/15 hover:border-[#1C1917] text-xs font-medium text-[#1C1917] transition-colors"
            >
              Addresses
            </NextLink>
            <NextLink
              href="/profile/settings"
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#1C1917]/15 hover:border-[#1C1917] text-xs font-medium text-[#1C1917] transition-colors"
            >
              Settings
            </NextLink>
          </div>
        </div>

        {/* Tab 1: Virtual Wardrobe Rail Collection */}
        {activeTab === "wardrobe" && (
          <div>
            {wardrobeItems.length === 0 ? (
              <div className="text-center py-20 rounded-3xl atelier-card space-y-3">
                <p className="font-serif text-lg text-[#1C1917]">Your rail is empty</p>
                <p className="text-xs text-[#78716C]">
                  Inspect pieces in our 3D showroom and select &ldquo;Hang in Wardrobe&rdquo;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wardrobeItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl atelier-card flex flex-col justify-between"
                  >
                    <div className="flex gap-4">
                      <div
                        className="w-20 h-24 rounded-xl bg-white overflow-hidden shrink-0 relative border border-[#1C1917]/[0.08]"
                        style={{ width: "80px", height: "96px" }}
                      >
                        <img
                          src={item.product.images.hero}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase tracking-wider text-[#9A7B4F] font-mono">
                          Hanger #{item.hangerPosition + 1}
                        </span>
                        <h3 className="font-serif text-base text-[#1C1917] font-medium truncate mt-0.5">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-[#78716C] mt-0.5">
                          Size: {item.selectedSize} • {item.selectedColor.name}
                        </p>
                        <span className="text-xs font-serif text-[#9A7B4F] font-bold block mt-1">
                          {formatPrice(item.product.price)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#1C1917]/[0.06] flex items-center justify-between">
                      <button
                        onClick={() => {
                          setInspectingProduct(item.product);
                          sounds.playGarmentInspect();
                        }}
                        className="text-xs text-[#9A7B4F] hover:text-[#1C1917] font-medium flex items-center gap-1 transition-colors"
                      >
                        <Eye size={12} />
                        <span>Inspect in 3D</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            addItem(item.product, item.selectedColor, item.selectedSize, 1);
                          }}
                          className="px-3 py-1 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-white text-xs transition-colors"
                        >
                          Acquire
                        </button>
                        <button
                          onClick={() => removeWardrobeItem(item.id)}
                          className="text-[#78716C] hover:text-red-600 p-1 transition-colors"
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
              <div className="text-center py-20 rounded-3xl atelier-card space-y-3">
                <p className="font-serif text-lg text-[#1C1917]">No custom ensembles saved yet</p>
                <p className="text-xs text-[#78716C]">
                  Visit the Virtual Try-On Studio to mix and match garments and save your favorite combinations.
                </p>
                <NextLink
                  href="/studio"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold hover:bg-[#2A2725] transition-colors"
                >
                  <span>Go to Virtual Studio</span>
                  <ArrowRight size={14} className="text-[#C5A880]" />
                </NextLink>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedOutfits.map((outfit) => (
                  <div
                    key={outfit.id}
                    className="p-6 rounded-2xl atelier-card space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#9A7B4F] font-mono">
                          {outfit.occasion}
                        </span>
                        <h3 className="font-serif text-lg text-[#1C1917] font-medium mt-0.5">
                          {outfit.name}
                        </h3>
                        <p className="text-xs text-[#78716C] mt-1">{outfit.description}</p>
                      </div>
                      <span className="font-serif text-base font-bold text-[#9A7B4F]">
                        {formatPrice(outfit.totalPrice)}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-[#1C1917]/[0.06]">
                      <button
                        onClick={() => {
                          loadOutfitLook(outfit);
                          router.push("/studio");
                        }}
                        className="px-4 py-1.5 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Sliders size={12} className="text-[#C5A880]" />
                        <span>Load on 3D Avatar</span>
                      </button>

                      <button
                        onClick={() => deleteOutfitLook(outfit.id)}
                        className="text-xs text-[#78716C] hover:text-red-600 p-1 flex items-center gap-1 transition-colors"
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
          <div className="max-w-2xl mx-auto p-8 rounded-3xl atelier-card space-y-6">
            <h3 className="font-serif text-xl text-[#1C1917] font-medium">
              Atelier Style DNA & Calibration
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-[#1C1917]/[0.06]">
                <span className="text-[#78716C]">Aesthetic Silhouette Preference</span>
                <span className="text-[#1C1917] font-medium">{styleProfile.aesthetic}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1C1917]/[0.06]">
                <span className="text-[#78716C]">Height Specification</span>
                <span className="text-[#1C1917] font-mono">{styleProfile.heightCm} cm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1C1917]/[0.06]">
                <span className="text-[#78716C]">Typical Tailored Size</span>
                <span className="text-[#1C1917] font-mono">{styleProfile.typicalSize}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1C1917]/[0.06]">
                <span className="text-[#78716C]">Private Membership Tier</span>
                <span className="text-[#9A7B4F] font-mono font-bold">{styleProfile.loyaltyTier}</span>
              </div>
              <div className="py-2">
                <span className="text-[#78716C] block mb-2">Signature Palette:</span>
                <div className="flex items-center gap-2">
                  {styleProfile.favoritePalette.map((col, idx) => (
                    <span
                      key={idx}
                      className="w-6 h-6 rounded-full border border-[#1C1917]/10"
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

