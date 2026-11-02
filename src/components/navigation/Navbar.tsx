"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import {
  ShoppingBag,
  Heart,
  Volume2,
  VolumeX,
  Menu,
  X,
  Compass,
  Layers,
  Sparkles,
  User,
  Sliders,
  LogIn,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { sounds } from "@/utils/soundEffects";

export default function Navbar() {
  const pathname = usePathname();
  const { getItemCount, setIsOpen } = useCartStore();
  const { wishlistIds } = useWardrobeStore();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.enabled = nextState;
    if (nextState) {
      sounds.playClick();
    }
  };

  const isDarkScene = pathname === "/wardrobe" || pathname === "/studio";

  const navLinks = [
    { href: "/wardrobe", label: "3D Wardrobe", badge: "Interactive", icon: Sliders },
    { href: "/explore", label: "Collections", icon: Compass },
    { href: "/collections", label: "Seasonal Drops", icon: Layers },
    { href: "/studio", label: "Virtual Studio", badge: "3D Try-On", icon: Sparkles },
    { href: "/stylist", label: "AI Stylist", icon: Sparkles },
  ];

  const cartCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? wishlistIds.length : 0;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? isDarkScene
              ? "bg-[#121110]/90 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl"
              : "bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#1C1917]/[0.06] py-3.5 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NextLink
              href="/"
              onClick={() => sounds.playClick()}
              className="flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-full border border-[#C5A880] flex items-center justify-center text-[#9A7B4F] text-xs font-serif tracking-widest group-hover:scale-105 transition-transform bg-[#C5A880]/10">
                V
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-serif tracking-[0.3em] text-lg font-bold transition-colors ${
                    isDarkScene
                      ? "text-white group-hover:text-[#C5A880]"
                      : "text-[#1C1917] group-hover:text-[#9A7B4F]"
                  }`}
                >
                  VESTRA
                </span>
                <span className="text-[8px] uppercase tracking-[0.4em] text-[#78716C] -mt-1 font-sans">
                  Haute Atelier
                </span>
              </div>
            </NextLink>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <NextLink
                    key={link.href}
                    href={link.href}
                    onClick={() => sounds.playClick()}
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                      isActive
                        ? isDarkScene
                          ? "text-[#FAF8F5] bg-white/[0.08] border border-[#C5A880]/40 shadow-sm"
                          : "text-[#1C1917] bg-[#1C1917]/[0.05] border border-[#C5A880]/60 shadow-sm"
                        : isDarkScene
                        ? "text-[#A8A29E] hover:text-white hover:bg-white/[0.04]"
                        : "text-[#78716C] hover:text-[#1C1917] hover:bg-[#1C1917]/[0.04]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#C5A880]/15 text-[#9A7B4F] border border-[#C5A880]/30 font-sans tracking-normal font-semibold">
                        {link.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#C5A880] rounded-full" />
                    )}
                  </NextLink>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isDarkScene
                    ? "text-[#A8A29E] hover:text-[#C5A880] hover:bg-white/[0.06]"
                    : "text-[#78716C] hover:text-[#1C1917] hover:bg-[#1C1917]/[0.04]"
                }`}
                title={soundEnabled ? "Mute Tactile Audio" : "Enable Tactile Audio"}
                aria-label="Toggle Sound"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Wishlist Link */}
              <NextLink
                href="/wishlist"
                onClick={() => sounds.playClick()}
                className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  pathname === "/wishlist"
                    ? "text-[#9A7B4F] bg-[#C5A880]/15 border border-[#C5A880]/40"
                    : isDarkScene
                    ? "text-[#A8A29E] hover:text-white hover:bg-white/[0.06]"
                    : "text-[#78716C] hover:text-[#1C1917] hover:bg-[#1C1917]/[0.04]"
                }`}
                aria-label="Wishlist"
              >
                <Heart size={16} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C5A880] text-[#1C1917] text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </NextLink>

              {/* User Profile / Auth Link */}
              <NextLink
                href="/login"
                onClick={() => sounds.playClick()}
                className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  pathname === "/profile" || pathname === "/login"
                    ? "text-[#9A7B4F] bg-[#C5A880]/15 border border-[#C5A880]/40"
                    : isDarkScene
                    ? "text-[#A8A29E] hover:text-white hover:bg-white/[0.06]"
                    : "text-[#78716C] hover:text-[#1C1917] hover:bg-[#1C1917]/[0.04]"
                }`}
                title="Client Portal & Sign In"
                aria-label="User Profile"
              >
                <User size={16} />
              </NextLink>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsOpen(true)}
                className={`relative px-4 py-1.5 rounded-full border text-xs font-medium tracking-wider flex items-center gap-2 transition-all ${
                  isDarkScene
                    ? "bg-[#1C1917] border-[#C5A880]/40 text-white hover:border-[#C5A880]"
                    : "bg-[#1C1917] border-[#1C1917] text-[#FAF8F5] hover:bg-[#2A2725] shadow-sm"
                }`}
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag size={14} className="text-[#C5A880]" />
                <span className="hidden sm:inline">Bag</span>
                {cartCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#C5A880] text-[#1C1917] text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  sounds.playClick();
                }}
                className={`lg:hidden w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isDarkScene ? "text-white" : "text-[#1C1917]"
                }`}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-2xl lg:hidden flex flex-col pt-24 px-6 pb-12 animate-in fade-in duration-300 text-[#1C1917]">
          <div className="flex flex-col gap-4 flex-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#78716C] border-b border-[#1C1917]/[0.08] pb-2 font-mono">
              Curated Navigation
            </span>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NextLink
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    sounds.playClick();
                  }}
                  className="flex items-center justify-between py-3 border-b border-[#1C1917]/[0.06] text-lg font-serif text-[#1C1917] hover:text-[#9A7B4F] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-[#9A7B4F]" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A880]/20 text-[#9A7B4F] border border-[#C5A880]/30 font-sans">
                      {link.badge}
                    </span>
                  )}
                </NextLink>
              );
            })}
            <NextLink
              href="/login"
              onClick={() => {
                setMobileMenuOpen(false);
                sounds.playClick();
              }}
              className="py-3 border-b border-[#1C1917]/[0.06] text-sm text-[#78716C] hover:text-[#1C1917] flex items-center gap-2"
            >
              <LogIn size={15} className="text-[#9A7B4F]" />
              <span>Client Sign In / Register</span>
            </NextLink>
            <NextLink
              href="/orders"
              onClick={() => {
                setMobileMenuOpen(false);
                sounds.playClick();
              }}
              className="py-3 border-b border-[#1C1917]/[0.06] text-sm text-[#78716C] hover:text-[#1C1917]"
            >
              Order Tracking & Archives
            </NextLink>
            <NextLink
              href="/admin"
              onClick={() => {
                setMobileMenuOpen(false);
                sounds.playClick();
              }}
              className="py-3 border-b border-[#1C1917]/[0.06] text-sm text-[#78716C] hover:text-[#1C1917]"
            >
              Atelier Backstage / Admin
            </NextLink>
          </div>

          <div className="pt-6 border-t border-[#1C1917]/[0.08] flex items-center justify-between text-xs text-[#78716C]">
            <span>VESTRA Digital Fashion</span>
            <span className="text-[#9A7B4F]">Paris • Milan • Tokyo</span>
          </div>
        </div>
      )}
    </>
  );
}
