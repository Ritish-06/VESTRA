"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[atelier error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex items-center justify-center p-6">
      <div className="max-w-md w-full atelier-card p-10 text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#F4F0E8] border border-[#E8E2D8] flex items-center justify-center text-[#9A7B4F]">
          <AlertCircle size={28} />
        </div>
        <div className="space-y-2">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#9A7B4F] font-semibold">
            Atelier Interruption
          </p>
          <h1 className="font-serif text-2xl font-light tracking-wide text-[#1C1917]">
            Momentary Disruption
          </h1>
          <p className="text-xs text-[#78716C] leading-relaxed">
            The digital showroom encountered an unexpected rendering condition. Your wardrobe selections and cart remain preserved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-5 bg-[#1C1917] hover:bg-[#33302C] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] rounded transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} /> Retry
          </button>
          <Link
            href="/wardrobe"
            className="flex-1 py-3 px-5 border border-[#D5CEBF] hover:border-[#9A7B4F] text-[#1C1917] text-xs uppercase tracking-[0.2em] rounded transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} /> Wardrobe
          </Link>
        </div>
      </div>
    </div>
  );
}
