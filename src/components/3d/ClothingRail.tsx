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
      {/* --- Bright Luxury Light Oak & Brushed Champagne Rail Structure --- */}
      {/* Main Horizontal Hanging Bar (Brushed Champagne) */}
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, railLength, 32]} />
        <meshStandardMaterial
          color="#B49A75"
          metalness={0.78}
          roughness={0.26}
        />
      </mesh>

      {/* Left End Finial Stopper */}
      <mesh position={[-railLength / 2, 0.55, 0]}>
        <sphereGeometry args={[0.032, 16, 16]} />
        <meshStandardMaterial color="#B49A75" metalness={0.82} roughness={0.22} />
      </mesh>

      {/* Right End Finial Stopper */}
      <mesh position={[railLength / 2, 0.55, 0]}>
        <sphereGeometry args={[0.032, 16, 16]} />
        <meshStandardMaterial color="#B49A75" metalness={0.82} roughness={0.22} />
      </mesh>

      {/* Left Vertical Support Pylon (Sculpted Light Oak) */}
      <mesh position={[-railLength / 2 + 0.15, -0.38, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 1.88, 20]} />
        <meshStandardMaterial color="#C8B294" metalness={0.18} roughness={0.5} />
      </mesh>

      {/* Left Champagne Collar Junction */}
      <mesh position={[-railLength / 2 + 0.15, 0.55, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.055, 20]} />
        <meshStandardMaterial color="#B49A75" metalness={0.82} roughness={0.22} />
      </mesh>

      {/* Left Base Foot (Warm Travertine Stone) */}
      <mesh position={[-railLength / 2 + 0.15, -1.32, 0]}>
        <boxGeometry args={[0.1, 0.045, 0.56]} />
        <meshStandardMaterial color="#E5DFD3" metalness={0.08} roughness={0.55} />
      </mesh>

      {/* Right Vertical Support Pylon (Sculpted Light Oak) */}
      <mesh position={[railLength / 2 - 0.15, -0.38, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 1.88, 20]} />
        <meshStandardMaterial color="#C8B294" metalness={0.18} roughness={0.5} />
      </mesh>

      {/* Right Champagne Collar Junction */}
      <mesh position={[railLength / 2 - 0.15, 0.55, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.055, 20]} />
        <meshStandardMaterial color="#B49A75" metalness={0.82} roughness={0.22} />
      </mesh>

      {/* Right Base Foot (Warm Travertine Stone) */}
      <mesh position={[railLength / 2 - 0.15, -1.32, 0]}>
        <boxGeometry args={[0.1, 0.045, 0.56]} />
        <meshStandardMaterial color="#E5DFD3" metalness={0.08} roughness={0.55} />
      </mesh>

      {/* Bottom Stabilizer Crossbar (Brushed Champagne) */}
      <mesh position={[0, -1.28, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.011, 0.011, railLength - 0.3, 16]} />
        <meshStandardMaterial color="#B49A75" metalness={0.7} roughness={0.32} />
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
