"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  RotateCw,
  ZoomIn,
  Heart,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  Sliders,
  Check,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Product, Colorway } from "@/types/product";

const ProductInspectorCanvas = dynamic(
  () => import("@/components/3d/ProductInspectorCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center text-[#c5a880] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#c5a880]/30 border-t-[#c5a880] animate-spin" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#9ca3af]">
          Loading 3D Fabric Weave...
        </span>
      </div>
    ),
  }
);
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";

interface ProductInspectorModalProps {
  product: Product | null;
  onClose: () => void;
  initialColor?: Colorway;
}

export default function ProductInspectorModal({
  product,
  onClose,
  initialColor,
}: ProductInspectorModalProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { addWardrobeItem, toggleWishlist, isInWishlist, setLookPiece } = useWardrobeStore();

  const [selectedColor, setSelectedColor] = useState<Colorway>(
    initialColor || (product ? product.colorways[0] : ({} as Colorway))
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product ? product.sizes[0] : ""
  );
  const [autoRotate, setAutoRotate] = useState(false);
  const [macroZoom, setMacroZoom] = useState(false);
  const [addedToWardrobe, setAddedToWardrobe] = useState(false);
  const [activeTab, setActiveTab] = useState<"fabric" | "craftsmanship">("fabric");

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, selectedColor, selectedSize, 1);
  };

  const handleAddToWardrobe = () => {
    addWardrobeItem(product, selectedColor, selectedSize);
    setAddedToWardrobe(true);
    setTimeout(() => setAddedToWardrobe(false), 2500);
  };

  const handleTryOnAvatar = () => {
    sounds.playClick();
    if (product.category === "outerwear" || product.category === "tailoring") {
      setLookPiece("outerwear", product);
    } else if (product.category === "tops") {
      setLookPiece("top", product);
    } else if (product.category === "trousers") {
      setLookPiece("trousers", product);
    }
    onClose();
    router.push("/studio");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto lg:overflow-hidden flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#070709]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-6xl h-full max-h-[92vh] bg-[#0f0f12] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#18181c]/80 border border-white/10 flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close product inspector"
        >
          <X size={18} />
        </button>

        {/* Left Side: 3D Turntable Inspection Viewport */}
        <div className="relative w-full lg:w-3/5 h-80 sm:h-96 lg:h-full bg-gradient-to-b from-[#131317] to-[#0a0a0c] flex flex-col">
          {/* Controls Overlay Header */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] px-3 py-1 rounded-full bg-black/40 border border-[#c5a880]/30 backdrop-blur-sm font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] animate-pulse" />
              Real-Time 3D Viewport
            </span>

            {/* Auto-Rotate Switch */}
            <button
              onClick={() => {
                setAutoRotate(!autoRotate);
                sounds.playClick();
              }}
              className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-sm flex items-center gap-1 transition-colors ${
                autoRotate
                  ? "bg-[#c5a880]/20 border-[#c5a880] text-[#c5a880]"
                  : "bg-black/30 border-white/10 text-[#9ca3af] hover:text-white"
              }`}
              title="Toggle Turntable Rotation"
            >
              <RotateCw size={12} className={autoRotate ? "animate-spin" : ""} />
              <span className="text-[10px]">Turn</span>
            </button>

            {/* Macro Fabric Zoom Switch */}
            <button
              onClick={() => {
                setMacroZoom(!macroZoom);
                sounds.playClick();
              }}
              className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-sm flex items-center gap-1 transition-colors ${
                macroZoom
                  ? "bg-[#c5a880]/20 border-[#c5a880] text-[#c5a880]"
                  : "bg-black/30 border-white/10 text-[#9ca3af] hover:text-white"
              }`}
              title="Inspect Fabric Macro Texture"
            >
              <ZoomIn size={12} />
              <span className="text-[10px]">Macro</span>
            </button>
          </div>

          {/* 3D Canvas */}
          <div className="flex-1 w-full h-full">
            <ProductInspectorCanvas
              product={product}
              activeColorway={selectedColor}
              autoRotate={autoRotate}
              macroZoom={macroZoom}
            />
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[#9ca3af] pointer-events-none bg-black/40 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
            Drag to rotate 360° • Pinch / scroll to inspect drape
          </div>
        </div>

        {/* Right Side: Product Dossier & Atelier Actions */}
        <div className="w-full lg:w-2/5 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/[0.08] bg-[#0c0c0e]">
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#9ca3af] mb-1.5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] font-mono">
                  {product.collectionName}
                </span>
                <span className="text-[11px] font-mono">Art. #{product.id.slice(-6).toUpperCase()}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-wide">
                {product.name}
              </h2>
              <p className="text-xs text-[#9ca3af] mt-1 italic">
                {product.subtitle}
              </p>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-xl font-serif text-[#c5a880] font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-[#6b7280] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-mono ml-auto">
                  Atelier In Stock
                </span>
              </div>
            </div>

            {/* Editorial Quote */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border-l-2 border-[#c5a880] text-xs text-white/90 italic leading-relaxed">
              &ldquo;{product.editorialQuote}&rdquo;
            </div>

            {/* Colorway Selection */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-[#9ca3af] uppercase tracking-wider text-[10px] font-mono">
                  Available Colorways
                </span>
                <span className="text-white font-medium text-xs">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colorways.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedColor(c);
                      sounds.playClick();
                    }}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                      selectedColor.id === c.id
                        ? "border-[#c5a880] scale-110 shadow-[0_0_10px_rgba(197,168,128,0.4)]"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                    title={c.name}
                  >
                    <span
                      className="block w-full h-full rounded-full border border-white/20"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-[#9ca3af] uppercase tracking-wider text-[10px] font-mono">
                  Bespoke Sizing
                </span>
                <span className="text-[#c5a880] text-[10px] underline cursor-pointer hover:text-white">
                  Size Guide & Drape Specs
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSize(s);
                      sounds.playClick();
                    }}
                    className={`py-2 text-xs rounded-lg font-medium transition-all text-center border ${
                      selectedSize === s
                        ? "bg-[#c5a880] text-[#0b0b0c] border-[#c5a880] font-bold shadow-md"
                        : "bg-white/[0.03] text-[#9ca3af] border-white/10 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {s.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabbed Specifications: Fabric vs Craftsmanship */}
            <div className="pt-2 border-t border-white/[0.06]">
              <div className="flex gap-4 border-b border-white/[0.06] pb-2 text-xs">
                <button
                  onClick={() => setActiveTab("fabric")}
                  className={`pb-1 font-medium transition-colors border-b-2 -mb-2 ${
                    activeTab === "fabric"
                      ? "text-[#c5a880] border-[#c5a880]"
                      : "text-[#9ca3af] border-transparent hover:text-white"
                  }`}
                >
                  Fabric Spec Sheet
                </button>
                <button
                  onClick={() => setActiveTab("craftsmanship")}
                  className={`pb-1 font-medium transition-colors border-b-2 -mb-2 ${
                    activeTab === "craftsmanship"
                      ? "text-[#c5a880] border-[#c5a880]"
                      : "text-[#9ca3af] border-transparent hover:text-white"
                  }`}
                >
                  Atelier Craft Details
                </button>
              </div>

              <div className="pt-3 text-xs">
                {activeTab === "fabric" ? (
                  <div className="space-y-2 text-[#9ca3af]">
                    <div className="flex justify-between py-1 border-b border-white/[0.03]">
                      <span>Material</span>
                      <span className="text-white font-medium">{product.fabric.composition}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.03]">
                      <span>Mill Origin</span>
                      <span className="text-white font-medium">{product.fabric.origin}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.03]">
                      <span>Fabric Weight</span>
                      <span className="text-white font-mono">{product.fabric.weightGsm} GSM</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.03]">
                      <span>Weave Structure</span>
                      <span className="text-white font-medium">{product.fabric.weave}</span>
                    </div>
                    <p className="pt-1 text-[11px] text-[#6b7280] italic">
                      {product.fabric.textureDescription}
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-1.5 text-[#9ca3af] list-disc list-inside">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="text-xs leading-relaxed">
                        <span className="text-white/90">{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 space-y-2.5">
            {/* Add to Bag CTA */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0b0b0c] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(197,168,128,0.3)] transition-all"
            >
              <ShoppingBag size={15} />
              <span>Acquire Item • ${product.price.toLocaleString()}</span>
            </button>

            {/* Secondary Action Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Hang in Virtual Wardrobe */}
              <button
                onClick={handleAddToWardrobe}
                className="py-2.5 px-3 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#c5a880]/50 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                {addedToWardrobe ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-400">Hung on Rail</span>
                  </>
                ) : (
                  <>
                    <Sliders size={14} className="text-[#c5a880]" />
                    <span>Hang in Wardrobe</span>
                  </>
                )}
              </button>

              {/* Try on Avatar */}
              <button
                onClick={handleTryOnAvatar}
                className="py-2.5 px-3 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#c5a880]/50 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles size={14} className="text-[#c5a880]" />
                <span>Try on Avatar</span>
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="w-full py-2 text-xs text-[#9ca3af] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Heart
                size={14}
                className={isWishlisted ? "fill-[#c5a880] text-[#c5a880]" : ""}
              />
              <span>
                {isWishlisted ? "Saved in Your Curated Vault" : "Add to Vault Wishlist"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

