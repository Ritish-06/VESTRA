"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { GarmentGeometryType, Colorway } from "@/types/product";

interface GarmentMeshProps {
  geometryType: GarmentGeometryType;
  colorway: Colorway;
  roughness?: number;
  metalness?: number;
  sheen?: number;
  isHovered?: boolean;
  isSelected?: boolean;
}

export default function GarmentMesh({
  geometryType,
  colorway,
  roughness = 0.5,
  metalness = 0.1,
  sheen = 0.3,
  isHovered = false,
  isSelected = false,
}: GarmentMeshProps) {
  const meshGroupRef = useRef<THREE.Group>(null);
  const color = new THREE.Color(colorway.threeColor || colorway.hex);

  // Gentle subtle fabric breathing movement
  useFrame((state) => {
    if (!meshGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (isHovered || isSelected) {
      meshGroupRef.current.rotation.y = Math.sin(t * 1.5) * 0.05;
    } else {
      meshGroupRef.current.rotation.y = 0;
    }
  });

  return (
    <group ref={meshGroupRef}>
      {/* Wooden & Brass Hanger */}
      <group position={[0, 0.45, 0]}>
        {/* Brass Hook */}
        <mesh position={[0, 0.08, 0]}>
          <torusGeometry args={[0.045, 0.005, 12, 32, Math.PI * 1.3]} />
          <meshStandardMaterial
            color="#c5a880"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        {/* Wooden Hanger Body */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.42, 0.022, 0.03]} />
          <meshStandardMaterial
            color="#2d1e15"
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
        {/* Hanger Crossbar */}
        <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.004, 0.004, 0.36, 12]} />
          <meshStandardMaterial color="#c5a880" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Garment Silhouette Geometry based on geometryType */}
      {geometryType === "trench_coat" && (
        <group position={[0, -0.25, 0]}>
          {/* Main Torso & Flared Coat Body */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.32, 1.15, 24]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>
          {/* Left Sleeve */}
          <mesh position={[-0.23, 0.15, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.065, 0.05, 0.72, 16]} />
            <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
          </mesh>
          {/* Right Sleeve */}
          <mesh position={[0.23, 0.15, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.065, 0.05, 0.72, 16]} />
            <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
          </mesh>
          {/* Lapel & Collar */}
          <mesh position={[0, 0.52, 0.05]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.22, 0.12, 0.06]} />
            <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
          </mesh>
          {/* Belt Sash */}
          <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.02, 12, 24]} />
            <meshStandardMaterial color="#c5a880" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      )}

      {geometryType === "tailored_blazer" && (
        <group position={[0, -0.05, 0]}>
          {/* Structured Chest */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.18, 0.8, 20]} />
            <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
          </mesh>
          {/* Structured Left Sleeve */}
          <mesh position={[-0.22, 0.05, 0]} rotation={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.06, 0.045, 0.65, 16]} />
            <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
          </mesh>
          {/* Structured Right Sleeve */}
          <mesh position={[0.22, 0.05, 0]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.06, 0.045, 0.65, 16]} />
            <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
          </mesh>
          {/* Peak Lapels */}
          <mesh position={[0, 0.32, 0.07]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.25, 0.18, 0.04]} />
            <meshStandardMaterial color={color} roughness={roughness * 0.9} metalness={metalness} />
          </mesh>
          {/* Gold Horn Buttons */}
          <mesh position={[0.03, 0.05, 0.12]}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0.03, -0.08, 0.12]}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      )}

      {geometryType === "silk_shirt" && (
        <group position={[0, 0, 0]}>
          {/* Fluid Torso */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.17, 0.19, 0.7, 24]} />
            <meshStandardMaterial
              color={color}
              roughness={0.25}
              metalness={0.1}
            />
          </mesh>
          {/* Flowing Sleeves */}
          <mesh position={[-0.2, 0.02, 0]} rotation={[0, 0, 0.18]}>
            <cylinderGeometry args={[0.055, 0.06, 0.62, 16]} />
            <meshStandardMaterial color={color} roughness={0.25} metalness={0.1} />
          </mesh>
          <mesh position={[0.2, 0.02, 0]} rotation={[0, 0, -0.18]}>
            <cylinderGeometry args={[0.055, 0.06, 0.62, 16]} />
            <meshStandardMaterial color={color} roughness={0.25} metalness={0.1} />
          </mesh>
          {/* Fluid Cowl Drape */}
          <mesh position={[0, 0.28, 0.05]} rotation={[0.4, 0, 0]}>
            <torusGeometry args={[0.09, 0.025, 12, 24]} />
            <meshStandardMaterial color={color} roughness={0.2} metalness={0.15} />
          </mesh>
        </group>
      )}

      {geometryType === "evening_gown" && (
        <group position={[0, -0.35, 0]}>
          {/* Fitted Bodice */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.14, 0.13, 0.45, 24]} />
            <meshStandardMaterial color={color} roughness={0.18} metalness={0.12} />
          </mesh>
          {/* Sweeping Liquid Train Skirt */}
          <mesh position={[0, -0.2, 0]}>
            <coneGeometry args={[0.38, 1.1, 32]} />
            <meshStandardMaterial color={color} roughness={0.18} metalness={0.12} />
          </mesh>
        </group>
      )}

      {geometryType === "pleated_trouser" && (
        <group position={[0, -0.25, 0]}>
          {/* Waistband */}
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.08, 20]} />
            <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
          </mesh>
          {/* Left Column Leg */}
          <mesh position={[-0.09, -0.18, 0]}>
            <cylinderGeometry args={[0.075, 0.09, 0.98, 16]} />
            <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
          </mesh>
          {/* Right Column Leg */}
          <mesh position={[0.09, -0.18, 0]}>
            <cylinderGeometry args={[0.075, 0.09, 0.98, 16]} />
            <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
          </mesh>
        </group>
      )}

      {geometryType === "knit_sweater" && (
        <group position={[0, 0, 0]}>
          {/* Textured Chunky Torso */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.19, 0.17, 0.65, 20]} />
            <meshStandardMaterial color={color} roughness={0.85} metalness={0.02} />
          </mesh>
          {/* Cozy Roll Neck */}
          <mesh position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.09, 0.085, 0.14, 20]} />
            <meshStandardMaterial color={color} roughness={0.9} metalness={0.02} />
          </mesh>
          {/* Voluminous Sleeves */}
          <mesh position={[-0.22, 0.02, 0]} rotation={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.07, 0.05, 0.62, 16]} />
            <meshStandardMaterial color={color} roughness={0.85} metalness={0.02} />
          </mesh>
          <mesh position={[0.22, 0.02, 0]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.07, 0.05, 0.62, 16]} />
            <meshStandardMaterial color={color} roughness={0.85} metalness={0.02} />
          </mesh>
        </group>
      )}

      {geometryType === "leather_jacket" && (
        <group position={[0, 0, 0]}>
          {/* Biker Torso */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.2, 0.17, 0.68, 20]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Asymmetric Zippers */}
          <mesh position={[0.05, -0.05, 0.11]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.015, 0.6, 0.01]} />
            <meshStandardMaterial color="#8a8a93" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Articulated Sleeves */}
          <mesh position={[-0.22, 0.02, 0]} rotation={[0, 0, 0.14]}>
            <cylinderGeometry args={[0.065, 0.045, 0.64, 16]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
          </mesh>
          <mesh position={[0.22, 0.02, 0]} rotation={[0, 0, -0.14]}>
            <cylinderGeometry args={[0.065, 0.045, 0.64, 16]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
      )}

      {geometryType === "minimalist_vest" && (
        <group position={[0, 0, 0]}>
          {/* Technical Body */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.18, 0.17, 0.62, 20]} />
            <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
          </mesh>
          {/* Magnetic Fidlock Straps */}
          <mesh position={[-0.06, 0.05, 0.11]}>
            <boxGeometry args={[0.035, 0.025, 0.015]} />
            <meshStandardMaterial color="#1a1a1e" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.06, 0.05, 0.11]}>
            <boxGeometry args={[0.035, 0.025, 0.015]} />
            <meshStandardMaterial color="#1a1a1e" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* Selected Brass Halo Indicator */}
      {isSelected && (
        <mesh position={[0, 0.45, 0]}>
          <ringGeometry args={[0.15, 0.165, 32]} />
          <meshBasicMaterial color="#c5a880" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
