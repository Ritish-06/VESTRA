"use client";

import React, { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { Product } from "@/types/product";
import { AvatarModelType } from "@/types/wardrobe";
import GarmentMesh from "./GarmentMesh";
import { computeBoundingFrame } from "./cameraFraming";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface VirtualMannequinCanvasProps {
  avatarType: AvatarModelType;
  top?: Product;
  outerwear?: Product;
  trousers?: Product;
  autoRotate?: boolean;
  resetTrigger?: number;
}

function MannequinScene({
  avatarType,
  top,
  outerwear,
  trousers,
  autoRotate,
  resetTrigger = 0,
}: VirtualMannequinCanvasProps) {
  const { camera, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const goalCamPos = useRef(new THREE.Vector3(0, 0.05, 4.4));
  const goalTarget = useRef(new THREE.Vector3(0, 0.05, 0));
  const isTransitioning = useRef(true);

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

  // Fit entire mannequin from head to pedestal using THREE.Box3
  useEffect(() => {
    if (!groupRef.current) return;
    const perspCam = camera as THREE.PerspectiveCamera;
    const fov = perspCam.fov || 38;
    const frame = computeBoundingFrame(
      groupRef.current,
      fov,
      size.width,
      size.height,
      {
        verticalPadding: size.width < 640 ? 1.38 : 1.24,
        horizontalPadding: size.width < 640 ? 1.45 : 1.3,
        minFitDistance: 3.6,
      }
    );
    goalTarget.current.set(0, frame.center.y, 0);
    goalCamPos.current.set(0, frame.center.y + 0.05, frame.fitDistance);
    isTransitioning.current = true;
  }, [avatarType, top?.id, outerwear?.id, trousers?.id, size.width, size.height, resetTrigger, camera]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }

    if (isTransitioning.current) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, goalCamPos.current.x, 6, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, goalCamPos.current.y, 6, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, goalCamPos.current.z, 6, delta);

      if (controlsRef.current) {
        controlsRef.current.target.x = THREE.MathUtils.damp(
          controlsRef.current.target.x,
          goalTarget.current.x,
          6,
          delta
        );
        controlsRef.current.target.y = THREE.MathUtils.damp(
          controlsRef.current.target.y,
          goalTarget.current.y,
          6,
          delta
        );
        controlsRef.current.target.z = THREE.MathUtils.damp(
          controlsRef.current.target.z,
          goalTarget.current.z,
          6,
          delta
        );
        controlsRef.current.update();
      }

      if (camera.position.distanceTo(goalCamPos.current) < 0.02) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <>
      <group ref={groupRef} position={[0, -0.1, 0]}>
        {/* Head Form / Egg Silhouette */}
        <mesh position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial
            color={mannequinColor}
            roughness={mannequinRoughness}
            metalness={mannequinMetalness}
          />
        </mesh>

        {/* Slender Elongated Neck */}
        <mesh position={[0, 1.18, 0]}>
          <cylinderGeometry args={[0.042, 0.052, 0.18, 16]} />
          <meshStandardMaterial
            color={mannequinColor}
            roughness={mannequinRoughness}
            metalness={mannequinMetalness}
          />
        </mesh>

        {/* Torso Base Form */}
        {!top && !outerwear && (
          <mesh position={[0, 0.72, 0]}>
            <cylinderGeometry args={[0.18, 0.15, 0.75, 20]} />
            <meshStandardMaterial
              color={mannequinColor}
              roughness={mannequinRoughness}
              metalness={mannequinMetalness}
            />
          </mesh>
        )}

        {/* Legs Base */}
        {!trousers && (
          <group position={[0, 0.02, 0]}>
            <mesh position={[-0.085, -0.4, 0]}>
              <cylinderGeometry args={[0.062, 0.048, 0.88, 16]} />
              <meshStandardMaterial
                color={mannequinColor}
                roughness={mannequinRoughness}
                metalness={mannequinMetalness}
              />
            </mesh>
            <mesh position={[0.085, -0.4, 0]}>
              <cylinderGeometry args={[0.062, 0.048, 0.88, 16]} />
              <meshStandardMaterial
                color={mannequinColor}
                roughness={mannequinRoughness}
                metalness={mannequinMetalness}
              />
            </mesh>
          </group>
        )}

        {/* Pedestal Stand and Brass Rod */}
        <mesh position={[0, -0.62, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.35, 16]} />
          <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.3, 0]}>
          <cylinderGeometry args={[0.4, 0.43, 0.04, 32]} />
          <meshStandardMaterial color="#141418" roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, -1.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.01, 12, 32]} />
          <meshStandardMaterial color="#c5a880" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* --- Modular Clothing Layering --- */}
        {trousers && (
          <group position={[0, 0.35, 0]}>
            <GarmentMesh
              geometryType={trousers.geometryType}
              colorway={trousers.colorways[0]}
              roughness={trousers.fabric.roughness}
              metalness={trousers.fabric.metalness}
              sheen={trousers.fabric.sheen}
            />
          </group>
        )}

        {top && (
          <group position={[0, 0.72, 0]} scale={0.96}>
            <GarmentMesh
              geometryType={top.geometryType}
              colorway={top.colorways[0]}
              roughness={top.fabric.roughness}
              metalness={top.fabric.metalness}
              sheen={top.fabric.sheen}
            />
          </group>
        )}

        {outerwear && (
          <group position={[0, 0.72, 0]} scale={1.04}>
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

      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.7}
        scale={5}
        blur={2}
        far={3}
        color="#050507"
      />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={2.0}
        maxDistance={6.5}
        minPolarAngle={Math.PI / 4.5}
        maxPolarAngle={Math.PI / 1.8}
        onStart={() => {
          isTransitioning.current = false;
        }}
        makeDefault
      />
    </>
  );
}

export default function VirtualMannequinCanvas(props: VirtualMannequinCanvasProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0.05, 4.2], fov: 38, near: 0.05, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.68} />
          <directionalLight position={[4, 6, 4]} intensity={1.5} color="#fff8f0" />
          <directionalLight position={[-4, 3, -3]} intensity={0.7} color="#c5a880" />
          <pointLight position={[0, 1.5, 2]} intensity={0.4} color="#ffffff" />

          <MannequinScene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
