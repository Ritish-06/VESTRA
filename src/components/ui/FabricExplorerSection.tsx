"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { Product } from "@/types/product";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import { Layers, Eye, ArrowUpRight, Sparkles } from "lucide-react";

interface FabricExplorerSectionProps {
  products: Product[];
  onInspectProduct?: (product: Product) => void;
}

export default function FabricExplorerSection({
  products,
  onInspectProduct,
}: FabricExplorerSectionProps) {
  const { recordProductView } = useWardrobeStore();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50, active: false });

  const showcaseItems = products.slice(0, 4);
  const currentProduct = showcaseItems[selectedIdx] || products[0];

  if (!currentProduct) return null;

  const macroImage =
    currentProduct.images?.fabricDetail ||
    currentProduct.images?.modelFront ||
    currentProduct.images?.hero;

  const sheenPercent = Math.round((currentProduct.fabric.sheen ?? 0.4) * 100);
  const structurePercent = Math.min(100, Math.round((currentProduct.fabric.weightGsm / 550) * 100));
  const mattePercent = Math.round((currentProduct.fabric.roughness ?? 0.5) * 100);

  return (
    <section
      aria-label="Atelier Fabric and Materiality Explorer"
      className="w-full py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E5E0D7]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-[#8C7352]">
            <Layers size={13} className="text-[#B49A75]" />
            <span>MATERIAL PROVENANCE // FABRIC EXPLORER</span>
          </div>
          <h2 className="text-exhibition-title text-[#25241F] font-normal">
            Tactile Micro-Weave & Shader Telemetry
          </h2>
        </div>
        <p className="text-xs text-[#77736C] max-w-md leading-relaxed">
          Move your cursor across the macro textile specimen to inspect weave grain at 1.8x magnification, or switch textiles to compare GSM density and origin mills.
        </p>
      </div>

      {/* Main Interactive Textile Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left 4 Columns: Textile Specimen Index */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3">
          {showcaseItems.map((item, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedIdx(idx);
                  sounds.playClick();
                }}
                className={`p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? "bg-[#25241F] text-white border-[#25241F] shadow-md"
                    : "bg-white text-[#25241F] border-[#E5E0D7] hover:border-[#B49A75]"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <span
                    className={`text-[9px] font-mono uppercase tracking-widest block ${
                      isSelected ? "text-[#DFD3C0]" : "text-[#8C7352]"
                    }`}
                  >
                    SPECIMEN 0{idx + 1} • {item.fabric.weightGsm} GSM
                  </span>
                  <h3 className="font-serif text-base font-medium truncate">
                    {item.fabric.weave}
                  </h3>
                  <p
                    className={`text-[11px] truncate ${
                      isSelected ? "text-white/75" : "text-[#77736C]"
                    }`}
                  >
                    {item.fabric.composition} • {item.fabric.origin}
                  </p>
                </div>
                <span
                  className="w-5 h-5 rounded-full border border-white/25 shrink-0 mt-1"
                  style={{ backgroundColor: item.colorways[0]?.hex || "#25241F" }}
                />
              </button>
            );
          })}
        </div>

        {/* Center 5 Columns: Interactive Macro Loupe Viewport */}
        <div
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setLoupePos({ x, y, active: true });
          }}
          onMouseLeave={() => setLoupePos((prev) => ({ ...prev, active: false }))}
          className="lg:col-span-5 relative min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-[#E5E0D7] bg-[#F0EDE6] cursor-crosshair select-none group"
        >
          <img
            src={macroImage}
            alt={`${currentProduct.fabric.weave} macro specimen`}
            style={
              loupePos.active
                ? {
                    transformOrigin: `${loupePos.x}% ${loupePos.y}%`,
                    transform: "scale(1.75)",
                  }
                : {
                    transformOrigin: "50% 50%",
                    transform: "scale(1.04)",
                  }
            }
            className="w-full h-full object-cover transition-transform duration-300 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#25241F]/70 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-white/92 backdrop-blur-md border border-[#E5E0D7] text-[10px] font-mono uppercase tracking-wider text-[#25241F]">
              {loupePos.active ? "1.75x Macro Loupe Active" : "Hover to Magnify Weave"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#25241F]/85 text-white text-[10px] font-mono">
              {currentProduct.fabric.origin}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#DFD3C0] block">
              {currentProduct.fabric.composition}
            </span>
            <h4 className="font-serif text-xl font-medium mt-0.5">
              {currentProduct.fabric.weave}
            </h4>
          </div>
        </div>

        {/* Right 3 Columns: Shader Telemetry & Associated Garment */}
        <div className="lg:col-span-3 rounded-3xl bg-white border border-[#E5E0D7] p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#8C7352]">
              <Sparkles size={12} className="text-[#B49A75]" />
              <span>Physical Telemetry</span>
            </span>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#77736C]">Structural Density</span>
                  <span className="font-mono text-[#25241F] tabular-nums">
                    {currentProduct.fabric.weightGsm} GSM
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#F0EDE6] overflow-hidden">
                  <div
                    className="h-full bg-[#25241F] rounded-full transition-all duration-300"
                    style={{ width: `${structurePercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#77736C]">Surface Luster / Sheen</span>
                  <span className="font-mono text-[#25241F] tabular-nums">{sheenPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#F0EDE6] overflow-hidden">
                  <div
                    className="h-full bg-[#B49A75] rounded-full transition-all duration-300"
                    style={{ width: `${sheenPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#77736C]">Tactile Grain / Matte</span>
                  <span className="font-mono text-[#25241F] tabular-nums">{mattePercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#F0EDE6] overflow-hidden">
                  <div
                    className="h-full bg-[#8C7352] rounded-full transition-all duration-300"
                    style={{ width: `${mattePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Crafted Garment Reference */}
          <div className="pt-4 border-t border-[#E5E0D7] space-y-3">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#77736C] block">
              Featured Silhouette in This Textile
            </span>

            <NextLink
              href={`/product/${currentProduct.slug || currentProduct.id}`}
              onClick={() => recordProductView(currentProduct.id)}
              className="group block"
            >
              <h4 className="font-serif text-base text-[#25241F] font-medium group-hover:text-[#8C7352] transition-colors flex items-center justify-between">
                <span className="truncate">{currentProduct.name}</span>
                <ArrowUpRight size={14} className="text-[#B49A75] shrink-0" />
              </h4>
              <span className="font-serif text-xs font-bold text-[#25241F] block mt-0.5 tabular-nums">
                {formatPrice(currentProduct.price)}
              </span>
            </NextLink>

            {onInspectProduct && (
              <button
                type="button"
                onClick={() => {
                  recordProductView(currentProduct.id);
                  onInspectProduct(currentProduct);
                  sounds.playGarmentInspect();
                }}
                className="w-full py-2.5 px-4 rounded-full bg-[#25241F] hover:bg-[#38362F] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye size={13} className="text-[#B49A75]" />
                <span>Inspect Garment in 3D</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
