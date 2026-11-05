"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { Product, Colorway } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import {
  Eye,
  ShoppingBag,
  Heart,
  Check,
  ArrowUpRight,
  Sliders,
} from "lucide-react";

interface EditorialPlateProps {
  product: Product;
  index: number;
  featuredSpan?: boolean;
  onInspect?: (product: Product) => void;
}

function EditorialGarmentPlate({
  product,
  index,
  featuredSpan = false,
  onInspect,
}: EditorialPlateProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist, addWardrobeItem, recordProductView } =
    useWardrobeStore();

  const [selectedColor, setSelectedColor] = useState<Colorway>(
    product.colorways[0] || { id: "default", name: "Atelier", hex: "#25241F" }
  );
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "48 (M)");
  const [addedConfirm, setAddedConfirm] = useState(false);
  const [wardrobeConfirm, setWardrobeConfirm] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const productUrl = `/product/${product.slug || product.id}`;

  const primaryImage = product.images?.hero || product.images?.modelFront;
  const secondaryImage =
    product.images?.modelBack && product.images.modelBack !== primaryImage
      ? product.images.modelBack
      : product.images?.fabricDetail && product.images.fabricDetail !== primaryImage
      ? product.images.fabricDetail
      : product.images?.modelFront || primaryImage;

  return (
    <article
      className={`group rounded-3xl bg-white border border-[#E5E0D7] hover:border-[#B49A75] transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-[0_10px_30px_-14px_rgba(37,36,31,0.06)] ${
        featuredSpan ? "lg:col-span-7" : "lg:col-span-5"
      }`}
    >
      {/* Top Archival Plate Index Bar */}
      <div className="px-6 py-3.5 border-b border-[#E5E0D7] flex items-center justify-between text-[10px] font-mono text-[#77736C] bg-[#F8F6F1]/70">
        <span>
          PLATE {String(index + 1).padStart(2, "0")} // {product.collectionName.toUpperCase()}
        </span>
        <span>
          {product.fabric.weightGsm} GSM • {product.fabric.origin}
        </span>
      </div>

      {/* Large Editorial Imagery with Hover Crossfade */}
      <div
        className={`relative w-full overflow-hidden bg-[#F0EDE6] ${
          featuredSpan ? "aspect-[4/4] sm:aspect-[16/13]" : "aspect-[3/4]"
        }`}
      >
        <NextLink
          href={productUrl}
          onClick={() => {
            recordProductView(product.id);
            sounds.playClick();
          }}
          className="block w-full h-full relative"
        >
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-0"
          />
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            loading="lazy"
            fetchPriority="low"
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 ease-out"
          />
        </NextLink>

        {/* Top-Right Wishlist & 3D Preview Pills */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {onInspect && (
            <button
              type="button"
              onClick={() => {
                recordProductView(product.id);
                onInspect(product);
                sounds.playGarmentInspect();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white/94 hover:bg-[#25241F] text-[#25241F] hover:text-white border border-[#E5E0D7] text-[11px] font-medium flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Eye size={12} className="text-[#B49A75]" />
              <span>3D Studio</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={isWishlisted ? "Remove from vault" : "Save to vault"}
            className="w-9 h-9 rounded-full bg-white/94 border border-[#E5E0D7] hover:border-[#B49A75] flex items-center justify-center text-[#25241F] transition-colors shadow-sm cursor-pointer"
          >
            <Heart
              size={14}
              className={isWishlisted ? "fill-[#B49A75] text-[#8C7352]" : ""}
            />
          </button>
        </div>

        {/* Subtle Bottom Editorial Quote Overlay on Featured Span */}
        {featuredSpan && (
          <div className="hidden sm:flex absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/92 backdrop-blur-md border border-[#E5E0D7] items-center justify-between gap-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
            <p className="text-xs font-serif italic text-[#25241F] line-clamp-1">
              &ldquo;{product.editorialQuote}&rdquo;
            </p>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7352] shrink-0">
              {product.fabric.weave}
            </span>
          </div>
        )}
      </div>

      {/* Minimal Architectural Dossier & Interactive Acquisition Controls */}
      <div className="p-6 sm:p-7 space-y-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <NextLink
              href={productUrl}
              onClick={() => recordProductView(product.id)}
              className="group/title inline-flex items-baseline gap-2"
            >
              <h3 className="font-serif text-xl sm:text-2xl text-[#25241F] font-medium group-hover/title:text-[#8C7352] transition-colors">
                {product.name}
              </h3>
              <ArrowUpRight size={15} className="text-[#B49A75] shrink-0" />
            </NextLink>
            <p className="text-xs text-[#77736C] italic line-clamp-1">{product.subtitle}</p>
          </div>

          <span className="font-serif text-lg font-bold text-[#25241F] tabular-nums shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Interactive Color Swatches & Size Selection Row */}
        <div className="pt-4 border-t border-[#E5E0D7] flex flex-wrap items-center justify-between gap-4">
          {/* Colorways */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#77736C] mr-1">
              Tone:
            </span>
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
                  title={col.name}
                  aria-label={`Select colorway ${col.name}`}
                  className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-[#B49A75] ring-offset-1 border-[#25241F] scale-110"
                      : "border-black/15 opacity-75 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              );
            })}
          </div>

          {/* Size Pills */}
          <div className="flex items-center gap-1">
            {product.sizes.slice(0, 4).map((sz) => {
              const short = sz.split(" ")[0];
              const isSelected = selectedSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => {
                    setSelectedSize(sz);
                    sounds.playClick();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#25241F] text-white border-[#25241F]"
                      : "bg-[#F8F6F1] text-[#77736C] border-[#E5E0D7] hover:text-[#25241F]"
                  }`}
                >
                  {short}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Row: Add to Wardrobe & Acquire */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              addItem(product, selectedColor, selectedSize, 1, false);
              setAddedConfirm(true);
              setTimeout(() => setAddedConfirm(false), 1800);
            }}
            className={`flex-1 py-3 px-4 rounded-full text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              addedConfirm
                ? "bg-[#607B60] text-white"
                : "bg-[#25241F] hover:bg-[#38362F] text-white"
            }`}
          >
            {addedConfirm ? (
              <>
                <Check size={14} />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} className="text-[#B49A75]" />
                <span>Acquire Piece</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              addWardrobeItem(product, selectedColor, selectedSize);
              setWardrobeConfirm(true);
              setTimeout(() => setWardrobeConfirm(false), 2000);
            }}
            className="py-3 px-4 rounded-full bg-[#F8F6F1] hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Hang in Personal 3D Wardrobe"
          >
            {wardrobeConfirm ? (
              <>
                <Check size={13} className="text-[#607B60]" />
                <span className="text-[#607B60]">In Wardrobe</span>
              </>
            ) : (
              <>
                <Sliders size={13} className="text-[#8C7352]" />
                <span>+ Wardrobe</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

interface AsymmetricalEditorialShowcaseProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  onInspectProduct?: (product: Product) => void;
}

export default function AsymmetricalEditorialShowcase({
  products,
  title,
  subtitle,
  onInspectProduct,
}: AsymmetricalEditorialShowcaseProps) {
  return (
    <div className="space-y-8">
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && <h3 className="font-serif text-2xl text-[#25241F]">{title}</h3>}
          {subtitle && <p className="text-xs text-[#77736C]">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {products.map((product, idx) => {
          // Alternate 7-column and 5-column asymmetrical layout every row:
          // Row 0: [7, 5], Row 1: [5, 7], Row 2: [7, 5]...
          const row = Math.floor(idx / 2);
          const isFirstInRow = idx % 2 === 0;
          const featuredSpan = row % 2 === 0 ? isFirstInRow : !isFirstInRow;

          return (
            <EditorialGarmentPlate
              key={product.id}
              product={product}
              index={idx}
              featuredSpan={featuredSpan}
              onInspect={onInspectProduct}
            />
          );
        })}
      </div>
    </div>
  );
}

