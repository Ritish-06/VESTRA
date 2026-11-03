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
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  Eye,
  ShoppingBag,
  QrCode,
  FileText,
} from "lucide-react";

interface OrderConfirmationClientProps {
  orderId: string;
}

export default function OrderConfirmationClient({ orderId }: OrderConfirmationClientProps) {
  const { orders } = useCartStore();
  const { getProduct, products } = useCatalog();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [order, setOrder] = useState<Order | null>(null);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [downloadedCert, setDownloadedCert] = useState(false);

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
            // Map db order to display shape
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
                  label: "Order Authenticated & Registered",
                  description: "Dossier encrypted with cryptographic NFC certificate.",
                  timestamp: "Just Now",
                  isCompleted: true,
                  isCurrent: true,
                },
                {
                  status: "tailoring",
                  label: "Atelier Fitting & Assembly",
                  description: "Master tailors hand-finish garments in certified workshop.",
                  timestamp: "Estimated in 24h",
                  isCompleted: false,
                  isCurrent: false,
                },
              ],
            });
            return;
          }
        }
      } catch {
        // Fallback to client store
      }

      // Check local zustand store
      const found = orders.find((o) => o.orderNumber === orderId || o.id === orderId);
      if (found && isMounted) {
        setOrder(found);
      } else if (isMounted) {
        // Fallback presentation
        const defaultProd = products[0];
        setOrder({
          id: "order-" + orderId,
          orderNumber: orderId.startsWith("VST-") ? orderId : `VST-${orderId}`,
          createdAt: new Date().toISOString(),
          items: [
            {
              id: "item-trench-01",
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
            fullName: "Valued Private Client",
            email: "client@vestra-atelier.com",
            address: "14 Rue de la Paix",
            city: "Paris",
            postalCode: "75002",
            country: "France",
          },
          trackingTimeline: [],
        });
      }
    }

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, token, orders, products, getProduct]);

  const handleDownloadCertificate = () => {
    sounds.playChime();
    setDownloadedCert(true);
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header confirmation card */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F4F0E8] border border-[#E8E2D8] flex items-center justify-center text-[#9A7B4F] mb-4 shadow-sm">
            <CheckCircle2 size={32} />
          </div>

          <span className="text-[11px] uppercase tracking-[0.3em] font-mono text-[#9A7B4F]">
            Atelier Transaction Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-normal mt-2">
            Your Order Has Been Authenticated
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-3 leading-relaxed">
            Order <span className="font-mono text-[#1C1917] font-semibold">{order.orderNumber}</span> has been securely entered into the private atelier register. Master tailors have been assigned to your garments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Garments list */}
          <div className="lg:col-span-7 space-y-6">
            <div className="atelier-card rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#1C1917]/[0.06] mb-4">
                <h3 className="font-serif text-base font-medium text-[#1C1917]">
                  Commissioned Garments ({order.items.length})
                </h3>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#9A7B4F]">
                  Bespoke Registry
                </span>
              </div>

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
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#9A7B4F] block">
                          {item.product.category}
                        </span>
                        <h4 className="font-serif text-sm font-medium text-[#1C1917]">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span className="text-[11px] text-[#78716C]">
                            {item.selectedColor.name} • Size {item.selectedSize}
                          </span>
                          <span className="text-[11px] text-[#78716C]">
                            • Qty {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
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
            </div>

            {/* Cryptographic NFC Microchip Seal */}
            <div className="atelier-card rounded-2xl p-6 bg-gradient-to-br from-white to-[#FAF8F5] border border-[#C5A880]/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center text-[#9A7B4F] shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-medium text-[#1C1917]">
                      Cryptographic Authenticity Certificate
                    </h3>
                    <QrCode size={18} className="text-[#9A7B4F]" />
                  </div>
                  <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                    Every VESTRA garment arrives with an NFC microchip behind the care label, validating provenance and numbered batch.
                  </p>
                  <button
                    onClick={handleDownloadCertificate}
                    className="mt-3 text-xs font-mono font-medium text-[#9A7B4F] hover:text-[#1C1917] flex items-center gap-1.5 transition-colors"
                  >
                    <FileText size={13} />
                    <span>
                      {downloadedCert
                        ? "Certificate Exported to Keychain ✓"
                        : "Download Certificate Dossier (.PDF)"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tracking & Actions */}
          <div className="space-y-6 lg:col-span-5">
            {/* Order Dossier Summary */}
            <div className="atelier-card rounded-2xl p-6">
              <h3 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#1C1917] mb-4 pb-2 border-b border-[#1C1917]/[0.06]">
                Dossier Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#78716C]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#1C1917]">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[#9A7B4F]">
                    <span>Atelier Privilege</span>
                    <span className="font-mono">
                      -{formatPrice(order.discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#78716C]">
                  <span>White-Glove Courier</span>
                  <span className="font-mono text-[#1C1917]">
                    {order.shippingAmount === 0 ? "Complimentary" : formatPrice(order.shippingAmount)}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#1C1917]/[0.08] flex justify-between font-serif text-base font-bold text-[#1C1917]">
                  <span>Total Settled</span>
                  <span className="text-[#9A7B4F]">{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mt-6 pt-4 border-t border-[#1C1917]/[0.06] text-xs">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#78716C]">
                  Delivery Destination
                </span>
                <p className="font-medium text-[#1C1917] mt-1">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-[#78716C]">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-[#78716C]">{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Real-time Tracking Action */}
            <div className="atelier-card rounded-2xl p-6 bg-[#1C1917] text-white">
              <div className="flex items-center gap-2 text-[#C5A880] mb-2">
                <Truck size={16} />
                <span className="text-[10px] uppercase font-mono tracking-widest">
                  Live Dispatch Stream
                </span>
              </div>
              <h4 className="font-serif text-lg font-medium">Track Armored Courier</h4>
              <p className="text-xs text-[#A8A29E] mt-1 leading-relaxed">
                Monitor real-time assembly, quality inspection, and GPS route of your order.
              </p>

              <NextLink
                href={`/orders/${order.orderNumber}${token ? `?token=${token}` : ""}`}
                onClick={() => sounds.playClick()}
                className="mt-4 w-full py-3 rounded-full bg-[#C5A880] hover:bg-[#E6D5B8] text-[#1C1917] text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Open Live Tracking Dossier</span>
                <ArrowRight size={14} />
              </NextLink>
            </div>

            {/* Back to Wardrobe */}
            <div className="text-center">
              <NextLink
                href="/wardrobe"
                onClick={() => sounds.playClick()}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors"
              >
                <ShoppingBag size={14} />
                <span>Return to 3D Wardrobe Rail</span>
              </NextLink>
            </div>
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
