"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import { useCartStore } from "@/store/useCartStore";
import { Order, OrderTrackingStep } from "@/types/cart";
import { Product } from "@/types/product";
import { PRODUCTS } from "@/data/products";
import { sounds } from "@/utils/soundEffects";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Navigation,
  Phone,
  Radio,
} from "lucide-react";

interface OrderDetailClientProps {
  orderId: string;
}

export default function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const { orders } = useCartStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(3); // In transit by default

  useEffect(() => {
    const found = orders.find(
      (o) => o.orderNumber === orderId || o.id === orderId
    );

    if (found) {
      setOrder(found);
      const activeIdx = found.trackingTimeline.findIndex((s) => s.isCurrent);
      if (activeIdx !== -1) setActiveStepIndex(activeIdx);
    } else {
      // High-end fallback order for direct URL exploration
      setOrder({
        id: "order-" + orderId,
        orderNumber: orderId.startsWith("VST-") ? orderId : `VST-${orderId}`,
        createdAt: "2026-11-02T14:10:00.000Z",
        items: [
          {
            id: "item-01",
            product: PRODUCTS[0],
            selectedColor: PRODUCTS[0].colorways[0],
            selectedSize: "48 / M",
            quantity: 1,
            addedAt: Date.now(),
          },
          {
            id: "item-02",
            product: PRODUCTS[1],
            selectedColor: PRODUCTS[1].colorways[0],
            selectedSize: "50 / L",
            quantity: 1,
            addedAt: Date.now(),
          },
        ],
        subtotal: PRODUCTS[0].price + PRODUCTS[1].price,
        discountAmount: 185,
        taxAmount: 240,
        shippingAmount: 0,
        total: PRODUCTS[0].price + PRODUCTS[1].price - 185 + 240,
        status: "in_transit",
        shippingAddress: {
          fullName: "Valentin De Vestra",
          email: "valentin@vestra.luxury",
          address: "14 Rue Saint-Honoré",
          city: "Paris",
          postalCode: "75001",
          country: "France",
        },
        trackingTimeline: [
          {
            status: "confirmed",
            label: "Order Authenticated & Registered",
            description: "Dossier encrypted with cryptographic NFC certificate.",
            timestamp: "Nov 02 • 14:10",
            isCompleted: true,
            isCurrent: false,
          },
          {
            status: "tailoring",
            label: "Atelier Fitting & Handcraft",
            description: "Artisans cut and stitch Japanese gabardine in Milan workshop.",
            timestamp: "Nov 02 • 15:30",
            isCompleted: true,
            isCurrent: false,
          },
          {
            status: "quality_inspection",
            label: "Optical & Fabric Inspection",
            description: "Laser seam verification and hand-pressed finishing completed.",
            timestamp: "Nov 02 • 17:45",
            isCompleted: true,
            isCurrent: false,
          },
          {
            status: "in_transit",
            label: "Armored White-Glove Courier In Transit",
            description: "Climate-controlled delivery van en route. GPS tracking active.",
            timestamp: "Nov 02 • 19:15",
            isCompleted: false,
            isCurrent: true,
          },
          {
            status: "delivered",
            label: "Client Hand-Off & Unboxing",
            description: "Garment delivered with archival wooden hanger and dust cover.",
            timestamp: "Est. Today • 21:00",
            isCompleted: false,
            isCurrent: false,
          },
        ],
      });
      setActiveStepIndex(3);
    }
  }, [orderId, orders]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C5A880]/30 border-t-[#C5A880] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <NextLink
            href="/orders"
            onClick={() => sounds.playClick()}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>All Client Dossiers</span>
          </NextLink>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1917] text-[#C5A880] text-[10px] font-mono tracking-widest uppercase">
            <Radio size={12} className="animate-pulse text-[#C5A880]" />
            <span>Live GPS Uplink</span>
          </div>
        </div>

        {/* Header Title */}
        <div className="atelier-card rounded-3xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#9A7B4F] text-[10px] font-mono tracking-widest uppercase">
                <span>Dossier Reference</span>
                <span>•</span>
                <span>{order.orderNumber}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl text-[#1C1917] font-medium mt-1">
                Real-Time Courier Telemetry
              </h1>
              <p className="text-xs text-[#78716C] mt-1">
                Allocated Courier: White Glove Escort #44 • Paris Haute Logistique
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-[#C5A880]/15 text-[#9A7B4F] border border-[#C5A880]/30 text-xs font-semibold uppercase tracking-wider font-mono">
                {order.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Live Tracking Map / Telemetry HUD */}
        <div className="atelier-card rounded-3xl p-6 sm:p-8 mb-8 bg-[#121110] text-[#FAF8F5] relative overflow-hidden">
          {/* Ambient Grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <Navigation size={18} className="text-[#C5A880] animate-pulse" />
                <span className="font-serif text-base font-medium text-white">
                  Courier Vector: 14 Rue de la Paix → {order.shippingAddress.address}
                </span>
              </div>
              <span className="text-xs font-mono text-[#C5A880]">
                ETA: ~24 Minutes
              </span>
            </div>

            {/* GPS Vector Visualization Bar */}
            <div className="py-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#9ca3af] mb-2">
                <span className="flex items-center gap-1.5 text-white">
                  <MapPin size={13} className="text-[#C5A880]" />
                  VESTRA Atelier Paris
                </span>
                <span className="text-[#C5A880] font-semibold">
                  Speed: 38 km/h • Climate: 18.5°C
                </span>
                <span className="flex items-center gap-1.5 text-white">
                  <MapPin size={13} className="text-[#C5A880]" />
                  {order.shippingAddress.city}
                </span>
              </div>

              {/* Progress track */}
              <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#8C734B] via-[#C5A880] to-[#E6D5B8] rounded-full transition-all duration-1000"
                  style={{ width: "72%" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                <span className="text-[10px] text-[#9ca3af] font-mono uppercase tracking-wider block">
                  Seal Verification
                </span>
                <span className="text-white font-medium mt-1 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-[#C5A880]" />
                  Biometric Lock Intact
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                <span className="text-[10px] text-[#9ca3af] font-mono uppercase tracking-wider block">
                  Delivery Protocol
                </span>
                <span className="text-white font-medium mt-1 flex items-center gap-1">
                  <Clock size={14} className="text-[#C5A880]" />
                  Direct Hand-Off With Signature
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                <span className="text-[10px] text-[#9ca3af] font-mono uppercase tracking-wider block">
                  Courier Escort Phone
                </span>
                <span className="text-[#C5A880] font-mono font-medium mt-1 flex items-center gap-1">
                  <Phone size={14} />
                  +33 1 42 68 55 44
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Multi-Stage Timeline */}
        <div className="atelier-card rounded-3xl p-6 sm:p-8 mb-8">
          <h2 className="font-serif text-xl font-medium text-[#1C1917] mb-6 pb-3 border-b border-[#1C1917]/[0.06]">
            Atelier Chain of Custody
          </h2>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#1C1917]/[0.08]">
            {order.trackingTimeline.map((step, idx) => {
              const isPast = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              return (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Step node dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                      isPast
                        ? "bg-[#C5A880] text-[#1C1917] shadow-sm"
                        : isCurrent
                        ? "bg-[#1C1917] text-[#C5A880] ring-4 ring-[#C5A880]/30 shadow-md"
                        : "bg-white border border-[#1C1917]/20 text-[#78716C]"
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 size={14} />
                    ) : isCurrent ? (
                      <Sparkles size={13} className="animate-spin" />
                    ) : (
                      <span className="text-[10px] font-mono">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 bg-[#FAF8F5] p-4 rounded-xl border border-[#1C1917]/[0.04]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4
                        className={`font-serif text-base font-medium ${
                          isCurrent
                            ? "text-[#1C1917] font-semibold"
                            : isPast
                            ? "text-[#1C1917]"
                            : "text-[#78716C]"
                        }`}
                      >
                        {step.label}
                      </h4>
                      <span className="text-xs font-mono text-[#9A7B4F]">
                        {step.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Garments in this Dossier */}
        <div className="atelier-card rounded-3xl p-6 sm:p-8">
          <h2 className="font-serif text-xl font-medium text-[#1C1917] mb-6 pb-3 border-b border-[#1C1917]/[0.06]">
            Garments Under Escort
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#1C1917]/[0.04] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-16 rounded-xl overflow-hidden bg-white border border-[#1C1917]/[0.08] shrink-0"
                    style={{ width: "56px", height: "64px" }}
                  >
                    <img
                      src={item.product.images.hero}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#9A7B4F]">
                      {item.product.collectionName}
                    </span>
                    <h4 className="font-serif text-sm font-medium text-[#1C1917]">
                      {item.product.name}
                    </h4>
                    <span className="text-[11px] text-[#78716C]">
                      Color: {item.selectedColor.name} • Size {item.selectedSize}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="font-serif text-sm font-bold text-[#1C1917]">
                    ${item.product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      setInspectingProduct(item.product);
                      sounds.playGarmentInspect();
                    }}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#C5A880]/40 text-[#9A7B4F] hover:bg-[#C5A880] hover:text-[#1C1917] text-[11px] font-medium flex items-center gap-1 transition-all shadow-xs"
                  >
                    <Eye size={12} />
                    <span>3D Inspect</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 3D Product Inspector Modal */}
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

