"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { Product, ProductCategory, GarmentGeometryType } from "@/types/product";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import {
  Layers,
  Plus,
  Package,
  TrendingUp,
  Sparkles,
  Check,
  Users,
} from "lucide-react";

export default function AdminPage() {
  const { products: catalogProducts, collections } = useCatalog();
  const [productList, setProductList] = useState<Product[]>(catalogProducts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState<{
    productCount: number;
    orderCount: number;
    userCount: number;
    totalRevenue: number;
  }>({
    productCount: catalogProducts.length,
    orderCount: 0,
    userCount: 1,
    totalRevenue: 0,
  });

  // New product form state
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<ProductCategory>("outerwear");
  const [geometryType, setGeometryType] = useState<GarmentGeometryType>("trench_coat");
  const [price, setPrice] = useState("120000");
  const [collectionId, setCollectionId] = useState("nocturne");
  const [composition, setComposition] = useState("100% Cashmere");
  const [weightGsm, setWeightGsm] = useState("320");
  const [createdSuccess, setCreatedSuccess] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.stats) {
            setStats(data.stats);
          }
        }
      } catch {
        // Fallback to local catalog counts
      }
    }
    loadStats();
  }, []);

  const totalValue = productList.reduce((acc, p) => acc + p.price, 0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: Product = {
      id: `vestra-custom-${Date.now()}`,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      subtitle,
      collectionId,
      collectionName: collections.find((c) => c.id === collectionId)?.name || "The Nocturne Atelier",
      category,
      price: parseFloat(price) || 85000,
      description: "Custom commissioned couture design engineered for the digital wardrobe.",
      editorialQuote: "Architectural singularity born from custom commission.",
      details: ["Hand-finished in our Paris atelier", "Archival certification tag included"],
      careInstructions: ["Professional dry clean only"],
      audience: "UNISEX",
      fabric: {
        name: composition,
        composition,
        origin: "Biella, Italy",
        weightGsm: parseInt(weightGsm, 10) || 300,
        textureDescription: "Custom luxury finish with calibrated normal map.",
        weave: "Twill",
        roughness: 0.5,
        metalness: 0.1,
      },
      colorways: [
        { id: "obsidian", name: "Obsidian", hex: "#111114", threeColor: "#111114" },
        { id: "champagne", name: "Champagne", hex: "#dfd2be", threeColor: "#dfd2be" },
      ],
      sizes: ["38 (S)", "40 (M)", "42 (L)"],
      images: {
        hero: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80",
        modelFront: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80",
        modelBack: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
        fabricDetail: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1000&q=80",
        hangerView: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      },
      geometryType,
      threeDimensions: { width: 0.7, height: 1.2, depth: 0.3 },
      rating: 5.0,
      reviewCount: 1,
      tags: ["Haute Couture", "Bespoke", "New"],
    };

    setProductList([newProd, ...productList]);
    setCreatedSuccess(true);
    sounds.playChime();

    setTimeout(() => {
      setCreatedSuccess(false);
      setShowAddModal(false);
      setName("");
      setSubtitle("");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#1C1917]/[0.08]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono">
              Atelier Command Centre
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-medium mt-1">
              Atelier Management Dashboard
            </h1>
          </div>

          <button
            onClick={() => {
              setShowAddModal(true);
              sounds.playClick();
            }}
            className="px-5 py-3 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus size={15} className="text-[#C5A880]" />
            <span>Commission New Piece</span>
          </button>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <div className="p-6 rounded-2xl atelier-card">
            <div className="flex justify-between items-center text-[#78716C] mb-2">
              <span className="text-xs uppercase font-mono tracking-wider">Archived Pieces</span>
              <Layers size={16} className="text-[#9A7B4F]" />
            </div>
            <span className="font-serif text-3xl font-medium text-[#1C1917]">
              {stats.productCount || productList.length}
            </span>
            <span className="text-[11px] text-[#78716C] block mt-1">
              Active GLTF & procedural garments
            </span>
          </div>

          <div className="p-6 rounded-2xl atelier-card">
            <div className="flex justify-between items-center text-[#78716C] mb-2">
              <span className="text-xs uppercase font-mono tracking-wider">Orders Dispatched</span>
              <Package size={16} className="text-[#9A7B4F]" />
            </div>
            <span className="font-serif text-3xl font-medium text-[#1C1917]">
              {stats.orderCount}
            </span>
            <span className="text-[11px] text-[#78716C] block mt-1">
              Recorded in PostgreSQL
            </span>
          </div>

          <div className="p-6 rounded-2xl atelier-card">
            <div className="flex justify-between items-center text-[#78716C] mb-2">
              <span className="text-xs uppercase font-mono tracking-wider">Memberships</span>
              <Users size={16} className="text-[#9A7B4F]" />
            </div>
            <span className="font-serif text-3xl font-medium text-[#1C1917]">
              {stats.userCount}
            </span>
            <span className="text-[11px] text-[#78716C] block mt-1">
              Private client credentials
            </span>
          </div>

          <div className="p-6 rounded-2xl atelier-card">
            <div className="flex justify-between items-center text-[#78716C] mb-2">
              <span className="text-xs uppercase font-mono tracking-wider">Catalog Valuation</span>
              <TrendingUp size={16} className="text-[#9A7B4F]" />
            </div>
            <span className="font-serif text-3xl font-medium text-[#9A7B4F]">
              {formatPrice(totalValue)}
            </span>
            <span className="text-[11px] text-[#78716C] block mt-1">
              Cumulative pieces valuation
            </span>
          </div>
        </div>

        {/* Product Inventory Table */}
        <div className="atelier-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1C1917]/[0.06]">
            <div>
              <h2 className="font-serif text-xl font-medium text-[#1C1917]">
                Master Garment Inventory
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Inspect 3D geometries, fabric metadata and price points.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#78716C]">
              <thead className="text-[10px] uppercase font-mono text-[#9A7B4F] border-b border-[#1C1917]/[0.08]">
                <tr>
                  <th className="pb-3">Garment</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">3D Mesh Type</th>
                  <th className="pb-3">Fabric Composition</th>
                  <th className="pb-3">Investment</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1917]/[0.04]">
                {productList.map((product) => (
                  <tr key={product.id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images.hero || product.images.modelFront}
                          alt={product.name}
                          className="w-10 h-12 rounded object-cover border border-[#1C1917]/10"
                        />
                        <div>
                          <span className="font-serif text-sm text-[#1C1917] font-medium block">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-[#78716C] italic">{product.subtitle}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 font-mono text-[11px] uppercase">
                      {product.category}
                    </td>
                    <td className="py-4 pr-4 font-mono text-[11px] text-[#9A7B4F]">
                      {product.geometryType}
                    </td>
                    <td className="py-4 pr-4 text-[11px]">
                      {product.fabric.name} ({product.fabric.weightGsm} GSM)
                    </td>
                    <td className="py-4 pr-4 font-serif text-sm font-semibold text-[#1C1917]">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active in 3D Rail
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg p-8 rounded-3xl bg-white border border-[#1C1917]/10 shadow-2xl space-y-6">
              <h3 className="font-serif text-2xl text-[#1C1917]">Commission Archival Piece</h3>

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#78716C] mb-1">Garment Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sovereign Imperial Trench"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1C1917]/15 rounded-xl px-3.5 py-2 text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#78716C] mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProductCategory)}
                      className="w-full bg-[#FAF8F5] border border-[#1C1917]/15 rounded-xl px-3 py-2 text-[#1C1917] focus:outline-none"
                    >
                      <option value="outerwear">Outerwear</option>
                      <option value="tailoring">Tailoring</option>
                      <option value="tops">Tops</option>
                      <option value="trousers">Trousers</option>
                      <option value="dresses">Dresses</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#78716C] mb-1">3D Mesh Geometry</label>
                    <select
                      value={geometryType}
                      onChange={(e) => setGeometryType(e.target.value as GarmentGeometryType)}
                      className="w-full bg-[#FAF8F5] border border-[#1C1917]/15 rounded-xl px-3 py-2 text-[#1C1917] focus:outline-none"
                    >
                      <option value="trench_coat">Trench Coat</option>
                      <option value="tailored_blazer">Tailored Blazer</option>
                      <option value="silk_shirt">Silk Shirt</option>
                      <option value="pleated_trouser">Pleated Trouser</option>
                      <option value="evening_gown">Evening Gown</option>
                      <option value="leather_jacket">Leather Biker</option>
                      <option value="knit_sweater">Cloud Cashmere</option>
                      <option value="minimalist_vest">Utility Gilet</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#78716C] mb-1">Price (INR)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#1C1917]/15 rounded-xl px-3.5 py-2 text-[#1C1917] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#78716C] mb-1">Fabric Weight (GSM)</label>
                    <input
                      type="number"
                      value={weightGsm}
                      onChange={(e) => setWeightGsm(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#1C1917]/15 rounded-xl px-3.5 py-2 text-[#1C1917] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full bg-[#1C1917] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#2A2725] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {createdSuccess ? <Check size={14} className="text-[#C5A880]" /> : <Plus size={14} className="text-[#C5A880]" />}
                    <span>{createdSuccess ? "Piece Registered" : "Save & Render in 3D"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-3 rounded-full bg-[#FAF8F5] text-[#78716C] hover:text-[#1C1917] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
