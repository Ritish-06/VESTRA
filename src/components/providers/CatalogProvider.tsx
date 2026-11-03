"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Product, Collection } from "@/types/product";
import { PRODUCTS, COLLECTIONS } from "@/data/products";
import { stockKey } from "@/lib/commerce";

interface CatalogContextValue {
  products: Product[];
  collections: Collection[];
  getProduct: (idOrSlug: string) => Product | undefined;
  /** Units available for a variant; `undefined` stock data means "unknown" (treated as available). */
  stockFor: (product: Product, colorId: string, size: string) => number;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({
  products,
  collections,
  children,
}: {
  products: Product[];
  collections: Collection[];
  children: React.ReactNode;
}) {
  const value = useMemo<CatalogContextValue>(() => {
    const byKey = new Map<string, Product>();
    for (const p of products) {
      byKey.set(p.id, p);
      byKey.set(p.slug, p);
    }
    return {
      products,
      collections,
      getProduct: (k) => byKey.get(k),
      stockFor: (product, colorId, size) => {
        const live = byKey.get(product.id) ?? product;
        if (!live.stock) return 99;
        return live.stock[stockKey(colorId, size)] ?? 0;
      },
    };
  }, [products, collections]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

/** Live storefront catalog (served from PostgreSQL via the root layout). */
export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (ctx) return ctx;
  // Outside the provider (should not happen in the app) — fall back to the seed catalog.
  return {
    products: PRODUCTS,
    collections: COLLECTIONS,
    getProduct: (k) => PRODUCTS.find((p) => p.id === k || p.slug === k),
    stockFor: () => 99,
  };
}

