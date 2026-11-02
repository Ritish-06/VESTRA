"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import { useCartStore } from "@/store/useCartStore";
import { sounds } from "@/utils/soundEffects";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscount,
    getTax,
    getShipping,
    getTotal,
    promoCode,
    applyPromo,
    removePromo,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyPromo(couponInput);
    if (success) {
      setCouponMessage({ type: "success", text: "Privilege code activated." });
      setCouponInput("");
    } else {
      setCouponMessage({ type: "error", text: "Invalid code. Try VESTRA10 or HAUTE20." });
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#f5f4f0] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="pb-8 border-b border-white/[0.08] flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono">
              Client Portfolio
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-white font-medium mt-1">
              Your Curated Bag
            </h1>
          </div>
          <span className="text-xs text-[#9ca3af]">
            {items.length} {items.length === 1 ? "creation" : "creations"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 my-8 rounded-3xl bg-white/[0.02] border border-white/5 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-[#c5a880] mx-auto">
              <ShoppingBag size={24} />
            </div>
            <h2 className="font-serif text-xl text-white">Your Shopping Bag is Empty</h2>
            <p className="text-xs text-[#9ca3af] max-w-sm mx-auto">
              Browse our interactive 3D Wardrobe or inspect our haute couture collections.
            </p>
            <NextLink
              href="/wardrobe"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold hover:bg-[#e6d5b8] transition-colors"
            >
              <span>Explore 3D Wardrobe</span>
              <ArrowRight size={14} />
            </NextLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#0e0e12] border border-white/[0.06] hover:border-white/10 transition-colors flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-24 rounded-xl bg-[#18181e] overflow-hidden flex-shrink-0 relative border border-white/5">
                      <img
                        src={item.product.images.hero}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#c5a880] font-mono">
                        {item.product.collectionName}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg text-white font-medium">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-[#9ca3af] mt-0.5">
                        Size: {item.selectedSize} • Tone: {item.selectedColor.name}
                      </p>
                      <span className="text-xs font-serif text-[#c5a880] font-bold mt-1 block">
                        ${item.product.price.toLocaleString()} each
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-white/[0.05]">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 border border-white/10 rounded-full px-3 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-[#9ca3af] hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-xs font-mono text-white px-2">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-[#9ca3af] hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-base font-bold text-white block">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#9ca3af] hover:text-red-400 p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary & Checkout Column */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-[#0e0e12] border border-white/[0.08] shadow-2xl space-y-6 h-fit">
              <h2 className="font-serif text-xl text-white font-medium">
                Investment Dossier
              </h2>

              {/* Privilege Code Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Privilege Code (VESTRA10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#c5a880]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white text-xs font-medium transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponMessage && (
                <p
                  className={`text-xs ${
                    couponMessage.type === "success" ? "text-[#c5a880]" : "text-red-400"
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}

              {promoCode && (
                <div className="flex items-center justify-between bg-[#c5a880]/10 border border-[#c5a880]/20 rounded-xl px-3.5 py-2 text-xs text-[#c5a880]">
                  <span>{promoCode.description}</span>
                  <button onClick={removePromo} className="underline hover:text-white">
                    Remove
                  </button>
                </div>
              )}

              {/* Summary Breakdown */}
              <div className="space-y-2 text-xs text-[#9ca3af] pt-4 border-t border-white/[0.05]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#c5a880]">
                    <span>Privilege Benefit</span>
                    <span>-${discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Duty & Luxury Apparel Tax (8%)</span>
                  <span className="text-white">${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>White-Glove Courier Service</span>
                  <span className="text-white">
                    {shipping === 0 ? "Complimentary" : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-white pt-3 border-t border-white/[0.08]">
                  <span>Total Investment</span>
                  <span className="text-[#c5a880] font-bold">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  sounds.playClick();
                  router.push("/checkout");
                }}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0b0b0c] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(197,168,128,0.3)] transition-all"
              >
                <span>Proceed to Private Checkout</span>
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#9ca3af]">
                <ShieldCheck size={12} className="text-[#c5a880]" />
                <span>Encrypted Atelier Checkout • NFC Microchip Certificate</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

