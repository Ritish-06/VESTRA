"use client";

import React, { useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float } from "@react-three/drei";
import { Product, Colorway } from "@/types/product";
import GarmentMesh from "./GarmentMesh";

interface ProductInspectorCanvasProps {
  product: Product;
  activeColorway: Colorway;
  autoRotate?: boolean;
  wireframeMode?: boolean;
  macroZoom?: boolean;
}

function InspectorScene({
  product,
  activeColorway,
  autoRotate = false,
  wireframeMode = false,
  macroZoom = false,
}: ProductInspectorCanvasProps) {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <>
      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} color="#ffffff" castShadow />
      <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#c5a880" />
      <pointLight position={[0, -2, 2]} intensity={0.4} color="#dfd2be" />

      {/* Floating 3D Garment Model */}
      <group position={[0, macroZoom ? 0.3 : 0, 0]} scale={macroZoom ? 1.6 : 1.15}>
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.1}>
          <group ref={modelRef}>
            <GarmentMesh
              geometryType={product.geometryType}
              colorway={activeColorway}
              roughness={product.fabric.roughness}
              metalness={product.fabric.metalness}
              sheen={product.fabric.sheen}
              isSelected={true}
            />
          </group>
        </Float>
      </group>

      {/* Soft Contact Floor Shadow */}
      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.65}
        scale={6}
        blur={2}
        far={4}
        color="#050507"
      />

      {/* Interactive Orbit Camera Controls */}
      <OrbitControls
        enablePan={false}
        minDistance={1.2}
        maxDistance={4.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        makeDefault
      />
    </>
  );
}

export default function ProductInspectorCanvas(props: ProductInspectorCanvasProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0.2, 2.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <InspectorScene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
