"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { sounds } from "@/utils/soundEffects";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck, Check, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please accept the private membership terms.");
      return;
    }

    setIsSubmitting(true);
    sounds.playClick();

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", name, email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to establish membership.");
        setIsSubmitting(false);
        return;
      }

      setRegisterSuccess(true);
      sounds.playChime();

      setTimeout(() => {
        router.push("/wardrobe");
      }, 700);
    } catch {
      setErrorMessage("Connection error. Please retry.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="w-full max-w-md">
          <div className="atelier-card p-8 sm:p-10 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#9A7B4F] font-semibold mb-2">
                Atelier Invitation
              </p>
              <h1 className="font-serif text-3xl font-light tracking-wide text-[#1C1917]">
                Create Membership
              </h1>
              <p className="text-xs text-[#78716C] mt-2">
                Join VESTRA to curate personalized wardrobes, save bespoke outfits & track white-glove orders.
              </p>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-start gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[11px] tracking-wider uppercase text-[#78716C] mb-1.5 font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Valentin De Vestra"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded text-sm text-[#1C1917] focus:outline-none focus:border-[#9A7B4F] transition-colors"
                  />
                  <User className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] tracking-wider uppercase text-[#78716C] mb-1.5 font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="valentin@domain.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded text-sm text-[#1C1917] focus:outline-none focus:border-[#9A7B4F] transition-colors"
                  />
                  <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] tracking-wider uppercase text-[#78716C] mb-1.5 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
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

              <div>
                <label className="block text-[11px] tracking-wider uppercase text-[#78716C] mb-1.5 font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded text-sm text-[#1C1917] focus:outline-none focus:border-[#9A7B4F] transition-colors"
                  />
                  <Lock className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3.5 h-3.5 mt-0.5 accent-[#9A7B4F] rounded border-[#E8E2D8]"
                  />
                  <span className="text-[11px] text-[#78716C] leading-snug">
                    I agree to the VESTRA Terms of Private Atelier Service and privacy protocols.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || registerSuccess}
                className="w-full mt-2 py-3.5 bg-[#1C1917] hover:bg-[#33302C] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] rounded transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#FAF8F5] border-t-transparent rounded-full animate-spin" />
                ) : registerSuccess ? (
                  <>
                    <Check size={16} className="text-[#C5A880]" /> Membership Granted
                  </>
                ) : (
                  <>
                    Establish Membership <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-[#78716C] mt-8">
              Already have an account?{" "}
              <NextLink
                href="/login"
                className="text-[#9A7B4F] hover:text-[#1C1917] font-medium transition-colors"
              >
                Sign In
              </NextLink>
            </p>

            <div className="mt-8 pt-6 border-t border-[#E8E2D8] flex items-center justify-center gap-2 text-[10px] text-[#A8A29E]">
              <ShieldCheck size={13} className="text-[#9A7B4F]" />
              <span>Encrypted Client Vault • VESTRA Haute Atelier</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
