"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import FashionProductCard from "@/components/ui/FashionProductCard";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { PRODUCTS } from "@/data/products";
import { Product, ProductCategory } from "@/types/product";
import { Search, SlidersHorizontal, X } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { products } = useCatalog();
  const catalogList = products.length > 0 ? products : PRODUCTS;

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  const categories: { id: ProductCategory | "all"; label: string }[] = [
    { id: "all", label: "All Categories" },
    { id: "outerwear", label: "Outerwear" },
    { id: "tailoring", label: "Tailoring" },
    { id: "tops", label: "Tops & Knitwear" },
    { id: "trousers", label: "Trousers" },
    { id: "dresses", label: "Evening Couture" },
    { id: "accessories", label: "Accessories" },
  ];

  const filteredResults = useMemo(() => {
    let list = catalogList;
    const q = searchQuery.trim().toLowerCase();

    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.collectionName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric.name.toLowerCase().includes(q) ||
          p.fabric.composition.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    return list;
  }, [catalogList, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col justify-between selection:bg-[#B49A75]/25 selection:text-[#25241F]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-10">
        {/* Search Header & Input */}
        <div className="space-y-6 max-w-3xl mx-auto text-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#8C7352]">
            ARCHIVE SEARCH // CATALOG QUERY
          </span>
          <h1 className="text-exhibition-title text-[#25241F] font-normal">
            Find Garments, Fabrics & Silhouettes
          </h1>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#77736C]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by piece name, fabric (silk, cashmere, wool), or collection..."
              className="w-full pl-12 pr-12 py-4 rounded-full bg-white border border-[#E5E0D7] text-sm text-[#25241F] placeholder:text-[#77736C] focus:outline-none focus:border-[#B49A75] shadow-xs transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#77736C] hover:text-[#25241F] cursor-pointer"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills & Count */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E5E0D7] pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#25241F] text-[#F8F6F1] font-semibold"
                    : "bg-white border border-[#E5E0D7] text-[#77736C] hover:text-[#25241F]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-[#77736C] shrink-0">
            {filteredResults.length} {filteredResults.length === 1 ? "Piece" : "Pieces"} Located
          </div>
        </div>

        {/* Results Grid */}
        {filteredResults.length === 0 ? (
          <div className="py-24 text-center rounded-3xl bg-white border border-[#E5E0D7] p-8 max-w-md mx-auto space-y-3">
            <SlidersHorizontal size={28} className="mx-auto text-[#B49A75]" />
            <h3 className="font-serif text-xl text-[#25241F]">No Silhouettes Matched</h3>
            <p className="text-xs text-[#77736C]">
              We couldn&apos;t find any items matching &ldquo;{searchQuery}&rdquo;. Try searching for &ldquo;trench&rdquo;, &ldquo;silk&rdquo;, &ldquo;cashmere&rdquo;, or reset your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-2 px-5 py-2 rounded-full bg-[#25241F] text-[#F8F6F1] text-xs uppercase tracking-wider font-semibold cursor-pointer"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredResults.map((product) => (
              <FashionProductCard
                key={product.id}
                product={product}
                onInspect={() => setInspectingProduct(product)}
              />
            ))}
          </div>
        )}
      </main>

      {inspectingProduct && (
        <ProductInspectorModal
          product={inspectingProduct}
          onClose={() => setInspectingProduct(null)}
          initialColor={inspectingProduct.colorways[0]}
        />
      )}

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#B49A75]/30 border-t-[#B49A75] animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
