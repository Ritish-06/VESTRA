"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  RotateCw,
  RotateCcw,
  ZoomIn,
  Heart,
  ShoppingBag,
  Sparkles,
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
      <div className="w-full h-full flex flex-col items-center justify-center text-[#8C7352] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#B49A75]/30 border-t-[#B49A75] animate-spin" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#77736C]">
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
  const [resetTrigger, setResetTrigger] = useState(0);
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
        className="fixed inset-0 bg-[#25241F]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-6xl h-full max-h-[92vh] bg-[#FFFFFF] border border-[#E5E0D7] rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row z-10 text-[#25241F]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 border border-[#E5E0D7] flex items-center justify-center text-[#77736C] hover:text-[#25241F] hover:bg-[#F0EDE6] transition-colors cursor-pointer"
          aria-label="Close product inspector"
        >
          <X size={18} />
        </button>

        {/* Left Side: Bright 3D Turntable Inspection Viewport */}
        <div className="relative w-full lg:w-3/5 h-80 sm:h-96 lg:h-full bright-showroom flex flex-col">
          {/* Controls Overlay Header */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7352] px-3 py-1 rounded-full bg-white/90 border border-[#E5E0D7] backdrop-blur-xs font-mono font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A75]" />
              3D Studio Viewport
            </span>

            {/* Auto-Rotate Switch */}
            <button
              onClick={() => {
                setAutoRotate(!autoRotate);
                sounds.playClick();
              }}
              className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-xs flex items-center gap-1 transition-colors cursor-pointer ${
                autoRotate
                  ? "bg-[#25241F] border-[#25241F] text-white"
                  : "bg-white/90 border-[#E5E0D7] text-[#77736C] hover:text-[#25241F]"
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
              className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-xs flex items-center gap-1 transition-colors cursor-pointer ${
                macroZoom
                  ? "bg-[#25241F] border-[#25241F] text-white"
                  : "bg-white/90 border-[#E5E0D7] text-[#77736C] hover:text-[#25241F]"
              }`}
              title="Inspect Fabric Macro Texture"
            >
              <ZoomIn size={12} />
              <span className="text-[10px]">Macro</span>
            </button>

            {/* Reset Camera Button */}
            <button
              onClick={() => {
                setMacroZoom(false);
                setResetTrigger((prev) => prev + 1);
                sounds.playClick();
              }}
              className="text-xs px-2.5 py-1 rounded-full border bg-white/90 border-[#E5E0D7] text-[#77736C] hover:text-[#25241F] hover:border-[#B49A75] backdrop-blur-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset Camera Framing"
            >
              <RotateCcw size={12} />
              <span className="text-[10px]">Reset</span>
            </button>
          </div>

          {/* 3D Canvas */}
          <div className="flex-1 w-full h-full">
            <ProductInspectorCanvas
              product={product}
              activeColorway={selectedColor}
              autoRotate={autoRotate}
              macroZoom={macroZoom}
              resetTrigger={resetTrigger}
            />
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[#77736C] pointer-events-none bg-white/85 px-3 py-1 rounded-full border border-[#E5E0D7] backdrop-blur-xs">
            Drag to rotate 360° • Pinch / scroll to inspect drape
          </div>
        </div>

        {/* Right Side: Product Dossier & Atelier Actions */}
        <div className="w-full lg:w-2/5 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#E5E0D7] bg-white">
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#77736C] mb-1.5">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7352] font-mono font-semibold">
                  {product.collectionName}
                </span>
                <span className="text-[11px] font-mono">Art. #{product.id.slice(-6).toUpperCase()}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#25241F] tracking-wide">
                {product.name}
              </h2>
              <p className="text-xs text-[#77736C] mt-1 italic">
                {product.subtitle}
              </p>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-xl font-serif text-[#8C7352] font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-[#77736C] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#607B60]/12 text-[#607B60] border border-[#607B60]/30 font-mono font-medium ml-auto">
                  Atelier In Stock
                </span>
              </div>
            </div>

            {/* Editorial Quote */}
            <div className="p-3.5 rounded-xl bg-[#F8F6F1] border-l-2 border-[#B49A75] text-xs text-[#25241F] italic leading-relaxed">
              &ldquo;{product.editorialQuote}&rdquo;
            </div>

            {/* Colorway Selection */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-[#77736C] uppercase tracking-wider text-[10px] font-mono">
                  Available Colorways
                </span>
                <span className="text-[#25241F] font-medium text-xs">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colorways.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedColor(c);
                      sounds.playClick();
                    }}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all p-0.5 cursor-pointer ${
                      selectedColor.id === c.id
                        ? "border-[#B49A75] scale-110 shadow-xs"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    title={c.name}
                  >
                    <span
                      className="block w-full h-full rounded-full border border-[#E5E0D7]"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-[#77736C] uppercase tracking-wider text-[10px] font-mono">
                  Bespoke Sizing
                </span>
                <span className="text-[#8C7352] text-[10px] underline">
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
                    className={`py-2 text-xs rounded-lg font-medium transition-all text-center border cursor-pointer ${
                      selectedSize === s
                        ? "bg-[#25241F] text-white border-[#25241F] font-semibold shadow-xs"
                        : "bg-[#F8F6F1] text-[#77736C] border-[#E5E0D7] hover:text-[#25241F] hover:border-[#B49A75]"
                    }`}
                  >
                    {s.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabbed Specifications: Fabric vs Craftsmanship */}
            <div className="pt-2 border-t border-[#E5E0D7]">
              <div className="flex gap-4 border-b border-[#E5E0D7] pb-2 text-xs">
                <button
                  onClick={() => setActiveTab("fabric")}
                  className={`pb-1 font-medium transition-colors border-b-2 -mb-2 cursor-pointer ${
                    activeTab === "fabric"
                      ? "text-[#25241F] border-[#B49A75]"
                      : "text-[#77736C] border-transparent hover:text-[#25241F]"
                  }`}
                >
                  Fabric Spec Sheet
                </button>
                <button
                  onClick={() => setActiveTab("craftsmanship")}
                  className={`pb-1 font-medium transition-colors border-b-2 -mb-2 cursor-pointer ${
                    activeTab === "craftsmanship"
                      ? "text-[#25241F] border-[#B49A75]"
                      : "text-[#77736C] border-transparent hover:text-[#25241F]"
                  }`}
                >
                  Atelier Craft Details
                </button>
              </div>

              <div className="pt-3 text-xs">
                {activeTab === "fabric" ? (
                  <div className="space-y-2 text-[#77736C]">
                    <div className="flex justify-between py-1 border-b border-[#E5E0D7]/60">
                      <span>Material</span>
                      <span className="text-[#25241F] font-medium">{product.fabric.composition}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E5E0D7]/60">
                      <span>Mill Origin</span>
                      <span className="text-[#25241F] font-medium">{product.fabric.origin}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E5E0D7]/60">
                      <span>Fabric Weight</span>
                      <span className="text-[#25241F] font-mono">{product.fabric.weightGsm} GSM</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E5E0D7]/60">
                      <span>Weave Structure</span>
                      <span className="text-[#25241F] font-medium">{product.fabric.weave}</span>
                    </div>
                    <p className="pt-1 text-[11px] text-[#77736C] italic">
                      {product.fabric.textureDescription}
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-1.5 text-[#77736C] list-disc list-inside">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="text-xs leading-relaxed">
                        <span className="text-[#25241F]">{detail}</span>
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
              className="w-full py-3.5 rounded-full bg-[#25241F] hover:bg-[#38362F] text-white font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <ShoppingBag size={15} className="text-[#B49A75]" />
              <span>Add to Bag • {formatPrice(product.price)}</span>
            </button>

            {/* Secondary Action Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Hang in Virtual Wardrobe */}
              <button
                onClick={handleAddToWardrobe}
                className="py-2.5 px-3 rounded-full bg-[#F8F6F1] border border-[#E5E0D7] hover:border-[#B49A75] text-[#25241F] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {addedToWardrobe ? (
                  <>
                    <Check size={14} className="text-[#607B60]" />
                    <span className="text-[#607B60]">Hung on Rail</span>
                  </>
                ) : (
                  <>
                    <Sliders size={14} className="text-[#8C7352]" />
                    <span>Hang in Wardrobe</span>
                  </>
                )}
              </button>

              {/* Try on Avatar */}
              <button
                onClick={handleTryOnAvatar}
                className="py-2.5 px-3 rounded-full bg-[#F8F6F1] border border-[#E5E0D7] hover:border-[#B49A75] text-[#25241F] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles size={14} className="text-[#8C7352]" />
                <span>Try on Avatar</span>
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="w-full py-2 text-xs text-[#77736C] hover:text-[#25241F] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Heart
                size={14}
                className={isWishlisted ? "fill-[#B49A75] text-[#B49A75]" : ""}
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
