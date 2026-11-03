"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { useCartStore } from "@/store/useCartStore";
import { sounds } from "@/utils/soundEffects";
import { formatPrice, DELIVERY_OPTIONS, DeliveryMethodId } from "@/lib/commerce";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PackageCheck,
  AlertCircle,
} from "lucide-react";

type CheckoutStep = "shipping" | "delivery" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    promoCode,
    getSubtotal,
    getDiscount,
    clearCart,
  } = useCartStore();

  const [step, setStep] = useState<CheckoutStep>("shipping");

  // Step 1: Shipping Details
  const [fullName, setFullName] = useState("Alexandre De Vestra");
  const [email, setEmail] = useState("alexandre@vestra-atelier.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("14, Nariman Point, Marine Drive");
  const [city, setCity] = useState("Mumbai");
  const [stateRegion, setStateRegion] = useState("Maharashtra");
  const [postalCode, setPostalCode] = useState("400021");
  const [country, setCountry] = useState("India");

  // Step 2: Delivery Option
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodId>("STANDARD");

  // Step 3: Payment Method
  const [paymentProvider, setPaymentProvider] = useState<"RAZORPAY" | "TEST_MODE">("TEST_MODE");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const discountedSubtotal = Math.max(0, subtotal - discount);

  // Delivery calculation from commerce rules
  const standardFee = discountedSubtotal >= 50000 ? 0 : DELIVERY_OPTIONS.STANDARD.fee;
  const shipping = deliveryMethod === "EXPRESS" ? DELIVERY_OPTIONS.EXPRESS.fee : standardFee;
  const total = discountedSubtotal + shipping;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setErrorMessage(null);
    if (step === "shipping") setStep("delivery");
    else if (step === "delivery") setStep("payment");
    else if (step === "payment") setStep("review");
  };

  const handleCompleteOrder = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setErrorMessage(null);
    sounds.playClick();

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.product.id,
          colorId: i.selectedColor.id,
          size: i.selectedSize,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName,
          email,
          phone,
          address,
          city,
          state: stateRegion,
          postalCode,
          country,
        },
        deliveryMethod,
        couponCode: promoCode?.code,
        idempotencyKey: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        paymentMethod: paymentProvider,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to authenticate order with atelier vault.");
        setIsProcessing(false);
        return;
      }

      clearCart();
      setIsProcessing(false);

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#C5A880", "#E6D5B8", "#1C1917", "#8C734B"],
        });
      } catch {}

      sounds.playChime();
      const tokenQuery = data.order.accessToken ? `?token=${data.order.accessToken}` : "";
      router.push(`/order-confirmation/${data.order.orderNumber}${tokenQuery}`);
    } catch {
      setErrorMessage("Network disruption while authorizing payment. Please retry.");
      setIsProcessing(false);
    }
  };

  const stepList: { id: CheckoutStep; label: string; number: number }[] = [
    { id: "shipping", label: "1. Client Dossier", number: 1 },
    { id: "delivery", label: "2. Courier Service", number: 2 },
    { id: "payment", label: "3. Encrypted Payment", number: 3 },
    { id: "review", label: "4. Final Review", number: 4 },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="pb-8 border-b border-[#1C1917]/[0.08] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono">
                Secure Atelier Protocol
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-medium mt-1">
                Private Client Checkout
              </h1>
            </div>

            {/* Step Progress Pill */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-[#1C1917]/[0.08] shadow-xs text-xs">
              {stepList.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setStep(s.id);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    step === s.id
                      ? "bg-[#1C1917] text-[#FAF8F5]"
                      : "text-[#78716C] hover:text-[#1C1917]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-3">
            <AlertCircle size={18} className="text-red-600 shrink-0" />
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Step Form Container */}
          <div className="lg:col-span-7">
            {step === "shipping" && (
              <form onSubmit={handleNextStep} className="bg-white p-8 rounded-3xl border border-[#1C1917]/[0.08] shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-xs text-[#9A7B4F] font-mono uppercase tracking-wider">
                  <Truck size={15} />
                  <span>Step 1 — Shipping & Residence Dossier</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#1C1917]/10 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1">Private Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#1C1917]/10 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1">Direct Phone Contact</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1C1917]/10 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1C1917]/10 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#1C1917]/10 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#1C1917]/10 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#1C1917]/10 rounded-xl px-3.5 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-[#FAF8F5] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span>Proceed to Courier Method</span>
                  <ArrowRight size={14} className="text-[#C5A880]" />
                </button>
              </form>
            )}

            {step === "delivery" && (
              <form onSubmit={handleNextStep} className="bg-white p-8 rounded-3xl border border-[#1C1917]/[0.08] shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-xs text-[#9A7B4F] font-mono uppercase tracking-wider">
                  <PackageCheck size={15} />
                  <span>Step 2 — Courier & Delivery Option</span>
                </div>

                <div className="space-y-4">
                  <label
                    onClick={() => setDeliveryMethod("STANDARD")}
                    className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                      deliveryMethod === "STANDARD"
                        ? "border-[#C5A880] bg-[#C5A880]/10 shadow-xs"
                        : "border-[#1C1917]/10 bg-[#FAF8F5]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${deliveryMethod === "STANDARD" ? "border-[#C5A880]" : "border-stone-400"}`}>
                          {deliveryMethod === "STANDARD" && <div className="w-2 h-2 rounded-full bg-[#C5A880]" />}
                        </div>
                        <div>
                          <h4 className="font-serif text-sm text-[#1C1917] font-medium">Standard White-Glove Courier</h4>
                          <p className="text-xs text-[#78716C]">Estimated Delivery: 4 to 6 business days</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#1C1917]">
                        {standardFee === 0 ? "Complimentary" : formatPrice(DELIVERY_OPTIONS.STANDARD.fee)}
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod("EXPRESS")}
                    className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                      deliveryMethod === "EXPRESS"
                        ? "border-[#C5A880] bg-[#C5A880]/10 shadow-xs"
                        : "border-[#1C1917]/10 bg-[#FAF8F5]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${deliveryMethod === "EXPRESS" ? "border-[#C5A880]" : "border-stone-400"}`}>
                          {deliveryMethod === "EXPRESS" && <div className="w-2 h-2 rounded-full bg-[#C5A880]" />}
                        </div>
                        <div>
                          <h4 className="font-serif text-sm text-[#1C1917] font-medium">Express Priority Air Flight</h4>
                          <p className="text-xs text-[#78716C]">Estimated Delivery: 24 to 48 hours guaranteed</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#9A7B4F]">
                        {formatPrice(DELIVERY_OPTIONS.EXPRESS.fee)}
                      </span>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="px-6 py-4 rounded-full border border-[#1C1917]/10 text-xs text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-[#FAF8F5] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight size={14} className="text-[#C5A880]" />
                  </button>
                </div>
              </form>
            )}

            {step === "payment" && (
              <form onSubmit={handleNextStep} className="bg-white p-8 rounded-3xl border border-[#1C1917]/[0.08] shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-xs text-[#9A7B4F] font-mono uppercase tracking-wider">
                  <CreditCard size={15} />
                  <span>Step 3 — Payment Authorization</span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider("TEST_MODE")}
                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-medium transition-all ${
                      paymentProvider === "TEST_MODE"
                        ? "bg-[#1C1917] text-white border-[#1C1917]"
                        : "bg-[#FAF8F5] text-[#78716C] border-[#1C1917]/10"
                    }`}
                  >
                    Atelier Test Mode (Zero charge)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentProvider("RAZORPAY")}
                    className={`flex-1 py-3 px-4 rounded-xl border text-xs font-medium transition-all ${
                      paymentProvider === "RAZORPAY"
                        ? "bg-[#1C1917] text-white border-[#1C1917]"
                        : "bg-[#FAF8F5] text-[#78716C] border-[#1C1917]/10"
                    }`}
                  >
                    Razorpay Gateway (INR)
                  </button>
                </div>

                {/* Vault Pass / Card Visual */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1C1917] to-[#121110] text-white border border-[#C5A880]/40 space-y-4 shadow-lg">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-serif tracking-widest text-[#C5A880] font-bold">
                      {paymentProvider === "RAZORPAY" ? "RAZORPAY SECURE GATEWAY" : "ATELIER TEST VAULT"}
                    </span>
                    <Lock size={13} className="text-[#C5A880]" />
                  </div>

                  <div>
                    <span className="text-[10px] text-[#A8A29E] font-mono block">AUTHORIZATION PROTOCOL</span>
                    <p className="font-mono text-sm tracking-widest text-white mt-1">
                      {paymentProvider === "RAZORPAY" ? "UPI • Cards • NetBanking • EMI" : "SANDBOX • 100% SECURE DEMO PASS"}
                    </p>
                  </div>

                  <div className="flex justify-between text-xs text-[#A8A29E] font-mono pt-2 border-t border-white/10">
                    <span>CLIENT: {fullName.toUpperCase()}</span>
                    <span>CURRENCY: INR (₹)</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("delivery")}
                    className="px-6 py-4 rounded-full border border-[#1C1917]/10 text-xs text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-[#FAF8F5] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <span>Proceed to Order Review</span>
                    <ArrowRight size={14} className="text-[#C5A880]" />
                  </button>
                </div>
              </form>
            )}

            {step === "review" && (
              <div className="bg-white p-8 rounded-3xl border border-[#1C1917]/[0.08] shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-xs text-[#9A7B4F] font-mono uppercase tracking-wider">
                  <CheckCircle2 size={15} />
                  <span>Step 4 — Final Client Order Review</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#1C1917]/[0.06] space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Recipient</span>
                    <span className="text-[#1C1917] font-medium">{fullName} ({email})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Destination</span>
                    <span className="text-[#1C1917] font-medium">{address}, {city}, {country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Courier Method</span>
                    <span className="text-[#1C1917] font-medium">
                      {deliveryMethod === "EXPRESS" ? "Express Priority Air (24-48h)" : "Standard White-Glove (4-6d)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Payment Channel</span>
                    <span className="text-[#9A7B4F] font-mono font-bold">
                      {paymentProvider === "RAZORPAY" ? "Razorpay (Test Mode)" : "Atelier Test Mode (Zero charge)"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("payment")}
                    className="px-6 py-4 rounded-full border border-[#1C1917]/10 text-xs text-[#78716C] hover:text-[#1C1917] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    disabled={isProcessing}
                    className="flex-1 py-4 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-[#FAF8F5] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer transition-all disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Sparkles size={14} className="animate-spin text-[#C5A880]" />
                        <span>Authorizing Transaction in Atelier Vault...</span>
                      </span>
                    ) : (
                      <span>Complete Purchase • {formatPrice(total)}</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#1C1917]/[0.08] shadow-sm space-y-5">
              <h3 className="font-serif text-lg text-[#1C1917] font-medium">
                Shopping Bag ({items.length})
              </h3>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center text-xs">
                    <div className="w-12 h-14 rounded-lg bg-[#FAF8F5] overflow-hidden flex-shrink-0 border border-[#1C1917]/10">
                      <img
                        src={item.product.images.hero}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-[#1C1917] truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-[#78716C]">
                        {item.selectedSize} • {item.selectedColor.name} (x{item.quantity})
                      </p>
                    </div>
                    <span className="font-mono text-[#1C1917] font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-[#1C1917]/[0.08] text-xs text-[#78716C]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#1C1917]">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#9A7B4F]">
                    <span>Privilege Benefit</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Courier Service</span>
                  <span className="text-[#1C1917]">
                    {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-[#1C1917] pt-3 border-t border-[#1C1917]/[0.08]">
                  <span>Total Investment</span>
                  <span className="text-[#1C1917] font-bold">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#1C1917]/[0.08] text-[11px] text-[#78716C] flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-[#C5A880] flex-shrink-0" />
              <span>White-Glove Courier with NFC Authenticated Encrypted Certificate.</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
