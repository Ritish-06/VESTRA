"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ProductInspectorModal from "@/components/ui/ProductInspectorModal";
import { useCartStore } from "@/store/useCartStore";
import { Order } from "@/types/cart";
import { Product } from "@/types/product";
import { PRODUCTS } from "@/data/products";
import { sounds } from "@/utils/soundEffects";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Eye,
  ShoppingBag,
  Clock,
  QrCode,
  FileText,
} from "lucide-react";

interface OrderConfirmationClientProps {
  orderId: string;
}

export default function OrderConfirmationClient({ orderId }: OrderConfirmationClientProps) {
  const { orders } = useCartStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [downloadedCert, setDownloadedCert] = useState(false);

  useEffect(() => {
    // Find order in store by orderNumber or id
    const found = orders.find(
      (o) => o.orderNumber === orderId || o.id === orderId
    );

    if (found) {
      setOrder(found);
    } else {
      // Mock luxury fallback order for demo or direct URL preview
      setOrder({
        id: "order-" + orderId,
        orderNumber: orderId.startsWith("VST-") ? orderId : `VST-${orderId}`,
        createdAt: new Date().toISOString(),
        items: [
          {
            id: "item-trench-01",
            product: PRODUCTS[0],
            selectedColor: PRODUCTS[0].colorways[0],
            selectedSize: "48 / M",
            quantity: 1,
            addedAt: Date.now(),
          },
        ],
        subtotal: PRODUCTS[0].price,
        discountAmount: 0,
        taxAmount: Math.round(PRODUCTS[0].price * 0.08),
        shippingAmount: 0,
        total: Math.round(PRODUCTS[0].price * 1.08),
        status: "confirmed",
        shippingAddress: {
          fullName: "Private Client",
          email: "client@vestra-atelier.com",
          address: "14 Rue de la Paix",
          city: "Paris",
          postalCode: "75002",
          country: "France",
        },
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
            label: "Atelier Fitting & Handcraft",
            description: "Artisans cut and stitch Japanese gabardine in Milan workshop.",
            timestamp: "Estimated in 24h",
            isCompleted: false,
            isCurrent: false,
          },
          {
            status: "quality_inspection",
            label: "Optical & Fabric Inspection",
            description: "Laser seam verification and hand-pressed finishing.",
            timestamp: "Pending",
            isCompleted: false,
            isCurrent: false,
          },
          {
            status: "in_transit",
            label: "White-Glove Courier Dispatch",
            description: "Climate-controlled delivery directly to your door.",
            timestamp: "Pending",
            isCompleted: false,
            isCurrent: false,
          },
          {
            status: "delivered",
            label: "Client Hand-Off & Unboxing",
            description: "Garment delivered with archival wooden hanger and dust cover.",
            timestamp: "Pending",
            isCompleted: false,
            isCurrent: false,
          },
        ],
      });
    }
  }, [orderId, orders]);

  const handleDownloadCertificate = () => {
    sounds.playClick();
    setDownloadedCert(true);
    setTimeout(() => setDownloadedCert(false), 3000);
  };

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

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        {/* Success Header Card */}
        <div className="atelier-card rounded-3xl p-8 sm:p-12 text-center mb-8 border border-[#C5A880]/30 shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#C5A880]/15 text-[#9A7B4F] flex items-center justify-center mx-auto mb-6 border border-[#C5A880]/40">
            <CheckCircle2 size={32} />
          </div>

          <span className="text-[10px] uppercase tracking-[0.35em] text-[#9A7B4F] font-mono">
            Transaction Confirmed
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1917] font-medium mt-2">
            Welcome to the VESTRA Circle
          </h1>

          <p className="text-sm text-[#78716C] max-w-md mx-auto mt-3 leading-relaxed">
            Your haute couture order has been securely registered in the atelier docket. A master artisan has been allocated to hand-finish your garments.
          </p>

          <div className="inline-flex items-center gap-3 mt-6 px-4 py-2 rounded-full bg-[#F4F0E8] border border-[#1C1917]/[0.08]">
            <span className="text-xs text-[#78716C] font-mono">Dossier Reference:</span>
            <span className="text-xs font-serif font-bold text-[#1C1917] tracking-wider">
              {order.orderNumber}
            </span>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Items & Guarantee */}
          <div className="md:col-span-2 space-y-6">
            {/* Acquired Garments */}
            <div className="atelier-card rounded-2xl p-6">
              <h2 className="font-serif text-lg font-medium text-[#1C1917] mb-4 pb-3 border-b border-[#1C1917]/[0.06] flex items-center justify-between">
                <span>Acquired Garments</span>
                <span className="text-xs font-mono text-[#78716C]">
                  {order.items.length} {order.items.length === 1 ? "Piece" : "Pieces"}
                </span>
              </h2>

              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#1C1917]/[0.04]"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-16 rounded-lg overflow-hidden bg-white border border-[#1C1917]/[0.08] shrink-0"
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
                        <span className="text-[9px] uppercase tracking-widest text-[#9A7B4F] font-mono">
                          {item.product.collectionName}
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
                        ${(item.product.price * item.quantity).toLocaleString()}
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

            {/* Haute Couture NFC Microchip Authentication Seal */}
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
                    Every VESTRA garment arrives with a hand-stitched contactless NFC microchip behind the care label, validating origin, provenance, and numbered production batch.
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
          <div className="space-y-6">
            {/* Order Dossier Summary */}
            <div className="atelier-card rounded-2xl p-6">
              <h3 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#1C1917] mb-4 pb-2 border-b border-[#1C1917]/[0.06]">
                Dossier Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#78716C]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#1C1917]">
                    ${order.subtotal.toLocaleString()}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[#9A7B4F]">
                    <span>Atelier Privilege</span>
                    <span className="font-mono">
                      -${order.discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#78716C]">
                  <span>Luxury Harmonized Tax</span>
                  <span className="font-mono text-[#1C1917]">
                    ${order.taxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#78716C]">
                  <span>White-Glove Courier</span>
                  <span className="font-mono text-[#1C1917]">
                    {order.shippingAmount === 0 ? "Complimentary" : `$${order.shippingAmount}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#1C1917]/[0.08] flex justify-between font-serif text-base font-bold text-[#1C1917]">
                  <span>Total Settled</span>
                  <span className="text-[#9A7B4F]">${order.total.toLocaleString()}</span>
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
                href={`/orders/${order.orderNumber}`}
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

