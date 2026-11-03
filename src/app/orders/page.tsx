"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import { useCartStore } from "@/store/useCartStore";
import { Order, OrderStatus } from "@/types/cart";
import { Product } from "@/types/product";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function OrdersPage() {
  const { orders } = useCartStore();
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);

  // If user has no orders yet, provide a mock archival order so they can immediately test the tracking experience!
  const displayOrders: Order[] =
    orders.length > 0
      ? orders
      : [
          {
            id: "order-demo-01",
            orderNumber: "VST-774912",
            createdAt: "2026-11-02T14:10:00.000Z",
            items: [],
            subtotal: 1850,
            discountAmount: 185,
            taxAmount: 133,
            shippingAmount: 0,
            total: 1798,
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
                label: "Order Authenticated",
                description: "Bespoke tailoring dossier generated and assigned to master artisan.",
                timestamp: "Nov 02 • 14:10",
                isCompleted: true,
                isCurrent: false,
              },
              {
                status: "tailoring",
                label: "Atelier Assembly & Finishing",
                description: "Garment hand-finished, pressed and inspected under calibrated studio lighting.",
                timestamp: "Nov 02 • 18:30",
                isCompleted: true,
                isCurrent: false,
              },
              {
                status: "quality_inspection",
                label: "Archival Quality Certification",
                description: "NFC microchip encrypted and white-glove boxed in archival museum packaging.",
                timestamp: "Nov 03 • 09:15",
                isCompleted: true,
                isCurrent: false,
              },
              {
                status: "in_transit",
                label: "Private Courier Dispatch",
                description: "Dispatched via climate-controlled luxury express courier (Paris Hub).",
                timestamp: "In Transit • Today",
                isCompleted: false,
                isCurrent: true,
              },
              {
                status: "delivered",
                label: "Delivered to Residence",
                description: "Signed for by client at destination address.",
                timestamp: "Estimated Tomorrow",
                isCompleted: false,
                isCurrent: false,
              },
            ],
          },
        ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-12">
        <div className="pb-8 border-b border-[#1C1917]/[0.08] flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono">
              Client Archival History
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1917] font-medium mt-1">
              Order Tracking & Archives
            </h1>
          </div>
          <span className="text-xs text-[#78716C]">
            {displayOrders.length} {displayOrders.length === 1 ? "Acquisition" : "Acquisitions"}
          </span>
        </div>

        {/* Orders Stack */}
        <div className="space-y-8">
          {displayOrders.map((order) => (
            <div
              key={order.id}
              className="atelier-card rounded-3xl p-6 sm:p-8 space-y-8"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1917]/[0.06]">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base sm:text-lg text-[#1C1917] font-bold">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#C5A880]/15 text-[#9A7B4F] border border-[#C5A880]/30 font-semibold">
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C] mt-1">
                    Placed {order.createdAt ? order.createdAt.slice(0, 10) : "Nov 02, 2026"} • Total: {formatPrice(order.total)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-xs text-[#78716C] text-right hidden sm:block">
                    <span className="block text-[#1C1917] font-medium">{order.shippingAddress.fullName}</span>
                    <span>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
                  </div>

                  <NextLink
                    href={`/orders/${order.orderNumber}`}
                    onClick={() => sounds.playClick()}
                    className="px-4 py-2 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Truck size={13} className="text-[#C5A880]" />
                    <span>Live GPS Telemetry</span>
                    <ArrowRight size={13} />
                  </NextLink>
                </div>
              </div>

              {/* Interactive Courier Tracking Timeline */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.25em] text-[#9A7B4F] font-mono mb-6">
                  Live Courier Timeline & NFC Authentication
                </h3>

                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#1C1917]/[0.08]">
                  {order.trackingTimeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          step.isCompleted
                            ? "bg-[#C5A880] text-[#1C1917] font-bold"
                            : step.isCurrent
                            ? "bg-[#1C1917] ring-2 ring-[#C5A880] text-[#C5A880] animate-pulse"
                            : "bg-white border border-[#1C1917]/20 text-[#78716C]"
                        }`}
                      >
                        {step.isCompleted ? <CheckCircle2 size={12} /> : idx + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-4">
                          <h4
                            className={`font-serif text-sm ${
                              step.isCurrent
                                ? "text-[#9A7B4F] font-semibold"
                                : step.isCompleted
                                ? "text-[#1C1917] font-medium"
                                : "text-[#78716C]"
                            }`}
                          >
                            {step.label}
                          </h4>
                          <span className="text-[11px] font-mono text-[#78716C]">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#78716C] mt-0.5 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Purchased if available */}
              {order.items.length > 0 && (
                <div className="pt-6 border-t border-[#1C1917]/[0.06]">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-[#78716C] font-mono mb-3">
                    Archival Garments in this Crate
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-[#FAF8F5] border border-[#1C1917]/[0.04] flex gap-3 items-center"
                      >
                        <div
                          className="w-12 h-14 rounded-lg bg-white overflow-hidden shrink-0 border border-[#1C1917]/[0.08]"
                          style={{ width: "48px", height: "56px" }}
                        >
                          <img
                            src={item.product.images.hero}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif text-xs text-[#1C1917] truncate font-medium">
                            {item.product.name}
                          </h5>
                          <p className="text-[10px] text-[#78716C]">
                            {item.selectedSize} • {item.selectedColor.name}
                          </p>
                          <button
                            onClick={() => {
                              setInspectingProduct(item.product);
                              sounds.playGarmentInspect();
                            }}
                            className="text-[10px] text-[#9A7B4F] hover:text-[#1C1917] flex items-center gap-1 mt-1 transition-colors font-medium"
                          >
                            <Eye size={10} />
                            <span>Inspect 3D</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Product Inspector Modal */}
      {inspectingProduct && (
        <ProductInspectorModal
          product={inspectingProduct}
          onClose={() => setInspectingProduct(null)}
        />
      )}

      <Footer />
    </div>
  );
}
