"use client";

import React, { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { sounds } from "@/utils/soundEffects";

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    setIsOpen,
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

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();

  const freeShippingThreshold = 1500;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

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

  const handleProceedToCheckout = () => {
    sounds.playClick();
    setIsOpen(false);
    router.push("/checkout");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f0f12] border-l border-white/[0.08] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 id="cart-drawer-heading" className="font-serif text-lg tracking-wider text-white">
                Client Shopping Bag
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#c5a880]/15 text-[#c5a880] font-sans">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Complimentary Courier Bar */}
          <div className="bg-[#141418] px-6 py-3 border-b border-white/[0.04]">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-[#9ca3af]">
                {remainingForFreeShipping === 0 ? (
                  <span className="text-[#c5a880] font-medium flex items-center gap-1">
                    <Sparkles size={12} /> Complimentary White-Glove Courier Unlocked
                  </span>
                ) : (
                  <span>Add ${remainingForFreeShipping.toLocaleString()} for Complimentary Courier</span>
                )}
              </span>
              <span className="text-white font-mono">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c5a880] transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-[#c5a880] mb-4">
                  <Tag size={24} />
                </div>
                <h3 className="font-serif text-lg text-white mb-2">Your Bag is Empty</h3>
                <p className="text-xs text-[#9ca3af] max-w-xs mb-6">
                  Explore our interactive 3D Wardrobe or seasonal collections to add pieces to your curated bag.
                </p>
                <NextLink
                  href="/wardrobe"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold tracking-wider hover:bg-[#e6d5b8] transition-colors"
                >
                  Enter 3D Wardrobe
                </NextLink>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors flex gap-4"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#1a1a1f] flex-shrink-0">
                    <Image
                      src={item.product.images.hero}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Item info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm text-white truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#9ca3af] hover:text-red-400 p-1 transition-colors"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#9ca3af] mt-0.5">
                        {item.selectedSize} • {item.selectedColor.name}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border border-white/10 rounded-full px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-[#9ca3af] hover:text-white p-0.5"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-xs font-mono text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-[#9ca3af] hover:text-white p-0.5"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      {/* Line Price */}
                      <div className="text-right">
                        <span className="text-xs font-medium text-white">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/[0.08] bg-[#0c0c0e] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Privilege Code (e.g. VESTRA10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#c5a880]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.08] text-white hover:bg-[#c5a880] hover:text-[#0b0b0c] text-xs font-medium transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponMessage && (
                <p
                  className={`text-[11px] ${
                    couponMessage.type === "success" ? "text-[#c5a880]" : "text-red-400"
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}

              {promoCode && (
                <div className="flex items-center justify-between bg-[#c5a880]/10 border border-[#c5a880]/20 rounded-lg px-3 py-1.5 text-xs text-[#c5a880]">
                  <span>{promoCode.description}</span>
                  <button
                    onClick={removePromo}
                    className="text-xs hover:text-white underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-[#9ca3af] pt-2 border-t border-white/[0.05]">
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
                  <span>Luxury Apparel Duty (Est.)</span>
                  <span className="text-white">${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Courier Service</span>
                  <span className="text-white">
                    {shipping === 0 ? "Complimentary" : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-serif text-white pt-2 border-t border-white/[0.08]">
                  <span>Total Investment</span>
                  <span className="text-[#c5a880] font-bold">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0b0b0c] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(197,168,128,0.3)] transition-all"
              >
                <span>Proceed to Private Checkout</span>
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#9ca3af]">
                <ShieldCheck size={12} className="text-[#c5a880]" />
                <span>Encrypted Atelier Checkout • NFC Authenticated Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

