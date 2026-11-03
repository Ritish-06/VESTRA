export type ProductCategory = 
  | "outerwear"
  | "tailoring"
  | "tops"
  | "trousers"
  | "dresses"
  | "footwear"
  | "accessories";

export type GarmentGeometryType = 
  | "trench_coat"
  | "tailored_blazer"
  | "silk_shirt"
  | "evening_gown"
  | "pleated_trouser"
  | "knit_sweater"
  | "leather_jacket"
  | "minimalist_vest"
  | "tote_bag";

export interface Colorway {
  id: string;
  name: string;
  hex: string;
  threeColor: string;
  image?: string;
}

export interface FabricSpec {
  name: string;
  composition: string;
  origin: string;
  weightGsm: number;
  textureDescription: string;
  weave: string;
  roughness: number;
  metalness: number;
  sheen?: number;
}

export type Audience = "WOMEN" | "MEN" | "UNISEX";

export interface Product {
  id: string;
  /** URL slug used by /product/[slug] */
  slug: string;
  name: string;
  subtitle: string;
  /** Who the garment is cut for (drives the Women / Men explore filters) */
  audience: Audience;
  /** Garment care guidance shown on the product page */
  careInstructions: string[];
  /** Optional GLB/GLTF model (public path or CDN URL). Falls back to procedural geometry. */
  modelUrl?: string | null;
  /** Units in stock keyed by `${colorId}|${size}` (populated from the database) */
  stock?: Record<string, number>;
  collectionId: string;
  collectionName: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isLimited?: boolean;
  description: string;
  editorialQuote: string;
  details: string[];
  fabric: FabricSpec;
  colorways: Colorway[];
  sizes: string[];
  images: {
    hero: string;
    modelFront: string;
    modelBack: string;
    fabricDetail: string;
    hangerView: string;
  };
  geometryType: GarmentGeometryType;
  threeDimensions: {
    width: number;
    height: number;
    depth: number;
  };
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface Collection {
  id: string;
  name: string;
  season: string;
  tagline: string;
  description: string;
  coverImage: string;
  productCount: number;
  palette: string[];
}

