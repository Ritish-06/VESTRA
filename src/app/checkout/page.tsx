"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { useCartStore } from "@/store/useCartStore";
import { sounds } from "@/utils/soundEffects";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  PackageCheck,
} from "lucide-react";

type CheckoutStep = "shipping" | "delivery" | "payment" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    getSubtotal,
    getDiscount,
    getTax,
    getShipping,
    getTotal,
    createOrder,
  } = useCartStore();

  const [step, setStep] = useState<CheckoutStep>("shipping");

  // Step 1: Shipping Details
  const [fullName, setFullName] = useState("Alexandre De Vestra");
  const [email, setEmail] = useState("alexandre@vestra-atelier.com");
  const [phone, setPhone] = useState("+33 1 42 68 55 00");
  const [address, setAddress] = useState("14 Rue de la Paix");
  const [city, setCity] = useState("Paris");
  const [stateRegion, setStateRegion] = useState("Île-de-France");
  const [postalCode, setPostalCode] = useState("75002");
  const [country, setCountry] = useState("France");

  // Step 2: Delivery Option
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");

  // Step 3: Payment
  const [paymentProvider, setPaymentProvider] = useState<"vault" | "card">("vault");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 8842");
  const [cardExpiry, setCardExpiry] = useState("11/29");
  const [cardCvc, setCardCvc] = useState("•••");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const tax = getTax();
  const baseShipping = getShipping();
  const deliverySurcharge = deliveryMethod === "express" ? 75 : 0;
  const shipping = baseShipping + deliverySurcharge;
  const total = subtotal - discount + tax + shipping;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    if (step === "shipping") setStep("delivery");
    else if (step === "delivery") setStep("payment");
    else if (step === "payment") setStep("review");
  };

  const handleCompleteOrder = () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    sounds.playClick();

    setTimeout(() => {
      const order = createOrder({
        fullName,
        email,
        address: `${address}, ${stateRegion}`,
        city,
        postalCode,
        country,
      });

      setIsProcessing(false);

      // Gold celebratory shower
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C5A880", "#E6D5B8", "#1C1917", "#8C734B"],
        });
      } catch {}

      sounds.playChime();
      router.push(`/order-confirmation/${order.orderNumber}`);
    }, 1500);
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
                    onClick={() => setDeliveryMethod("standard")}
                    className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                      deliveryMethod === "standard"
                        ? "border-[#C5A880] bg-[#C5A880]/10 shadow-xs"
                        : "border-[#1C1917]/10 bg-[#FAF8F5]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${deliveryMethod === "standard" ? "border-[#C5A880]" : "border-stone-400"}`}>
                          {deliveryMethod === "standard" && <div className="w-2 h-2 rounded-full bg-[#C5A880]" />}
                        </div>
                        <div>
                          <h4 className="font-serif text-sm text-[#1C1917] font-medium">Standard White-Glove Courier</h4>
                          <p className="text-xs text-[#78716C]">Estimated Delivery: 3 to 5 business days</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#1C1917]">
                        {baseShipping === 0 ? "Complimentary" : `$${baseShipping}`}
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod("express")}
                    className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                      deliveryMethod === "express"
                        ? "border-[#C5A880] bg-[#C5A880]/10 shadow-xs"
                        : "border-[#1C1917]/10 bg-[#FAF8F5]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${deliveryMethod === "express" ? "border-[#C5A880]" : "border-stone-400"}`}>
                          {deliveryMethod === "express" && <div className="w-2 h-2 rounded-full bg-[#C5A880]" />}
                        </div>
                        <div>
                          <h4 className="font-serif text-sm text-[#1C1917] font-medium">Express Climate-Controlled Flight</h4>
                          <p className="text-xs text-[#78716C]">Estimated Delivery: 24 to 48 hours guaranteed</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#9A7B4F]">+$75</span>
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
                  <span>Step 3 — Encrypted Payment Gateway</span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider("vault")}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      paymentProvider === "vault"
                        ? "bg-[#1C1917] text-white border-[#1C1917]"
                        : "bg-[#FAF8F5] text-[#78716C] border-[#1C1917]/10"
                    }`}
                  >
                    VESTRA Vault Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentProvider("card")}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      paymentProvider === "card"
                        ? "bg-[#1C1917] text-white border-[#1C1917]"
                        : "bg-[#FAF8F5] text-[#78716C] border-[#1C1917]/10"
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                </div>

                {/* Vault Card Visual */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1C1917] to-[#121110] text-white border border-[#C5A880]/40 space-y-4 shadow-lg">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-serif tracking-widest text-[#C5A880] font-bold">VESTRA ATELIER PASS</span>
                    <Lock size={13} className="text-[#C5A880]" />
                  </div>

                  <div>
                    <span className="text-[10px] text-[#A8A29E] font-mono block">ENCRYPTED ACCOUNT</span>
                    <p className="font-mono text-base tracking-widest text-white mt-1">{cardNumber}</p>
                  </div>

                  <div className="flex justify-between text-xs text-[#A8A29E] font-mono pt-2 border-t border-white/10">
                    <span>HOLDER: {fullName.toUpperCase()}</span>
                    <span>EXP: {cardExpiry}</span>
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
                      {deliveryMethod === "express" ? "Express Air Flight (24-48h)" : "Standard White-Glove (3-5d)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Payment Authorization</span>
                    <span className="text-[#9A7B4F] font-mono font-bold">VESTRA VAULT (•••• 8842)</span>
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
                    className="flex-1 py-4 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-[#FAF8F5] font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer transition-all"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Sparkles size={14} className="animate-spin text-[#C5A880]" />
                        <span>Authorizing Transaction...</span>
                      </span>
                    ) : (
                      <span>Complete Purchase • ${total.toLocaleString()}</span>
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
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-[#1C1917]/[0.08] text-xs text-[#78716C]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#1C1917]">${subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#9A7B4F]">
                    <span>Privilege Benefit</span>
                    <span>-${discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Apparel Duty (8%)</span>
                  <span className="text-[#1C1917]">${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Courier Service</span>
                  <span className="text-[#1C1917]">
                    {shipping === 0 ? "Complimentary" : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif text-[#1C1917] pt-3 border-t border-[#1C1917]/[0.08]">
                  <span>Total Investment</span>
                  <span className="text-[#1C1917] font-bold">
                    ${total.toLocaleString()}
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
