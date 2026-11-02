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
    <div className="min-h-screen bg-[#070709] text-[#f5f4f0] flex flex-col relative overflow-hidden">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] text-xs font-mono mb-2">
            <Sparkles size={12} />
            <span>VESTRA Atelier Intelligence</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium">
            Your Personal Haute Couturier
          </h1>
          <p className="text-xs text-[#9ca3af] leading-relaxed">
            Harnessing generative styling heuristics, garment drape dynamics, and Savile Row principles to curate your next commanding presence.
          </p>
        </div>

        {/* Suggestion Prompts Bar */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-[10px] uppercase tracking-wider text-[#6b7280] font-mono flex items-center gap-1 flex-shrink-0">
            <Lightbulb size={12} /> Prompts:
          </span>
          {STYLIST_PROMPTS.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handleSendPrompt(prompt.query)}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#c5a880]/60 hover:text-white text-[#9ca3af] transition-colors whitespace-nowrap flex-shrink-0"
            >
              &ldquo;{prompt.query}&rdquo;
            </button>
          ))}
        </div>

        {/* Chat / Consultation Container */}
        <div className="flex-1 rounded-3xl bg-[#0d0d10] border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden min-h-[500px]">
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
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-serif ${
                    msg.sender === "stylist"
                      ? "bg-[#c5a880]/20 border border-[#c5a880]/50 text-[#c5a880]"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {msg.sender === "stylist" ? <Sparkles size={16} /> : <UserIcon size={16} />}
                </div>

                {/* Message Body */}
                <div
                  className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#c5a880] text-[#0b0b0c] font-medium"
                      : "bg-[#141418] border border-white/[0.06] text-white/90"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Render Recommended Outfit Look Card if attached */}
                  {msg.recommendedLook && (
                    <div className="mt-5 p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-[#c5a880] font-mono">
                            Recommended Ensemble
                          </span>
                          <h4 className="font-serif text-base sm:text-lg text-white font-medium mt-0.5">
                            {msg.recommendedLook.name}
                          </h4>
                          <p className="text-xs text-[#9ca3af] mt-1">
                            {msg.recommendedLook.description}
                          </p>
                        </div>
                        <span className="text-sm font-serif font-bold text-[#c5a880]">
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
                                className="p-2 rounded-lg bg-white/[0.03] border border-white/5 flex gap-2.5 items-center"
                              >
                                <div className="w-10 h-12 rounded bg-[#18181e] overflow-hidden flex-shrink-0">
                                  <img
                                    src={p.images.hero}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-serif text-xs text-white truncate">
                                    {p.name}
                                  </p>
                                  <p className="text-[10px] text-[#c5a880]">
                                    ${p.price.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]">
                        <button
                          onClick={() => handleTryInStudio(msg.recommendedLook!)}
                          className="px-3.5 py-1.5 rounded-full bg-[#c5a880] text-[#0b0b0c] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#e6d5b8] transition-colors"
                        >
                          <Sliders size={12} />
                          <span>Try on 3D Avatar</span>
                        </button>

                        <button
                          onClick={() => handleAcquireLook(msg.recommendedLook!)}
                          className="px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <ShoppingBag size={12} className="text-[#c5a880]" />
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
                <div className="w-9 h-9 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/50 text-[#c5a880] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={14} className="animate-pulse" />
                </div>
                <div className="rounded-2xl px-5 py-3 bg-[#141418] border border-white/[0.06] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#c5a880] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Form */}
          <div className="p-4 bg-[#0a0a0d] border-t border-white/[0.06]">
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
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-full px-5 py-3 text-xs sm:text-sm text-white placeholder-[#6b7280] focus:outline-none focus:border-[#c5a880]"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                  !inputQuery.trim() || isTyping
                    ? "opacity-30 cursor-not-allowed bg-white/5 text-[#9ca3af]"
                    : "bg-[#c5a880] hover:bg-[#e6d5b8] text-[#0b0b0c] hover:scale-105 shadow-md"
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

