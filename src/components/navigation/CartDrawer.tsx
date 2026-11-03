"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { sounds } from "@/utils/soundEffects";
import { formatPrice, FREE_STANDARD_SHIPPING_THRESHOLD } from "@/lib/commerce";

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
  const shipping = getShipping();
  const total = getTotal();

  const freeShippingThreshold = FREE_STANDARD_SHIPPING_THRESHOLD;
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
                {items.length} {items.length === 1 ? "creation" : "creations"}
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
                  <span className="text-[#c5a880] font-medium">✓ Complimentary Insured Courier Unlocked</span>
                ) : (
                  <span>
                    Add <strong className="text-white">{formatPrice(remainingForFreeShipping)}</strong> for Complimentary Courier
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[#6b7280] font-mono">
                {Math.round(progressToFreeShipping)}%
              </span>
            </div>
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#9a7b4f] to-[#c5a880] transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-white/[0.04]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#9ca3af]">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-[#c5a880] mb-4">
                  <ShieldCheck size={28} />
                </div>
                <p className="font-serif text-base text-white">Your Shopping Bag is Empty</p>
                <p className="text-xs text-[#6b7280] mt-1 max-w-xs">
                  Browse our 3D Wardrobe Rail or select bespoke archival creations to begin.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/wardrobe");
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#c5a880] text-[#0f0f12] text-xs font-semibold hover:bg-[#e6d5b8] transition-colors"
                >
                  Explore 3D Wardrobe
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  <div className="w-20 h-24 rounded-lg bg-[#18181e] overflow-hidden flex-shrink-0 relative border border-white/[0.06]">
                    <img
                      src={item.product.images?.hero || item.product.images?.modelFront}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm text-white line-clamp-1">{item.product.name}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#6b7280] hover:text-red-400 p-1 -mr-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#9ca3af]">
                        <span>Tone: {item.selectedColor.name}</span>
                        <span>•</span>
                        <span>Size: {item.selectedSize}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2 border border-white/10 rounded-full px-2 py-0.5 bg-white/[0.02]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-[#9ca3af] hover:text-white p-0.5"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-mono text-white px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-[#9ca3af] hover:text-white p-0.5"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="font-serif text-sm text-[#c5a880] font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-[#141418] border-t border-white/[0.06] space-y-4">
              {/* Promo code entry */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Privilege Code (VESTRA10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-[#0f0f12] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#c5a880]"
                  />
                  <Tag size={13} className="text-[#6b7280] absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponMessage && (
                <p className={`text-[11px] ${couponMessage.type === "success" ? "text-[#c5a880]" : "text-red-400"}`}>
                  {couponMessage.text}
                </p>
              )}

              {promoCode && (
                <div className="flex justify-between items-center bg-[#c5a880]/10 border border-[#c5a880]/20 rounded-lg px-3 py-1.5 text-xs text-[#c5a880]">
                  <span>{promoCode.description}</span>
                  <button onClick={removePromo} className="underline text-[10px] hover:text-white">
                    Remove
                  </button>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-[#9ca3af] pt-2 border-t border-white/[0.04]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#c5a880]">
                    <span>Atelier Privilege</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Courier</span>
                  <span className="text-white">
                    {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-white pt-2 border-t border-white/[0.06]">
                  <span>Total</span>
                  <span className="text-[#c5a880] font-bold">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-full bg-[#c5a880] hover:bg-[#e6d5b8] text-[#0f0f12] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>

              <div className="text-center">
                <NextLink
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] text-[#9ca3af] hover:text-white underline transition-colors"
                >
                  View Full Shopping Bag Page
                </NextLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
