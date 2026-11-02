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
    <footer className="bg-[#08080a] border-t border-white/[0.06] pt-20 pb-12 text-[#9ca3af]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Manifesto Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/[0.06]">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-[#c5a880]/60 flex items-center justify-center text-[#c5a880] text-sm font-serif">
                V
              </div>
              <span className="font-serif tracking-[0.3em] text-xl font-bold text-white">
                VESTRA
              </span>
            </div>
            <p className="font-serif text-lg text-white/90 italic leading-relaxed pt-2">
              &ldquo;Clothing is not merely worn; it is inhabited. VESTRA sculpts digital reality into physical presence.&rdquo;
            </p>
            <p className="text-xs text-[#9ca3af] leading-relaxed max-w-md">
              Bridging haute couture, generative real-time 3D, and bespoke tailoring. Experience the sensory intimacy of a private salon wherever you stand.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8 text-xs">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono mb-4">
                Atelier Experiences
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <NextLink
                    href="/wardrobe"
                    className="hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>3D Interactive Wardrobe</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c5a880]" />
                  </NextLink>
                </li>
                <li>
                  <NextLink
                    href="/studio"
                    className="hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>Virtual Try-On Studio</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c5a880]" />
                  </NextLink>
                </li>
                <li>
                  <NextLink
                    href="/stylist"
                    className="hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>AI Stylist Intelligence</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c5a880]" />
                  </NextLink>
                </li>
                <li>
                  <NextLink
                    href="/explore"
                    className="hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>The Full Catalog</span>
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#c5a880]" />
                  </NextLink>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono mb-4">
                Client Relations
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <NextLink href="/orders" className="hover:text-white transition-colors">
                    Order Tracking
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/profile" className="hover:text-white transition-colors">
                    Private Vault & DNA
                  </NextLink>
                </li>
                <li>
                  <NextLink href="/admin" className="hover:text-white transition-colors">
                    Atelier Backstage
                  </NextLink>
                </li>
                <li>
                  <span className="text-[#6b7280]">Bespoke Appointments (Paris/Tokyo)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter / Private Dispatch */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono">
              The Private Dispatch
            </h4>
            <p className="text-xs text-[#9ca3af]">
              Receive private salon invitations, limited run allocations, and 3D digital drops.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] text-xs">
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
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#c5a880]"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-[#1a1a1f] hover:bg-[#c5a880] hover:text-[#0b0b0c] text-white text-xs font-medium tracking-wider transition-colors border border-white/10 flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={12} className="text-[#c5a880]" />
                  <span>Request Membership</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Salons & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <div className="flex items-center gap-4 text-[#6b7280]">
            <span>Salon Paris: 14 Rue Saint-Honoré</span>
            <span>•</span>
            <span>Salon Tokyo: Minami-Aoyama 5-Chome</span>
          </div>
          <div className="text-[#6b7280]">
            © 2026 VESTRA Digital Fashion Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
