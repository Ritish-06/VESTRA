import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Colorway } from "@/types/product";
import { WardrobeItem, OutfitLook, AvatarModelType, UserStyleProfile } from "@/types/wardrobe";
import { PRODUCTS } from "@/data/products";
import { sounds } from "@/utils/soundEffects";

export interface AtelierToast {
  id: number;
  title: string;
  subtitle?: string;
  type?: "bag" | "wishlist" | "wardrobe" | "info";
}

interface WardrobeState {
  wardrobeItems: WardrobeItem[];
  wishlistIds: string[];
  recentlyViewedIds: string[];
  savedOutfits: OutfitLook[];
  selectedAvatar: AvatarModelType;
  activeLook: {
    outerwear?: Product;
    top?: Product;
    trousers?: Product;
    footwear?: Product;
    accessory?: Product;
  };
  styleProfile: UserStyleProfile;
  activeToast: AtelierToast | null;

  // Actions
  addWardrobeItem: (product: Product, selectedColor: Colorway, selectedSize: string) => void;
  removeWardrobeItem: (id: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  recordProductView: (productId: string) => void;
  showToast: (title: string, subtitle?: string, type?: AtelierToast["type"]) => void;
  dismissToast: () => void;
  
  // Try-on & Look Actions
  setSelectedAvatar: (avatar: AvatarModelType) => void;
  setLookPiece: (category: "outerwear" | "top" | "trousers" | "footwear" | "accessory", product?: Product) => void;
  clearLook: () => void;
  loadOutfitLook: (look: OutfitLook) => void;
  saveCurrentLookAsOutfit: (name: string, occasion: string) => OutfitLook;
  deleteOutfitLook: (lookId: string) => void;
}

const DEFAULT_WARDROBE_ITEMS: WardrobeItem[] = [
  {
    id: "initial-01",
    productId: "vestra-trench-01",
    product: PRODUCTS[0],
    selectedColor: PRODUCTS[0].colorways[0],
    selectedSize: "48 (M)",
    hangerPosition: 0,
    addedAt: 1730550000000,
  },
  {
    id: "initial-02",
    productId: "vestra-blazer-02",
    product: PRODUCTS[1],
    selectedColor: PRODUCTS[1].colorways[0],
    selectedSize: "48 (M)",
    hangerPosition: 1,
    addedAt: 1730570000000,
  },
  {
    id: "initial-03",
    productId: "vestra-shirt-03",
    product: PRODUCTS[2],
    selectedColor: PRODUCTS[2].colorways[0],
    selectedSize: "40 (M)",
    hangerPosition: 2,
    addedAt: 1730590000000,
  },
];

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set, get) => ({
      wardrobeItems: DEFAULT_WARDROBE_ITEMS,
      wishlistIds: ["vestra-gown-05", "vestra-leather-06"],
      recentlyViewedIds: ["vestra-trench-01", "vestra-gown-05", "vestra-blazer-02"],
      savedOutfits: [],
      selectedAvatar: "haute_obsidian",
      activeToast: null,
      activeLook: {
        outerwear: PRODUCTS[1], // Blazer
        top: PRODUCTS[6], // Cashmere
        trousers: PRODUCTS[3], // Trousers
      },
      styleProfile: {
        name: "Valentin De Vestra",
        aesthetic: "Brutalist Tailoring & Midnight Silk",
        favoritePalette: ["#0b0b0c", "#1e1b18", "#c5a880", "#e2e8f0"],
        heightCm: 184,
        typicalSize: "EU 48 (M)",
        savedOutfitsCount: 3,
        loyaltyTier: "Atelier Black",
      },

      addWardrobeItem: (product, selectedColor, selectedSize) => {
        const id = `wardrobe-${Date.now()}`;
        const newPosition = get().wardrobeItems.length;
        set((state) => ({
          wardrobeItems: [
            ...state.wardrobeItems,
            {
              id,
              productId: product.id,
              product,
              selectedColor,
              selectedSize,
              hangerPosition: newPosition,
              addedAt: Date.now(),
            },
          ],
          activeToast: {
            id: Date.now(),
            title: "Hung on 3D Wardrobe Rail",
            subtitle: `${product.name} • ${selectedColor.name}`,
            type: "wardrobe",
          },
        }));
        sounds.playHangerSlide();
      },

      removeWardrobeItem: (id) => {
        set((state) => ({
          wardrobeItems: state.wardrobeItems.filter((item) => item.id !== id),
        }));
        sounds.playClick();
      },

      toggleWishlist: (productId) => {
        const current = get().wishlistIds;
        const exists = current.includes(productId);
        if (exists) {
          set({
            wishlistIds: current.filter((id) => id !== productId),
            activeToast: {
              id: Date.now(),
              title: "Removed from Vault Wishlist",
              type: "wishlist",
            },
          });
        } else {
          set({
            wishlistIds: [...current, productId],
            activeToast: {
              id: Date.now(),
              title: "Saved to Private Vault Wishlist",
              type: "wishlist",
            },
          });
          sounds.playChime();
        }
      },

      isInWishlist: (productId) => {
        return get().wishlistIds.includes(productId);
      },

      recordProductView: (productId) => {
        if (!productId) return;
        const current = get().recentlyViewedIds || [];
        const next = [productId, ...current.filter((id) => id !== productId)].slice(0, 10);
        set({ recentlyViewedIds: next });
      },

      showToast: (title, subtitle, type = "info") => {
        set({
          activeToast: {
            id: Date.now(),
            title,
            subtitle,
            type,
          },
        });
      },

      dismissToast: () => {
        set({ activeToast: null });
      },

      setSelectedAvatar: (avatar) => {
        set({ selectedAvatar: avatar });
        sounds.playClick();
      },

      setLookPiece: (category, product) => {
        set((state) => ({
          activeLook: {
            ...state.activeLook,
            [category]: product,
          },
        }));
        sounds.playGarmentInspect();
      },

      clearLook: () => {
        set({ activeLook: {} });
        sounds.playClick();
      },

      loadOutfitLook: (look) => {
        set({
          activeLook: {
            top: look.top,
            outerwear: look.outerwear,
            trousers: look.trousers,
            footwear: look.footwear,
            accessory: look.accessory,
          },
        });
        sounds.playChime();
      },

      saveCurrentLookAsOutfit: (name, occasion) => {
        const look = get().activeLook;
        const pieces = [look.outerwear, look.top, look.trousers, look.footwear, look.accessory].filter(Boolean) as Product[];
        const totalPrice = pieces.reduce((acc, p) => acc + p.price, 0);

        const newOutfit: OutfitLook = {
          id: `outfit-${Date.now()}`,
          name: name || `Curated Look ${get().savedOutfits.length + 1}`,
          occasion: occasion || "Private Salon",
          description: pieces.map((p) => p.name).join(" • "),
          top: look.top,
          outerwear: look.outerwear,
          trousers: look.trousers,
          footwear: look.footwear,
          accessory: look.accessory,
          totalPrice,
          tags: ["Custom Outfit", "Atelier", occasion || "Bespoke"],
        };

        set((state) => ({
          savedOutfits: [newOutfit, ...state.savedOutfits],
        }));

        sounds.playChime();
        return newOutfit;
      },

      deleteOutfitLook: (lookId) => {
        set((state) => ({
          savedOutfits: state.savedOutfits.filter((o) => o.id !== lookId),
        }));
        sounds.playClick();
      },
    }),
    {
      name: "vestra_wardrobe_storage",
      partialize: (state) => ({
        wardrobeItems: state.wardrobeItems,
        wishlistIds: state.wishlistIds,
        recentlyViewedIds: state.recentlyViewedIds,
        savedOutfits: state.savedOutfits,
        selectedAvatar: state.selectedAvatar,
        activeLook: state.activeLook,
        styleProfile: state.styleProfile,
      }),
    }
  )
);
