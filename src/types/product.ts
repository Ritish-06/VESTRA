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
  | "minimalist_vest";

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

export interface Product {
  id: string;
  name: string;
  subtitle: string;
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
