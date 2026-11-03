import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex items-center justify-center p-6">
      <div className="max-w-md w-full atelier-card p-10 text-center space-y-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#9A7B4F] font-semibold">
          404 • Not Found
        </p>
        <h1 className="font-serif text-3xl font-light tracking-wide text-[#1C1917]">
          Piece Undiscovered
        </h1>
        <p className="text-xs text-[#78716C] leading-relaxed">
          The archive or garment suite you are seeking does not exist in the current atelier curation.
        </p>
        <div className="pt-4">
          <Link
            href="/wardrobe"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#1C1917] hover:bg-[#33302C] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] rounded transition-colors"
          >
            <ArrowLeft size={14} /> Return to Wardrobe
          </Link>
        </div>
      </div>
    </div>
  );
}
