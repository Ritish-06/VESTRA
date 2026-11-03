"use client";

import React, { useState, Suspense } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { useCartStore } from "@/store/useCartStore";
import { sounds } from "@/utils/soundEffects";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Check, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const { getItemCount } = useCartStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const cartCount = getItemCount();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    sounds.playClick();

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Authentication failed. Please verify credentials.");
        setIsSubmitting(false);
        return;
      }

      setLoginSuccess(true);
      sounds.playChime();

      setTimeout(() => {
        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (cartCount > 0) {
          router.push("/checkout");
        } else if (data.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      }, 700);
    } catch {
      setErrorMessage("Network error connecting to atelier server.");
      setIsSubmitting(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail("admin@vestra.store");
    setPassword("VestraAdmin#2026");
    setErrorMessage(null);
    sounds.playClick();
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
    <div className="w-full max-w-md">
      <div className="atelier-card p-8 sm:p-10 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#9A7B4F] font-semibold mb-2">
            Private Access
          </p>
          <h1 className="font-serif text-3xl font-light tracking-wide text-[#1C1917]">
            Atelier Sign In
          </h1>
          <p className="text-xs text-[#78716C] mt-2">
            Enter your credentials to access your private wardrobe, orders & tailoring status.
          </p>
        </div>

        {/* Demo Credentials Pill */}
        <div className="mb-6 p-3 bg-[#F4F0E8] border border-[#E8E2D8] rounded text-left flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-[#1C1917]">Demo Atelier Admin</p>
            <p className="text-[10px] text-[#78716C]">admin@vestra.store</p>
          </div>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="text-[10px] tracking-wider uppercase font-semibold text-[#9A7B4F] hover:text-[#1C1917] underline transition-colors"
          >
            Auto-Fill
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label className="block text-[11px] tracking-wider uppercase text-[#78716C] mb-2 font-medium">
              Client Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded text-sm text-[#1C1917] focus:outline-none focus:border-[#9A7B4F] transition-colors"
              />
              <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[11px] tracking-wider uppercase text-[#78716C] font-medium">
                Password
              </label>
              <NextLink
                href="/forgot-password"
                className="text-[11px] text-[#9A7B4F] hover:text-[#1C1917] transition-colors"
              >
                Forgot?
              </NextLink>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded text-sm text-[#1C1917] focus:outline-none focus:border-[#9A7B4F] transition-colors"
              />
              <Lock className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#1C1917]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#9A7B4F] rounded border-[#E8E2D8]"
              />
              <span className="text-xs text-[#78716C]">Remember session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loginSuccess}
            className="w-full py-3.5 bg-[#1C1917] hover:bg-[#33302C] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] rounded transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-[#FAF8F5] border-t-transparent rounded-full animate-spin" />
            ) : loginSuccess ? (
              <>
                <Check size={16} className="text-[#C5A880]" /> Authenticated
              </>
            ) : (
              <>
                Access Atelier <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E8E2D8]" />
          </div>
          <span className="relative bg-[#FFFFFF] px-4 text-[10px] tracking-wider uppercase text-[#A8A29E]">
            Or continue
          </span>
        </div>

        <button
          onClick={handleContinueAsGuest}
          className="w-full py-3 border border-[#E8E2D8] hover:border-[#9A7B4F] text-[#1C1917] text-xs uppercase tracking-[0.15em] rounded transition-colors"
        >
          Continue as Guest
        </button>

        <p className="text-center text-xs text-[#78716C] mt-8">
          Not yet a member?{" "}
          <NextLink
            href="/register"
            className="text-[#9A7B4F] hover:text-[#1C1917] font-medium transition-colors"
          >
            Apply for Membership
          </NextLink>
        </p>

        <div className="mt-8 pt-6 border-t border-[#E8E2D8] flex items-center justify-center gap-2 text-[10px] text-[#A8A29E]">
          <ShieldCheck size={13} className="text-[#9A7B4F]" />
          <span>Encrypted Session • VESTRA Private Vault</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <Suspense fallback={<div className="text-xs uppercase tracking-widest text-[#9A7B4F]">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
