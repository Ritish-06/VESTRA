import { PRODUCTS } from "./products";
import { OutfitLook } from "@/types/wardrobe";

export interface StylistPrompt {
  id: string;
  query: string;
  category: "formal" | "avant-garde" | "business" | "resort" | "evening";
  occasion: string;
  recommendedLook: OutfitLook;
  stylistRationale: string;
}

export const STYLIST_PROMPTS: StylistPrompt[] = [
  {
    id: "gala-venice",
    query: "Suggest an outfit for a black-tie gala dinner in Venice.",
    category: "evening",
    occasion: "Venetian Biennale Gala / Red Carpet",
    recommendedLook: {
      id: "look-venice-01",
      name: "The Sovereign Evening Ensemble",
      occasion: "Black-Tie Biennale Gala",
      description: "Dramatic juxtaposition of fluid liquid satin and structural tailoring with understated lustrous accessories.",
      outerwear: PRODUCTS.find((p) => p.id === "vestra-blazer-02"),
      top: PRODUCTS.find((p) => p.id === "vestra-gown-05"),
      trousers: PRODUCTS.find((p) => p.id === "vestra-trouser-04"),
      totalPrice: 4810,
      tags: ["Haute Couture", "Black Tie", "Venice", "Archival"],
    },
    stylistRationale:
      "For a Venetian gala, dramatic light reflection across waterways demands opulent texture. Pair the bias-cut liquid satin gown with the architectural Super 160s blazer draped over the shoulders. The contrast between masculine Savile Row structure and feminine silk fluid movement is quintessentially VESTRA.",
  },
  {
    id: "keynote-tech",
    query: "What should I wear for a major international tech summit keynote?",
    category: "business",
    occasion: "Global Keynote / Sovereign Presentation",
    recommendedLook: {
      id: "look-keynote-02",
      name: "The Vanguard Tech-Luxe Uniform",
      occasion: "Global Keynote Stage",
      description: "Razor-sharp tailored blazer over brushed cloud cashmere with architectural column trousers.",
      outerwear: PRODUCTS.find((p) => p.id === "vestra-blazer-02"),
      top: PRODUCTS.find((p) => p.id === "vestra-knit-07"),
      trousers: PRODUCTS.find((p) => p.id === "vestra-trouser-04"),
      totalPrice: 3100,
      tags: ["Executive", "Keynote", "Minimalist Power"],
    },
    stylistRationale:
      "Stage lighting washes out unstructured clothing. The double-breasted blazer with sharp roped shoulders provides commanding geometry, while the brushed Mongolian cashmere turtleneck underneath keeps the posture relaxed, modern, and unpretentiously authoritative.",
  },
  {
    id: "tokyo-underground",
    query: "Curate a nighttime avant-garde look for gallery hops in Tokyo.",
    category: "avant-garde",
    occasion: "Contemporary Art Vernissage & Tokyo Nightlife",
    recommendedLook: {
      id: "look-tokyo-03",
      name: "Neo-Shinjuku Monolith",
      occasion: "Tokyo Night Vernissage",
      description: "Oiled Japanese washed calfskin paired with modular technical utility vest and deep pleated cavalry trousers.",
      outerwear: PRODUCTS.find((p) => p.id === "vestra-leather-06"),
      top: PRODUCTS.find((p) => p.id === "vestra-vest-08"),
      trousers: PRODUCTS.find((p) => p.id === "vestra-trouser-04"),
      totalPrice: 4180,
      tags: ["Avant-Garde", "Cyber-Minimal", "Tokyo Night", "Artisanal Leather"],
    },
    stylistRationale:
      "The Tokyo gallery scene calls for architectural texture rather than flashy logos. The 1.2mm Japanese washed calfskin biker coat creates dramatic silhouette, layered with the technical Fidlock utility gilet to add utilitarian depth over floor-grazing trousers.",
  },
  {
    id: "autumn-paris",
    query: "Suggest an effortlessly chic daytime look for Autumn in Paris.",
    category: "formal",
    occasion: "Left Bank Gallery Stroll & Cafe Flore",
    recommendedLook: {
      id: "look-paris-04",
      name: "Rive Gauche Contemplative",
      occasion: "Parisian Autumn Daytime",
      description: "Storm-resistant bonded gabardine trench over fluid asymmetrical silk blouse and relaxed pleats.",
      outerwear: PRODUCTS.find((p) => p.id === "vestra-trench-01"),
      top: PRODUCTS.find((p) => p.id === "vestra-shirt-03"),
      trousers: PRODUCTS.find((p) => p.id === "vestra-trouser-04"),
      totalPrice: 3320,
      tags: ["Parisian", "Effortless", "Fluid Tailoring"],
    },
    stylistRationale:
      "Parisian elegance thrives on subtle contradictions: the protective, structured volume of the double-breasted gabardine trench belted softly over the liquid drape of the Lyon silk blouse. Clean, cinematic, and timeless.",
  },
];

