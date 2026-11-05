"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Search,
  LogIn,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWardrobeStore } from "@/store/useWardrobeStore";
import { useCatalog } from "@/components/providers/CatalogProvider";
import { sounds } from "@/utils/soundEffects";
import { formatPrice } from "@/lib/commerce";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount, setIsOpen, lastAddedAt } = useCartStore();
  const { wishlistIds, activeToast, dismissToast, recordProductView } = useWardrobeStore();
  const { products } = useCatalog();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-focus search input when search drawer opens
  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 40);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  // Pulse cart count badge on add
  useEffect(() => {
    if (!lastAddedAt) return;
    setCartPulse(true);
    const t = setTimeout(() => setCartPulse(false), 360);
    return () => clearTimeout(t);
  }, [lastAddedAt]);

  // Auto-dismiss active toast notification
  useEffect(() => {
    if (!activeToast) return;
    const t = setTimeout(() => {
      dismissToast();
    }, 3400);
    return () => clearTimeout(t);
  }, [activeToast, dismissToast]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.enabled = nextState;
    if (nextState) {
      sounds.playClick();
    }
  };

  const navLinks = [
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/collections", label: "Collections", icon: Layers },
    { href: "/wardrobe", label: "Wardrobe", badge: "3D", icon: Sliders },
    { href: "/lookbook", label: "Lookbook", icon: Sparkles },
    { href: "/studio", label: "Studio", badge: "Try-On", icon: Sparkles },
  ];

  const cartCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? wishlistIds.length : 0;

  const quickSearchResults = searchQuery.trim()
    ? products
        .filter((p) => {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.subtitle.toLowerCase().includes(q) ||
            p.collectionName.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
          );
        })
        .slice(0, 5)
    : products.slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    sounds.playClick();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || pathname === "/wardrobe" || pathname === "/studio" || searchOpen
            ? "bg-[#F8F6F1]/94 backdrop-blur-md border-b border-[#E5E0D7] py-3.5 shadow-[0_4px_20px_-8px_rgba(37,36,31,0.06)]"
            : "bg-[#F8F6F1]/82 backdrop-blur-sm border-b border-[#E5E0D7]/60 py-4"
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
              <div className="w-8 h-8 rounded-full border border-[#B49A75] flex items-center justify-center text-[#8C7352] text-xs font-serif tracking-widest group-hover:scale-105 transition-transform bg-[#F0EDE6]">
                V
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-[0.28em] text-lg font-bold text-[#25241F] group-hover:text-[#8C7352] transition-colors">
                  VESTRA
                </span>
                <span className="text-[8px] uppercase tracking-[0.38em] text-[#77736C] -mt-1 font-sans">
                  Haute Atelier
                </span>
              </div>
            </NextLink>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <NextLink
                    key={link.href}
                    href={link.href}
                    data-active={isActive ? "true" : undefined}
                    onClick={() => sounds.playClick()}
                    className={`nav-underline relative px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? "text-[#25241F] bg-[#F0EDE6] border border-[#B49A75] shadow-2xs"
                        : "text-[#77736C] hover:text-[#25241F] hover:bg-[#F0EDE6]/70"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#B49A75]/15 text-[#8C7352] border border-[#B49A75]/35 font-sans tracking-normal font-semibold">
                        {link.badge}
                      </span>
                    )}
                  </NextLink>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Interactive Search Toggle */}
              <button
                type="button"
                onClick={() => {
                  setSearchOpen((prev) => !prev);
                  sounds.playClick();
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  searchOpen || pathname === "/explore"
                    ? "text-[#8C7352] bg-[#F0EDE6] border border-[#B49A75]/40"
                    : "text-[#77736C] hover:text-[#25241F] hover:bg-[#F0EDE6]"
                }`}
                title="Search Atelier Archive"
                aria-label="Toggle Search"
                aria-expanded={searchOpen}
              >
                {searchOpen ? <X size={16} /> : <Search size={16} />}
              </button>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#77736C] hover:text-[#25241F] hover:bg-[#F0EDE6] transition-colors cursor-pointer"
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
                    ? "text-[#8C7352] bg-[#F0EDE6] border border-[#B49A75]/40"
                    : "text-[#77736C] hover:text-[#25241F] hover:bg-[#F0EDE6]"
                }`}
                title="Saved Pieces"
                aria-label="Wishlist"
              >
                <Heart size={16} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B49A75] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {wishlistCount}
                  </span>
                )}
              </NextLink>

              {/* User Profile / Auth Link */}
              <NextLink
                href="/profile"
                onClick={() => sounds.playClick()}
                className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  pathname === "/profile" || pathname === "/login"
                    ? "text-[#8C7352] bg-[#F0EDE6] border border-[#B49A75]/40"
                    : "text-[#77736C] hover:text-[#25241F] hover:bg-[#F0EDE6]"
                }`}
                title="Client Profile"
                aria-label="User Profile"
              >
                <User size={16} />
              </NextLink>

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={`relative px-4 py-1.5 rounded-full bg-[#25241F] border border-[#25241F] text-white hover:bg-[#38362F] text-xs font-medium tracking-wider flex items-center gap-2 transition-all duration-200 shadow-xs cursor-pointer ${
                  cartPulse ? "scale-105 ring-2 ring-[#B49A75]" : "scale-100"
                }`}
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag size={14} className="text-[#B49A75]" />
                <span className="hidden sm:inline">Bag</span>
                {cartCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#B49A75] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  sounds.playClick();
                }}
                className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#25241F] hover:bg-[#F0EDE6] transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Smooth Auto-Focus Search Drawer */}
        <div
          className={`expandable-container ${searchOpen ? "is-expanded" : ""}`}
          aria-hidden={!searchOpen}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-5 mt-3 border-t border-[#E5E0D7]">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
              <Search size={16} className="absolute left-4 text-[#77736C] pointer-events-none" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                placeholder="Search archival trench coats, mulberry silk, cashmere, tailoring..."
                className="w-full pl-11 pr-28 py-3 rounded-full bg-white border border-[#E5E0D7] focus:border-[#B49A75] focus:outline-none text-xs text-[#25241F] placeholder-[#77736C] shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-2 rounded-full bg-[#25241F] hover:bg-[#38362F] text-white text-[11px] font-medium transition-colors cursor-pointer"
              >
                Explore All
              </button>
            </form>

            {/* Quick Results Preview */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7352]">
                  {searchQuery.trim() ? "Matching Archival Pieces" : "Popular Atelier Creations"}
                </span>
                <NextLink
                  href="/explore"
                  onClick={() => setSearchOpen(false)}
                  className="text-[11px] text-[#77736C] hover:text-[#25241F] flex items-center gap-1"
                >
                  <span>Full Catalog</span>
                  <ArrowRight size={11} />
                </NextLink>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {quickSearchResults.map((item) => (
                  <NextLink
                    key={item.id}
                    href={`/product/${item.slug || item.id}`}
                    onClick={() => {
                      recordProductView(item.id);
                      setSearchOpen(false);
                      sounds.playClick();
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl bg-white border border-[#E5E0D7] hover:border-[#B49A75] transition-colors"
                  >
                    <img
                      src={item.images.hero}
                      alt={item.name}
                      loading="lazy"
                      className="w-11 h-14 rounded-lg object-cover bg-[#F0EDE6] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-xs text-[#25241F] font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-[#77736C] truncate">{item.collectionName}</p>
                      <p className="font-serif text-[11px] font-bold text-[#8C7352] mt-0.5">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </NextLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Editorial Toast Notification */}
      {mounted && activeToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-sm bg-white border border-[#B49A75] rounded-2xl p-4 shadow-[0_18px_40px_-12px_rgba(37,36,31,0.18)] flex items-center gap-3.5 text-[#25241F] animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="w-9 h-9 rounded-full bg-[#F0EDE6] border border-[#B49A75]/40 flex items-center justify-center text-[#607B60] shrink-0">
            <CheckCircle2 size={17} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-xs font-semibold text-[#25241F]">{activeToast.title}</p>
            {activeToast.subtitle && (
              <p className="text-[11px] text-[#77736C] truncate mt-0.5">{activeToast.subtitle}</p>
            )}
          </div>
          {activeToast.type === "bag" && (
            <button
              type="button"
              onClick={() => {
                dismissToast();
                setIsOpen(true);
              }}
              className="px-3 py-1.5 rounded-full bg-[#25241F] text-white text-[10px] font-semibold tracking-wider uppercase hover:bg-[#38362F] transition-colors shrink-0 cursor-pointer"
            >
              View Bag
            </button>
          )}
          <button
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss notification"
            className="text-[#77736C] hover:text-[#25241F] p-1 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F8F6F1]/98 backdrop-blur-2xl lg:hidden flex flex-col pt-24 px-6 pb-12 animate-in fade-in duration-200 text-[#25241F]">
          <div className="flex flex-col gap-4 flex-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#77736C] border-b border-[#E5E0D7] pb-2 font-mono">
              Atelier Navigation
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
                  className="flex items-center justify-between py-3 border-b border-[#E5E0D7] text-lg font-serif text-[#25241F] hover:text-[#8C7352] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-[#B49A75]" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0EDE6] text-[#8C7352] border border-[#B49A75]/40 font-sans">
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
              className="flex items-center justify-between py-3 border-b border-[#E5E0D7] text-lg font-serif text-[#25241F] hover:text-[#8C7352] transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogIn size={18} className="text-[#B49A75]" />
                <span>Sign In / Register</span>
              </div>
            </NextLink>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E5E0D7] flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs text-[#25241F] font-medium">3D Digital Wardrobe</p>
              <p className="text-[11px] text-[#77736C]">Interactive showroom experience</p>
            </div>
            <NextLink
              href="/wardrobe"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 rounded-full bg-[#25241F] text-white text-xs font-semibold"
            >
              Enter
            </NextLink>
          </div>
        </div>
      )}
    </>
  );
}
