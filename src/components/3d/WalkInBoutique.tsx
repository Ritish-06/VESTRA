"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { Product, Colorway } from "@/types/product";
import GarmentMesh from "./GarmentMesh";
import { Float } from "@react-three/drei";

interface WalkInBoutiqueProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  itemColors?: Record<string, Colorway>;
}

export default function WalkInBoutique({
  products,
  selectedProduct,
  onSelectProduct,
  itemColors = {},
}: WalkInBoutiqueProps) {
  const roomGroupRef = useRef<THREE.Group>(null);

  // Divide products into center pedestal, left gallery, and right gallery
  const centerItem = selectedProduct || products[0];
  const leftGalleryItems = products.slice(1, 4);
  const rightGalleryItems = products.slice(4, 7);

  return (
    <group ref={roomGroupRef} position={[0, -0.2, 0]}>
      {/* --- Architectural Room Shell --- */}
      {/* Luxury Dark Marble Floor */}
      <mesh position={[0, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial
          color="#0c0d10"
          roughness={0.12}
          metalness={0.35}
        />
      </mesh>

      {/* Back Wall with Architectural Slat Design */}
      <mesh position={[0, 1.5, -4]}>
        <planeGeometry args={[16, 8]} />
        <meshStandardMaterial color="#141519" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Back Lit Onyx Panel */}
      <mesh position={[0, 1.2, -3.95]}>
        <planeGeometry args={[6, 4.5]} />
        <meshStandardMaterial
          color="#1e1c18"
          emissive="#c5a880"
          emissiveIntensity={0.15}
          roughness={0.4}
        />
      </mesh>

      {/* Ceiling with Recessed Light Tracks */}
      <mesh position={[0, 4.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#0e0e11" roughness={0.9} />
      </mesh>

      {/* Ceiling Recessed Light Strips (Emissive) */}
      <mesh position={[-2.5, 4.18, 0]}>
        <boxGeometry args={[0.08, 0.02, 10]} />
        <meshStandardMaterial emissive="#f5f4f0" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[2.5, 4.18, 0]}>
        <boxGeometry args={[0.08, 0.02, 10]} />
        <meshStandardMaterial emissive="#f5f4f0" emissiveIntensity={1.2} />
      </mesh>

      {/* --- Center Showcase Pedestal --- */}
      <group position={[0, -1.8, 0]}>
        {/* Tier 1 Circular Marble Base */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.3, 1.4, 0.1, 36]} />
          <meshStandardMaterial color="#18181c" roughness={0.2} metalness={0.4} />
        </mesh>
        {/* Brass Accent Ring */}
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[1.15, 1.15, 0.02, 36]} />
          <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Illuminated Edge Ring */}
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.35, 0.02, 12, 48]} />
          <meshStandardMaterial emissive="#c5a880" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Centerpiece Garment on Floating Pedestal Display */}
      {centerItem && (
        <group position={[0, 0.25, 0]}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.15}>
            <group
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(centerItem);
              }}
              onPointerOver={() => {
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "auto";
              }}
            >
              <GarmentMesh
                geometryType={centerItem.geometryType}
                colorway={itemColors[centerItem.id] || centerItem.colorways[0]}
                roughness={centerItem.fabric.roughness}
                metalness={centerItem.fabric.metalness}
                sheen={centerItem.fabric.sheen}
                isSelected={true}
              />
            </group>
          </Float>

          {/* Central Spotlight directly on the centerpiece */}
          <spotLight
            position={[0, 3.8, 1.2]}
            target-position={[0, 0, 0]}
            intensity={2.8}
            angle={0.45}
            penumbra={0.6}
            color="#fff8ed"
          />
        </group>
      )}

      {/* --- Left Wall Gallery Rail --- */}
      <group position={[-3.2, 0, -1]} rotation={[0, 0.4, 0]}>
        {/* Horizontal Brass Wall Bar */}
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 2.8, 16]} />
          <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Left Gallery Items */}
        {leftGalleryItems.map((prod, i) => (
          <group
            key={prod.id}
            position={[(i - 1) * 0.7, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(prod);
            }}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <GarmentMesh
              geometryType={prod.geometryType}
              colorway={itemColors[prod.id] || prod.colorways[0]}
              roughness={prod.fabric.roughness}
              metalness={prod.fabric.metalness}
              sheen={prod.fabric.sheen}
            />
          </group>
        ))}
      </group>

      {/* --- Right Wall Gallery Rail --- */}
      <group position={[3.2, 0, -1]} rotation={[0, -0.4, 0]}>
        {/* Horizontal Brass Wall Bar */}
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 2.8, 16]} />
          <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.25} />
        </mesh>
        {/* Right Gallery Items */}
        {rightGalleryItems.map((prod, i) => (
          <group
            key={prod.id}
            position={[(i - 1) * 0.7, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(prod);
            }}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <GarmentMesh
              geometryType={prod.geometryType}
              colorway={itemColors[prod.id] || prod.colorways[0]}
              roughness={prod.fabric.roughness}
              metalness={prod.fabric.metalness}
              sheen={prod.fabric.sheen}
            />
          </group>
        ))}
      </group>
    </group>
  );
}
