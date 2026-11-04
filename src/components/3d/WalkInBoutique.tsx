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

  const centerItem = selectedProduct || products[0];
  const leftGalleryItems = products.slice(1, 4);
  const rightGalleryItems = products.slice(4, 7);

  return (
    <group ref={roomGroupRef} position={[0, -0.2, 0]}>
      {/* --- Bright Luxury Architectural Salon Shell --- */}
      {/* Warm Honed Travertine Limestone Floor */}
      <mesh position={[0, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial
          color="#EAE5DC"
          roughness={0.38}
          metalness={0.06}
        />
      </mesh>

      {/* Back Architectural Plaster Wall */}
      <mesh position={[0, 1.5, -4]}>
        <planeGeometry args={[18, 8]} />
        <meshStandardMaterial color="#F3EFE7" roughness={0.85} metalness={0.02} />
      </mesh>

      {/* Warm Back-Lit Alabaster Feature Panel */}
      <mesh position={[0, 1.1, -3.94]}>
        <planeGeometry args={[6.2, 4.4]} />
        <meshStandardMaterial
          color="#FAF7F1"
          emissive="#F4EBDD"
          emissiveIntensity={0.22}
          roughness={0.45}
        />
      </mesh>

      {/* Champagne Architectural Frame around Feature Panel */}
      <mesh position={[0, 1.1, -3.96]}>
        <planeGeometry args={[6.32, 4.52]} />
        <meshStandardMaterial color="#B49A75" metalness={0.65} roughness={0.35} />
      </mesh>

      {/* Ceiling with Warm Gallery Light Tracks */}
      <mesh position={[0, 4.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#F8F6F1" roughness={0.9} />
      </mesh>

      {/* --- Center Travertine & Brushed Champagne Pedestal --- */}
      <group position={[0, -1.8, 0]}>
        {/* Tier 1 Circular Travertine Base */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[1.28, 1.38, 0.12, 40]} />
          <meshStandardMaterial color="#E5DFD3" roughness={0.45} metalness={0.08} />
        </mesh>
        {/* Brushed Champagne Accent Ring */}
        <mesh position={[0, 0.125, 0]}>
          <cylinderGeometry args={[1.14, 1.14, 0.02, 40]} />
          <meshStandardMaterial color="#B49A75" metalness={0.78} roughness={0.25} />
        </mesh>
        {/* Outer Champagne Trim Ring */}
        <mesh position={[0, 0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.36, 0.015, 12, 48]} />
          <meshStandardMaterial color="#B49A75" metalness={0.75} roughness={0.28} />
        </mesh>
      </group>

      {/* Centerpiece Garment on Floating Pedestal Display */}
      {centerItem && (
        <group position={[0, 0.12, 0]}>
          <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.06}>
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
                modelUrl={centerItem.modelUrl}
                roughness={centerItem.fabric.roughness}
                metalness={centerItem.fabric.metalness}
                sheen={centerItem.fabric.sheen}
                isSelected={true}
              />
            </group>
          </Float>

          {/* Soft Natural Gallery Spotlight on Centerpiece */}
          <spotLight
            position={[0, 3.8, 1.5]}
            intensity={1.6}
            angle={0.5}
            penumbra={0.7}
            color="#FFFDF8"
          />
        </group>
      )}

      {/* --- Left Wall Gallery Rail --- */}
      <group position={[-3.1, 0, -1]} rotation={[0, 0.38, 0]}>
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 2.7, 16]} />
          <meshStandardMaterial color="#B49A75" metalness={0.78} roughness={0.26} />
        </mesh>
        {leftGalleryItems.map((prod, i) => (
          <group
            key={prod.id}
            position={[(i - 1) * 0.72, 0, 0]}
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
              modelUrl={prod.modelUrl}
              roughness={prod.fabric.roughness}
              metalness={prod.fabric.metalness}
              sheen={prod.fabric.sheen}
            />
          </group>
        ))}
      </group>

      {/* --- Right Wall Gallery Rail --- */}
      <group position={[3.1, 0, -1]} rotation={[0, -0.38, 0]}>
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 2.7, 16]} />
          <meshStandardMaterial color="#B49A75" metalness={0.78} roughness={0.26} />
        </mesh>
        {rightGalleryItems.map((prod, i) => (
          <group
            key={prod.id}
            position={[(i - 1) * 0.72, 0, 0]}
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
              modelUrl={prod.modelUrl}
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
