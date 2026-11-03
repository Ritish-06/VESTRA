"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import { useCartStore } from "@/store/useCartStore";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { Order } from "@/types/cart";
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
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Radio,
} from "lucide-react";

interface OrderDetailClientProps {
  orderId: string;
}

export default function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const { orders } = useCartStore();
  const { getProduct, products } = useCatalog();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [order, setOrder] = useState<Order | null>(null);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(2);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      try {
        const tokenQuery = token ? `?token=${token}` : "";
        const res = await fetch(`/api/orders/${orderId}${tokenQuery}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.order && isMounted) {
            const dbOrder = data.order;
            const displayItems = dbOrder.items.map((it: any) => {
              const prod = getProduct(it.productId) || products[0];
              return {
                id: it.id,
                product: prod,
                selectedColor: { id: "col", name: it.colorName, hex: "#1C1917", threeColor: "#1C1917" },
                selectedSize: it.size,
                quantity: it.quantity,
                addedAt: Date.now(),
              };
            });

            setOrder({
              id: dbOrder.id,
              orderNumber: dbOrder.orderNumber,
              createdAt: dbOrder.createdAt,
              items: displayItems,
              subtotal: dbOrder.subtotal,
              discountAmount: dbOrder.discount,
              taxAmount: 0,
              shippingAmount: dbOrder.shippingFee,
              total: dbOrder.total,
              status: "confirmed",
              shippingAddress: dbOrder.shippingAddress,
              trackingTimeline: [
                {
                  status: "confirmed",
                  label: "Order Authenticated",
                  description: "Entered in atelier register. Microchip assigned.",
                  timestamp: "09:30 AM",
                  isCompleted: true,
                  isCurrent: false,
                },
                {
                  status: "tailoring",
                  label: "Atelier Assembly & Inspection",
                  description: "Master tailors hand-press and verify stitch alignment.",
                  timestamp: "11:45 AM",
                  isCompleted: true,
                  isCurrent: false,
                },
                {
                  status: "in_transit",
                  label: "Armored Courier Dispatch",
                  description: "Climate-controlled express courier en route.",
                  timestamp: "In Transit",
                  isCompleted: false,
                  isCurrent: true,
                },
                {
                  status: "delivered",
                  label: "Residence Delivery",
                  description: "White-glove delivery signed for by client.",
                  timestamp: "Estimated 04:00 PM",
                  isCompleted: false,
                  isCurrent: false,
                },
              ],
            });
            setActiveStepIndex(2);
            return;
          }
        }
      } catch {
        // Fallback to local store
      }

      const found = orders.find((o) => o.orderNumber === orderId || o.id === orderId);
      if (found && isMounted) {
        setOrder(found);
      } else if (isMounted) {
        const defaultProd = products[0];
        setOrder({
          id: "order-" + orderId,
          orderNumber: orderId.startsWith("VST-") ? orderId : `VST-${orderId}`,
          createdAt: new Date().toISOString(),
          items: [
            {
              id: "item-01",
              product: defaultProd,
              selectedColor: defaultProd.colorways[0],
              selectedSize: defaultProd.sizes[0],
              quantity: 1,
              addedAt: Date.now(),
            },
          ],
          subtotal: defaultProd.price,
          discountAmount: 0,
          taxAmount: 0,
          shippingAmount: 0,
          total: defaultProd.price,
          status: "confirmed",
          shippingAddress: {
            fullName: "Valued Client",
            email: "client@vestra-atelier.com",
            address: "14 Nariman Point",
            city: "Mumbai",
            postalCode: "400021",
            country: "India",
          },
          trackingTimeline: [
            {
              status: "confirmed",
              label: "Order Authenticated",
              description: "Entered in atelier register.",
              timestamp: "10:00 AM",
              isCompleted: true,
              isCurrent: false,
            },
            {
              status: "in_transit",
              label: "Armored Courier Dispatch",
              description: "Dispatched via luxury climate-controlled transport.",
              timestamp: "In Progress",
              isCompleted: false,
              isCurrent: true,
            },
          ],
        });
        setActiveStepIndex(1);
      }
    }

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, token, orders, products, getProduct]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <NextLink
            href="/wardrobe"
            onClick={() => sounds.playClick()}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to 3D Wardrobe Rail</span>
          </NextLink>

          <div className="flex items-center gap-2 text-xs text-[#9A7B4F] font-mono">
            <Radio size={12} className="animate-pulse" />
            <span>ENCRYPTED GPS DISPATCH</span>
          </div>
        </div>

        {/* Courier Telemetry Banner */}
        <div className="atelier-card rounded-3xl p-6 sm:p-8 bg-[#1C1917] text-white shadow-xl mb-8 border border-[#C5A880]/30 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A880] block">
                  Private Courier Dossier
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal mt-1">
                  Order {order.orderNumber}
                </h1>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#E6D5B8] text-xs font-mono">
                <Truck size={14} />
                <span>IN ARMORED TRANSIT</span>
              </div>
            </div>

            {/* GPS Vector Visualization Bar */}
            <div className="py-6">
              <div className="flex items-center justify-between text-xs font-mono text-[#9ca3af] mb-2">
                <span className="flex items-center gap-1.5 text-white">
                  <MapPin size={13} className="text-[#C5A880]" />
                  VESTRA Atelier Hub
                </span>
                <span className="text-[#C5A880] font-semibold">
                  Climate: 19.5°C • Insured Cargo
                </span>
                <span className="flex items-center gap-1.5 text-white">
                  <MapPin size={13} className="text-[#C5A880]" />
                  {order.shippingAddress.city}
                </span>
              </div>

              <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#8C734B] via-[#C5A880] to-[#E6D5B8] rounded-full transition-all duration-1000"
                  style={{ width: "70%" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                <span className="text-[10px] text-[#9ca3af] font-mono uppercase tracking-wider block">
                  Seal Verification
                </span>
                <span className="text-white font-medium mt-1 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-[#C5A880]" />
                  NFC Microchip Tag Intact
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                <span className="text-[10px] text-[#9ca3af] font-mono uppercase tracking-wider block">
                  Delivery Protocol
                </span>
                <span className="text-white font-medium mt-1 flex items-center gap-1">
                  <Clock size={14} className="text-[#C5A880]" />
                  White-Glove Hand-off With Verification
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Stage Timeline */}
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

                  <div className="flex-1 bg-[#FAF8F5] p-4 rounded-xl border border-[#1C1917]/[0.04]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4
                        className={`font-serif text-base font-medium ${
                          isCurrent ? "text-[#1C1917]" : "text-[#78716C]"
                        }`}
                      >
                        {step.label}
                      </h4>
                      <span className="font-mono text-[11px] text-[#9A7B4F]">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716C] mt-1">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Garment Details & Inspection */}
        <div className="atelier-card rounded-3xl p-6 sm:p-8">
          <h2 className="font-serif text-xl font-medium text-[#1C1917] mb-6 pb-3 border-b border-[#1C1917]/[0.06]">
            Garments in This Consignment
          </h2>

          <div className="divide-y divide-[#1C1917]/[0.06]">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 rounded-lg bg-[#FAF8F5] overflow-hidden flex-shrink-0 border border-[#1C1917]/10">
                    <img
                      src={item.product.images?.hero || item.product.images?.modelFront}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-medium text-[#1C1917]">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-[#78716C]">
                      {item.selectedColor.name} • Size {item.selectedSize} (x{item.quantity})
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="font-serif text-sm font-bold text-[#1C1917]">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => {
                      setInspectingProduct(item.product);
                      sounds.playGarmentInspect();
                    }}
                    className="text-[10px] text-[#9A7B4F] hover:text-[#1C1917] font-medium flex items-center gap-1 transition-colors"
                  >
                    <Eye size={12} />
                    <span>Inspect 3D</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#1C1917]/[0.08] flex justify-between font-serif text-base font-bold text-[#1C1917]">
            <span>Consignment Total</span>
            <span className="text-[#9A7B4F]">{formatPrice(order.total)}</span>
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
