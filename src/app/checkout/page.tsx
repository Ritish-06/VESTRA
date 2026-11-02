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
} from "lucide-react";

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

  const [fullName, setFullName] = useState("Alexandre De Vestra");
  const [email, setEmail] = useState("alexandre@vestra-atelier.com");
  const [address, setAddress] = useState("14 Rue de la Paix");
  const [city, setCity] = useState("Paris");
  const [postalCode, setPostalCode] = useState("75002");
  const [country, setCountry] = useState("France");

  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 8842");
  const [cardExpiry, setCardExpiry] = useState("11/29");
  const [cardCvc, setCardCvc] = useState("•••");
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsProcessing(true);
    sounds.playClick();

    setTimeout(() => {
      const order = createOrder({
        fullName,
        email,
        address,
        city,
        postalCode,
        country,
      });

      setIsProcessing(false);
      setCompletedOrderNumber(order.orderNumber);

      // Gold confetti shower
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#c5a880", "#e6d5b8", "#f5f4f0", "#8c734b"],
        });
      } catch {}
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#f5f4f0] flex flex-col relative overflow-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {completedOrderNumber ? (
          /* Order Confirmation Screen */
          <div className="max-w-2xl mx-auto text-center py-16 px-6 rounded-3xl bg-[#0e0e12] border border-[#c5a880]/30 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#c5a880]/15 border border-[#c5a880] flex items-center justify-center text-[#c5a880] mx-auto">
              <CheckCircle2 size={32} />
            </div>

            <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono block">
              Bespoke Order Authenticated
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium">
              Thank You for Your Patronage
            </h1>

            <p className="text-xs text-[#9ca3af] leading-relaxed max-w-md mx-auto">
              Your order <span className="text-white font-mono font-bold">#{completedOrderNumber}</span> has been transferred to our master tailors. An NFC encrypted certificate of authenticity will accompany your garment box.
            </p>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#9ca3af] max-w-sm mx-auto flex items-center justify-between">
              <span>Courier Destination</span>
              <span className="text-white font-medium">{city}, {country}</span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.push("/orders")}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold tracking-wider hover:bg-[#e6d5b8] transition-colors flex items-center justify-center gap-2"
              >
                <span>Track Private Courier Timeline</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => router.push("/wardrobe")}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/[0.05] hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors"
              >
                Return to 3D Wardrobe
              </button>
            </div>
          </div>
        ) : (
          /* Standard Checkout Form */
          <div>
            <div className="pb-8 border-b border-white/[0.08] mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono">
                Secure Client Transaction
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium mt-1">
                Private Atelier Checkout
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Form Side */}
              <form onSubmit={handleCompleteOrder} className="lg:col-span-7 space-y-8">
                {/* 1. Identity & Shipping */}
                <div className="p-6 rounded-3xl bg-[#0e0e12] border border-white/[0.08] shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-xs text-[#c5a880] font-mono uppercase tracking-wider">
                    <Truck size={15} />
                    <span>1. White-Glove Shipping Dossier</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-[#9ca3af] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#9ca3af] mb-1">Private Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#9ca3af] mb-1">Residence Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#9ca3af] mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#9ca3af] mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#9ca3af] mb-1">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#c5a880]"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Payment Method */}
                <div className="p-6 rounded-3xl bg-[#0e0e12] border border-white/[0.08] shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-xs text-[#c5a880] font-mono uppercase tracking-wider">
                    <CreditCard size={15} />
                    <span>2. Encrypted Atelier Payment</span>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#1a1a22] to-[#121216] border border-[#c5a880]/30 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-serif tracking-widest text-[#c5a880] font-bold">VESTRA VAULT PASS</span>
                      <Lock size={13} className="text-[#c5a880]" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-[#6b7280] font-mono">ACCOUNT NUMBER</span>
                      <p className="font-mono text-sm tracking-widest text-white">{cardNumber}</p>
                    </div>

                    <div className="flex justify-between text-xs text-[#9ca3af] font-mono">
                      <span>VALID THRU: {cardExpiry}</span>
                      <span>SEC: {cardCvc}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || items.length === 0}
                    className={`w-full py-4 rounded-full font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-xl ${
                      isProcessing
                        ? "bg-white/20 text-white cursor-wait"
                        : "bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0b0b0c] hover:shadow-[0_0_25px_rgba(197,168,128,0.3)]"
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Sparkles size={14} className="animate-spin" />
                        <span>Authorizing Archival Order...</span>
                      </span>
                    ) : (
                      <span>Complete Order • ${total.toLocaleString()}</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Order Summary Side */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-3xl bg-[#0e0e12] border border-white/[0.08] shadow-xl space-y-4">
                  <h3 className="font-serif text-lg text-white font-medium">
                    Order Summary ({items.length})
                  </h3>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 items-center text-xs">
                        <div className="w-12 h-14 rounded-lg bg-[#18181e] overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.images.hero}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-white truncate">{item.product.name}</h4>
                          <p className="text-[10px] text-[#9ca3af]">
                            {item.selectedSize} • {item.selectedColor.name} (x{item.quantity})
                          </p>
                        </div>
                        <span className="font-mono text-white">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-white/[0.06] text-xs text-[#9ca3af]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-white">${subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-[#c5a880]">
                        <span>Privilege Discount</span>
                        <span>-${discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Apparel Tax (8%)</span>
                      <span className="text-white">${tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Courier Service</span>
                      <span className="text-white">
                        {shipping === 0 ? "Complimentary" : `$${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-serif text-white pt-2 border-t border-white/[0.08]">
                      <span>Total</span>
                      <span className="text-[#c5a880] font-bold">
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
