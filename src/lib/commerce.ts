/**
 * Shared commerce rules (safe to import from client and server).
 * The server is always authoritative — client code only uses these for
 * previews; every total is recomputed in `src/lib/pricing.ts`.
 */

export const CURRENCY = "INR";

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Format whole rupees, e.g. 148000 → "₹1,48,000" */
export function formatPrice(amount: number): string {
  return inrFormatter.format(Math.round(amount));
}

export type DeliveryMethodId = "STANDARD" | "EXPRESS";

export const DELIVERY_OPTIONS: Record<
  DeliveryMethodId,
  { id: DeliveryMethodId; label: string; description: string; fee: number; minDays: number; maxDays: number }
> = {
  STANDARD: {
    id: "STANDARD",
    label: "Standard Delivery",
    description: "Insured courier, signature on delivery",
    fee: 500,
    minDays: 4,
    maxDays: 6,
  },
  EXPRESS: {
    id: "EXPRESS",
    label: "Express Delivery",
    description: "Priority dispatch within 24 hours",
    fee: 1500,
    minDays: 1,
    maxDays: 2,
  },
};

/** Standard delivery is complimentary above this subtotal (after discount). */
export const FREE_STANDARD_SHIPPING_THRESHOLD = 50000;

export function shippingFeeFor(method: DeliveryMethodId, discountedSubtotal: number): number {
  if (discountedSubtotal <= 0) return 0;
  if (method === "STANDARD" && discountedSubtotal >= FREE_STANDARD_SHIPPING_THRESHOLD) return 0;
  return DELIVERY_OPTIONS[method].fee;
}

/** Add business days (skips Sundays) to a date. */
export function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) added++;
  }
  return d;
}

export function estimatedDeliveryRange(method: DeliveryMethodId, from: Date = new Date()) {
  const opt = DELIVERY_OPTIONS[method];
  return { earliest: addBusinessDays(from, opt.minDays), latest: addBusinessDays(from, opt.maxDays) };
}

export function formatDeliveryDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export const stockKey = (colorId: string, size: string) => `${colorId}|${size}`;

/** Order lifecycle stages shown in tracking (in order). */
export const TRACKING_STAGES = [
  { status: "PLACED", label: "Order placed", description: "We've received your order." },
  { status: "CONFIRMED", label: "Order confirmed", description: "Payment verified and your pieces reserved." },
  { status: "PREPARING", label: "Preparing your order", description: "Pressed, inspected and packed by our atelier." },
  { status: "SHIPPED", label: "Shipped", description: "Handed to our insured courier partner." },
  { status: "OUT_FOR_DELIVERY", label: "Out for delivery", description: "Your parcel is on its way to you today." },
  { status: "DELIVERED", label: "Delivered", description: "Signed for at your address." },
] as const;

export type TrackingStatus = (typeof TRACKING_STAGES)[number]["status"];

