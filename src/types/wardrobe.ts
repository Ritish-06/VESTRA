import { Product, Colorway } from "./product";

export type AvatarModelType = "editorial_slate" | "minimalist_marble" | "haute_obsidian";

export interface WardrobeItem {
  id: string;
  productId: string;
  product: Product;
  selectedColor: Colorway;
  selectedSize: string;
  hangerPosition: number;
  addedAt: number;
  isCustomOutfit?: boolean;
}

export interface OutfitLook {
  id: string;
  name: string;
  occasion: string;
  description: string;
  top?: Product;
  outerwear?: Product;
  trousers?: Product;
  footwear?: Product;
  accessory?: Product;
  totalPrice: number;
  tags: string[];
}

export interface UserStyleProfile {
  name: string;
  aesthetic: string;
  favoritePalette: string[];
  heightCm: number;
  typicalSize: string;
  savedOutfitsCount: number;
  loyaltyTier: "Atelier Black" | "Private Client" | "Haute Circle";
}

