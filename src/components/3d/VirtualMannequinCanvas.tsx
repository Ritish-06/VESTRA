"use client";

import React, { useRef, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float } from "@react-three/drei";
import { Product } from "@/types/product";
import { AvatarModelType } from "@/types/wardrobe";
import GarmentMesh from "./GarmentMesh";

interface VirtualMannequinCanvasProps {
  avatarType: AvatarModelType;
  top?: Product;
  outerwear?: Product;
  trousers?: Product;
  autoRotate?: boolean;
}

function StylizedMannequin({
  avatarType,
  top,
  outerwear,
  trousers,
  autoRotate,
}: VirtualMannequinCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Avatar material aesthetic
  let mannequinColor = "#1a1a1f";
  let mannequinRoughness = 0.35;
  let mannequinMetalness = 0.2;

  if (avatarType === "editorial_slate") {
    mannequinColor = "#4a4c54";
    mannequinRoughness = 0.5;
    mannequinMetalness = 0.1;
  } else if (avatarType === "minimalist_marble") {
    mannequinColor = "#e6e2da";
    mannequinRoughness = 0.25;
    mannequinMetalness = 0.05;
  } else if (avatarType === "haute_obsidian") {
    mannequinColor = "#0e0e11";
    mannequinRoughness = 0.2;
    mannequinMetalness = 0.4;
  }

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* --- Stylized Couture Mannequin Body Rig --- */}
      {/* Head Form / Egg Silhouette */}
      <mesh position={[0, 1.48, 0]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial
          color={mannequinColor}
          roughness={mannequinRoughness}
          metalness={mannequinMetalness}
        />
      </mesh>

      {/* Slender Elongated Neck */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.045, 0.055, 0.2, 16]} />
        <meshStandardMaterial
          color={mannequinColor}
          roughness={mannequinRoughness}
          metalness={mannequinMetalness}
        />
      </mesh>

      {/* Torso Base Form (visible if no top is worn) */}
      {!top && !outerwear && (
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.19, 0.16, 0.8, 20]} />
          <meshStandardMaterial
            color={mannequinColor}
            roughness={mannequinRoughness}
            metalness={mannequinMetalness}
          />
        </mesh>
      )}

      {/* Legs Base (visible if no trousers worn) */}
      {!trousers && (
        <group position={[0, 0.05, 0]}>
          <mesh position={[-0.09, -0.45, 0]}>
            <cylinderGeometry args={[0.065, 0.05, 0.95, 16]} />
            <meshStandardMaterial
              color={mannequinColor}
              roughness={mannequinRoughness}
              metalness={mannequinMetalness}
            />
          </mesh>
          <mesh position={[0.09, -0.45, 0]}>
            <cylinderGeometry args={[0.065, 0.05, 0.95, 16]} />
            <meshStandardMaterial
              color={mannequinColor}
              roughness={mannequinRoughness}
              metalness={mannequinMetalness}
            />
          </mesh>
        </group>
      )}

      {/* Pedestal Stand and Brass Rod */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.5, 16]} />
        <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.45, 0]}>
        <cylinderGeometry args={[0.42, 0.45, 0.04, 32]} />
        <meshStandardMaterial color="#141418" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, -1.43, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.01, 12, 32]} />
        <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* --- Modular Clothing Layering --- */}
      {/* 1. Trousers Layer */}
      {trousers && (
        <group position={[0, 0.45, 0]}>
          <GarmentMesh
            geometryType={trousers.geometryType}
            colorway={trousers.colorways[0]}
            roughness={trousers.fabric.roughness}
            metalness={trousers.fabric.metalness}
            sheen={trousers.fabric.sheen}
          />
        </group>
      )}

      {/* 2. Top Layer */}
      {top && (
        <group position={[0, 0.85, 0]} scale={0.96}>
          <GarmentMesh
            geometryType={top.geometryType}
            colorway={top.colorways[0]}
            roughness={top.fabric.roughness}
            metalness={top.fabric.metalness}
            sheen={top.fabric.sheen}
          />
        </group>
      )}

      {/* 3. Outerwear Layer (Slightly larger scale to fit over top) */}
      {outerwear && (
        <group position={[0, 0.85, 0]} scale={1.05}>
          <GarmentMesh
            geometryType={outerwear.geometryType}
            colorway={outerwear.colorways[0]}
            roughness={outerwear.fabric.roughness}
            metalness={outerwear.fabric.metalness}
            sheen={outerwear.fabric.sheen}
          />
        </group>
      )}
    </group>
  );
}

export default function VirtualMannequinCanvas(props: VirtualMannequinCanvasProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0.2, 3.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.65} />
          <directionalLight position={[4, 6, 4]} intensity={1.5} color="#fff8f0" />
          <directionalLight position={[-4, 3, -3]} intensity={0.7} color="#c5a880" />
          <pointLight position={[0, 1.5, 2]} intensity={0.4} color="#ffffff" />

          <StylizedMannequin {...props} />

          <ContactShadows
            position={[0, -1.45, 0]}
            opacity={0.7}
            scale={5}
            blur={2}
            far={3}
            color="#050507"
          />

          <OrbitControls
            enablePan={false}
            minDistance={1.8}
            maxDistance={5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
