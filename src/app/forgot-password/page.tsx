"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { sounds } from "@/utils/soundEffects";
import { Mail, ArrowRight, Check, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    sounds.playChime();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#1C1917]/[0.08] shadow-xl">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9A7B4F] font-mono block">
              Atelier Security
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1917] font-medium">
              Reset Secret Key
            </h1>
            <p className="text-xs text-[#78716C]">
              Enter your registered client email to receive bespoke verification instructions.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <Check size={20} />
              </div>
              <p className="font-serif text-lg text-[#1C1917]">Dispatch Transmitted</p>
              <p className="text-xs text-[#78716C] leading-relaxed">
                If an account exists for <span className="font-semibold text-[#1C1917]">{email}</span>, you will receive encrypted reset credentials within minutes.
              </p>
              <NextLink
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#9A7B4F] hover:underline pt-2"
              >
                <ArrowLeft size={13} />
                <span>Return to Client Login</span>
              </NextLink>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#78716C] mb-1.5">
                  Client Email Address
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

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#1C1917] hover:bg-[#2A2725] text-[#FAF8F5] font-semibold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Dispatch Recovery Link</span>
                <ArrowRight size={14} className="text-[#C5A880]" />
              </button>

              <div className="text-center">
                <NextLink
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917]"
                >
                  <ArrowLeft size={13} />
                  <span>Return to Sign In</span>
                </NextLink>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

