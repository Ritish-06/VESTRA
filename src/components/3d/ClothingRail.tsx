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
  onSelectedObjectChange?: (object: THREE.Object3D | null) => void;
}

export default function ClothingRail({
  products,
  selectedProduct,
  onSelectProduct,
  railOffset,
  itemColors = {},
  onSelectedObjectChange,
}: ClothingRailProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spacing = 0.58; // Distance between hangers along the rail
  const railLength = Math.max(5.5, products.length * spacing + 1.2);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* --- High-End Architectural Rail Structure --- */}
      {/* Main Horizontal Hanging Bar (Brushed Brass) */}
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, railLength, 32]} />
        <meshStandardMaterial
          color="#c5a880"
          metalness={0.88}
          roughness={0.25}
        />
      </mesh>

      {/* Left End Finial Stopper */}
      <mesh position={[-railLength / 2, 0.55, 0]}>
        <sphereGeometry args={[0.032, 16, 16]} />
        <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right End Finial Stopper */}
      <mesh position={[railLength / 2, 0.55, 0]}>
        <sphereGeometry args={[0.032, 16, 16]} />
        <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left Vertical Support Pylon */}
      <mesh position={[-railLength / 2 + 0.15, -0.38, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 1.88, 20]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Left Gold Collar Junction */}
      <mesh position={[-railLength / 2 + 0.15, 0.55, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.055, 20]} />
        <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left Base Foot (Heavy Matte Charcoal) */}
      <mesh position={[-railLength / 2 + 0.15, -1.32, 0]}>
        <boxGeometry args={[0.09, 0.04, 0.55]} />
        <meshStandardMaterial color="#121215" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Right Vertical Support Pylon */}
      <mesh position={[railLength / 2 - 0.15, -0.38, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 1.88, 20]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Right Gold Collar Junction */}
      <mesh position={[railLength / 2 - 0.15, 0.55, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.055, 20]} />
        <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right Base Foot */}
      <mesh position={[railLength / 2 - 0.15, -1.32, 0]}>
        <boxGeometry args={[0.09, 0.04, 0.55]} />
        <meshStandardMaterial color="#121215" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Bottom Stabilizer Crossbar */}
      <mesh position={[0, -1.28, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.011, 0.011, railLength - 0.3, 16]} />
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
          onSelectedObjectChange={onSelectedObjectChange}
        />
      ))}
    </group>
  );
}
