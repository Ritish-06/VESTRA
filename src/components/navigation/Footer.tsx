"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { sounds } from "@/utils/soundEffects";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    sounds.playChime();
  };

  return (
    <footer className="bg-[#F0EDE6] border-t border-[#E5E0D7] pt-20 pb-12 text-[#77736C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Manifesto Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#E5E0D7]">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-[#B49A75] bg-[#F8F6F1] flex items-center justify-center text-[#8C7352] text-sm font-serif">
                V
              </div>
              <span className="font-serif tracking-[0.28em] text-xl font-bold text-[#25241F]">
                VESTRA
              </span>
            </div>
            <p className="font-serif text-lg text-[#25241F] italic leading-relaxed pt-2">
              &ldquo;Clothing is not merely worn; it is inhabited. VESTRA sculpts digital reality into physical presence.&rdquo;
            </p>
            <p className="text-xs text-[#77736C] leading-relaxed max-w-md">
              Bridging haute couture, interactive 3D showroom design, and bespoke tailoring. Experience the natural light and tactile intimacy of a private salon.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8 text-xs">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.28em] text-[#8C7352] font-mono font-semibold mb-4">
                Atelier Experiences
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <NextLink
                    href="/wardrobe"
                    className="text-[#77736C] hover:text-[#25241F] transition-colors flex items-center gap-1 group"
                  >
                    <span>3D Interactive Wardrobe</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#B49A75]" />
                  </NextLink>
                </li>
                <li>
                  <NextLink
                    href="/studio"
                    className="text-[#77736C] hover:text-[#25241F] transition-colors flex items-center gap-1 group"
                  >
                    <span>Virtual Try-On Studio</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#B49A75]" />
                  </NextLink>
                </li>
                <li>
                  <NextLink
                    href="/stylist"
                    className="text-[#77736C] hover:text-[#25241F] transition-colors flex items-center gap-1 group"
                  >
                    <span>AI Stylist Intelligence</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#B49A75]" />
                  </NextLink>
                </li>
                <li>
                  <NextLink
                    href="/explore"
                    className="text-[#77736C] hover:text-[#25241F] transition-colors flex items-center gap-1 group"
                  >
                    <span>The Full Catalog</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#B49A75]" />
                  </NextLink>
                </li>
                <li>
                  <NextLink
                    href="/collections"
                    className="text-[#77736C] hover:text-[#25241F] transition-colors flex items-center gap-1 group"
                  >
                    <span>Curatorial Collections</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#B49A75]" />
                  </NextLink>
                </li>
                <li>
                  <NextLink
                    href="/lookbook"
                    className="text-[#77736C] hover:text-[#25241F] transition-colors flex items-center gap-1 group"
                  >
                    <span>Photographic Lookbook</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#B49A75]" />
                  </NextLink>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.28em] text-[#8C7352] font-mono font-semibold mb-4">
                Client Relations
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <NextLink href="/track-order" className="text-[#77736C] hover:text-[#25241F] transition-colors">
                    Order Tracking & Dispatch
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/profile" className="text-[#77736C] hover:text-[#25241F] transition-colors">
                    Private Vault & DNA
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/admin" className="text-[#77736C] hover:text-[#25241F] transition-colors">
                    Atelier Backstage
                  </NextLink>
                </li>
                <li>
                  <span className="text-[#77736C]/80">Bespoke Appointments (Paris / Tokyo)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter / Private Dispatch */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.28em] text-[#8C7352] font-mono font-semibold">
              The Private Dispatch
            </h4>
            <p className="text-xs text-[#77736C]">
              Receive private salon invitations, limited run allocations, and seasonal lookbooks.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#607B60]/10 border border-[#607B60]/30 text-[#607B60] text-xs font-medium">
                <Check size={14} />
                <span>You are inducted into the VESTRA Private Circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your private email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-[#E5E0D7] rounded-lg px-3.5 py-2.5 text-xs text-[#25241F] placeholder-[#77736C] focus:outline-none focus:border-[#B49A75]"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#25241F] hover:bg-[#38362F] text-white text-xs font-medium tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={12} className="text-[#B49A75]" />
                  <span>Request Membership</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Salons & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 text-[#77736C]">
          <div className="flex items-center gap-4">
            <span>Salon Paris: 14 Rue Saint-Honoré</span>
            <span>•</span>
            <span>Salon Tokyo: Minami-Aoyama 5-Chome</span>
          </div>
          <div>
            © 2026 VESTRA Digital Fashion Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
