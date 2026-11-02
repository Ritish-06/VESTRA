import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Colorway } from "@/types/product";
import { CartItem, PromoCode, Order } from "@/types/cart";
import { sounds } from "@/utils/soundEffects";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promoCode: PromoCode | null;
  orders: Order[];
  
  // Actions
  addItem: (product: Product, selectedColor: Colorway, selectedSize: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  createOrder: (shippingAddress: Order["shippingAddress"]) => Order;
  
  // Computed values
  getSubtotal: () => number;
  getDiscount: () => number;
  getTax: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const VALID_PROMOS: Record<string, PromoCode> = {
  VESTRA10: { code: "VESTRA10", discountPercentage: 10, description: "10% Private Atelier Welcome" },
  HAUTE20: { code: "HAUTE20", discountPercentage: 20, description: "20% Archival Client Benefit" },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,
      orders: [],

      addItem: (product, selectedColor, selectedSize, quantity = 1) => {
        const itemId = `${product.id}-${selectedColor.id}-${selectedSize}`;
        const existingItem = get().items.find((item) => item.id === itemId);

        if (existingItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
            ),
            isOpen: true,
          }));
        } else {
          set((state) => ({
            items: [
              ...state.items,
              {
                id: itemId,
                product,
                selectedColor,
                selectedSize,
                quantity,
                addedAt: Date.now(),
              },
            ],
            isOpen: true,
          }));
        }
        sounds.playChime();
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
        sounds.playClick();
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
        sounds.playClick();
      },

      clearCart: () => {
        set({ items: [], promoCode: null });
      },

      setIsOpen: (isOpen) => {
        set({ isOpen });
        sounds.playClick();
      },

      applyPromo: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const promo = VALID_PROMOS[cleanCode];
        if (promo) {
          set({ promoCode: promo });
          sounds.playChime();
          return true;
        }
        return false;
      },

      removePromo: () => {
        set({ promoCode: null });
        sounds.playClick();
      },

      createOrder: (shippingAddress) => {
        const subtotal = get().getSubtotal();
        const discountAmount = get().getDiscount();
        const taxAmount = get().getTax();
        const shippingAmount = get().getShipping();
        const total = get().getTotal();

        const orderNumber = `VST-${Math.floor(100000 + Math.random() * 900000)}`;
        const now = new Date().toISOString();

        const newOrder: Order = {
          id: `order-${Date.now()}`,
          orderNumber,
          createdAt: now,
          items: [...get().items],
          subtotal,
          discountAmount,
          taxAmount,
          shippingAmount,
          total,
          status: "confirmed",
          shippingAddress,
          trackingTimeline: [
            {
              status: "confirmed",
              label: "Order Authenticated",
              description: "Bespoke tailoring dossier generated and assigned to master artisan.",
              timestamp: "Just now",
              isCompleted: true,
              isCurrent: true,
            },
            {
              status: "tailoring",
              label: "Atelier Assembly & Finishing",
              description: "Garment hand-finished, pressed and inspected under calibrated studio lighting.",
              timestamp: "Estimated in 24 hours",
              isCompleted: false,
              isCurrent: false,
            },
            {
              status: "quality_inspection",
              label: "Archival Quality Certification",
              description: "NFC microchip encrypted and white-glove boxed in archival museum packaging.",
              timestamp: "Estimated in 48 hours",
              isCompleted: false,
              isCurrent: false,
            },
            {
              status: "in_transit",
              label: "Private Courier Dispatch",
              description: "Dispatched via climate-controlled luxury express courier.",
              timestamp: "Estimated in 3 days",
              isCompleted: false,
              isCurrent: false,
            },
            {
              status: "delivered",
              label: "Delivered to Residence",
              description: "Signed for by client at destination address.",
              timestamp: "Estimated in 5 days",
              isCompleted: false,
              isCurrent: false,
            },
          ],
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          items: [],
          promoCode: null,
          isOpen: false,
        }));

        sounds.playChime();
        return newOrder;
      },

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const promo = get().promoCode;
        if (!promo) return 0;
        return (subtotal * promo.discountPercentage) / 100;
      },

      getTax: () => {
        const subtotal = get().getSubtotal() - get().getDiscount();
        return Math.round(subtotal * 0.08); // 8% luxury apparel tax
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 1500 || subtotal === 0 ? 0 : 50; // Complimentary courier over $1500
      },

      getTotal: () => {
        const sub = get().getSubtotal();
        const disc = get().getDiscount();
        const tax = get().getTax();
        const ship = get().getShipping();
        return sub - disc + tax + ship;
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "vestra_cart_storage",
    }
  )
);

