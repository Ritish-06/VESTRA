"use client";

import React, { useState, useEffect } from "react";
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
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

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

  const handleAnimatedRemove = (itemId: string) => {
    setRemovingId(itemId);
    setTimeout(() => {
      removeItem(itemId);
      setRemovingId(null);
    }, 220);
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
      aria-hidden={!isOpen}
      aria-labelledby="cart-drawer-heading"
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#25241F]/35 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md bg-[#F8F6F1] border-l border-[#E5E0D7] shadow-2xl flex flex-col text-[#25241F] transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="p-6 bg-white border-b border-[#E5E0D7] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 id="cart-drawer-heading" className="font-serif text-lg tracking-wider text-[#25241F]">
                Client Shopping Bag
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F0EDE6] border border-[#E5E0D7] text-[#8C7352] font-sans font-medium tabular-nums">
                {items.length} {items.length === 1 ? "creation" : "creations"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#77736C] hover:text-[#25241F] hover:bg-[#F0EDE6] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Complimentary Courier Bar */}
          <div className="bg-[#F0EDE6] px-6 py-3 border-b border-[#E5E0D7]">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-[#77736C]">
                {remainingForFreeShipping === 0 ? (
                  <span className="text-[#607B60] font-semibold">✓ Complimentary Insured Courier Unlocked</span>
                ) : (
                  <span>
                    Add <strong className="text-[#25241F] tabular-nums">{formatPrice(remainingForFreeShipping)}</strong> for Complimentary Courier
                  </span>
                )}
              </span>
              <span className="text-[10px] text-[#77736C] font-mono tabular-nums">
                {Math.round(progressToFreeShipping)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#E5E0D7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B49A75] transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-[#E5E0D7]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#77736C]">
                <div className="w-16 h-16 rounded-full bg-[#F0EDE6] border border-[#E5E0D7] flex items-center justify-center text-[#B49A75] mb-4">
                  <ShieldCheck size={28} />
                </div>
                <p className="font-serif text-base text-[#25241F]">Your Shopping Bag is Empty</p>
                <p className="text-xs text-[#77736C] mt-1 max-w-xs">
                  Browse our 3D Wardrobe Rail or select bespoke creations to begin.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/wardrobe");
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#25241F] text-white text-xs font-semibold hover:bg-[#38362F] transition-colors cursor-pointer"
                >
                  Explore 3D Wardrobe
                </button>
              </div>
            ) : (
              items.map((item) => {
                const isRemoving = removingId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`pt-4 first:pt-0 flex gap-4 transition-all duration-200 ${
                      isRemoving ? "opacity-0 -translate-x-4 scale-95" : "opacity-100 translate-x-0 scale-100"
                    }`}
                  >
                    <div className="w-20 h-24 rounded-lg bg-[#F0EDE6] overflow-hidden shrink-0 relative border border-[#E5E0D7]">
                      <img
                        src={item.product.images?.hero || item.product.images?.modelFront}
                        alt={item.product.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-sm text-[#25241F] font-medium line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleAnimatedRemove(item.id)}
                            className="text-[#77736C] hover:text-[#B45C52] p-1 -mr-1 transition-colors cursor-pointer shrink-0"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-[#77736C]">
                          <span>Tone: {item.selectedColor.name}</span>
                          <span>•</span>
                          <span>Size: {item.selectedSize}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2 border border-[#E5E0D7] rounded-full px-2 py-0.5 bg-white">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                handleAnimatedRemove(item.id);
                              } else {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            className="text-[#77736C] hover:text-[#25241F] p-0.5 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-mono text-[#25241F] w-5 text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-[#77736C] hover:text-[#25241F] p-0.5 cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="font-serif text-sm text-[#8C7352] font-semibold tabular-nums">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E5E0D7] space-y-4">
              {/* Promo code entry */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Privilege Code (VESTRA10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-[#F8F6F1] border border-[#E5E0D7] rounded-lg pl-8 pr-3 py-2 text-xs text-[#25241F] placeholder-[#77736C] focus:outline-none focus:border-[#B49A75]"
                  />
                  <Tag size={13} className="text-[#77736C] absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#F0EDE6] hover:bg-[#E5E0D7] border border-[#E5E0D7] text-xs font-medium text-[#25241F] transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {couponMessage && (
                <p className={`text-[11px] font-medium ${couponMessage.type === "success" ? "text-[#607B60]" : "text-[#B45C52]"}`}>
                  {couponMessage.text}
                </p>
              )}

              {promoCode && (
                <div className="flex justify-between items-center bg-[#F0EDE6] border border-[#B49A75]/40 rounded-lg px-3 py-1.5 text-xs text-[#8C7352]">
                  <span>{promoCode.description}</span>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="underline text-[10px] hover:text-[#25241F] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-[#77736C] pt-2 border-t border-[#E5E0D7]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#25241F] font-medium tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#607B60] font-medium">
                    <span>Atelier Privilege</span>
                    <span className="tabular-nums">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Courier</span>
                  <span className="text-[#25241F] font-medium tabular-nums">
                    {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-[#25241F] pt-2 border-t border-[#E5E0D7]">
                  <span>Total</span>
                  <span className="text-[#8C7352] font-bold tabular-nums">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-full bg-[#25241F] hover:bg-[#38362F] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>

              <div className="text-center">
                <NextLink
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] text-[#77736C] hover:text-[#25241F] underline transition-colors"
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
