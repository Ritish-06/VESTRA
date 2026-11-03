import "server-only";
import { prisma } from "@/lib/prisma";
import { shippingFeeFor, DeliveryMethodId } from "@/lib/commerce";

export interface CartItemInput {
  productId: string;
  colorId: string;
  size: string;
  quantity: number;
}

export interface ValidatedOrderItem {
  productId: string;
  variantId: string;
  productName: string;
  colorName: string;
  size: string;
  image: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderPricingResult {
  valid: boolean;
  error?: string;
  items: ValidatedOrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponApplied?: {
    code: string;
    discountPct: number;
  };
}

/**
 * Validates cart items against the authoritative database records,
 * ensures variants and inventory exist, and calculates subtotal, coupon discount,
 * shipping fee, and total in Indian Rupees (INR).
 */
export async function calculateOrderPricing(
  itemsInput: CartItemInput[],
  deliveryMethod: DeliveryMethodId = "STANDARD",
  couponCode?: string | null
): Promise<OrderPricingResult> {
  if (!itemsInput || itemsInput.length === 0) {
    return {
      valid: false,
      error: "Your shopping bag is empty.",
      items: [],
      subtotal: 0,
      discount: 0,
      shippingFee: 0,
      total: 0,
    };
  }

  const validatedItems: ValidatedOrderItem[] = [];
  let subtotal = 0;

  for (const item of itemsInput) {
    if (item.quantity <= 0) continue;

    const product = await prisma.product.findUnique({
      where: { id: item.productId, isActive: true },
      include: {
        variants: {
          where: { colorId: item.colorId, size: item.size, isActive: true },
          include: { inventory: true },
        },
      },
    });

    if (!product || product.variants.length === 0) {
      return {
        valid: false,
        error: `Garment variant for product ID "${item.productId}" is not available in the atelier.`,
        items: [],
        subtotal: 0,
        discount: 0,
        shippingFee: 0,
        total: 0,
      };
    }

    const variant = product.variants[0];
    const availableStock = variant.inventory?.quantity ?? 0;
    if (availableStock < item.quantity) {
      return {
        valid: false,
        error: `Only ${availableStock} piece(s) available in stock for "${product.name}" (${variant.colorName}, ${variant.size}).`,
        items: [],
        subtotal: 0,
        discount: 0,
        shippingFee: 0,
        total: 0,
      };
    }

    const unitPrice = product.price;
    const itemTotal = unitPrice * item.quantity;
    subtotal += itemTotal;

    const images = product.images as unknown as { hero?: string; modelFront?: string };
    const image = images?.modelFront || images?.hero || "";

    validatedItems.push({
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      colorName: variant.colorName,
      size: variant.size,
      image,
      unitPrice,
      quantity: item.quantity,
      totalPrice: itemTotal,
    });
  }

  // Authoritative Coupon Validation
  let discount = 0;
  let couponApplied: { code: string; discountPct: number } | undefined;

  if (couponCode) {
    const cleanCode = couponCode.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode, isActive: true },
    });

    if (coupon) {
      const isNotExpired = !coupon.expiresAt || coupon.expiresAt > new Date();
      const meetsMinSubtotal = subtotal >= coupon.minSubtotal;

      if (isNotExpired && meetsMinSubtotal) {
        discount = Math.round((subtotal * coupon.discountPct) / 100);
        couponApplied = {
          code: coupon.code,
          discountPct: coupon.discountPct,
        };
      }
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shippingFee = shippingFeeFor(deliveryMethod, discountedSubtotal);
  const total = discountedSubtotal + shippingFee;

  return {
    valid: true,
    items: validatedItems,
    subtotal,
    discount,
    shippingFee,
    total,
    couponApplied,
  };
}
