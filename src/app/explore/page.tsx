"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import { PRODUCTS, COLLECTIONS } from "@/data/products";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";
import {
  Search,
  Eye,
  ShoppingBag,
  Heart,
  Sliders,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function ExplorePage() {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWardrobeStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  const categories = [
    { id: "all", label: "All Collections" },
    { id: "new_arrivals", label: "New Arrivals" },
    { id: "outerwear", label: "Outerwear & Coats" },
    { id: "tailoring", label: "Tailoring & Suiting" },
    { id: "tops", label: "Silk & Knitwear" },
    { id: "trousers", label: "Trousers" },
    { id: "dresses", label: "Evening Couture" },
    { id: "streetwear", label: "Technical Avant-Garde" },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesCategory = true;
      if (selectedCategory === "new_arrivals") {
        matchesCategory = Boolean(p.isNew);
      } else if (selectedCategory === "streetwear") {
        matchesCategory = p.category === "outerwear" && p.geometryType === "minimalist_vest";
      } else if (selectedCategory !== "all") {
        matchesCategory = p.category === selectedCategory;
      }

      const matchesCollection =
        selectedCollection === "all" || p.collectionId === selectedCollection;

      return matchesSearch && matchesCategory && matchesCollection;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedCollection, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Editorial Heading */}
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 pb-8 border-b border-[#1C1917]/[0.08]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono">
              Haute Couture Catalog
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1917] font-medium mt-1">
              The VESTRA Archive
            </h1>
          </div>
          <p className="text-xs text-[#78716C] max-w-md">
            Every garment in our catalog is engineered with precision tailoring, tactile fabric metadata, and interactive 3D spatial geometry.
          </p>
        </div>

        {/* Filter and Search Bar Dock */}
        <div className="my-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
            <input
              type="text"
              placeholder="Search by silhouette, cashmere, silk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#1C1917]/10 rounded-full pl-10 pr-4 py-2.5 text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#C5A880] shadow-sm"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  sounds.playClick();
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#1C1917] text-[#FAF8F5] font-semibold shadow-sm"
                    : "bg-white text-[#78716C] hover:text-[#1C1917] border border-[#1C1917]/[0.08] hover:border-[#1C1917]/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Collection & Sorting Selectors */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="bg-white border border-[#1C1917]/10 rounded-full px-3.5 py-2 text-xs text-[#78716C] focus:outline-none focus:border-[#C5A880] shadow-sm cursor-pointer"
            >
              <option value="all">All Drops</option>
              {COLLECTIONS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")}
              className="bg-white border border-[#1C1917]/10 rounded-full px-3.5 py-2 text-xs text-[#78716C] focus:outline-none focus:border-[#C5A880] shadow-sm cursor-pointer"
            >
              <option value="featured">Featured Archive</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#1C1917]/[0.06] shadow-sm">
            <p className="font-serif text-lg text-[#1C1917]">No archival pieces found</p>
            <p className="text-xs text-[#78716C] mt-1">
              Try adjusting your search criteria or resetting filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="group rounded-2xl bg-white border border-[#1C1917]/[0.08] hover:border-[#C5A880] transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[3/4] w-full bg-[#18181e] overflow-hidden">
                    <img
                      src={product.images.hero}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Collection Tag */}
                    <span className="absolute top-3 left-3 text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#9A7B4F] border border-[#1C1917]/10 font-mono font-medium shadow-sm">
                      {product.collectionName.split(" ")[1] || product.collectionName}
                    </span>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-[#1C1917]/10 flex items-center justify-center text-[#1C1917] hover:text-[#9A7B4F] transition-colors shadow-sm cursor-pointer"
                      aria-label="Save to wishlist"
                    >
                      <Heart
                        size={14}
                        className={isWishlisted ? "fill-[#C5A880] text-[#9A7B4F]" : ""}
                      />
                    </button>

                    {/* Floating Hover 3D Peek Action Pill */}
                    <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => {
                          setInspectingProduct(product);
                          sounds.playGarmentInspect();
                        }}
                        className="flex-1 py-2.5 rounded-full bg-[#1C1917]/95 backdrop-blur-md border border-[#1C1917] hover:bg-[#2A2725] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-lg cursor-pointer"
                      >
                        <Eye size={13} className="text-[#C5A880]" />
                        <span>Inspect in 3D</span>
                      </button>

                      <button
                        onClick={() => {
                          addItem(product, product.colorways[0], product.sizes[0], 1);
                        }}
                        className="w-10 h-10 rounded-full bg-[#C5A880] hover:bg-[#E6D5B8] text-[#1C1917] flex items-center justify-center transition-colors shadow-lg flex-shrink-0 cursor-pointer"
                        title="Quick Add to Bag"
                      >
                        <ShoppingBag size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#78716C]">
                        <span>{product.fabric.weave}</span>
                        <span className="font-mono">{product.fabric.weightGsm} GSM</span>
                      </div>

                      <h3 className="font-serif text-base text-[#1C1917] font-medium mt-1 group-hover:text-[#9A7B4F] transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-[11px] text-[#78716C] mt-0.5 line-clamp-1 italic">
                        {product.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#1C1917]/[0.06] flex items-center justify-between">
                      {/* Color dots */}
                      <div className="flex items-center gap-1.5">
                        {product.colorways.map((col) => (
                          <span
                            key={col.id}
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: col.hex }}
                            title={col.name}
                          />
                        ))}
                      </div>

                      <span className="font-serif text-sm font-bold text-[#1C1917]">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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
