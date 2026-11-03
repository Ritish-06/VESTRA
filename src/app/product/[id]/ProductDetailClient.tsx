"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import { Product, Colorway } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import {
  RotateCw,
  ZoomIn,
  ShoppingBag,
  Sliders,
  Sparkles,
  Heart,
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
  Sparkle,
} from "lucide-react";

const ProductInspectorCanvas = dynamic(
  () => import("@/components/3d/ProductInspectorCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center text-[#c5a880] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#c5a880]/30 border-t-[#c5a880] animate-spin" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#9ca3af]">
          Rendering 3D Model...
        </span>
      </div>
    ),
  }
);

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { addWardrobeItem, toggleWishlist, isInWishlist, setLookPiece } = useWardrobeStore();
  const { products } = useCatalog();

  const [selectedColor, setSelectedColor] = useState<Colorway>(product.colorways[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [autoRotate, setAutoRotate] = useState(false);
  const [macroZoom, setMacroZoom] = useState(false);
  const [hungSuccess, setHungSuccess] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const complimentaryProducts = products
    .filter((p) => p.collectionId === product.collectionId && p.id !== product.id)
    .slice(0, 3);

  const handleTryOnAvatar = () => {
    sounds.playClick();
    if (product.category === "outerwear" || product.category === "tailoring") {
      setLookPiece("outerwear", product);
    } else if (product.category === "tops") {
      setLookPiece("top", product);
    } else if (product.category === "trousers") {
      setLookPiece("trousers", product);
    }
    router.push("/studio");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Back Link */}
        <div className="mb-6">
          <NextLink
            href="/explore"
            className="inline-flex items-center gap-2 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            <span>Return to Catalog</span>
          </NextLink>
        </div>

        {/* 3D Inspector Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left: 3D Viewport */}
          <div className="lg:col-span-7 h-[480px] sm:h-[580px] lg:h-[680px] rounded-3xl bg-gradient-to-b from-[#111116] to-[#09090c] border border-[#1C1917]/10 relative overflow-hidden flex flex-col shadow-xl">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5a880] px-3 py-1 rounded-full bg-black/50 border border-[#c5a880]/30 font-mono">
                3D Garment Inspection
              </span>

              <button
                type="button"
                onClick={() => {
                  setAutoRotate(!autoRotate);
                  sounds.playClick();
                }}
                className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-sm flex items-center gap-1 transition-colors cursor-pointer ${
                  autoRotate
                    ? "bg-[#c5a880]/20 border-[#c5a880] text-[#c5a880]"
                    : "bg-black/30 border-white/10 text-[#9ca3af] hover:text-white"
                }`}
              >
                <RotateCw size={12} className={autoRotate ? "animate-spin" : ""} />
                <span className="text-[10px]">Rotate</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMacroZoom(!macroZoom);
                  sounds.playClick();
                }}
                className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-sm flex items-center gap-1 transition-colors cursor-pointer ${
                  macroZoom
                    ? "bg-[#c5a880]/20 border-[#c5a880] text-[#c5a880]"
                    : "bg-black/30 border-white/10 text-[#9ca3af] hover:text-white"
                }`}
              >
                <ZoomIn size={12} />
                <span className="text-[10px]">Macro</span>
              </button>
            </div>

            <div className="flex-1 w-full h-full">
              <ProductInspectorCanvas
                product={product}
                activeColorway={selectedColor}
                autoRotate={autoRotate}
                macroZoom={macroZoom}
              />
            </div>

            <div className="p-3 bg-black/40 text-center text-[10px] text-[#9ca3af] border-t border-white/[0.04]">
              Drag to orbit 360° • Scroll / Pinch to zoom into fabric texture
            </div>
          </div>

          {/* Right: Garment Specifications & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono font-semibold">
                  {product.collectionName}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-medium mt-1">
                  {product.name}
                </h1>
                <p className="text-xs text-[#78716C] mt-1 italic">{product.subtitle}</p>

                <div className="flex items-baseline gap-3 mt-4">
                  <span className="font-serif text-2xl font-bold text-[#9A7B4F]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#78716C] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border-l-2 border-[#C5A880] text-xs text-[#1C1917]/90 italic leading-relaxed shadow-xs">
                &ldquo;{product.editorialQuote}&rdquo;
              </div>

              <p className="text-xs text-[#78716C] leading-relaxed">{product.description}</p>

              {/* Colorway Selection */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-mono block mb-2">
                  Tone Colorway: <strong className="text-[#1C1917]">{selectedColor.name}</strong>
                </span>
                <div className="flex items-center gap-2">
                  {product.colorways.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c);
                        sounds.playClick();
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor.id === c.id
                          ? "border-[#9A7B4F] scale-110 shadow-sm"
                          : "border-black/10 opacity-75 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-mono block mb-2">
                  Tailored Size:
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSelectedSize(s);
                        sounds.playClick();
                      }}
                      className={`py-2 text-xs rounded-lg font-medium transition-colors border cursor-pointer ${
                        selectedSize === s
                          ? "bg-[#1C1917] text-white border-[#1C1917] font-bold shadow-xs"
                          : "bg-white text-[#78716C] border-[#1C1917]/15 hover:text-[#1C1917]"
                      }`}
                    >
                      {s.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric Specs */}
              <div className="p-4 rounded-2xl atelier-card space-y-2 text-xs text-[#78716C]">
                <div className="flex justify-between py-1 border-b border-[#1C1917]/[0.05]">
                  <span>Composition</span>
                  <span className="text-[#1C1917] font-medium">{product.fabric.composition}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1C1917]/[0.05]">
                  <span>Origin</span>
                  <span className="text-[#1C1917] font-medium">{product.fabric.origin}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1C1917]/[0.05]">
                  <span>Weight</span>
                  <span className="text-[#1C1917] font-mono">{product.fabric.weightGsm} GSM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1C1917]/[0.05]">
                  <span>Weave</span>
                  <span className="text-[#1C1917] font-medium">{product.fabric.weave}</span>
                </div>
                {product.careInstructions && product.careInstructions.length > 0 && (
                  <div className="pt-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#9A7B4F] block mb-1">
                      Care Guidance
                    </span>
                    <p className="text-[11px] text-[#78716C] leading-snug">
                      {product.careInstructions.join(" • ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery Estimate */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#1C1917]/[0.06] text-xs text-[#78716C]">
                <Truck size={15} className="text-[#9A7B4F] shrink-0" />
                <span>Complimentary insured courier dispatch within 24 hours of tailoring validation.</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  addItem(product, selectedColor, selectedSize, 1);
                }}
                className="w-full py-4 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-white font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <ShoppingBag size={15} className="text-[#C5A880]" />
                <span>Acquire Piece • {formatPrice(product.price)}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addWardrobeItem(product, selectedColor, selectedSize);
                    setHungSuccess(true);
                    setTimeout(() => setHungSuccess(false), 2500);
                  }}
                  className="py-2.5 rounded-full bg-white border border-[#1C1917]/15 hover:border-[#C5A880] text-[#1C1917] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  {hungSuccess ? (
                    <>
                      <Check size={13} className="text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Hung on Rail</span>
                    </>
                  ) : (
                    <>
                      <Sliders size={13} className="text-[#9A7B4F]" />
                      <span>Hang in Wardrobe</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleTryOnAvatar}
                  className="py-2.5 rounded-full bg-white border border-[#1C1917]/15 hover:border-[#C5A880] text-[#1C1917] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Sparkles size={13} className="text-[#9A7B4F]" />
                  <span>Try on 3D Avatar</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="w-full py-1 text-xs text-[#78716C] hover:text-[#1C1917] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Heart size={13} className={isWishlisted ? "fill-[#C5A880] text-[#9A7B4F]" : ""} />
                <span>{isWishlisted ? "Saved in Private Vault" : "Add to Vault Wishlist"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Complimentary Collection Pieces */}
        {complimentaryProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#1C1917]/[0.08]">
            <h2 className="font-serif text-2xl text-[#1C1917] mb-6">
              Complimentary Pieces from {product.collectionName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {complimentaryProducts.map((comp) => (
                <NextLink
                  key={comp.id}
                  href={`/product/${comp.slug || comp.id}`}
                  className="group rounded-2xl atelier-card p-4 transition-all"
                >
                  <div className="aspect-[3/4] w-full rounded-xl bg-[#FAF8F5] overflow-hidden mb-3 border border-[#1C1917]/[0.04]">
                    <img
                      src={comp.images.hero || comp.images.modelFront}
                      alt={comp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-serif text-sm text-[#1C1917] font-medium truncate">{comp.name}</h3>
                  <span className="text-xs font-serif text-[#9A7B4F] font-bold block mt-1">
                    {formatPrice(comp.price)}
                  </span>
                </NextLink>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
