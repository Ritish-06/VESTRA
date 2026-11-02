"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import { PRODUCTS } from "@/data/products";
import { STYLIST_PROMPTS, StylistPrompt } from "@/data/stylistPresets";
import { OutfitLook } from "@/types/wardrobe";
import { Product } from "@/types/product";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { useCartStore } from "@/store/useCartStore";
import { sounds } from "@/utils/soundEffects";
import {
  Sparkles,
  Send,
  Sliders,
  ShoppingBag,
  ArrowRight,
  Bot,
  User as UserIcon,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "stylist";
  text: string;
  recommendedLook?: OutfitLook;
  timestamp: string;
}

export default function StylistPage() {
  const router = useRouter();
  const { loadOutfitLook } = useWardrobeStore();
  const { addItem } = useCartStore();

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-1",
      sender: "stylist",
      text: "Bienvenue to the VESTRA Atelier Intelligence. I am your personal couture stylist. Describe your upcoming occasion, setting, or aesthetic mood, and I will sculpt a harmonious silhouette from our archives.",
      timestamp: "Just now",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    sounds.playClick();

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: promptText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    // Contextual match finder
    setTimeout(() => {
      const lower = promptText.toLowerCase();
      let matched = STYLIST_PROMPTS.find(
        (p) =>
          lower.includes(p.category) ||
          lower.includes(p.id) ||
          promptText.includes(p.query)
      );

      // Fallback matching logic
      if (!matched) {
        if (lower.includes("gala") || lower.includes("dinner") || lower.includes("dress") || lower.includes("evening")) {
          matched = STYLIST_PROMPTS[0]; // Venice Gala
        } else if (lower.includes("presentation") || lower.includes("tech") || lower.includes("work") || lower.includes("business") || lower.includes("college")) {
          matched = STYLIST_PROMPTS[1]; // Keynote
        } else if (lower.includes("night") || lower.includes("art") || lower.includes("avant") || lower.includes("tokyo")) {
          matched = STYLIST_PROMPTS[2]; // Tokyo Avant-Garde
        } else {
          matched = STYLIST_PROMPTS[3]; // Paris Daytime
        }
      }

      const stylistResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "stylist",
        text: matched.stylistRationale,
        recommendedLook: matched.recommendedLook,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, stylistResponse]);
      setIsTyping(false);
      sounds.playChime();
    }, 1200);
  };

  const handleTryInStudio = (look: OutfitLook) => {
    loadOutfitLook(look);
    router.push("/studio");
  };

  const handleAcquireLook = (look: OutfitLook) => {
    const pieces = [look.outerwear, look.top, look.trousers, look.footwear].filter(Boolean) as Product[];
    pieces.forEach((p) => addItem(p, p.colorways[0], p.sizes[0], 1));
    sounds.playChime();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#9A7B4F] text-xs font-mono mb-2 font-medium">
            <Sparkles size={12} />
            <span>VESTRA Atelier Intelligence</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C1917] font-medium">
            Your Personal Haute Couturier
          </h1>
          <p className="text-xs text-[#78716C] leading-relaxed">
            Harnessing generative styling heuristics, garment drape dynamics, and Savile Row principles to curate your next commanding presence.
          </p>
        </div>

        {/* Suggestion Prompts Bar */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[10px] uppercase tracking-wider text-[#78716C] font-mono flex items-center gap-1 shrink-0">
            <Lightbulb size={12} className="text-[#9A7B4F]" /> Prompts:
          </span>
          {STYLIST_PROMPTS.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handleSendPrompt(prompt.query)}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white border border-[#1C1917]/10 hover:border-[#C5A880] hover:text-[#1C1917] text-[#78716C] transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              &ldquo;{prompt.query}&rdquo;
            </button>
          ))}
        </div>

        {/* Chat / Consultation Container */}
        <div className="flex-1 rounded-3xl atelier-card flex flex-col overflow-hidden min-h-[500px]">
          {/* Messages Feed */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 max-w-3xl ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-serif ${
                    msg.sender === "stylist"
                      ? "bg-[#C5A880]/20 border border-[#C5A880]/50 text-[#9A7B4F]"
                      : "bg-[#1C1917] text-white"
                  }`}
                >
                  {msg.sender === "stylist" ? <Sparkles size={16} /> : <UserIcon size={16} />}
                </div>

                {/* Message Body */}
                <div
                  className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#1C1917] text-[#FAF8F5] font-medium shadow-sm"
                      : "bg-[#FAF8F5] border border-[#1C1917]/[0.08] text-[#1C1917]"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Render Recommended Outfit Look Card if attached */}
                  {msg.recommendedLook && (
                    <div className="mt-5 p-4 rounded-xl bg-white border border-[#C5A880]/30 shadow-xs space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A7B4F] font-mono font-semibold">
                            Recommended Ensemble
                          </span>
                          <h4 className="font-serif text-base sm:text-lg text-[#1C1917] font-medium mt-0.5">
                            {msg.recommendedLook.name}
                          </h4>
                          <p className="text-xs text-[#78716C] mt-1">
                            {msg.recommendedLook.description}
                          </p>
                        </div>
                        <span className="text-sm font-serif font-bold text-[#9A7B4F]">
                          ${msg.recommendedLook.totalPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Pieces Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                        {[
                          msg.recommendedLook.outerwear,
                          msg.recommendedLook.top,
                          msg.recommendedLook.trousers,
                        ]
                          .filter(Boolean)
                          .map((piece) => {
                            const p = piece as Product;
                            return (
                              <div
                                key={p.id}
                                className="p-2 rounded-lg bg-[#FAF8F5] border border-[#1C1917]/[0.06] flex gap-2.5 items-center"
                              >
                                <div
                                  className="w-10 h-12 rounded bg-white overflow-hidden shrink-0 border border-[#1C1917]/[0.06]"
                                  style={{ width: "40px", height: "48px" }}
                                >
                                  <img
                                    src={p.images.hero}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-serif text-xs text-[#1C1917] font-medium truncate">
                                    {p.name}
                                  </p>
                                  <p className="text-[10px] text-[#9A7B4F] font-semibold">
                                    ${p.price.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-[#1C1917]/[0.06]">
                        <button
                          onClick={() => handleTryInStudio(msg.recommendedLook!)}
                          className="px-3.5 py-1.5 rounded-full bg-[#1C1917] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#2A2725] transition-colors cursor-pointer"
                        >
                          <Sliders size={12} className="text-[#C5A880]" />
                          <span>Try on 3D Avatar</span>
                        </button>

                        <button
                          onClick={() => handleAcquireLook(msg.recommendedLook!)}
                          className="px-3.5 py-1.5 rounded-full bg-[#C5A880]/20 hover:bg-[#C5A880]/30 text-[#1C1917] border border-[#C5A880]/40 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingBag size={12} className="text-[#9A7B4F]" />
                          <span>Acquire Ensemble</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-lg">
                <div className="w-9 h-9 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/50 text-[#9A7B4F] flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="animate-pulse" />
                </div>
                <div className="rounded-2xl px-5 py-3 bg-[#FAF8F5] border border-[#1C1917]/[0.08] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Form */}
          <div className="p-4 bg-[#FAF8F5] border-t border-[#1C1917]/[0.08]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(inputQuery);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask VESTRA... (e.g. 'Curate an understated dinner look for a gallery opening in Berlin')"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-1 bg-white border border-[#1C1917]/15 rounded-full px-5 py-3 text-xs sm:text-sm text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#C5A880]"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  !inputQuery.trim() || isTyping
                    ? "opacity-30 cursor-not-allowed bg-[#1C1917]/10 text-[#78716C]"
                    : "bg-[#1C1917] hover:bg-[#2A2725] text-[#C5A880] hover:scale-105 shadow-md"
                }`}
                aria-label="Send query to stylist"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

