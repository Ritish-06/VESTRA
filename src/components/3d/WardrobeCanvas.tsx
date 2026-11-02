"use client";

import React, { useRef, useState, useEffect, Suspense, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Product, Colorway } from "@/types/product";
import ClothingRail from "./ClothingRail";
import WalkInBoutique from "./WalkInBoutique";
import { sounds } from "@/utils/soundEffects";

interface WardrobeCanvasProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  mode: "rail" | "boutique";
  railOffset: number;
  itemColors?: Record<string, Colorway>;
}

function CameraRig({
  mode,
  selectedProduct,
  railOffset,
}: {
  mode: "rail" | "boutique";
  selectedProduct: Product | null;
  railOffset: number;
}) {
  useFrame((state, delta) => {
    let targetX = 0;
    let targetY = 0.15;
    let targetZ = 3.8;

    if (mode === "boutique") {
      targetX = 0;
      targetY = 0.5;
      targetZ = 4.8;
    } else {
      // Rail Mode
      if (selectedProduct) {
        // Center camera gently toward focused product
        targetZ = 3.2;
        targetY = 0.05;
      } else {
        targetZ = 3.9;
        targetY = 0.1;
      }
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, delta * 3);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, delta * 3);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, delta * 3);
  });

  return null;
}

export default function WardrobeCanvas({
  products,
  selectedProduct,
  onSelectProduct,
  mode,
  railOffset,
  itemColors = {},
}: WardrobeCanvasProps) {
  return (
    <div className="w-full h-full relative r3f-container select-none">
      <Canvas
        camera={{ position: [0, 0.2, 4], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Ambient & Studio Lighting */}
          <ambientLight intensity={0.65} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.4}
            color="#fff8f0"
            castShadow
          />
          <directionalLight
            position={[-5, 4, -3]}
            intensity={0.7}
            color="#c5a880"
          />
          <pointLight position={[0, 2.5, 2]} intensity={0.5} color="#ffffff" />

          {/* Camera Smooth Rig */}
          <CameraRig
            mode={mode}
            selectedProduct={selectedProduct}
            railOffset={railOffset}
          />

          {/* Dual Experience: Rail vs Walk-in Boutique */}
          {mode === "rail" ? (
            <group position={[0, 0, 0]}>
              <ClothingRail
                products={products}
                selectedProduct={selectedProduct}
                onSelectProduct={onSelectProduct}
                railOffset={railOffset}
                itemColors={itemColors}
              />
              <ContactShadows
                position={[0, -1.82, 0]}
                opacity={0.7}
                scale={10}
                blur={2.5}
                far={4}
                color="#040406"
              />
            </group>
          ) : (
            <group position={[0, 0, 0]}>
              <WalkInBoutique
                products={products}
                selectedProduct={selectedProduct}
                onSelectProduct={onSelectProduct}
                itemColors={itemColors}
              />
              <ContactShadows
                position={[0, -1.89, 0]}
                opacity={0.8}
                scale={12}
                blur={2}
                far={5}
                color="#000000"
              />
            </group>
          )}

          {/* In boutique mode allow free gentle orbit exploration */}
          {mode === "boutique" && (
            <OrbitControls
              enablePan={false}
              minDistance={2.5}
              maxDistance={7}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2.05}
              maxAzimuthAngle={Math.PI / 3}
              minAzimuthAngle={-Math.PI / 3}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
