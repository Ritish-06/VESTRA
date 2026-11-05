"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import { Search, PackageCheck, Truck, ShieldCheck, ArrowRight, Clock, CheckCircle } from "lucide-react";

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderNumber.trim();
    if (!trimmed) {
      setError("Please enter your VESTRA order number (e.g. VST-774912).");
      return;
    }
    setError("");
    router.push(`/orders/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col justify-between selection:bg-[#B49A75]/25 selection:text-[#25241F]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E0D7] text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7352]">
            <Truck size={12} className="text-[#B49A75]" />
            <span>GLOBAL DISPATCH // ORDER CONCIERGE</span>
          </div>
          <h1 className="text-exhibition-title text-[#25241F] font-normal">
            Track Your Haute Couture Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-[#77736C] max-w-lg mx-auto leading-relaxed">
            Enter your order reference code or email address to track white-glove delivery, garment preparation, and courier handoff status.
          </p>
        </div>

        {/* Tracking Input Form */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E0D7] shadow-sm space-y-6">
          <form onSubmit={handleTrack} className="space-y-5">
            <div>
              <label htmlFor="order-number" className="block text-xs font-mono uppercase tracking-wider text-[#77736C] mb-2">
                VESTRA Order Reference Code *
              </label>
              <div className="relative">
                <input
                  id="order-number"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. VST-774912"
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F6F1] border border-[#E5E0D7] text-sm text-[#25241F] focus:outline-none focus:border-[#B49A75] font-mono"
                />
              </div>
            </div>

            <div>
              <label htmlFor="order-email" className="block text-xs font-mono uppercase tracking-wider text-[#77736C] mb-2">
                Purchaser Email Address (Optional)
              </label>
              <input
                id="order-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@atelier.com"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#F8F6F1] border border-[#E5E0D7] text-sm text-[#25241F] focus:outline-none focus:border-[#B49A75]"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#25241F] hover:bg-[#38362F] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Search size={14} className="text-[#B49A75]" />
              <span>Locate Shipment & Timeline</span>
            </button>
          </form>

          {/* Quick Demo Reference Links */}
          <div className="pt-4 border-t border-[#E5E0D7] space-y-2 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#77736C] block">
              Sample Tracking References:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setOrderNumber("VST-774912")}
                className="text-xs font-mono text-[#8C7352] hover:underline px-2.5 py-1 rounded-full bg-[#F0EDE6]"
              >
                VST-774912 (In Transit)
              </button>
              <button
                type="button"
                onClick={() => setOrderNumber("VST-892104")}
                className="text-xs font-mono text-[#8C7352] hover:underline px-2.5 py-1 rounded-full bg-[#F0EDE6]"
              >
                VST-892104 (Delivered)
              </button>
            </div>
          </div>
        </div>

        {/* Global Dispatch Guarantee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E5E0D7] text-center space-y-2">
            <Clock size={20} className="mx-auto text-[#B49A75]" />
            <h4 className="font-serif text-sm text-[#25241F] font-semibold">24-Hour Atelier Prep</h4>
            <p className="text-[11px] text-[#77736C]">Each piece is inspected, steamed, and boxed within 24 hours.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-[#E5E0D7] text-center space-y-2">
            <Truck size={20} className="mx-auto text-[#B49A75]" />
            <h4 className="font-serif text-sm text-[#25241F] font-semibold">Climate-Controlled Freight</h4>
            <p className="text-[11px] text-[#77736C]">Silk, wool, and leather protected in archival acid-free packaging.</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-[#E5E0D7] text-center space-y-2">
            <ShieldCheck size={20} className="mx-auto text-[#B49A75]" />
            <h4 className="font-serif text-sm text-[#25241F] font-semibold">Insured White-Glove</h4>
            <p className="text-[11px] text-[#77736C]">Full provenance insurance with signature confirmation on receipt.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
