"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation";
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

  const navLinks = [
    { href: "/wardrobe", label: "3D Wardrobe", badge: "Interactive", icon: Sliders },
    { href: "/explore", label: "Catalog", icon: Compass },
    { href: "/collections", label: "Collections", icon: Layers },
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
            ? "bg-[#0b0b0c]/85 backdrop-blur-md border-b border-white/[0.06] py-3.5 shadow-2xl"
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
              <div className="w-8 h-8 rounded-full border border-[#c5a880]/60 flex items-center justify-center text-[#c5a880] text-xs font-serif tracking-widest group-hover:scale-105 group-hover:border-[#c5a880] transition-transform">
                V
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.3em] text-lg font-bold text-white group-hover:text-[#c5a880] transition-colors">
                  VESTRA
                </span>
                <span className="text-[8px] uppercase tracking-[0.4em] text-[#9ca3af] -mt-1 font-sans">
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
                    className={`relative px-3.5 py-2 rounded-full text-xs font-medium tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                      isActive
                        ? "text-[#f5f4f0] bg-white/[0.08] border border-[#c5a880]/30 shadow-sm"
                        : "text-[#9ca3af] hover:text-[#f5f4f0] hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/30 font-sans tracking-normal">
                        {link.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#c5a880] rounded-full" />
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
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#9ca3af] hover:text-[#c5a880] hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-colors"
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
                    ? "text-[#c5a880] bg-white/[0.08] border border-[#c5a880]/30"
                    : "text-[#9ca3af] hover:text-[#f5f4f0] hover:bg-white/[0.06]"
                }`}
                aria-label="Wishlist"
              >
                <Heart size={16} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c5a880] text-[#0b0b0c] text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </NextLink>

              {/* User Profile Vault */}
              <NextLink
                href="/profile"
                onClick={() => sounds.playClick()}
                className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  pathname === "/profile"
                    ? "text-[#c5a880] bg-white/[0.08] border border-[#c5a880]/30"
                    : "text-[#9ca3af] hover:text-[#f5f4f0] hover:bg-white/[0.06]"
                }`}
                aria-label="User Profile"
              >
                <User size={16} />
              </NextLink>

              {/* Cart Button */}
              <button
                onClick={() => setIsOpen(true)}
                className="relative px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#1c1c1f] to-[#121214] border border-[#c5a880]/40 text-[#f5f4f0] text-xs font-medium tracking-wider flex items-center gap-2 hover:border-[#c5a880] hover:shadow-[0_0_15px_rgba(197,168,128,0.2)] transition-all"
                aria-label="Open Shopping Cart"
              >
                <ShoppingBag size={14} className="text-[#c5a880]" />
                <span className="hidden sm:inline">Bag</span>
                {cartCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#c5a880] text-[#0b0b0c] text-[10px] font-bold flex items-center justify-center">
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
                className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#9ca3af] hover:text-[#f5f4f0] hover:bg-white/[0.06] transition-colors"
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
        <div className="fixed inset-0 z-40 bg-[#0b0b0c]/95 backdrop-blur-2xl lg:hidden flex flex-col pt-24 px-6 pb-12 animate-in fade-in duration-300">
          <div className="flex flex-col gap-4 flex-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#9ca3af] border-b border-white/[0.08] pb-2 font-mono">
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
                  className="flex items-center justify-between py-3 border-b border-white/[0.05] text-lg font-serif text-[#f5f4f0] hover:text-[#c5a880] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-[#c5a880]" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/30 font-sans">
                      {link.badge}
                    </span>
                  )}
                </NextLink>
              );
            })}
            <NextLink
              href="/orders"
              onClick={() => {
                setMobileMenuOpen(false);
                sounds.playClick();
              }}
              className="py-3 border-b border-white/[0.05] text-sm text-[#9ca3af] hover:text-white transition-colors"
            >
              Order Tracking & Archives
            </NextLink>
            <NextLink
              href="/admin"
              onClick={() => {
                setMobileMenuOpen(false);
                sounds.playClick();
              }}
              className="py-3 border-b border-white/[0.05] text-sm text-[#9ca3af] hover:text-white transition-colors"
            >
              Atelier Backstage / Admin
            </NextLink>
          </div>

          <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#9ca3af]">
            <span>VESTRA Digital Fashion</span>
            <span className="text-[#c5a880]">Paris • Milan • Tokyo</span>
          </div>
        </div>
      )}
    </>
  );
}

