"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import FashionProductCard from "@/components/ui/FashionProductCard";
import InteractiveSlider from "@/components/ui/InteractiveSlider";
import { Product, Colorway } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import {
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ShoppingBag,
  Sliders,
  Sparkles,
  Heart,
  ArrowLeft,
  Check,
  Truck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Box,
} from "lucide-react";

const ProductInspectorCanvas = dynamic(
  () => import("@/components/3d/ProductInspectorCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center text-[#B49A75] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#B49A75]/30 border-t-[#B49A75] animate-spin" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#77736C]">
          Framing 3D Garment...
        </span>
      </div>
    ),
  }
);

type GalleryItem =
  | { id: "3d"; type: "3d"; label: string; thumb: string }
  | { id: string; type: "image"; label: string; src: string; thumb: string };

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const {
    addWardrobeItem,
    toggleWishlist,
    isInWishlist,
    setLookPiece,
    recordProductView,
    recentlyViewedIds,
  } = useWardrobeStore();
  const { products } = useCatalog();

  const [selectedColor, setSelectedColor] = useState<Colorway>(product.colorways[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [autoRotate, setAutoRotate] = useState(false);
  const [macroZoom, setMacroZoom] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [hungSuccess, setHungSuccess] = useState(false);
  const [addedToBagSuccess, setAddedToBagSuccess] = useState(false);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  // Gallery state: index 0 is Interactive 3D Showroom, followed by editorial photography
  const galleryItems: GalleryItem[] = useMemo(() => {
    const heroImg = product.images?.hero || product.images?.modelFront;
    const frontImg = product.images?.modelFront || heroImg;
    const backImg = product.images?.modelBack || heroImg;
    const detailImg = product.images?.fabricDetail || product.images?.hangerView || frontImg;

    return [
      { id: "3d", type: "3d", label: "3D Showroom", thumb: heroImg },
      { id: "hero", type: "image", label: "Editorial Portrait", src: heroImg, thumb: heroImg },
      { id: "front", type: "image", label: "Front Silhouette", src: frontImg, thumb: frontImg },
      { id: "back", type: "image", label: "Back Drape", src: backImg, thumb: backImg },
      { id: "detail", type: "image", label: "Fabric Macro", src: detailImg, thumb: detailImg },
    ];
  }, [product]);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const swipeStartX = useRef<number | null>(null);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    description: true,
    materials: true,
    sizing: false,
    delivery: false,
  });

  // Record product view in recently viewed store on mount
  useEffect(() => {
    recordProductView(product.id);
  }, [product.id, recordProductView]);

  const activeMedia = galleryItems[activeMediaIndex] || galleryItems[0];
  const isWishlisted = isInWishlist(product.id);

  const complimentaryProducts = useMemo(() => {
    const sameCollection = products.filter(
      (p) => p.collectionId === product.collectionId && p.id !== product.id
    );
    return sameCollection.length >= 3
      ? sameCollection
      : [...sameCollection, ...products.filter((p) => p.id !== product.id)].slice(0, 6);
  }, [products, product]);

  const recentlyViewedProducts = useMemo(() => {
    return (recentlyViewedIds || [])
      .filter((id) => id !== product.id && id !== product.slug)
      .map((id) => products.find((p) => p.id === id || p.slug === id))
      .filter(Boolean) as Product[];
  }, [recentlyViewedIds, products, product.id, product.slug]);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
    sounds.playClick();
  };

  const selectMediaSlide = (idx: number) => {
    const normalized = (idx + galleryItems.length) % galleryItems.length;
    setActiveMediaIndex(normalized);
    setImageZoomed(false);
    sounds.playClick();
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x: Math.min(90, Math.max(10, x)), y: Math.min(90, Math.max(10, y)) });
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
    router.push("/studio");
  };

  const handleAddToBag = () => {
    addItem(product, selectedColor, selectedSize, quantity, true);
    setAddedToBagSuccess(true);
    setTimeout(() => setAddedToBagSuccess(false), 2200);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Breadcrumb & Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <NextLink
            href="/explore"
            className="inline-flex items-center gap-2 text-xs text-[#77736C] hover:text-[#25241F] transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            <span>Return to Catalog</span>
          </NextLink>
          <span className="text-[11px] font-mono text-[#8C7352] uppercase tracking-widest">
            {product.collectionName}
          </span>
        </div>

        {/* Main Product Inspection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Dual 3D Showroom & Editorial Gallery Slider */}
          <div className="lg:col-span-7 space-y-4">
            <div className="h-[490px] sm:h-[580px] lg:h-[650px] rounded-3xl bright-showroom border border-[#E5E0D7] relative overflow-hidden flex flex-col shadow-xs">
              {/* Top Controls Bar */}
              <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7352] px-3 py-1 rounded-full bg-white/92 border border-[#E5E0D7] font-mono font-semibold shadow-2xs">
                    {activeMedia.type === "3d" ? "3D Garment Inspection" : activeMedia.label}
                  </span>

                  {activeMedia.type === "3d" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setAutoRotate(!autoRotate);
                          sounds.playClick();
                        }}
                        className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-xs flex items-center gap-1 transition-colors cursor-pointer ${
                          autoRotate
                            ? "bg-[#25241F] border-[#25241F] text-white"
                            : "bg-white/92 border-[#E5E0D7] text-[#77736C] hover:text-[#25241F]"
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
                        className={`text-xs px-2.5 py-1 rounded-full border backdrop-blur-xs flex items-center gap-1 transition-colors cursor-pointer ${
                          macroZoom
                            ? "bg-[#25241F] border-[#25241F] text-white"
                            : "bg-white/92 border-[#E5E0D7] text-[#77736C] hover:text-[#25241F]"
                        }`}
                      >
                        <ZoomIn size={12} />
                        <span className="text-[10px]">Macro</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMacroZoom(false);
                          setResetTrigger((prev) => prev + 1);
                          sounds.playClick();
                        }}
                        className="text-xs px-2.5 py-1 rounded-full border bg-white/92 border-[#E5E0D7] text-[#77736C] hover:text-[#25241F] hover:border-[#B49A75] backdrop-blur-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="Reset Camera View"
                      >
                        <RotateCcw size={12} />
                        <span className="text-[10px]">Reset View</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setImageZoomed((z) => !z);
                        sounds.playClick();
                      }}
                      className={`text-xs px-3 py-1 rounded-full border backdrop-blur-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                        imageZoomed
                          ? "bg-[#25241F] border-[#25241F] text-white"
                          : "bg-white/92 border-[#E5E0D7] text-[#25241F] hover:border-[#B49A75]"
                      }`}
                    >
                      {imageZoomed ? <ZoomOut size={12} /> : <ZoomIn size={12} />}
                      <span className="text-[10px]">{imageZoomed ? "Reset Framing" : "Inspect Weave"}</span>
                    </button>
                  )}
                </div>

                {/* Gallery Slide Prev / Next Arrows */}
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => selectMediaSlide(activeMediaIndex - 1)}
                    aria-label="Previous media view"
                    className="w-8 h-8 rounded-full bg-white/92 hover:bg-white border border-[#E5E0D7] text-[#25241F] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => selectMediaSlide(activeMediaIndex + 1)}
                    aria-label="Next media view"
                    className="w-8 h-8 rounded-full bg-white/92 hover:bg-white border border-[#E5E0D7] text-[#25241F] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              {/* Active Stage: 3D Showroom or Controlled Zoom Image Gallery */}
              <div className="flex-1 w-full h-full relative overflow-hidden">
                {activeMedia.type === "3d" ? (
                  <ProductInspectorCanvas
                    product={product}
                    activeColorway={selectedColor}
                    autoRotate={autoRotate}
                    macroZoom={macroZoom}
                    resetTrigger={resetTrigger}
                  />
                ) : (
                  <div
                    onPointerDown={(e) => {
                      swipeStartX.current = e.clientX;
                    }}
                    onPointerUp={(e) => {
                      if (swipeStartX.current === null) return;
                      const dx = e.clientX - swipeStartX.current;
                      if (Math.abs(dx) > 45 && !imageZoomed) {
                        selectMediaSlide(dx < 0 ? activeMediaIndex + 1 : activeMediaIndex - 1);
                      }
                      swipeStartX.current = null;
                    }}
                    onMouseMove={handleImageMouseMove}
                    onClick={() => setImageZoomed((z) => !z)}
                    className={`w-full h-full flex items-center justify-center bg-[#F4F1EA] overflow-hidden select-none ${
                      imageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                  >
                    <img
                      key={activeMedia.id}
                      src={activeMedia.src}
                      alt={`${product.name} - ${activeMedia.label}`}
                      style={
                        imageZoomed
                          ? {
                              transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                              transform: "scale(1.65)",
                            }
                          : {
                              transformOrigin: "50% 50%",
                              transform: "scale(1)",
                            }
                      }
                      className="w-full h-full object-contain transition-transform duration-300 ease-out animate-in fade-in"
                    />
                  </div>
                )}
              </div>

              {/* Stage Caption Footer */}
              <div className="p-3 bg-white/90 text-center text-[10px] text-[#77736C] border-t border-[#E5E0D7] flex items-center justify-between px-5">
                <span>
                  {activeMedia.type === "3d"
                    ? "Drag to orbit 360° • Scroll / Pinch to zoom • Full silhouette framed automatically"
                    : imageZoomed
                    ? "Move pointer to inspect micro-weave • Click to return to full garment framing"
                    : "Full garment framed • Click image to inspect weave or swipe for alternate angles"}
                </span>
                <span className="font-mono">
                  0{activeMediaIndex + 1} / 0{galleryItems.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div
              className="grid grid-cols-5 gap-2.5"
              role="tablist"
              aria-label="Product media views"
            >
              {galleryItems.map((item, idx) => {
                const isSelected = idx === activeMediaIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => selectMediaSlide(idx)}
                    className={`group relative h-20 sm:h-24 rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-[#25241F] ring-2 ring-[#B49A75]/50 shadow-xs"
                        : "border-[#E5E0D7] opacity-75 hover:opacity-100 hover:border-[#B49A75]"
                    }`}
                  >
                    <img
                      src={item.thumb}
                      alt={item.label}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#25241F]/70 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[9px] font-mono text-white tracking-wider uppercase flex items-center gap-1 truncate">
                        {item.type === "3d" && <Box size={10} className="text-[#DFD3C0] shrink-0" />}
                        <span className="truncate">{item.label}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sticky Garment Specifications, Actions & Smooth Accordions */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C7352] font-mono font-semibold">
                  {product.collectionName}
                </span>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  className="inline-flex items-center gap-1.5 text-xs text-[#77736C] hover:text-[#25241F] transition-colors cursor-pointer"
                >
                  <Heart
                    size={15}
                    className={`transition-transform duration-200 ${
                      isWishlisted ? "fill-[#B49A75] text-[#8C7352] scale-110" : ""
                    }`}
                  />
                  <span>{isWishlisted ? "Saved in Vault" : "Save"}</span>
                </button>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#25241F] font-medium mt-1">
                {product.name}
              </h1>
              <p className="text-xs text-[#77736C] mt-1 italic">{product.subtitle}</p>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="font-serif text-2xl font-bold text-[#25241F] tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-[#77736C] line-through tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-[10px] font-mono text-[#607B60] ml-auto">
                  ● Tailored to Order • In Stock
                </span>
              </div>
            </div>

            {/* Colorway Selection */}
            <div className="p-4 rounded-2xl bg-white border border-[#E5E0D7] space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#77736C] font-mono block mb-2.5">
                  Tone Colorway: <strong className="text-[#25241F]">{selectedColor.name}</strong>
                </span>
                <div className="flex items-center gap-2.5">
                  {product.colorways.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c);
                        sounds.playClick();
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                        selectedColor.id === c.id
                          ? "border-[#8C7352] ring-2 ring-[#B49A75]/40 scale-110 shadow-xs"
                          : "border-black/15 opacity-75 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={`Select colorway ${c.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="pt-3 border-t border-[#E5E0D7]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#77736C] font-mono">
                    Tailored Size: <strong className="text-[#25241F]">{selectedSize}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAccordions((prev) => ({ ...prev, sizing: true }))
                    }
                    className="text-[11px] text-[#8C7352] hover:text-[#25241F] underline cursor-pointer"
                  >
                    Size & Fit Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSelectedSize(s);
                        sounds.playClick();
                      }}
                      className={`py-2 text-xs rounded-xl font-medium transition-all duration-150 border cursor-pointer ${
                        selectedSize === s
                          ? "bg-[#25241F] text-white border-[#25241F] font-semibold shadow-2xs"
                          : "bg-[#F8F6F1] text-[#25241F] border-[#E5E0D7] hover:border-[#B49A75]"
                      }`}
                    >
                      {s.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Primary Add to Bag Action */}
              <div className="pt-3 border-t border-[#E5E0D7] flex items-center gap-3">
                <div
                  className="flex items-center border border-[#E5E0D7] rounded-full bg-[#F8F6F1] px-3 py-2.5"
                  aria-label="Quantity selector"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((q) => Math.max(1, q - 1));
                      sounds.playClick();
                    }}
                    aria-label="Decrease quantity"
                    className="text-[#77736C] hover:text-[#25241F] p-1 cursor-pointer"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-semibold text-[#25241F] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuantity((q) => q + 1);
                      sounds.playClick();
                    }}
                    aria-label="Increase quantity"
                    className="text-[#77736C] hover:text-[#25241F] p-1 cursor-pointer"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToBag}
                  className={`flex-1 py-3.5 px-6 rounded-full font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer ${
                    addedToBagSuccess
                      ? "bg-[#607B60] text-white"
                      : "bg-[#25241F] hover:bg-[#38362F] active:scale-[0.99] text-white"
                  }`}
                >
                  {addedToBagSuccess ? (
                    <>
                      <Check size={15} />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={15} className="text-[#B49A75]" />
                      <span className="tabular-nums">
                        Add to Bag • {formatPrice(product.price * quantity)}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Secondary Spatial Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    addWardrobeItem(product, selectedColor, selectedSize);
                    setHungSuccess(true);
                    setTimeout(() => setHungSuccess(false), 2500);
                  }}
                  className="py-2.5 rounded-full bg-[#F8F6F1] border border-[#E5E0D7] hover:border-[#B49A75] text-[#25241F] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {hungSuccess ? (
                    <>
                      <Check size={13} className="text-[#607B60]" />
                      <span className="text-[#607B60] font-semibold">Hung on 3D Rail</span>
                    </>
                  ) : (
                    <>
                      <Sliders size={13} className="text-[#8C7352]" />
                      <span>Hang in 3D Wardrobe</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleTryOnAvatar}
                  className="py-2.5 rounded-full bg-[#F8F6F1] border border-[#E5E0D7] hover:border-[#B49A75] text-[#25241F] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles size={13} className="text-[#8C7352]" />
                  <span>Try on 3D Avatar</span>
                </button>
              </div>
            </div>

            {/* Smooth Intrinsic-Size Accordions (animate-to-intrinsic-sizes) */}
            <div className="rounded-2xl bg-white border border-[#E5E0D7] divide-y divide-[#E5E0D7] overflow-hidden">
              {/* Accordion 1: Description & Architectural Notes */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion("description")}
                  aria-expanded={openAccordions.description}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#F8F6F1]/60 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-sm font-medium text-[#25241F]">
                    Description & Architectural Notes
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#8C7352] transition-transform duration-300 ${
                      openAccordions.description ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`expandable-container ${
                    openAccordions.description ? "is-expanded" : ""
                  }`}
                  aria-hidden={!openAccordions.description}
                >
                  <div className="px-5 pb-4 space-y-3 text-xs text-[#77736C] leading-relaxed">
                    <p className="italic text-[#25241F] border-l-2 border-[#B49A75] pl-3">
                      &ldquo;{product.editorialQuote}&rdquo;
                    </p>
                    <p>{product.description}</p>
                  </div>
                </div>
              </div>

              {/* Accordion 2: Materials, Provenance & Fabric Telemetry */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion("materials")}
                  aria-expanded={openAccordions.materials}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#F8F6F1]/60 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-sm font-medium text-[#25241F]">
                    Materials, Provenance & Care
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#8C7352] transition-transform duration-300 ${
                      openAccordions.materials ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`expandable-container ${
                    openAccordions.materials ? "is-expanded" : ""
                  }`}
                  aria-hidden={!openAccordions.materials}
                >
                  <div className="px-5 pb-4 space-y-2 text-xs text-[#77736C]">
                    <div className="flex justify-between py-1 border-b border-[#E5E0D7]/60">
                      <span>Composition</span>
                      <span className="text-[#25241F] font-medium">{product.fabric.composition}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E5E0D7]/60">
                      <span>Mill Origin</span>
                      <span className="text-[#25241F] font-medium">{product.fabric.origin}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E5E0D7]/60">
                      <span>Weight</span>
                      <span className="text-[#25241F] font-mono">{product.fabric.weightGsm} GSM</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E5E0D7]/60">
                      <span>Weave Structure</span>
                      <span className="text-[#25241F] font-medium">{product.fabric.weave}</span>
                    </div>
                    {product.careInstructions && product.careInstructions.length > 0 && (
                      <p className="pt-2 text-[11px] text-[#77736C]">
                        <strong className="text-[#25241F]">Care:</strong>{" "}
                        {product.careInstructions.join(" • ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Accordion 3: Sizing & Fit Guidance */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion("sizing")}
                  aria-expanded={openAccordions.sizing}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#F8F6F1]/60 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-sm font-medium text-[#25241F]">
                    Sizing, Drape & Fit Guidance
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#8C7352] transition-transform duration-300 ${
                      openAccordions.sizing ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`expandable-container ${
                    openAccordions.sizing ? "is-expanded" : ""
                  }`}
                  aria-hidden={!openAccordions.sizing}
                >
                  <div className="px-5 pb-4 space-y-2 text-xs text-[#77736C] leading-relaxed">
                    <p>
                      <strong className="text-[#25241F]">Silhouette Fit:</strong>{" "}
                      Tailored to true European atelier proportions with structured shoulders and fluid hem drape.
                    </p>
                    <p>
                      Available sizes: <span className="text-[#25241F] font-mono">{product.sizes.join(", ")}</span>. Complimentary sleeve and hem adjustments are included with every archival order.
                    </p>
                  </div>
                </div>
              </div>

              {/* Accordion 4: Delivery & White-Glove Packaging */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion("delivery")}
                  aria-expanded={openAccordions.delivery}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#F8F6F1]/60 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-sm font-medium text-[#25241F]">
                    Insured Courier & Archival Packaging
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#8C7352] transition-transform duration-300 ${
                      openAccordions.delivery ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`expandable-container ${
                    openAccordions.delivery ? "is-expanded" : ""
                  }`}
                  aria-hidden={!openAccordions.delivery}
                >
                  <div className="px-5 pb-4 space-y-2 text-xs text-[#77736C] leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <Truck size={15} className="text-[#8C7352] shrink-0 mt-0.5" />
                      <p>
                        Complimentary insured express courier dispatch within 24 hours. Delivered in a breathable linen garment cover with a sculpted oak hanger and NFC authenticity certificate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complimentary Collection Pieces Slider */}
        {complimentaryProducts.length > 0 && (
          <div className="mt-24 pt-14 border-t border-[#E5E0D7]">
            <InteractiveSlider
              eyebrow={product.collectionName}
              title="Complete the Ensemble"
              subtitle="Curated archival creations engineered to layer seamlessly with this silhouette."
            >
              {complimentaryProducts.map((comp) => (
                <FashionProductCard
                  key={comp.id}
                  product={comp}
                  onInspect={(p) => setInspectingProduct(p)}
                />
              ))}
            </InteractiveSlider>
          </div>
        )}

        {/* Recently Viewed Slider */}
        {recentlyViewedProducts.length > 0 && (
          <div className="mt-20 pt-14 border-t border-[#E5E0D7]">
            <InteractiveSlider
              eyebrow="Your Personal Viewing History"
              title="Recently Viewed Creations"
              subtitle="Garments you recently inspected across the VESTRA showroom."
            >
              {recentlyViewedProducts.map((recent) => (
                <FashionProductCard
                  key={`pdp-recent-${recent.id}`}
                  product={recent}
                  onInspect={(p) => setInspectingProduct(p)}
                  compact
                />
              ))}
            </InteractiveSlider>
          </div>
        )}
      </main>

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
