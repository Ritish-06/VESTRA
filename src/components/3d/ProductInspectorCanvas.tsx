"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float } from "@react-three/drei";
import { Product, Colorway } from "@/types/product";
import GarmentMesh from "./GarmentMesh";
import { computeBoundingFrame } from "./cameraFraming";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export interface ProductInspectorCanvasProps {
  product: Product;
  activeColorway: Colorway;
  autoRotate?: boolean;
  wireframeMode?: boolean;
  macroZoom?: boolean;
  resetTrigger?: number;
}

function InspectorScene({
  product,
  activeColorway,
  autoRotate = false,
  wireframeMode = false,
  macroZoom = false,
  resetTrigger = 0,
}: ProductInspectorCanvasProps) {
  const { camera, size } = useThree();
  const modelRef = useRef<THREE.Group>(null);
  const measureGroupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const [shadowY, setShadowY] = useState(-1.05);
  const [minDist, setMinDist] = useState(1.1);
  const [maxDist, setMaxDist] = useState(5.5);

  const goalCamPos = useRef(new THREE.Vector3(0, -0.05, 2.8));
  const goalTarget = useRef(new THREE.Vector3(0, -0.05, 0));
  const isTransitioning = useRef(true);
  const shouldResetRotation = useRef(false);

  // Measure garment bounding box with THREE.Box3 and compute ideal camera distance & center
  useEffect(() => {
    if (!measureGroupRef.current) return;

    const perspCam = camera as THREE.PerspectiveCamera;
    const fov = perspCam.fov || 38;

    // Temporarily reset rotation when measuring axis-aligned garment bounds
    const currentRotY = modelRef.current ? modelRef.current.rotation.y : 0;
    if (modelRef.current) modelRef.current.rotation.y = 0;

    const frame = computeBoundingFrame(
      measureGroupRef.current,
      fov,
      size.width,
      size.height,
      {
        verticalPadding: size.width < 640 ? 1.48 : 1.34,
        horizontalPadding: size.width < 640 ? 1.54 : 1.38,
        minFitDistance: 1.95,
      }
    );

    if (modelRef.current) modelRef.current.rotation.y = currentRotY;

    const centerY = frame.center.y;
    const fitZ = frame.fitDistance;

    setShadowY(frame.box.min.y - 0.1);
    setMinDist(frame.minDistance);
    setMaxDist(frame.maxDistance);

    if (macroZoom) {
      // Controlled zoom-in focused on upper torso weave detail
      const macroY = centerY + frame.size.y * 0.12;
      goalTarget.current.set(0, macroY, 0);
      goalCamPos.current.set(0, macroY + 0.03, Math.max(frame.minDistance, fitZ * 0.56));
    } else {
      // Full top-to-bottom garment framing
      goalTarget.current.set(0, centerY, 0);
      goalCamPos.current.set(0, centerY + 0.04, fitZ);
    }

    isTransitioning.current = true;
  }, [product.id, product.geometryType, macroZoom, size.width, size.height, camera]);

  // Explicit camera & rotation reset when resetTrigger increments
  useEffect(() => {
    if (resetTrigger > 0) {
      isTransitioning.current = true;
      shouldResetRotation.current = true;
    }
  }, [resetTrigger]);

  useFrame((_, delta) => {
    if (modelRef.current) {
      if (shouldResetRotation.current) {
        modelRef.current.rotation.y = THREE.MathUtils.damp(
          modelRef.current.rotation.y,
          0,
          7,
          delta
        );
        if (Math.abs(modelRef.current.rotation.y) < 0.01) {
          modelRef.current.rotation.y = 0;
          shouldResetRotation.current = false;
        }
      } else if (autoRotate) {
        modelRef.current.rotation.y += delta * 0.45;
      }
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
      } else {
        camera.lookAt(goalTarget.current);
      }

      const distToGoal = camera.position.distanceTo(goalCamPos.current);
      if (distToGoal < 0.015) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <>
      {/* Bright Soft Natural Studio Lighting Setup */}
      <ambientLight intensity={0.86} color="#FFFDF9" />
      <hemisphereLight args={["#FFFDF8", "#E6DFD3", 0.65]} />
      <directionalLight position={[4, 6, 5]} intensity={1.15} color="#FFFBF4" castShadow />
      <directionalLight position={[-4, 3, 3]} intensity={0.6} color="#F2EAE0" />
      <directionalLight position={[0, 4, -4]} intensity={0.45} color="#DFD3C0" />
      <pointLight position={[0, -1.5, 2.5]} intensity={0.35} color="#FFFDF8" />

      {/* Centered 3D Garment Model Measured by THREE.Box3 */}
      <group position={[0, 0, 0]} scale={1.0}>
        <Float speed={1.0} rotationIntensity={0.04} floatIntensity={0.04}>
          <group ref={modelRef}>
            <group ref={measureGroupRef}>
              <GarmentMesh
                geometryType={product.geometryType}
                colorway={activeColorway}
                modelUrl={product.modelUrl}
                roughness={product.fabric.roughness}
                metalness={product.fabric.metalness}
                sheen={product.fabric.sheen}
                isSelected={true}
                wireframe={wireframeMode}
              />
            </group>
          </group>
        </Float>
      </group>

      {/* Soft Natural Floor Shadow Positioned Directly Below Garment Hem */}
      <ContactShadows
        position={[0, shadowY, 0]}
        opacity={0.26}
        scale={5.5}
        blur={2.8}
        far={3.5}
        color="#8C8273"
      />

      {/* Interactive Orbit Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        minDistance={minDist}
        maxDistance={maxDist}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 1.75}
        onStart={() => {
          // Yield immediately to user drag or scroll zoom
          isTransitioning.current = false;
          shouldResetRotation.current = false;
        }}
        makeDefault
      />
    </>
  );
}

export default function ProductInspectorCanvas(props: ProductInspectorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    try {
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl2") ||
        testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl");
      if (!gl) setWebglAvailable(false);
    } catch {
      setWebglAvailable(false);
    }

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    const handleVisibility = () => {
      setIsVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  if (!webglAvailable) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F8F6F1]">
        <img
          src={props.product.images?.hero || props.product.images?.modelFront}
          alt={props.product.name}
          className="max-h-[82%] w-auto object-contain rounded-2xl shadow-sm"
        />
        <span className="text-[10px] font-mono text-[#77736C] mt-2">
          Studio Preview • {props.activeColorway.name}
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        frameloop={isVisible ? "always" : "never"}
        camera={{ position: [0, -0.05, 2.8], fov: 38, near: 0.05, far: 100 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <InspectorScene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
