"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import { ArrowLeft, MapPin, Plus, Check, Trash2, Home, Building } from "lucide-react";

interface SavedAddress {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  type: "home" | "studio" | "office";
}

export default function ProfileAddressesPage() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "addr-01",
      name: "Valentin De Vestra",
      line1: "42 Rue de Turenne",
      line2: "Atelier 4B",
      city: "Paris",
      state: "Île-de-France",
      postalCode: "75003",
      country: "France",
      phone: "+33 1 42 68 55 00",
      isDefault: true,
      type: "studio",
    },
    {
      id: "addr-02",
      name: "Valentin De Vestra",
      line1: "18 Kensington Palace Gardens",
      city: "London",
      state: "Greater London",
      postalCode: "W8 4QP",
      country: "United Kingdom",
      phone: "+44 20 7946 0912",
      isDefault: false,
      type: "home",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
    type: "home" as const,
  });

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.line1 || !newAddr.city || !newAddr.postalCode) return;
    const added: SavedAddress = {
      id: `addr-${Date.now()}`,
      ...newAddr,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, added]);
    setIsAdding(false);
    setNewAddr({
      name: "",
      line1: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      phone: "",
      type: "home",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col justify-between selection:bg-[#B49A75]/25 selection:text-[#25241F]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D7] pb-6">
          <div className="space-y-1">
            <NextLink
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#8C7352] hover:text-[#25241F] transition-colors mb-2"
            >
              <ArrowLeft size={13} />
              <span>Back to Profile</span>
            </NextLink>
            <h1 className="text-exhibition-title text-[#25241F] font-normal">
              Saved Delivery Addresses
            </h1>
            <p className="text-xs text-[#77736C]">
              Manage residential and salon destinations for white-glove courier deliveries.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-5 py-2.5 rounded-full bg-[#25241F] hover:bg-[#38362F] text-white text-xs font-medium flex items-center gap-2 self-start sm:self-auto transition-colors shadow-xs cursor-pointer"
          >
            <Plus size={14} className="text-[#B49A75]" />
            <span>{isAdding ? "Cancel" : "Add New Address"}</span>
          </button>
        </div>

        {/* Add Address Form */}
        {isAdding && (
          <form
            onSubmit={handleAddSubmit}
            className="p-8 rounded-3xl bg-white border border-[#B49A75] space-y-5 shadow-sm"
          >
            <h3 className="font-serif text-lg text-[#25241F] font-medium">New Atelier Delivery Destination</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#77736C] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  placeholder="e.g. Valentin De Vestra"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D7] text-xs text-[#25241F]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#77736C] mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D7] text-xs text-[#25241F]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-[#77736C] mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddr.line1}
                  onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                  placeholder="Apartment, suite, street"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D7] text-xs text-[#25241F]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#77736C] mb-1">City</label>
                <input
                  type="text"
                  required
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  placeholder="e.g. Mumbai"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D7] text-xs text-[#25241F]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#77736C] mb-1">Postal / ZIP Code</label>
                <input
                  type="text"
                  required
                  value={newAddr.postalCode}
                  onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                  placeholder="e.g. 400001"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D7] text-xs text-[#25241F]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-full border border-[#E5E0D7] text-xs text-[#77736C]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-[#25241F] text-white text-xs font-semibold uppercase tracking-wider"
              >
                Save Destination
              </button>
            </div>
          </form>
        )}

        {/* Address Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-6 rounded-3xl bg-white border transition-all space-y-4 shadow-xs relative ${
                addr.isDefault ? "border-[#B49A75] ring-1 ring-[#B49A75]/30" : "border-[#E5E0D7]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {addr.type === "studio" ? (
                    <Building size={16} className="text-[#8C7352]" />
                  ) : (
                    <Home size={16} className="text-[#8C7352]" />
                  )}
                  <h4 className="font-serif text-base text-[#25241F] font-medium">{addr.name}</h4>
                </div>

                {addr.isDefault && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B49A75]/15 border border-[#B49A75]/30 text-[#8C7352] text-[10px] font-mono uppercase tracking-wider font-semibold">
                    Default
                  </span>
                )}
              </div>

              <div className="text-xs text-[#77736C] space-y-0.5 font-mono">
                <p className="text-[#25241F] font-sans">{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>
                  {addr.city}, {addr.state} {addr.postalCode}
                </p>
                <p>{addr.country}</p>
                <p className="pt-1 text-[#8C7352]">{addr.phone}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D7]">
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs text-[#8C7352] hover:underline font-medium cursor-pointer"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-xs text-[#667B63] flex items-center gap-1 font-medium">
                    <Check size={13} /> Default Address
                  </span>
                )}

                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs text-[#77736C] hover:text-red-600 transition-colors p-1 cursor-pointer"
                  title="Remove Address"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
