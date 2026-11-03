import * as THREE from "three";

export interface BoundingFrameResult {
  box: THREE.Box3;
  size: THREE.Vector3;
  center: THREE.Vector3;
  maxDimension: number;
  fitDistance: number;
  minDistance: number;
  maxDistance: number;
}

export interface FramingOptions {
  /** Multiplier for vertical breathing room (default: 1.34 desktop, 1.48 mobile) */
  verticalPadding?: number;
  /** Multiplier for horizontal breathing room (default: 1.38 desktop, 1.54 mobile) */
  horizontalPadding?: number;
  /** Minimum allowed camera fit distance */
  minFitDistance?: number;
  /** Extra vertical offset applied to camera target (e.g. to compensate for UI bars) */
  targetYOffset?: number;
}

/**
 * Computes the exact THREE.Box3 bounding box of any 3D garment or scene group
 * and calculates the responsive camera distance required to display the complete
 * model from top to bottom hem without clipping on any viewport aspect ratio.
 */
export function computeBoundingFrame(
  object: THREE.Object3D,
  cameraFovDeg: number,
  viewportWidth: number,
  viewportHeight: number,
  options: FramingOptions = {}
): BoundingFrameResult {
  object.updateWorldMatrix(true, true);

  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();

  if (box.isEmpty() || !Number.isFinite(box.min.x)) {
    size.set(0.65, 1.35, 0.35);
    center.set(0, -0.05, 0);
  } else {
    box.getSize(size);
    box.getCenter(center);
  }

  const safeWidth = Math.max(1, viewportWidth);
  const safeHeight = Math.max(1, viewportHeight);
  const aspect = safeWidth / safeHeight;
  const isMobile = aspect < 0.85 || safeWidth < 640;

  const vPad = options.verticalPadding ?? (isMobile ? 1.48 : 1.34);
  const hPad = options.horizontalPadding ?? (isMobile ? 1.54 : 1.38);

  const fovRad = THREE.MathUtils.degToRad(cameraFovDeg);
  const halfFovV = fovRad / 2;
  const halfFovH = Math.atan(Math.tan(halfFovV) * Math.max(0.42, aspect));

  // Ensure full visibility even while the user rotates the garment 360 degrees
  const rotationalHorizontalSpan = Math.max(
    size.x,
    size.z,
    Math.hypot(size.x, size.z) * 0.85,
    0.5
  );
  const verticalSpan = Math.max(size.y, 0.65);

  const distanceForHeight = ((verticalSpan / 2) * vPad) / Math.tan(halfFovV);
  const distanceForWidth = ((rotationalHorizontalSpan / 2) * hPad) / Math.tan(halfFovH);

  // Offset by half of the garment's depth so the closest surface never clips or distorts
  const depthOffset = Math.max(size.z, size.x) * 0.38;

  const minFit = options.minFitDistance ?? 1.85;
  const fitDistance = Math.max(minFit, Math.max(distanceForHeight, distanceForWidth) + depthOffset);
  const maxDimension = Math.max(size.x, size.y, size.z);

  if (options.targetYOffset) {
    center.y += options.targetYOffset;
  }

  return {
    box,
    size,
    center,
    maxDimension,
    fitDistance,
    minDistance: Math.max(0.95, fitDistance * 0.45),
    maxDistance: Math.max(4.8, fitDistance * 2.25),
  };
}

