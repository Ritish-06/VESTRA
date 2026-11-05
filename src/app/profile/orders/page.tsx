"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import { formatPrice } from "@/lib/commerce";
import { Package, Truck, ArrowLeft, ArrowUpRight, Clock, CheckCircle } from "lucide-react";

interface OrderSummary {
  id: string;
  orderNumber: string;
  totalPaise: number;
  status: string;
  createdAt: string;
  itemCount: number;
  previewName: string;
  previewImage: string;
}

export default function ProfileOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        } else {
          // Fallback demo orders if not signed in
          setOrders([
            {
              id: "VST-774912",
              orderNumber: "VST-774912",
              totalPaise: 11400000,
              status: "SHIPPED",
              createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
              itemCount: 2,
              previewName: "Monolith Bonded Trench",
              previewImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
            },
            {
              id: "VST-892104",
              orderNumber: "VST-892104",
              totalPaise: 7800000,
              status: "DELIVERED",
              createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
              itemCount: 1,
              previewName: "Structured Peak Lapel Blazer",
              previewImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
            },
          ]);
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col justify-between selection:bg-[#B49A75]/25 selection:text-[#25241F]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D7] pb-6">
          <div className="space-y-1">
            <NextLink
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#8C7352] hover:text-[#25241F] transition-colors mb-2"
            >
              <ArrowLeft size={13} />
              <span>Back to Profile</span>
            </NextLink>
            <h1 className="text-exhibition-title text-[#25241F] font-normal">
              Order History & Dockets
            </h1>
            <p className="text-xs text-[#77736C]">
              Review past acquisitions, tracked shipments, and official atelier invoices.
            </p>
          </div>

          <NextLink
            href="/track-order"
            className="px-4 py-2.5 rounded-full bg-white border border-[#E5E0D7] hover:border-[#25241F] text-xs font-medium text-[#25241F] flex items-center gap-2 self-start sm:self-auto transition-colors shadow-xs"
          >
            <Truck size={14} className="text-[#B49A75]" />
            <span>Track by Order Code</span>
          </NextLink>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#B49A75]/30 border-t-[#B49A75] animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white border border-[#E5E0D7] p-8 max-w-md mx-auto space-y-3">
            <Package size={28} className="mx-auto text-[#B49A75]" />
            <h3 className="font-serif text-lg text-[#25241F]">No Acquisitions on Record</h3>
            <p className="text-xs text-[#77736C]">
              You have not placed any orders yet. Visit our digital showroom or explore curated garments.
            </p>
            <NextLink
              href="/wardrobe"
              className="mt-3 inline-block px-5 py-2.5 rounded-full bg-[#25241F] text-[#F8F6F1] text-xs uppercase tracking-wider font-semibold"
            >
              Explore 3D Wardrobe
            </NextLink>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-6 rounded-2xl bg-white border border-[#E5E0D7] hover:border-[#B49A75]/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-16 rounded-xl bg-[#F0EDE6] overflow-hidden border border-[#E5E0D7] shrink-0">
                    <img
                      src={ord.previewImage}
                      alt={ord.previewName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[#25241F]">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider bg-[#F0EDE6] text-[#8C7352] border border-[#E5E0D7]">
                        {ord.status}
                      </span>
                    </div>
                    <h4 className="font-serif text-sm sm:text-base text-[#25241F]">
                      {ord.previewName} {ord.itemCount > 1 ? `+ ${ord.itemCount - 1} more` : ""}
                    </h4>
                    <span className="text-[11px] text-[#77736C] font-mono">
                      {new Date(ord.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-[#E5E0D7]">
                  <span className="font-serif text-base font-bold text-[#25241F]">
                    {formatPrice(Math.round(ord.totalPaise / 100))}
                  </span>

                  <NextLink
                    href={`/orders/${encodeURIComponent(ord.orderNumber)}`}
                    className="px-4 py-2 rounded-full bg-[#25241F] hover:bg-[#38362F] text-[#F8F6F1] text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Inspect Order</span>
                    <ArrowUpRight size={13} />
                  </NextLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
