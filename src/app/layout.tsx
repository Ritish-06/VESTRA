import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VESTRA — The Future of Digital Fashion | 3D Wardrobe & Atelier",
  description:
    "An immersive 3D digital wardrobe and haute couture shopping platform. Explore clothes hanging in virtual 3D, inspect fabrics, try outfits on avatars, and consult your personal AI stylist.",
  keywords: [
    "Digital Fashion",
    "3D Wardrobe",
    "Virtual Try-On",
    "Haute Couture",
    "AI Stylist",
    "Three.js Fashion",
    "Luxury E-Commerce",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased selection:bg-[#c5a880]/30 selection:text-[#1c1917]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1C1917] font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
