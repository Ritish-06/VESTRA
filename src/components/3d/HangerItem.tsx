"use client";

import React, { useRef, useState, useEffect } from "react";
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
  onSelectedObjectChange?: (object: THREE.Object3D | null) => void;
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
  onSelectedObjectChange,
}: HangerItemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const garmentHolderRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Base horizontal position along the rail
  const baseTargetX = (index - (totalCount - 1) / 2) * spacing + railOffset;
  const activeColor = selectedColor || product.colorways[0];

  useEffect(() => {
    if (isSelected && garmentHolderRef.current && onSelectedObjectChange) {
      onSelectedObjectChange(garmentHolderRef.current);
    }
  }, [isSelected, product.id, onSelectedObjectChange]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const targetX = baseTargetX;
    let targetY = 0;
    let targetZ = 0;
    let targetRotZ = 0;

    if (isSelected) {
      targetY = 0.015;
      targetZ = 0.22; // Subtle forward spotlight presentation while keeping hook on rail
    } else if (hovered) {
      targetY = 0.01;
      targetZ = 0.08;
      targetRotZ = Math.sin(state.clock.getElapsedTime() * 3.5) * 0.02;
    }

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
      <group ref={garmentHolderRef}>
        <GarmentMesh
          geometryType={product.geometryType}
          colorway={activeColor}
          modelUrl={product.modelUrl}
          roughness={product.fabric.roughness}
          metalness={product.fabric.metalness}
          sheen={product.fabric.sheen}
          isHovered={hovered}
          isSelected={isSelected}
        />
      </group>
    </group>
  );
}
