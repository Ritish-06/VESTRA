"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { ArrowLeft, User, Sparkles, ShieldCheck, Check, Bell } from "lucide-react";

export default function ProfileSettingsPage() {
  const { styleProfile } = useWardrobeStore();
  const [name, setName] = useState(styleProfile.name);
  const [aesthetic, setAesthetic] = useState(styleProfile.aesthetic);
  const [heightCm, setHeightCm] = useState(styleProfile.heightCm);
  const [typicalSize, setTypicalSize] = useState(styleProfile.typicalSize);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col justify-between selection:bg-[#B49A75]/25 selection:text-[#25241F]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-8">
        <div className="space-y-1 border-b border-[#E5E0D7] pb-6">
          <NextLink
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#8C7352] hover:text-[#25241F] transition-colors mb-2"
          >
            <ArrowLeft size={13} />
            <span>Back to Profile</span>
          </NextLink>
          <h1 className="text-exhibition-title text-[#25241F] font-normal">
            Account Preferences & Style DNA
          </h1>
          <p className="text-xs text-[#77736C]">
            Configure your biometric measurements, curatorial aesthetic profile, and notification settings.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Sartorial Profile */}
          <div className="p-8 rounded-3xl bg-white border border-[#E5E0D7] space-y-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#8C7352]">
              <Sparkles size={14} className="text-[#B49A75]" />
              <span>SARTORIAL IDENTITY & MEASUREMENTS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#77736C] mb-2">
                  Client Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F6F1] border border-[#E5E0D7] text-xs text-[#25241F] focus:outline-none focus:border-[#B49A75]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#77736C] mb-2">
                  Aesthetic DNA Archetype
                </label>
                <input
                  type="text"
                  value={aesthetic}
                  onChange={(e) => setAesthetic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F6F1] border border-[#E5E0D7] text-xs text-[#25241F] focus:outline-none focus:border-[#B49A75]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#77736C] mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F6F1] border border-[#E5E0D7] text-xs text-[#25241F] focus:outline-none focus:border-[#B49A75]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#77736C] mb-2">
                  Typical Tailored Size
                </label>
                <select
                  value={typicalSize}
                  onChange={(e) => setTypicalSize(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F6F1] border border-[#E5E0D7] text-xs text-[#25241F] focus:outline-none focus:border-[#B49A75]"
                >
                  <option value="EU 44 (XS)">EU 44 (XS)</option>
                  <option value="EU 46 (S)">EU 46 (S)</option>
                  <option value="EU 48 (M)">EU 48 (M)</option>
                  <option value="EU 50 (L)">EU 50 (L)</option>
                  <option value="EU 52 (XL)">EU 52 (XL)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Experience & Audio */}
          <div className="p-8 rounded-3xl bg-white border border-[#E5E0D7] space-y-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#8C7352]">
              <Bell size={14} className="text-[#B49A75]" />
              <span>EXPERIENCE & NOTIFICATIONS</span>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F6F1] cursor-pointer">
                <div>
                  <h4 className="font-serif text-sm text-[#25241F] font-medium">Haptic & Ambient Audio</h4>
                  <p className="text-xs text-[#77736C]">Hanger slide sounds, fabric inspection chimes, and modal clicks.</p>
                </div>
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  className="w-4 h-4 accent-[#B49A75]"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F6F1] cursor-pointer">
                <div>
                  <h4 className="font-serif text-sm text-[#25241F] font-medium">Atelier Dispatch Alerts</h4>
                  <p className="text-xs text-[#77736C]">Receive real-time email updates when your order is placed, shipped, or delivered.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="w-4 h-4 accent-[#B49A75]"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedNotice ? (
              <span className="text-xs text-[#667B63] flex items-center gap-1.5 font-medium bg-[#667B63]/10 px-4 py-2 rounded-full border border-[#667B63]/20">
                <Check size={14} /> Preferences Saved Successfully
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-[#25241F] hover:bg-[#38362F] text-white text-xs font-semibold uppercase tracking-[0.2em] transition-all shadow-xs cursor-pointer"
            >
              Update Preferences
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
