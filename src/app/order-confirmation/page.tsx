"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import { CheckCircle2, ArrowRight, Package, Truck, Sliders } from "lucide-react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || searchParams.get("id") || "VST-774912";

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col justify-between selection:bg-[#B49A75]/25 selection:text-[#25241F]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-10 text-center">
        <div className="w-16 h-16 rounded-full bg-[#667B63]/15 border border-[#667B63]/30 text-[#667B63] mx-auto flex items-center justify-center">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#8C7352]">
            HAUTE COUTURE ACQUISITION CONFIRMED
          </span>
          <h1 className="text-exhibition-title text-[#25241F] font-normal">
            Thank You for Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#77736C] max-w-lg mx-auto leading-relaxed">
            Your sartorial acquisition has been logged with the atelier. A confirmation receipt and dispatch docket have been dispatched to your email.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E5E0D7] max-w-md mx-auto text-left space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5E0D7] pb-3">
            <span className="text-xs font-mono text-[#77736C]">Order Reference:</span>
            <span className="text-xs font-mono font-bold text-[#25241F]">{orderId}</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#E5E0D7] pb-3">
            <span className="text-xs font-mono text-[#77736C]">Estimated Delivery:</span>
            <span className="text-xs font-mono text-[#8C7352]">3–5 Business Days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#77736C]">Freight Service:</span>
            <span className="text-xs font-mono text-[#25241F]">Climate-Insured White-Glove</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <NextLink
            href={`/orders/${encodeURIComponent(orderId)}`}
            className="px-6 py-3.5 rounded-full bg-[#25241F] hover:bg-[#38362F] text-[#F8F6F1] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs"
          >
            <Truck size={14} className="text-[#B49A75]" />
            <span>Track Order Timeline</span>
          </NextLink>

          <NextLink
            href="/wardrobe"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F0EDE6] border border-[#E5E0D7] text-[#25241F] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Sliders size={14} className="text-[#8C7352]" />
            <span>Return to 3D Wardrobe</span>
          </NextLink>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#B49A75]/30 border-t-[#B49A75] animate-spin" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
