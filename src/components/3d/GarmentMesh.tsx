"use client";

import React, { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { GarmentGeometryType, Colorway } from "@/types/product";

interface GarmentMeshProps {
  geometryType: GarmentGeometryType;
  colorway: Colorway;
  modelUrl?: string | null;
  roughness?: number;
  metalness?: number;
  sheen?: number;
  isHovered?: boolean;
  isSelected?: boolean;
  wireframe?: boolean;
}

function GlbGarmentModel({ url, color }: { url: string; color: THREE.Color }) {
  const gltf = useGLTF(url);
  const normalizedScene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const targetScale = 1.15 / maxDim;
    cloned.scale.setScalar(targetScale);
    cloned.position.set(
      -center.x * targetScale,
      -center.y * targetScale - 0.18,
      -center.z * targetScale
    );

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material && "color" in mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.color.copy(color);
          mesh.material = mat;
        }
      }
    });

    return cloned;
  }, [gltf.scene, color]);

  return <primitive object={normalizedScene} />;
}

export default function GarmentMesh({
  geometryType,
  colorway,
  modelUrl,
  roughness = 0.5,
  metalness = 0.1,
  isHovered = false,
  isSelected = false,
  wireframe = false,
}: GarmentMeshProps) {
  const meshGroupRef = useRef<THREE.Group>(null);
  const color = new THREE.Color(colorway.threeColor || colorway.hex);

  // Subtle fabric breathing movement on hover/focus
  useFrame((state) => {
    if (!meshGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    if (isHovered || isSelected) {
      meshGroupRef.current.rotation.y = Math.sin(t * 1.4) * 0.045;
    } else {
      meshGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        meshGroupRef.current.rotation.y,
        0,
        0.1
      );
    }
  });

  return (
    <group ref={meshGroupRef} scale={1.0}>
      {/* --- Bespoke Walnut & Brushed Brass Hanger (Hook aligns with rail Y = 0.55) --- */}
      <group position={[0, 0.45, 0]}>
        {/* Brass Hook */}
        <mesh position={[0, 0.08, 0]}>
          <torusGeometry args={[0.042, 0.005, 12, 32, Math.PI * 1.35]} />
          <meshStandardMaterial
            color="#c5a880"
            metalness={0.9}
            roughness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Brass Neck Stem */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.04, 12]} />
          <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Sculpted Wooden Hanger Arms */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.4, 0.022, 0.028]} />
          <meshStandardMaterial
            color="#2d1e15"
            roughness={0.68}
            metalness={0.05}
            wireframe={wireframe}
          />
        </mesh>
        {/* Hanger Trouser Crossbar */}
        <mesh position={[0, -0.055, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.004, 0.004, 0.35, 12]} />
          <meshStandardMaterial color="#c5a880" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* --- Garment Silhouette Geometry (1:1 Proportionally Framed) --- */}
      {!modelUrl && geometryType === "trench_coat" && (
        <group position={[0, -0.18, 0]}>
          {/* Upper Shoulder Yoke */}
          <mesh position={[0, 0.52, 0]}>
            <cylinderGeometry args={[0.19, 0.2, 0.16, 24]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
          {/* Main Flared Trench Body (Shoulders to Full Hem) */}
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.18, 0.29, 0.98, 28]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
          {/* Left Sleeve */}
          <mesh position={[-0.22, 0.2, 0]} rotation={[0, 0, 0.16]}>
            <cylinderGeometry args={[0.06, 0.048, 0.64, 18]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
          {/* Right Sleeve */}
          <mesh position={[0.22, 0.2, 0]} rotation={[0, 0, -0.16]}>
            <cylinderGeometry args={[0.06, 0.048, 0.64, 18]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
          {/* Storm Lapels & Collar */}
          <mesh position={[0, 0.58, 0.045]} rotation={[0.18, 0, 0]}>
            <boxGeometry args={[0.22, 0.12, 0.055]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
          {/* Waist Belt Sash */}
          <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.21, 0.018, 12, 28]} />
            <meshStandardMaterial color="#c5a880" metalness={0.75} roughness={0.28} />
          </mesh>
        </group>
      )}

      {!modelUrl && geometryType === "tailored_blazer" && (
        <group position={[0, -0.02, 0]}>
          {/* Structured Chest & Tapered Waist */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.195, 0.175, 0.74, 24]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
          {/* Structured Left Sleeve */}
          <mesh position={[-0.215, 0.08, 0]} rotation={[0, 0, 0.14]}>
            <cylinderGeometry args={[0.058, 0.044, 0.62, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
          {/* Structured Right Sleeve */}
          <mesh position={[0.215, 0.08, 0]} rotation={[0, 0, -0.14]}>
            <cylinderGeometry args={[0.058, 0.044, 0.62, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
          {/* Peak Lapels */}
          <mesh position={[0, 0.34, 0.065]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.24, 0.17, 0.038]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness * 0.9}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
          {/* Double-Breasted Gold Horn Buttons */}
          <mesh position={[0.035, 0.08, 0.18]}>
            <sphereGeometry args={[0.011, 12, 12]} />
            <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[-0.035, 0.08, 0.18]}>
            <sphereGeometry args={[0.011, 12, 12]} />
            <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0.035, -0.04, 0.175]}>
            <sphereGeometry args={[0.011, 12, 12]} />
            <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[-0.035, -0.04, 0.175]}>
            <sphereGeometry args={[0.011, 12, 12]} />
            <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      )}

      {!modelUrl && geometryType === "silk_shirt" && (
        <group position={[0, 0, 0]}>
          {/* Fluid Silk Torso */}
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.17, 0.185, 0.68, 24]} />
            <meshStandardMaterial
              color={color}
              roughness={0.24}
              metalness={0.1}
              wireframe={wireframe}
            />
          </mesh>
          {/* Flowing Sleeves */}
          <mesh position={[-0.2, 0.04, 0]} rotation={[0, 0, 0.16]}>
            <cylinderGeometry args={[0.052, 0.058, 0.6, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={0.24}
              metalness={0.1}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0.2, 0.04, 0]} rotation={[0, 0, -0.16]}>
            <cylinderGeometry args={[0.052, 0.058, 0.6, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={0.24}
              metalness={0.1}
              wireframe={wireframe}
            />
          </mesh>
          {/* Draped Cowl Collar */}
          <mesh position={[0, 0.3, 0.04]} rotation={[0.38, 0, 0]}>
            <torusGeometry args={[0.088, 0.024, 12, 24]} />
            <meshStandardMaterial
              color={color}
              roughness={0.2}
              metalness={0.14}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      )}

      {!modelUrl && geometryType === "evening_gown" && (
        <group position={[0, -0.18, 0]}>
          {/* Couture Shoulder Straps Connecting Bodice to Hanger */}
          <mesh position={[-0.1, 0.53, 0]} rotation={[0, 0, -0.08]}>
            <boxGeometry args={[0.022, 0.18, 0.018]} />
            <meshStandardMaterial
              color={color}
              roughness={0.18}
              metalness={0.12}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0.1, 0.53, 0]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.022, 0.18, 0.018]} />
            <meshStandardMaterial
              color={color}
              roughness={0.18}
              metalness={0.12}
              wireframe={wireframe}
            />
          </mesh>
          {/* Sculpted Corset Bodice */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.155, 0.125, 0.34, 28]} />
            <meshStandardMaterial
              color={color}
              roughness={0.18}
              metalness={0.12}
              wireframe={wireframe}
            />
          </mesh>
          {/* Silk Waistband Seam */}
          <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.128, 0.012, 12, 28]} />
            <meshStandardMaterial color="#c5a880" metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Continuous A-Line Sweeping Skirt (Waist to Full Bottom Hem) */}
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.126, 0.34, 0.88, 36]} />
            <meshStandardMaterial
              color={color}
              roughness={0.18}
              metalness={0.12}
              wireframe={wireframe}
            />
          </mesh>
          {/* Subtle Fluted Pleat Accents at Hem */}
          <mesh position={[0, -0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.335, 0.008, 10, 36]} />
            <meshStandardMaterial
              color={color}
              roughness={0.15}
              metalness={0.18}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      )}

      {!modelUrl && geometryType === "pleated_trouser" && (
        <group position={[0, -0.15, 0]}>
          {/* Brass Hanger Clips */}
          <mesh position={[-0.11, 0.48, 0]}>
            <boxGeometry args={[0.018, 0.09, 0.024]} />
            <meshStandardMaterial color="#c5a880" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0.11, 0.48, 0]}>
            <boxGeometry args={[0.018, 0.09, 0.024]} />
            <meshStandardMaterial color="#c5a880" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Tailored High-Rise Waistband */}
          <mesh position={[0, 0.41, 0]}>
            <cylinderGeometry args={[0.16, 0.165, 0.08, 24]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
          {/* Left Wide-Leg Column */}
          <mesh position={[-0.085, -0.08, 0]}>
            <cylinderGeometry args={[0.078, 0.092, 0.92, 20]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
          {/* Right Wide-Leg Column */}
          <mesh position={[0.085, -0.08, 0]}>
            <cylinderGeometry args={[0.078, 0.092, 0.92, 20]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      )}

      {!modelUrl && geometryType === "knit_sweater" && (
        <group position={[0, 0, 0]}>
          {/* Chunky Cashmere Torso */}
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.185, 0.168, 0.64, 24]} />
            <meshStandardMaterial
              color={color}
              roughness={0.85}
              metalness={0.02}
              wireframe={wireframe}
            />
          </mesh>
          {/* Ribbed Roll Neck */}
          <mesh position={[0, 0.33, 0]}>
            <cylinderGeometry args={[0.088, 0.085, 0.13, 20]} />
            <meshStandardMaterial
              color={color}
              roughness={0.9}
              metalness={0.02}
              wireframe={wireframe}
            />
          </mesh>
          {/* Relaxed Sleeves */}
          <mesh position={[-0.215, 0.03, 0]} rotation={[0, 0, 0.15]}>
            <cylinderGeometry args={[0.068, 0.048, 0.6, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={0.85}
              metalness={0.02}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0.215, 0.03, 0]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.068, 0.048, 0.6, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={0.85}
              metalness={0.02}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      )}

      {!modelUrl && geometryType === "leather_jacket" && (
        <group position={[0, 0, 0]}>
          {/* Structured Calfskin Torso */}
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.195, 0.168, 0.66, 24]} />
            <meshStandardMaterial
              color={color}
              roughness={0.38}
              metalness={0.22}
              wireframe={wireframe}
            />
          </mesh>
          {/* Asymmetric Silver Zipper */}
          <mesh position={[0.045, -0.02, 0.18]} rotation={[0, 0, 0.09]}>
            <boxGeometry args={[0.014, 0.58, 0.012]} />
            <meshStandardMaterial color="#b4b4be" metalness={0.95} roughness={0.12} />
          </mesh>
          {/* Articulated Sleeves */}
          <mesh position={[-0.215, 0.03, 0]} rotation={[0, 0, 0.14]}>
            <cylinderGeometry args={[0.062, 0.045, 0.62, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={0.38}
              metalness={0.22}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0.215, 0.03, 0]} rotation={[0, 0, -0.14]}>
            <cylinderGeometry args={[0.062, 0.045, 0.62, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={0.38}
              metalness={0.22}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      )}

      {!modelUrl && geometryType === "minimalist_vest" && (
        <group position={[0, 0, 0]}>
          {/* Technical Quilted Gilet Body */}
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.18, 0.172, 0.62, 24]} />
            <meshStandardMaterial
              color={color}
              roughness={0.35}
              metalness={0.15}
              wireframe={wireframe}
            />
          </mesh>
          {/* Stand Collar */}
          <mesh position={[0, 0.31, 0]}>
            <cylinderGeometry args={[0.09, 0.095, 0.08, 20]} />
            <meshStandardMaterial
              color={color}
              roughness={0.35}
              metalness={0.15}
              wireframe={wireframe}
            />
          </mesh>
          {/* Fidlock Hardware Buckles */}
          <mesh position={[-0.055, 0.06, 0.175]}>
            <boxGeometry args={[0.034, 0.024, 0.016]} />
            <meshStandardMaterial color="#c5a880" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0.055, 0.06, 0.175]}>
            <boxGeometry args={[0.034, 0.024, 0.016]} />
            <meshStandardMaterial color="#c5a880" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      )}

      {!modelUrl && geometryType === "tote_bag" && (
        <group position={[0, -0.08, 0]}>
          {/* Twin Saddle-Stitched Leather Handles */}
          <mesh position={[0, 0.28, 0.035]}>
            <torusGeometry args={[0.11, 0.012, 12, 28, Math.PI]} />
            <meshStandardMaterial
              color={color}
              roughness={0.4}
              metalness={0.12}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0, 0.28, -0.035]}>
            <torusGeometry args={[0.11, 0.012, 12, 28, Math.PI]} />
            <meshStandardMaterial
              color={color}
              roughness={0.4}
              metalness={0.12}
              wireframe={wireframe}
            />
          </mesh>
          {/* Structured Architectural Leather Tote Body */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.44, 0.38, 0.16]} />
            <meshStandardMaterial
              color={color}
              roughness={roughness}
              metalness={metalness}
              wireframe={wireframe}
            />
          </mesh>
          {/* Brass Handle D-Rings */}
          <mesh position={[-0.11, 0.24, 0.082]}>
            <sphereGeometry args={[0.014, 12, 12]} />
            <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.11, 0.24, 0.082]}>
            <sphereGeometry args={[0.014, 12, 12]} />
            <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )}

      {modelUrl && (
        <Suspense fallback={null}>
          <GlbGarmentModel url={modelUrl} color={color} />
        </Suspense>
      )}

      {/* Subtle Selected Brass Halo Indicator at Hanger Hook */}
      {isSelected && (
        <mesh position={[0, 0.53, 0]}>
          <ringGeometry args={[0.08, 0.095, 32]} />
          <meshBasicMaterial
            color="#c5a880"
            side={THREE.DoubleSide}
            transparent
            opacity={0.55}
          />
        </mesh>
      )}
    </group>
  );
}
