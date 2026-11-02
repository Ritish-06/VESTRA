"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorCanvas from "@/components/3d/ProductInspectorCanvas";
import { PRODUCTS } from "@/data/products";
import { Product, Colorway } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";
import {
  RotateCw,
  ZoomIn,
  ShoppingBag,
  Sliders,
  Sparkles,
  Heart,
  ArrowLeft,
  Check,
} from "lucide-react";

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { addWardrobeItem, toggleWishlist, isInWishlist, setLookPiece } = useWardrobeStore();

  const [selectedColor, setSelectedColor] = useState<Colorway>(product.colorways[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [autoRotate, setAutoRotate] = useState(false);
  const [macroZoom, setMacroZoom] = useState(false);
  const [hungSuccess, setHungSuccess] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const complimentaryProducts = PRODUCTS.filter(
    (p) => p.collectionId === product.collectionId && p.id !== product.id
  ).slice(0, 3);

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
    <div className="min-h-screen bg-[#070709] text-[#f5f4f0] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Back Link */}
        <div className="mb-6">
          <NextLink
            href="/explore"
            className="inline-flex items-center gap-2 text-xs text-[#9ca3af] hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Catalog</span>
          </NextLink>
        </div>

        {/* 3D Inspector Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left: 3D Viewport */}
          <div className="lg:col-span-7 h-[480px] sm:h-[580px] lg:h-[680px] rounded-3xl bg-gradient-to-b from-[#111116] to-[#09090c] border border-white/[0.08] relative overflow-hidden flex flex-col shadow-2xl">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5a880] px-3 py-1 rounded-full bg-black/50 border border-[#c5a880]/30 font-mono">
                3D Product Turntable
              </span>

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
              >
                <RotateCw size={12} className={autoRotate ? "animate-spin" : ""} />
                <span className="text-[10px]">Rotate</span>
              </button>

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
              Drag to orbit 360° • Scroll / Pinch to zoom into weave
            </div>
          </div>

          {/* Right: Garment Specifications & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono">
                  {product.collectionName}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium mt-1">
                  {product.name}
                </h1>
                <p className="text-xs text-[#9ca3af] mt-1 italic">{product.subtitle}</p>

                <div className="flex items-baseline gap-3 mt-4">
                  <span className="font-serif text-2xl font-bold text-[#c5a880]">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#6b7280] line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border-l-2 border-[#c5a880] text-xs text-white/90 italic leading-relaxed">
                &ldquo;{product.editorialQuote}&rdquo;
              </div>

              <p className="text-xs text-[#9ca3af] leading-relaxed">{product.description}</p>

              {/* Colorway Selection */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#9ca3af] font-mono block mb-2">
                  Tone Colorway: {selectedColor.name}
                </span>
                <div className="flex items-center gap-2">
                  {product.colorways.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedColor(c);
                        sounds.playClick();
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        selectedColor.id === c.id
                          ? "border-[#c5a880] scale-110"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#9ca3af] font-mono block mb-2">
                  Tailored Size:
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedSize(s);
                        sounds.playClick();
                      }}
                      className={`py-2 text-xs rounded-lg font-medium transition-colors border ${
                        selectedSize === s
                          ? "bg-[#c5a880] text-[#0b0b0c] border-[#c5a880] font-bold"
                          : "bg-white/[0.03] text-[#9ca3af] border-white/10 hover:text-white"
                      }`}
                    >
                      {s.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric Specs */}
              <div className="p-4 rounded-2xl bg-[#0e0e12] border border-white/[0.06] space-y-2 text-xs text-[#9ca3af]">
                <div className="flex justify-between py-1 border-b border-white/[0.03]">
                  <span>Composition</span>
                  <span className="text-white">{product.fabric.composition}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.03]">
                  <span>Origin</span>
                  <span className="text-white">{product.fabric.origin}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.03]">
                  <span>Weight</span>
                  <span className="text-white font-mono">{product.fabric.weightGsm} GSM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.03]">
                  <span>Weave</span>
                  <span className="text-white">{product.fabric.weave}</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => {
                  addItem(product, selectedColor, selectedSize, 1);
                }}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0b0b0c] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(197,168,128,0.3)] transition-all"
              >
                <ShoppingBag size={15} />
                <span>Acquire Piece • ${product.price.toLocaleString()}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    addWardrobeItem(product, selectedColor, selectedSize);
                    setHungSuccess(true);
                    setTimeout(() => setHungSuccess(false), 2500);
                  }}
                  className="py-2.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#c5a880] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  {hungSuccess ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-400">Hung on Rail</span>
                    </>
                  ) : (
                    <>
                      <Sliders size={13} className="text-[#c5a880]" />
                      <span>Hang in Wardrobe</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleTryOnAvatar}
                  className="py-2.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#c5a880] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles size={13} className="text-[#c5a880]" />
                  <span>Try on 3D Avatar</span>
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-full py-1 text-xs text-[#9ca3af] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Heart size={13} className={isWishlisted ? "fill-[#c5a880] text-[#c5a880]" : ""} />
                <span>{isWishlisted ? "Saved in Private Vault" : "Add to Vault Wishlist"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Complimentary Collection Pieces */}
        {complimentaryProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-white/[0.08]">
            <h2 className="font-serif text-2xl text-white mb-6">
              Complimentary Pieces from {product.collectionName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {complimentaryProducts.map((comp) => (
                <NextLink
                  key={comp.id}
                  href={`/product/${comp.id}`}
                  className="group rounded-2xl bg-[#0e0e12] border border-white/5 hover:border-white/15 p-4 transition-all"
                >
                  <div className="aspect-[3/4] w-full rounded-xl bg-[#18181e] overflow-hidden mb-3">
                    <img
                      src={comp.images.hero}
                      alt={comp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-serif text-sm text-white truncate">{comp.name}</h3>
                  <span className="text-xs font-serif text-[#c5a880] font-bold block mt-1">
                    ${comp.price.toLocaleString()}
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
