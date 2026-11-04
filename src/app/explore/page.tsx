"use client";

import React, { useState, useMemo, useEffect } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import FashionProductCard from "@/components/ui/FashionProductCard";
import InteractiveSlider from "@/components/ui/InteractiveSlider";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { Product } from "@/types/product";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";
import {
  Search,
  ArrowRight,
  SlidersHorizontal,
  RotateCcw,
  X,
} from "lucide-react";

const DISCOVERY_FILTERS = [
  { id: "all", label: "All Works" },
  { id: "new", label: "New Arrivals" },
  { id: "women", label: "Women & Dresses" },
  { id: "men", label: "Men" },
  { id: "outerwear", label: "Outerwear" },
  { id: "tailoring", label: "Tailoring" },
  { id: "tops", label: "Tops & Silks" },
  { id: "trousers", label: "Trousers" },
  { id: "accessories", label: "Accessories" },
  { id: "seasonal", label: "Seasonal" },
];

export default function ExplorePage() {
  const { products, collections } = useCatalog();
  const { recentlyViewedIds } = useWardrobeStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(500000);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  // Sync initial filter from query string if navigated from category slider
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const f = params.get("filter");
    const q = params.get("q");
    if (f && DISCOVERY_FILTERS.some((d) => d.id === f)) {
      setSelectedFilter(f);
    }
    if (q) {
      setSearchQuery(q);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.subtitle.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.fabric.weave.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query));

        let matchesCategory = true;
        if (selectedFilter === "new") {
          matchesCategory = Boolean(p.isNew);
        } else if (selectedFilter === "women") {
          matchesCategory = p.audience === "WOMEN" || p.audience === "UNISEX";
        } else if (selectedFilter === "men") {
          matchesCategory = p.audience === "MEN" || p.audience === "UNISEX";
        } else if (selectedFilter === "outerwear") {
          matchesCategory = p.category === "outerwear";
        } else if (selectedFilter === "tailoring") {
          matchesCategory = p.category === "tailoring";
        } else if (selectedFilter === "tops") {
          matchesCategory = p.category === "tops";
        } else if (selectedFilter === "trousers") {
          matchesCategory = p.category === "trousers";
        } else if (selectedFilter === "accessories") {
          matchesCategory = p.category === "accessories" || p.category === "footwear";
        } else if (selectedFilter === "seasonal") {
          matchesCategory = p.tags.includes("Seasonal") || p.collectionId === "nocturne";
        }

        const matchesCollection =
          selectedCollection === "all" || p.collectionId === selectedCollection;

        const matchesPrice = p.price <= maxPriceFilter;

        return matchesSearch && matchesCategory && matchesCollection && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [products, searchQuery, selectedFilter, selectedCollection, sortBy, maxPriceFilter]);

  const recentlyViewedProducts = useMemo(() => {
    return (recentlyViewedIds || [])
      .map((id) => products.find((p) => p.id === id || p.slug === id))
      .filter(Boolean) as Product[];
  }, [recentlyViewedIds, products]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedFilter("all");
    setSelectedCollection("all");
    setSortBy("featured");
    setMaxPriceFilter(500000);
    sounds.playClick();
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedFilter !== "all" ||
    selectedCollection !== "all" ||
    maxPriceFilter < 500000;

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
        {/* Editorial Heading */}
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 pb-8 border-b border-[#E5E0D7]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C7352] font-mono">
              Haute Couture Discovery
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#25241F] font-medium mt-1">
              Explore Collections
            </h1>
          </div>
          <p className="text-xs text-[#77736C] max-w-md leading-relaxed">
            Every garment in the VESTRA atelier is engineered with precision architectural tailoring, physical fabric textures, and interactive 3D spatial rails.
          </p>
        </div>

        {/* Horizontal Collections Banner Row */}
        <div className="pb-6 border-b border-[#E5E0D7]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7352]">
              Current Atelier Drops
            </span>
            <NextLink
              href="/collections"
              className="text-[11px] text-[#77736C] hover:text-[#25241F] flex items-center gap-1 transition-colors"
            >
              <span>View Lookbooks</span>
              <ArrowRight size={12} />
            </NextLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {collections.map((col) => {
              const isSelected = selectedCollection === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => {
                    setSelectedCollection(isSelected ? "all" : col.id);
                    sounds.playClick();
                  }}
                  aria-pressed={isSelected}
                  className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? "border-[#B49A75] bg-[#F0EDE6] shadow-xs"
                      : "border-[#E5E0D7] bg-white hover:border-[#B49A75]"
                  }`}
                >
                  <div className="relative z-10">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C7352]">
                      {col.season}
                    </span>
                    <h2 className="font-serif text-base font-medium text-[#25241F] mt-0.5">
                      {col.name}
                    </h2>
                    <p className="text-[11px] text-[#77736C] line-clamp-1 mt-1">
                      {col.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter and Search Bar Dock */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77736C]" />
              <input
                type="text"
                placeholder="Search silk, gabardine, cashmere..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E5E0D7] rounded-full pl-10 pr-9 py-2.5 text-xs text-[#25241F] placeholder-[#77736C] focus:outline-none focus:border-[#B49A75] shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77736C] hover:text-[#25241F] cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Discovery Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 vestra-carousel">
              {DISCOVERY_FILTERS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(cat.id);
                    sounds.playClick();
                  }}
                  aria-pressed={selectedFilter === cat.id}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedFilter === cat.id
                      ? "bg-[#25241F] text-white font-semibold shadow-2xs"
                      : "bg-white text-[#77736C] hover:text-[#25241F] border border-[#E5E0D7] hover:border-[#B49A75]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Expandable Filter Drawer Toggle & Sort */}
            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                type="button"
                onClick={() => {
                  setFiltersOpen((prev) => !prev);
                  sounds.playClick();
                }}
                aria-expanded={filtersOpen}
                className={`px-3.5 py-2 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  filtersOpen
                    ? "bg-[#25241F] text-white border-[#25241F]"
                    : "bg-white text-[#25241F] border-[#E5E0D7] hover:border-[#B49A75]"
                }`}
              >
                <SlidersHorizontal size={13} />
                <span>Refine</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")}
                aria-label="Sort products"
                className="bg-white border border-[#E5E0D7] rounded-full px-3.5 py-2 text-xs text-[#25241F] focus:outline-none focus:border-[#B49A75] shadow-2xs cursor-pointer"
              >
                <option value="featured">Featured Archive</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Smooth Animated Filter Drawer (animate-to-intrinsic-sizes) */}
          <div
            className={`expandable-container ${filtersOpen ? "is-expanded" : ""}`}
            aria-hidden={!filtersOpen}
          >
            <div className="p-5 rounded-2xl bg-white border border-[#E5E0D7] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#8C7352] block mb-2">
                  Atelier Capsule Drop
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full bg-[#F8F6F1] border border-[#E5E0D7] rounded-xl px-3.5 py-2 text-xs text-[#25241F] focus:outline-none focus:border-[#B49A75]"
                >
                  <option value="all">All Seasonal Drops</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name} ({col.season})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="max-price-slider"
                    className="text-[10px] font-mono uppercase tracking-wider text-[#8C7352]"
                  >
                    Maximum Investment
                  </label>
                  <span className="text-xs font-serif font-bold text-[#25241F] tabular-nums">
                    ₹{maxPriceFilter.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  id="max-price-slider"
                  type="range"
                  min={50000}
                  max={500000}
                  step={10000}
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#25241F] cursor-pointer"
                />
              </div>

              <div className="flex items-end justify-between sm:justify-end gap-3">
                <span className="text-xs text-[#77736C] font-mono tabular-nums">
                  Showing {filteredProducts.length} of {products.length} pieces
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-3.5 py-2 rounded-full bg-[#F0EDE6] hover:bg-[#E5E0D7] text-[#25241F] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>Reset All</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E0D7] shadow-2xs space-y-3">
            <p className="font-serif text-lg text-[#25241F]">No archival pieces match this selection</p>
            <p className="text-xs text-[#77736C]">
              Try adjusting your search criteria or resetting active filters.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#25241F] text-white text-xs font-semibold hover:bg-[#38362F] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => (
              <FashionProductCard
                key={product.id}
                product={product}
                priority={idx < 2}
                onInspect={(p) => setInspectingProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Recently Viewed Slider */}
        {recentlyViewedProducts.length > 0 && (
          <div className="pt-14 border-t border-[#E5E0D7]">
            <InteractiveSlider
              eyebrow="Your Viewing Dossier"
              title="Recently Viewed Creations"
              subtitle="Revisit garments you have inspected across the showroom."
            >
              {recentlyViewedProducts.map((product) => (
                <FashionProductCard
                  key={`explore-recent-${product.id}`}
                  product={product}
                  onInspect={(p) => setInspectingProduct(p)}
                  compact
                />
              ))}
            </InteractiveSlider>
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
