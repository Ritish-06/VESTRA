"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { getItemCount } = useCartStore();

  const [email, setEmail] = useState("valentin@vestra.luxury");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const cartCount = getItemCount();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    sounds.playClick();

    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccess(true);
      sounds.playChime();

      setTimeout(() => {
        // If guest has items in cart, proceed to checkout; otherwise go to profile
        if (cartCount > 0) {
          router.push("/checkout");
        } else {
          router.push("/profile");
        }
      }, 800);
    }, 1000);
  };

  const handleContinueAsGuest = () => {
    sounds.playClick();
    if (cartCount > 0) {
      router.push("/checkout");
    } else {
      router.push("/wardrobe");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#1C1917]/[0.08] shadow-xl">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#C5A880] flex items-center justify-center text-[#9A7B4F] text-sm font-serif mx-auto bg-[#C5A880]/10">
              V
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono block">
              Atelier Client Portal
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1917] font-medium">
              Welcome Back
            </h1>
            <p className="text-xs text-[#78716C]">
              Access your bespoke wardrobe vault, orders, and private allocations.
            </p>
          </div>

          {cartCount > 0 && (
            <div className="p-3 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/30 text-xs text-[#9A7B4F] flex items-center justify-between">
              <span>Your shopping bag ({cartCount} items) is preserved.</span>
            </div>
          )}

          {loginSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <Check size={20} />
              </div>
              <p className="font-serif text-lg text-[#1C1917]">Authenticated</p>
              <p className="text-xs text-[#78716C]">Redirecting to your atelier dossier...</p>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1.5">
                  Client Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1C1917]/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#78716C]">
                    Secret Key / Password
                  </label>
                  <NextLink
                    href="/forgot-password"
                    className="text-[11px] text-[#9A7B4F] hover:underline"
                  >
                    Forgot Password?
                  </NextLink>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1C1917]/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#78716C]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#1C1917]/20 text-[#C5A880] focus:ring-[#C5A880]"
                  />
                  <span>Remember this terminal</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-[#FAF8F5] font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>{isSubmitting ? "Authenticating..." : "Sign In to Atelier"}</span>
                <ArrowRight size={14} className="text-[#C5A880]" />
              </button>

              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="w-full py-3 rounded-full bg-transparent hover:bg-[#F4F0E8] text-[#1C1917] border border-[#1C1917]/10 font-medium text-xs tracking-wider transition-colors cursor-pointer"
              >
                Continue as Guest Client
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[#1C1917]/[0.08] text-center text-xs text-[#78716C]">
            <span>Don&apos;t have an account yet? </span>
            <NextLink href="/register" className="text-[#9A7B4F] font-semibold hover:underline">
              Create Client Account
            </NextLink>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

