"use client";

import React, { useState } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { PRODUCTS, COLLECTIONS } from "@/data/products";
import { Product, ProductCategory, GarmentGeometryType } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { sounds } from "@/utils/soundEffects";
import {
  Layers,
  Plus,
  Package,
  TrendingUp,
  DollarSign,
  Sparkles,
  Check,
} from "lucide-react";

export default function AdminPage() {
  const { orders } = useCartStore();
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<ProductCategory>("outerwear");
  const [geometryType, setGeometryType] = useState<GarmentGeometryType>("trench_coat");
  const [price, setPrice] = useState("1200");
  const [collectionId, setCollectionId] = useState("nocturne");
  const [composition, setComposition] = useState("100% Cashmere");
  const [weightGsm, setWeightGsm] = useState("320");
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const totalValue = productList.reduce((acc, p) => acc + p.price, 0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: Product = {
      id: `vestra-custom-${Date.now()}`,
      name,
      subtitle,
      collectionId,
      collectionName: COLLECTIONS.find((c) => c.id === collectionId)?.name || "The Nocturne Atelier",
      category,
      price: parseFloat(price) || 1000,
      description: "Custom commissioned couture design engineered for the digital wardrobe.",
      editorialQuote: "Architectural singularity born from custom commission.",
      details: ["Hand-finished in our Paris atelier", "Archival certification tag included"],
      fabric: {
        name: composition,
        composition,
        origin: "Biella, Italy",
        weightGsm: parseInt(weightGsm, 10) || 300,
        textureDescription: "Custom luxury finish with calibrated normal map.",
        weave: "Twill",
        roughness: 0.5,
        metalness: 0.1,
        sheen: 0.3,
      },
      colorways: [
        { id: "noir", name: "Midnight Noir", hex: "#111116", threeColor: "#111116" },
        { id: "champagne", name: "Brushed Champagne", hex: "#c5a880", threeColor: "#c5a880" },
      ],
      sizes: ["46 (S)", "48 (M)", "50 (L)"],
      images: {
        hero: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80",
        modelFront: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80",
        modelBack: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
        fabricDetail: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1000&q=80",
        hangerView: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      },
      geometryType,
      threeDimensions: { width: 0.65, height: 1.0, depth: 0.3 },
      rating: 5.0,
      reviewCount: 1,
      tags: ["Custom", "Commission"],
    };

    setProductList([newProd, ...productList]);
    setCreatedSuccess(true);
    sounds.playChime();
    setTimeout(() => {
      setCreatedSuccess(false);
      setShowAddModal(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-10">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pb-8 border-b border-[#1C1917]/[0.08]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono">
              Atelier Management Console
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1917] font-medium mt-1">
              Backstage Operations
            </h1>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-white text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus size={15} className="text-[#C5A880]" />
            <span>Commission New Garment</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl atelier-card">
            <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-mono">
              Archival Designs
            </span>
            <p className="font-serif text-3xl text-[#1C1917] font-bold mt-2">
              {productList.length}
            </p>
          </div>

          <div className="p-6 rounded-2xl atelier-card">
            <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-mono">
              Active Collections
            </span>
            <p className="font-serif text-3xl text-[#9A7B4F] font-bold mt-2">
              {COLLECTIONS.length}
            </p>
          </div>

          <div className="p-6 rounded-2xl atelier-card">
            <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-mono">
              Total Catalog Valuation
            </span>
            <p className="font-serif text-3xl text-[#1C1917] font-bold mt-2">
              ${totalValue.toLocaleString()}
            </p>
          </div>

          <div className="p-6 rounded-2xl atelier-card">
            <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-mono">
              Client Acquisitions
            </span>
            <p className="font-serif text-3xl text-emerald-700 font-bold mt-2">
              {orders.length + 1}
            </p>
          </div>
        </div>

        {/* Product Inventory Table */}
        <div className="p-6 rounded-3xl atelier-card space-y-4">
          <h2 className="font-serif text-xl text-[#1C1917] font-medium">
            Active 3D Wardrobe Inventory
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-mono text-[#78716C] border-b border-[#1C1917]/[0.08]">
                <tr>
                  <th className="pb-3">Garment</th>
                  <th className="pb-3">Collection</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">3D Rig</th>
                  <th className="pb-3">Material GSM</th>
                  <th className="pb-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1917]/[0.06] text-[#78716C]">
                {productList.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]">
                    <td className="py-3.5 pr-4 flex items-center gap-3">
                      <div
                        className="w-9 h-11 rounded bg-white overflow-hidden shrink-0 border border-[#1C1917]/[0.08]"
                        style={{ width: "36px", height: "44px" }}
                      >
                        <img
                          src={p.images.hero}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <span className="font-serif text-[#1C1917] font-medium block">{p.name}</span>
                        <span className="text-[10px] text-[#78716C]">#{p.id}</span>
                      </div>
                    </td>
                    <td className="py-3.5">{p.collectionName}</td>
                    <td className="py-3.5 capitalize">{p.category}</td>
                    <td className="py-3.5 font-mono text-[11px] text-[#9A7B4F] font-semibold">{p.geometryType}</td>
                    <td className="py-3.5 font-mono text-[#1C1917]">{p.fabric.weightGsm} GSM</td>
                    <td className="py-3.5 text-right font-serif font-bold text-[#1C1917]">
                      ${p.price.toLocaleString()}
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
                    <label className="block text-[#78716C] mb-1">Price (USD)</label>
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

