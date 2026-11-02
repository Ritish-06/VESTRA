"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Product, Colorway } from "@/types/product";
import GarmentMesh from "./GarmentMesh";
import { sounds } from "@/utils/soundEffects";

interface HangerItemProps {
  product: Product;
  selectedColor?: Colorway;
  index: number;
  totalCount: number;
  spacing: number;
  isSelected: boolean;
  onSelect: (product: Product) => void;
  railOffset: number;
}

export default function HangerItem({
  product,
  selectedColor,
  index,
  totalCount,
  spacing,
  isSelected,
  onSelect,
  railOffset,
}: HangerItemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Default base position along the rail
  const baseTargetX = (index - (totalCount - 1) / 2) * spacing + railOffset;
  const activeColor = selectedColor || product.colorways[0];

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Determine target positions with spring-like smooth damping
    let targetX = baseTargetX;
    let targetY = 0;
    let targetZ = 0;
    let targetRotZ = 0;

    if (isSelected) {
      targetY = 0.12;
      targetZ = 0.45; // moves forward toward camera for spotlight focus
    } else if (hovered) {
      targetY = 0.04;
      targetZ = 0.12;
      targetRotZ = Math.sin(state.clock.getElapsedTime() * 4) * 0.03; // gentle hanger sway
    }

    // Smooth lerp
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 8);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 8);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, delta * 8);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, delta * 6);
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    sounds.playGarmentInspect();
    onSelect(product);
  };

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
    sounds.playHangerSlide();
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group
      ref={groupRef}
      position={[baseTargetX, 0, 0]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <GarmentMesh
        geometryType={product.geometryType}
        colorway={activeColor}
        roughness={product.fabric.roughness}
        metalness={product.fabric.metalness}
        sheen={product.fabric.sheen}
        isHovered={hovered}
        isSelected={isSelected}
      />
    </group>
  );
}

