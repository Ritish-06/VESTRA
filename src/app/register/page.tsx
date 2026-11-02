"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { sounds } from "@/utils/soundEffects";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;
    setIsSubmitting(true);
    sounds.playClick();

    setTimeout(() => {
      setIsSubmitting(false);
      setRegisterSuccess(true);
      sounds.playChime();

      setTimeout(() => {
        router.push("/wardrobe");
      }, 1000);
    }, 1200);
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
              Atelier Client Registration
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1917] font-medium">
              Create Client Account
            </h1>
            <p className="text-xs text-[#78716C]">
              Join the VESTRA Private Circle for personalized avatars and allocations.
            </p>
          </div>

          {registerSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <Check size={20} />
              </div>
              <p className="font-serif text-lg text-[#1C1917]">Account Registered</p>
              <p className="text-xs text-[#78716C]">Opening your private 3D wardrobe...</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type="text"
                    placeholder="e.g. Jean-Luc Delacroix"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1C1917]/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1.5">
                  Private Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type="email"
                    placeholder="client@vestra-atelier.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1C1917]/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
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

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
                  <input
                    type="password"
                    placeholder="Confirm secret key"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1C1917]/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#78716C]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-[#1C1917]/20 text-[#C5A880] focus:ring-[#C5A880]"
                    required
                  />
                  <span>
                    I agree to the VESTRA Client Privileges Charter, Terms of Service, and Confidentiality Policy.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !agreeTerms}
                className="w-full py-3.5 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-[#FAF8F5] font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mt-2"
              >
                <span>{isSubmitting ? "Registering..." : "Create Client Account"}</span>
                <ArrowRight size={14} className="text-[#C5A880]" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[#1C1917]/[0.08] text-center text-xs text-[#78716C]">
            <span>Already a client? </span>
            <NextLink href="/login" className="text-[#9A7B4F] font-semibold hover:underline">
              Sign In to Atelier
            </NextLink>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

