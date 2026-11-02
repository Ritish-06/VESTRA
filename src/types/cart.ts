import { Product, Colorway } from "./product";

export interface CartItem {
  id: string; // unique item uuid (product + color + size)
  product: Product;
  selectedColor: Colorway;
  selectedSize: string;
  quantity: number;
  addedAt: number;
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  description: string;
}

export type OrderStatus = "confirmed" | "tailoring" | "quality_inspection" | "in_transit" | "delivered";

export interface OrderTrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  status: OrderStatus;
  shippingAddress: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  trackingTimeline: OrderTrackingStep[];
}

