"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import { useCartStore } from "@/store/useCartStore";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Bookmark,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    savedForLater,
    removeItem,
    saveItemForLater,
    moveToCart,
    updateQuantity,
    getSubtotal,
    getDiscount,
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="pb-8 border-b border-[#1C1917]/[0.08] flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono">
              Client Portfolio
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1917] font-medium mt-1">
              Your Curated Bag
            </h1>
          </div>
          <span className="text-xs text-[#78716C]">
            {items.length} {items.length === 1 ? "creation" : "creations"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 my-8 rounded-3xl atelier-card max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full border border-[#1C1917]/10 flex items-center justify-center text-[#9A7B4F] mx-auto bg-[#FAF8F5]">
              <ShoppingBag size={24} />
            </div>
            <h2 className="font-serif text-xl text-[#1C1917]">Your Shopping Bag is Empty</h2>
            <p className="text-xs text-[#78716C] max-w-sm mx-auto">
              Browse our interactive 3D Wardrobe or inspect our haute couture collections.
            </p>
            <NextLink
              href="/wardrobe"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold hover:bg-[#2A2725] transition-colors"
            >
              <span>Explore 3D Wardrobe</span>
              <ArrowRight size={14} className="text-[#C5A880]" />
            </NextLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl atelier-card flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <div
                      className="w-20 h-24 rounded-xl bg-white overflow-hidden shrink-0 relative border border-[#1C1917]/[0.08]"
                      style={{ width: "80px", height: "96px" }}
                    >
                      <img
                        src={item.product.images?.hero || item.product.images?.modelFront}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#9A7B4F] font-mono">
                        {item.product.collectionName}
                      </span>
                      <NextLink href={`/product/${item.product.slug || item.product.id}`}>
                        <h3 className="font-serif text-base sm:text-lg text-[#1C1917] font-medium hover:text-[#9A7B4F] transition-colors">
                          {item.product.name}
                        </h3>
                      </NextLink>
                      <p className="text-xs text-[#78716C] mt-0.5">
                        Size: {item.selectedSize} • Tone: {item.selectedColor.name}
                      </p>
                      <span className="text-xs font-serif text-[#9A7B4F] font-bold mt-1 block">
                        {formatPrice(item.product.price)} each
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#1C1917]/[0.06]">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 border border-[#1C1917]/15 rounded-full px-3 py-1 bg-[#FAF8F5]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-[#78716C] hover:text-[#1C1917]"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-xs font-mono text-[#1C1917] px-2 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-[#78716C] hover:text-[#1C1917]"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="font-serif text-base font-bold text-[#1C1917] block">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => saveItemForLater(item.id)}
                        className="text-[#78716C] hover:text-[#9A7B4F] p-1.5 transition-colors"
                        title="Save for later"
                        aria-label="Save for later"
                      >
                        <Bookmark size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[#78716C] hover:text-red-600 p-1.5 transition-colors"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Saved For Later Section */}
              {savedForLater && savedForLater.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#1C1917]/[0.08]">
                  <h3 className="font-serif text-base font-medium text-[#1C1917] mb-3">
                    Saved for Later ({savedForLater.length})
                  </h3>
                  <div className="space-y-3">
                    {savedForLater.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-white border border-[#1C1917]/[0.06] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.images?.hero}
                            alt={item.product.name}
                            className="w-12 h-14 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="font-serif text-sm font-medium text-[#1C1917]">
                              {item.product.name}
                            </h4>
                            <span className="text-xs text-[#9A7B4F] font-serif font-bold">
                              {formatPrice(item.product.price)}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => moveToCart(item.id)}
                          className="px-4 py-1.5 rounded-full border border-[#1C1917]/15 hover:border-[#9A7B4F] text-xs font-medium text-[#1C1917]"
                        >
                          Move to Bag
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Summary & Checkout Column */}
            <div className="lg:col-span-4 p-6 rounded-3xl atelier-card space-y-6 h-fit">
              <h2 className="font-serif text-xl text-[#1C1917] font-medium">
                Investment Dossier
              </h2>

              {/* Privilege Code Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Privilege Code (VESTRA10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-[#FAF8F5] border border-[#1C1917]/15 rounded-xl px-3.5 py-2 text-xs text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#C5A880]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1C1917] hover:bg-[#2A2725] text-white text-xs font-medium transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponMessage && (
                <p
                  className={`text-xs ${
                    couponMessage.type === "success" ? "text-[#9A7B4F]" : "text-red-600"
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}

              {promoCode && (
                <div className="flex items-center justify-between bg-[#C5A880]/15 border border-[#C5A880]/30 rounded-xl px-3.5 py-2 text-xs text-[#9A7B4F]">
                  <span>{promoCode.description}</span>
                  <button type="button" onClick={removePromo} className="underline hover:text-[#1C1917]">
                    Remove
                  </button>
                </div>
              )}

              {/* Summary Breakdown */}
              <div className="space-y-2 text-xs text-[#78716C] pt-4 border-t border-[#1C1917]/[0.06]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#1C1917] font-mono">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#9A7B4F]">
                    <span>Privilege Benefit</span>
                    <span className="font-mono">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White-Glove Courier</span>
                  <span className="text-[#1C1917] font-mono">
                    {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-[#1C1917] pt-3 border-t border-[#1C1917]/[0.08] font-bold">
                  <span>Total Investment</span>
                  <span className="text-[#9A7B4F]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  router.push("/checkout");
                }}
                className="w-full py-4 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-white font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Proceed to Private Checkout</span>
                <ArrowRight size={14} className="text-[#C5A880]" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#78716C]">
                <ShieldCheck size={12} className="text-[#9A7B4F]" />
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
