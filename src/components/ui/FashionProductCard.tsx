"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { Product, Colorway } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import { Eye, ShoppingBag, Heart, Check, SlidersHorizontal } from "lucide-react";

interface FashionProductCardProps {
  product: Product;
  onInspect?: (product: Product) => void;
  priority?: boolean;
  compact?: boolean;
}

export default function FashionProductCard({
  product,
  onInspect,
  priority = false,
  compact = false,
}: FashionProductCardProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist, recordProductView } = useWardrobeStore();

  const [selectedColor, setSelectedColor] = useState<Colorway>(
    product.colorways[0] || { id: "default", name: "Atelier", hex: "#25241F" }
  );
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "48 (M)");
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [addedConfirm, setAddedConfirm] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const productUrl = `/product/${product.slug || product.id}`;

  const primaryImage = product.images?.hero || product.images?.modelFront;
  const secondaryImage =
    product.images?.modelBack && product.images.modelBack !== primaryImage
      ? product.images.modelBack
      : product.images?.fabricDetail && product.images.fabricDetail !== primaryImage
      ? product.images.fabricDetail
      : product.images?.hangerView && product.images.hangerView !== primaryImage
      ? product.images.hangerView
      : product.images?.modelFront || primaryImage;

  const handleQuickAdd = (sizeToAdd: string) => {
    addItem(product, selectedColor, sizeToAdd, 1, false);
    setSelectedSize(sizeToAdd);
    setShowSizePicker(false);
    setAddedConfirm(true);
    setTimeout(() => {
      setAddedConfirm(false);
    }, 1800);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartPulse(true);
    toggleWishlist(product.id);
    setTimeout(() => setHeartPulse(false), 320);
  };

  return (
    <article
      className="group rounded-2xl bg-white border border-[#E5E0D7] hover:border-[#B49A75] transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden flex flex-col justify-between shadow-[0_6px_20px_-10px_rgba(37,36,31,0.06)] hover:shadow-[0_18px_36px_-14px_rgba(37,36,31,0.12)]"
    >
      {/* Image Stage with Crossfade Secondary Imagery */}
      <div className="relative aspect-[3/4] w-full bg-[#F0EDE6] overflow-hidden select-none">
        <NextLink
          href={productUrl}
          onClick={() => {
            recordProductView(product.id);
            sounds.playClick();
          }}
          className="block w-full h-full relative"
          aria-label={`View ${product.name}`}
        >
          {/* Primary Image */}
          <img
            src={primaryImage}
            alt={product.name}
            width={600}
            height={800}
            {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
            className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-0"
          />

          {/* Alternate Crossfade Image (revealed on hover) */}
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            width={600}
            height={800}
            fetchPriority="low"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500 ease-out"
          />
        </NextLink>

        {/* Top-Left Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none">
          <span className="text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/92 backdrop-blur-md text-[#8C7352] border border-[#E5E0D7] font-mono font-semibold shadow-2xs">
            {product.collectionName.split(" ")[1] || product.collectionName}
          </span>
          {product.isNew && (
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#25241F] text-white font-mono font-medium">
              New
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/92 backdrop-blur-md border border-[#E5E0D7] flex items-center justify-center text-[#25241F] hover:border-[#B49A75] transition-transform duration-200 shadow-2xs cursor-pointer ${
            heartPulse ? "scale-125" : "scale-100"
          }`}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
        >
          <Heart
            size={14}
            className={`transition-colors duration-200 ${
              isWishlisted ? "fill-[#B49A75] text-[#8C7352]" : "text-[#25241F]"
            }`}
          />
        </button>

        {/* Inline Size Options Overlay Drawer */}
        {showSizePicker && (
          <div
            className="absolute inset-x-2.5 bottom-14 z-20 p-2.5 rounded-xl bg-white/96 backdrop-blur-md border border-[#E5E0D7] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] uppercase tracking-wider font-mono text-[#77736C]">
                Select Tailored Size
              </span>
              <button
                type="button"
                onClick={() => setShowSizePicker(false)}
                className="text-[10px] text-[#77736C] hover:text-[#25241F] cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {product.sizes.map((sz) => {
                const shortLabel = sz.split(" ")[0];
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleQuickAdd(sz)}
                    className={`py-1.5 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer ${
                      selectedSize === sz
                        ? "bg-[#25241F] text-white border-[#25241F]"
                        : "bg-[#F8F6F1] text-[#25241F] border-[#E5E0D7] hover:border-[#B49A75]"
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions Bar on Hover / Focus */}
        <div
          className={`absolute inset-x-3 bottom-3 z-10 flex items-center gap-1.5 transition-all duration-300 ${
            addedConfirm || showSizePicker
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0"
          }`}
        >
          {addedConfirm ? (
            <div className="w-full py-2.5 px-3 rounded-full bg-[#607B60] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md">
              <Check size={13} />
              <span>Added to Bag</span>
            </div>
          ) : (
            <>
              {onInspect && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    recordProductView(product.id);
                    onInspect(product);
                    sounds.playGarmentInspect();
                  }}
                  className="flex-1 py-2 px-3 rounded-full bg-white/95 hover:bg-[#25241F] text-[#25241F] hover:text-white border border-[#E5E0D7] text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                  aria-label={`Quick view ${product.name} in 3D`}
                >
                  <Eye size={12} className="text-[#B49A75]" />
                  <span>Quick View 3D</span>
                </button>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  sounds.playClick();
                  setShowSizePicker((prev) => !prev);
                }}
                className="w-8 h-8 rounded-full bg-white/95 hover:bg-[#F0EDE6] text-[#25241F] border border-[#E5E0D7] flex items-center justify-center transition-colors shadow-md shrink-0 cursor-pointer"
                title="Select Size & Options"
                aria-label="Select size options"
              >
                <SlidersHorizontal size={12} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleQuickAdd(selectedSize);
                }}
                className="w-8 h-8 rounded-full bg-[#25241F] hover:bg-[#38362F] text-white flex items-center justify-center transition-colors shadow-md shrink-0 cursor-pointer"
                title={`Quick Add (${selectedColor.name}, ${selectedSize})`}
                aria-label={`Add ${product.name} to bag`}
              >
                <ShoppingBag size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Product Information Footer */}
      <div className={`${compact ? "p-3.5" : "p-4"} flex-1 flex flex-col justify-between bg-white`}>
        <div>
          <div className="flex items-center justify-between text-[10px] text-[#77736C] font-mono">
            <span className="truncate">{product.fabric.weave}</span>
            <span className="shrink-0">{product.fabric.weightGsm} GSM</span>
          </div>

          <NextLink
            href={productUrl}
            onClick={() => {
              recordProductView(product.id);
              sounds.playClick();
            }}
          >
            <h3 className="font-serif text-base text-[#25241F] font-medium mt-1 group-hover:text-[#8C7352] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </NextLink>

          {!compact && (
            <p className="text-[11px] text-[#77736C] mt-0.5 line-clamp-1 italic">
              {product.subtitle}
            </p>
          )}
        </div>

        <div className="pt-3 mt-3 border-t border-[#E5E0D7] flex items-center justify-between gap-2">
          {/* Interactive Color Swatches */}
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Colorways">
            {product.colorways.map((col) => {
              const isSelected = selectedColor.id === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => {
                    setSelectedColor(col);
                    sounds.playClick();
                  }}
                  aria-label={`Select color ${col.name}`}
                  aria-checked={isSelected}
                  role="radio"
                  title={col.name}
                  className={`w-4 h-4 rounded-full border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-[#B49A75] ring-offset-1 border-[#25241F]/30 scale-110"
                      : "border-black/15 opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              );
            })}
          </div>

          <span className="font-serif text-sm font-bold text-[#25241F] tabular-nums">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </article>
  );
}
