import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col items-center justify-center p-6">
      <div className="relative flex flex-col items-center space-y-4">
        {/* Elegant spinning emblem */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border border-[#E8E2D8]" />
          <div className="absolute inset-0 rounded-full border border-t-[#9A7B4F] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full border border-[#D5CEBF] opacity-40" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-serif text-lg tracking-[0.25em] uppercase text-[#1C1917]">
            VESTRA
          </p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#9A7B4F]">
            Preparing Digital Atelier…
          </p>
        </div>
      </div>
    </div>
  );
}
