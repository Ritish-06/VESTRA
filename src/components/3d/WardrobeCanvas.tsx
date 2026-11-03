"use client";

import React, { useRef, useState, Suspense, useCallback, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Product, Colorway } from "@/types/product";
import ClothingRail from "./ClothingRail";
import WalkInBoutique from "./WalkInBoutique";
import { computeBoundingFrame } from "./cameraFraming";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface WardrobeCanvasProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  mode: "rail" | "boutique";
  railOffset: number;
  itemColors?: Record<string, Colorway>;
  zoomOffset?: number;
  resetTrigger?: number;
}

function CameraRig({
  mode,
  selectedProduct,
  selectedObject,
  zoomOffset = 0,
  resetTrigger = 0,
  controlsRef,
}: {
  mode: "rail" | "boutique";
  selectedProduct: Product | null;
  selectedObject: THREE.Object3D | null;
  zoomOffset?: number;
  resetTrigger?: number;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { size, camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, -0.15, 0));
  const goalPos = useRef(new THREE.Vector3(0, -0.1, 3.6));
  const goalLookAt = useRef(new THREE.Vector3(0, -0.15, 0));

  // Recalculate framing via THREE.Box3 whenever garment, mode, viewport size, or zoom changes
  useEffect(() => {
    const perspCam = camera as THREE.PerspectiveCamera;
    const fov = perspCam.fov || 38;
    const aspect = size.width / Math.max(1, size.height);
    const isMobile = aspect < 0.85 || size.width < 640;

    if (mode === "boutique") {
      const boutiqueZ = isMobile ? 5.2 : 4.5;
      goalPos.current.set(0, 0.15, Math.max(2.6, boutiqueZ + zoomOffset));
      goalLookAt.current.set(0, -0.15, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, -0.15, 0);
        controlsRef.current.update();
      }
      return;
    }

    // Rail Mode: Use THREE.Box3 on the selected 3D garment object to frame from hanger to bottom hem
    if (selectedObject) {
      const frame = computeBoundingFrame(
        selectedObject,
        fov,
        size.width,
        size.height,
        {
          // Extra vertical padding accounts for top category pills & bottom HUD card
          verticalPadding: isMobile ? 2.15 : 1.88,
          horizontalPadding: isMobile ? 1.85 : 1.55,
          minFitDistance: isMobile ? 3.7 : 3.3,
        }
      );

      // Include rail top (+0.60) and garment bottom hem in vertical centering
      const topY = Math.max(0.6, frame.box.max.y);
      const bottomY = Math.min(-0.82, frame.box.min.y);
      const fullSpanY = topY - bottomY;
      const midY = (topY + bottomY) / 2;

      const halfFovRad = THREE.MathUtils.degToRad(fov / 2);
      const vMultiplier = isMobile ? 2.12 : 1.86;
      const spanDistance = ((fullSpanY / 2) * vMultiplier) / Math.tan(halfFovRad);

      // Selected hanger steps forward by z = 0.22
      const finalZ = Math.max(frame.fitDistance, spanDistance) + 0.22 + zoomOffset;
      const clampedZ = THREE.MathUtils.clamp(finalZ, 2.2, 6.2);

      // Shift lookAt slightly downward so garment sits centered between top & bottom UI bars
      const uiSafeCenterY = midY - 0.04;

      goalPos.current.set(0, uiSafeCenterY + 0.04, clampedZ);
      goalLookAt.current.set(0, uiSafeCenterY, 0);
    } else {
      const fallbackHeight = selectedProduct?.threeDimensions?.height ?? 1.25;
      const halfFovRad = THREE.MathUtils.degToRad(fov / 2);
      const vMultiplier = isMobile ? 2.15 : 1.88;
      const baseZ = Math.max(
        isMobile ? 3.75 : 3.4,
        ((Math.max(1.45, fallbackHeight + 0.35) / 2) * vMultiplier) / Math.tan(halfFovRad) + 0.22
      );
      const clampedZ = THREE.MathUtils.clamp(baseZ + zoomOffset, 2.2, 6.2);
      goalPos.current.set(0, -0.12, clampedZ);
      goalLookAt.current.set(0, -0.16, 0);
    }
  }, [mode, selectedProduct, selectedObject, size.width, size.height, zoomOffset, resetTrigger, camera, controlsRef]);

  useFrame((state, delta) => {
    if (mode === "rail") {
      state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, goalPos.current.x, 5, delta);
      state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, goalPos.current.y, 5, delta);
      state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, goalPos.current.z, 5, delta);

      lookAtTarget.current.x = THREE.MathUtils.damp(lookAtTarget.current.x, goalLookAt.current.x, 6, delta);
      lookAtTarget.current.y = THREE.MathUtils.damp(lookAtTarget.current.y, goalLookAt.current.y, 6, delta);
      lookAtTarget.current.z = THREE.MathUtils.damp(lookAtTarget.current.z, goalLookAt.current.z, 6, delta);

      state.camera.lookAt(lookAtTarget.current);
    }
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
  zoomOffset = 0,
  resetTrigger = 0,
}: WardrobeCanvasProps) {
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const handleSelectedObjectChange = useCallback((obj: THREE.Object3D | null) => {
    setSelectedObject(obj);
  }, []);

  return (
    <div className="w-full h-full relative r3f-container select-none">
      <Canvas
        camera={{ position: [0, -0.12, 3.6], fov: 38, near: 0.05, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Ambient & Studio Lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.45}
            color="#fff8f0"
            castShadow
          />
          <directionalLight
            position={[-5, 4, -3]}
            intensity={0.75}
            color="#c5a880"
          />
          <pointLight position={[0, 2.5, 2.5]} intensity={0.5} color="#ffffff" />

          {/* Dynamic Bounding-Box Camera Rig */}
          <CameraRig
            mode={mode}
            selectedProduct={selectedProduct}
            selectedObject={selectedObject}
            zoomOffset={zoomOffset}
            resetTrigger={resetTrigger}
            controlsRef={controlsRef}
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
                onSelectedObjectChange={handleSelectedObjectChange}
              />
              <ContactShadows
                position={[0, -1.32, 0]}
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
              ref={controlsRef}
              enablePan={false}
              enableDamping
              dampingFactor={0.06}
              minDistance={2.6}
              maxDistance={7.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2.02}
              maxAzimuthAngle={Math.PI / 3}
              minAzimuthAngle={-Math.PI / 3}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
