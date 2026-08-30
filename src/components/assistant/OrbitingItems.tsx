"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// OrbitingItems — procurement-themed 3D props (box, laptop, briefcase, cloud,
// shield, coin, document, server rack) drifting in a slow ring around NOVA's
// avatar. Purely decorative — safe to delete without touching the avatar or
// assistant logic. See public/models/items/CREDITS.md for model sources and
// licenses (a few require attribution, credited there).
//
// Each source model comes at a wildly different native scale (some
// centimeters, some meters), so every item is auto-normalized to the same
// target size from its own bounding box rather than using guessed per-model
// scale constants — that's what was producing a giant mis-scaled briefcase
// blob earlier.
// ---------------------------------------------------------------------------

const TARGET_SIZE = 0.55;

const ITEMS = [
  { url: "/models/items/cardboard-box.glb", y: -0.1, tiltSpeed: 0.6 },
  { url: "/models/items/laptop.glb", y: 0.25, tiltSpeed: 0.4 },
  { url: "/models/items/briefcase.glb", y: -0.15, tiltSpeed: 0.5 },
  { url: "/models/items/cloud.glb", y: 0.55, tiltSpeed: 0.3 },
  { url: "/models/items/shield.glb", y: 0.05, tiltSpeed: 0.7 },
  { url: "/models/items/coin.glb", y: 0.35, tiltSpeed: 1.1 },
  { url: "/models/items/document.glb", y: -0.05, tiltSpeed: 0.55 },
  { url: "/models/items/server-rack.glb", y: 0.15, tiltSpeed: 0.35 },
] as const;

const ORBIT_RADIUS = 2.9;
const ORBIT_SPEED = 0.16;

function OrbitItem({
  url,
  y,
  tiltSpeed,
  angleOffset,
}: {
  url: string;
  y: number;
  tiltSpeed: number;
  angleOffset: number;
}) {
  const { scene } = useGLTF(url);
  const groupRef = React.useRef<THREE.Group>(null);
  const spinRef = React.useRef<THREE.Group>(null);

  const model = React.useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) mesh.frustumCulled = false;
    });

    // Normalize every model to the same on-screen size regardless of its
    // native export scale, and re-center its pivot to its own middle.
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = TARGET_SIZE / maxDim;

    const wrapper = new THREE.Group();
    cloned.position.set(-center.x, -center.y, -center.z);
    wrapper.add(cloned);
    wrapper.scale.setScalar(scale);
    return wrapper;
  }, [scene]);

  useFrame((frameState) => {
    const t = frameState.clock.getElapsedTime();
    const angle = angleOffset + t * ORBIT_SPEED;
    const group = groupRef.current;
    if (group) {
      group.position.set(Math.cos(angle) * ORBIT_RADIUS, y + Math.sin(t * 0.8 + angleOffset) * 0.12, Math.sin(angle) * ORBIT_RADIUS);
    }
    if (spinRef.current) {
      spinRef.current.rotation.y = t * tiltSpeed;
      spinRef.current.rotation.x = Math.sin(t * tiltSpeed * 0.6) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={spinRef}>
        <primitive object={model} />
      </group>
    </group>
  );
}

export function OrbitingItems() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <OrbitItem key={item.url} {...item} angleOffset={(i / ITEMS.length) * Math.PI * 2} />
      ))}
    </>
  );
}

for (const item of ITEMS) useGLTF.preload(item.url);
