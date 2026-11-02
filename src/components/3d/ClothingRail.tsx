"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { Product, Colorway } from "@/types/product";
import HangerItem from "./HangerItem";

interface ClothingRailProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  railOffset: number;
  itemColors?: Record<string, Colorway>;
}

export default function ClothingRail({
  products,
  selectedProduct,
  onSelectProduct,
  railOffset,
  itemColors = {},
}: ClothingRailProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spacing = 0.58; // Distance between hangers along the rail
  const railLength = Math.max(5.5, products.length * spacing + 1.2);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* --- High-End Architectural Rail Structure --- */}
      {/* Main Horizontal Hanging Bar (Brushed Brass) */}
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.016, railLength, 32]} />
        <meshStandardMaterial
          color="#c5a880"
          metalness={0.88}
          roughness={0.25}
        />
      </mesh>

      {/* Left End Finial Stopper */}
      <mesh position={[-railLength / 2, 0.55, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right End Finial Stopper */}
      <mesh position={[railLength / 2, 0.55, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left Vertical Support Pylon */}
      <mesh position={[-railLength / 2 + 0.15, -0.65, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2.4, 20]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Left Gold Collar Junction */}
      <mesh position={[-railLength / 2 + 0.15, 0.55, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 20]} />
        <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left Base Foot (Heavy Matte Charcoal) */}
      <mesh position={[-railLength / 2 + 0.15, -1.82, 0]}>
        <boxGeometry args={[0.1, 0.05, 0.6]} />
        <meshStandardMaterial color="#121215" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Right Vertical Support Pylon */}
      <mesh position={[railLength / 2 - 0.15, -0.65, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2.4, 20]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Right Gold Collar Junction */}
      <mesh position={[railLength / 2 - 0.15, 0.55, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 20]} />
        <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right Base Foot */}
      <mesh position={[railLength / 2 - 0.15, -1.82, 0]}>
        <boxGeometry args={[0.1, 0.05, 0.6]} />
        <meshStandardMaterial color="#121215" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Bottom Stabilizer Crossbar */}
      <mesh position={[0, -1.78, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, railLength - 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* --- Garments Hanging on the Rail --- */}
      {products.map((product, idx) => (
        <HangerItem
          key={product.id}
          product={product}
          selectedColor={itemColors[product.id] || product.colorways[0]}
          index={idx}
          totalCount={products.length}
          spacing={spacing}
          isSelected={selectedProduct?.id === product.id}
          onSelect={onSelectProduct}
          railOffset={railOffset}
        />
      ))}
    </group>
  );
}
