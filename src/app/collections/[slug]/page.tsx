import React from "react";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import CartDrawer from "@/components/navigation/CartDrawer";
import AsymmetricalEditorialShowcase from "@/components/ui/AsymmetricalEditorialShowcase";
import LookbookHotspotSlider from "@/components/ui/LookbookHotspotSlider";
import { PRODUCTS, COLLECTIONS } from "@/data/products";
import { formatPrice } from "@/lib/commerce";
import { Sliders, ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";

export function generateStaticParams() {
  return [
    { slug: "nocturne" },
    { slug: "sculptural" },
    { slug: "cyber-minimal" },
    { slug: "essential-forms" },
    { slug: "after-hours" },
    { slug: "modern-heritage" },
    { slug: "future-classics" },
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Curatorial worlds mapping
  const worldDescriptions: Record<
    string,
    { name: string; season: string; tagline: string; description: string; cover: string }
  > = {
    "essential-forms": {
      name: "01 / Essential Forms",
      season: "Permanent Core Atelier",
      tagline: "Architectural tailoring, monolithic trench coats & sharp foundational geometry.",
      description:
        "Everyday essentials stripped of superfluous ornament. Monolithic wools, bonded tech-cottons, and laser-precise seams engineered to anchor the modern silhouette.",
      cover: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85",
    },
    "after-hours": {
      name: "02 / After Hours",
      season: "Evening Couture Edition",
      tagline: "Nocturnal raw silk drape, liquid column gowns & sculptured twilight silhouettes.",
      description:
        "Designed for midnight salons and gallery openings. Heavy mulberry silk charmeuse with fluid asymmetrical hems and subtle metallic sheen.",
      cover: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85",
    },
    "modern-heritage": {
      name: "03 / Modern Heritage",
      season: "Atelier Autumn / Winter",
      tagline: "Double-faced cashmere, boiled wools & time-honored European artisanal milling.",
      description:
        "Centuries of sartorial heritage blended with forward-thinking construction. Tactile warmth, hand-finished lapels, and timeless presence.",
      cover: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=85",
    },
    "future-classics": {
      name: "04 / Future Classics",
      season: "Permanent Innovators",
      tagline: "Sculptural compact knitwear, fluid wide trousers & modular wardrobe staples.",
      description:
        "Garments built to outlive trends. Zero-waste 3D knit engineering, moisture-wicking organic wools, and adaptable ease.",
      cover: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85",
    },
  };

  const matchedCol = COLLECTIONS.find(
    (c) => c.id.toLowerCase() === slug.toLowerCase() || c.name.toLowerCase().includes(slug.toLowerCase())
  );
  const matchedWorld = worldDescriptions[slug.toLowerCase()];

  const title = matchedWorld?.name || matchedCol?.name || "Collection Exhibition";
  const season = matchedWorld?.season || matchedCol?.season || "VESTRA Atelier";
  const tagline = matchedWorld?.tagline || matchedCol?.tagline || "Haute couture reimagined for the digital era.";
  const description =
    matchedWorld?.description ||
    matchedCol?.description ||
    "Immersive silhouettes, physical-digital craftsmanship, and curated materials.";
  const coverImage =
    matchedWorld?.cover ||
    matchedCol?.coverImage ||
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85";

  // Filter products by collection or category
  const collectionProducts = PRODUCTS.filter((p) => {
    if (matchedCol && p.collectionId === matchedCol.id) return true;
    if (slug === "essential-forms") return p.category === "outerwear" || p.category === "tailoring";
    if (slug === "after-hours") return p.category === "dresses" || p.category === "accessories";
    if (slug === "modern-heritage") return p.category === "outerwear" || p.category === "tops";
    if (slug === "future-classics") return p.category === "trousers" || p.category === "tops";
    return true;
  });

  const displayProducts = collectionProducts.length > 0 ? collectionProducts : PRODUCTS.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#25241F] flex flex-col justify-between selection:bg-[#B49A75]/25 selection:text-[#25241F]">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 w-full pt-20 sm:pt-24 space-y-20 pb-28">
        {/* Editorial Collection Hero Banner */}
        <section className="relative w-full min-h-[72dvh] flex flex-col justify-end overflow-hidden border-b border-[#E5E0D7] bg-[#EEEAE2]">
          <div className="absolute inset-0 z-0">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25241F]/90 via-[#25241F]/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20 w-full space-y-6 text-[#F8F6F1]">
            <NextLink
              href="/collections"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.22em] text-[#B49A75] hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Curatorial Worlds</span>
            </NextLink>

            <div className="space-y-3 max-w-3xl">
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#B49A75] block">
                {season}
              </span>
              <h1 className="text-exhibition-display font-normal leading-[1.05] tracking-tight text-white">
                {title}
              </h1>
              <p className="text-base sm:text-lg font-serif italic text-white/90">
                &ldquo;{tagline}&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-[#E5E0D7] max-w-2xl leading-relaxed pt-2">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <NextLink
                href="/wardrobe"
                className="px-6 py-3 rounded-full bg-[#B49A75] hover:bg-[#A38863] text-[#25241F] text-xs font-semibold tracking-wider transition-all flex items-center gap-2 shadow-sm"
              >
                <Sliders size={14} />
                <span>Browse in 3D Wardrobe Rail</span>
              </NextLink>

              <NextLink
                href="/explore"
                className="px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-wider transition-colors flex items-center gap-1.5"
              >
                <span>View Full Archive</span>
                <ArrowUpRight size={13} />
              </NextLink>
            </div>
          </div>
        </section>

        {/* Curated Pieces Showcase */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between border-b border-[#E5E0D7] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7352]">
                EXHIBITION SILHOUETTES
              </span>
              <h2 className="text-exhibition-title text-[#25241F] font-normal">
                Curated Garment Plates
              </h2>
            </div>
            <span className="text-xs font-mono text-[#77736C]">
              {displayProducts.length} Pieces Documented
            </span>
          </div>

          <AsymmetricalEditorialShowcase
            products={displayProducts}
            title={`${title} // Curated Selection`}
            subtitle="Asymmetrical plates featuring fabric weights, composition notes, and dual-angle inspection."
          />
        </div>

        {/* Lookbook Hotspot Film */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <LookbookHotspotSlider />
        </div>
      </main>

      <Footer />
    </div>
  );
}
