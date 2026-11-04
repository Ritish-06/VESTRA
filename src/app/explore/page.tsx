"use client";

import React, { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import AsymmetricalEditorialShowcase from "@/components/ui/AsymmetricalEditorialShowcase";
import FashionProductCard from "@/components/ui/FashionProductCard";
import InteractiveSlider from "@/components/ui/InteractiveSlider";
import { ORBIT_CAPSULES } from "@/components/ui/FashionOrbitExperience";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { Product } from "@/types/product";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  LayoutGrid,
  Columns,
} from "lucide-react";

const DISCOVERY_FILTERS = [
  { id: "all", label: "All Exhibition Works" },
  { id: "essential-forms", label: "01 / Essential Forms" },
  { id: "after-hours", label: "02 / After Hours" },
  { id: "modern-heritage", label: "03 / Modern Heritage" },
  { id: "future-classics", label: "04 / Future Classics" },
  { id: "outerwear", label: "Outerwear" },
  { id: "tailoring", label: "Tailoring" },
  { id: "tops", label: "Tops & Silks" },
  { id: "trousers", label: "Trousers" },
  { id: "accessories", label: "Accessories" },
];

export default function ExplorePage() {
  const { products, collections } = useCatalog();
  const { recentlyViewedIds } = useWardrobeStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [layoutMode, setLayoutMode] = useState<"editorial" | "index">("editorial");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(500000);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

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
      .filter((p, idx) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.subtitle.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.fabric.weave.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query));

        let matchesCategory = true;
        const capsuleMatch = ORBIT_CAPSULES.find((c) => c.id === selectedFilter);
        if (capsuleMatch) {
          matchesCategory = capsuleMatch.matchFn(p, idx);
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

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
        {/* Architectural Exhibition Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E5E0D7]">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C7352] font-mono block">
              CURATORIAL ARCHIVE // PRODUCT DISCOVERY
            </span>
            <h1 className="text-exhibition-display text-[#25241F] font-normal">
              Asymmetrical Archive
            </h1>
            <p className="text-xs sm:text-sm text-[#77736C] prose-measure">
              Explore garments as large-format editorial plates with dual-angle hover transitions, live colorway and size selection, and instant 3D studio inspection.
            </p>
          </div>

          {/* Layout Mode Switcher (Asymmetrical Editorial vs Compact Index) */}
          <div className="flex items-center gap-2 self-start lg:self-end">
            <div className="inline-flex items-center p-1 rounded-full bg-white border border-[#E5E0D7] shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setLayoutMode("editorial");
                  sounds.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  layoutMode === "editorial"
                    ? "bg-[#25241F] text-white"
                    : "text-[#77736C] hover:text-[#25241F]"
                }`}
              >
                <Columns size={13} />
                <span>Editorial Plates</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLayoutMode("index");
                  sounds.playClick();
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  layoutMode === "index"
                    ? "bg-[#25241F] text-white"
                    : "text-[#77736C] hover:text-[#25241F]"
                }`}
              >
                <LayoutGrid size={13} />
                <span>Archive Index</span>
              </button>
            </div>
          </div>
        </div>

        {/* Discovery Controls: Search, World Filters, Sort & Expandable Refine */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77736C]"
              />
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

            {/* Curatorial World & Category Filter Pills */}
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

            {/* Expandable Refine & Sort */}
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
                onChange={(e) =>
                  setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")
                }
                aria-label="Sort products"
                className="bg-white border border-[#E5E0D7] rounded-full px-3.5 py-2 text-xs text-[#25241F] focus:outline-none focus:border-[#B49A75] shadow-2xs cursor-pointer"
              >
                <option value="featured">Curatorial Order</option>
                <option value="price-asc">Investment: Low to High</option>
                <option value="price-desc">Investment: High to Low</option>
              </select>
            </div>
          </div>

          {/* Smooth Animated Refine Drawer */}
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
                    htmlFor="explore-max-price"
                    className="text-[10px] font-mono uppercase tracking-wider text-[#8C7352]"
                  >
                    Maximum Investment
                  </label>
                  <span className="text-xs font-serif font-bold text-[#25241F] tabular-nums">
                    ₹{maxPriceFilter.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  id="explore-max-price"
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
                  {filteredProducts.length} of {products.length} works
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-3.5 py-2 rounded-full bg-[#F0EDE6] hover:bg-[#E5E0D7] text-[#25241F] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Discovery Showcase: Asymmetrical Editorial Plates vs Compact Archive Index */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E0D7] shadow-2xs space-y-3">
            <p className="font-serif text-lg text-[#25241F]">
              No exhibition works match this selection
            </p>
            <p className="text-xs text-[#77736C]">
              Try adjusting your search query or resetting active curatorial filters.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-2 px-5 py-2.5 rounded-full bg-[#25241F] text-white text-xs font-semibold hover:bg-[#38362F] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : layoutMode === "editorial" ? (
          <AsymmetricalEditorialShowcase
            products={filteredProducts}
            onInspectProduct={(p) => setInspectingProduct(p)}
          />
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

        {/* Recently Viewed Dossier */}
        {recentlyViewedProducts.length > 0 && (
          <div className="pt-14 border-t border-[#E5E0D7]">
            <InteractiveSlider
              eyebrow="Your Viewing Dossier"
              title="Recently Inspected Creations"
              subtitle="Revisit silhouettes from your personal exploration."
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
