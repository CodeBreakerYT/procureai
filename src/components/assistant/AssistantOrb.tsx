"use client";

import * as React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshDistortMaterial, Sphere, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { AssistantState } from "@/lib/types";

// ---------------------------------------------------------------------------
// AssistantOrb — TEMPORARY placeholder visual for NOVA.
//
// This is intentionally the ONLY file that will be deleted/replaced when a
// real 3D GLB/GLTF avatar is ready. It has a single contract: given an
// `AssistantState`, render something. Nothing outside `assistant/` should
// import three.js directly — everyone else talks to <AIAssistant /> only.
// ---------------------------------------------------------------------------

const STATE_COLOR: Record<AssistantState, string> = {
  idle: "#6f6cff",
  listening: "#22d3ee",
  thinking: "#a855f7",
  analyzing: "#fbbf24",
  speaking: "#38bdf8",
};

const STATE_SPEED: Record<AssistantState, number> = {
  idle: 0.35,
  listening: 0.9,
  thinking: 0.6,
  analyzing: 1.2,
  speaking: 1.4,
};

function OrbMesh({ state }: { state: AssistantState }) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const groupRef = React.useRef<THREE.Group>(null);
  const color = STATE_COLOR[state];
  const speed = STATE_SPEED[state];
  const targetColor = React.useMemo(() => new THREE.Color(color), [color]);

  useFrame((frameState, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.05;
      const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
      if (mat.color) mat.color.lerp(targetColor, 0.05);
    }
    if (groupRef.current) {
      const t = frameState.clock.getElapsedTime();
      const pulse = state === "listening" || state === "speaking" ? Math.sin(t * 6) * 0.06 : Math.sin(t * 1.2) * 0.03;
      const scale = 1 + pulse;
      groupRef.current.scale.setScalar(scale);
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere ref={meshRef} args={[1.35, 128, 128]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={state === "analyzing" ? 0.55 : state === "thinking" ? 0.4 : 0.28}
          speed={speed}
          roughness={0.15}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={0.55}
        />
      </Sphere>
      <Sparkles count={40} scale={4} size={2.5} speed={0.4} color={color} opacity={0.6} />
    </group>
  );
}

export interface AssistantOrbProps {
  state: AssistantState;
  className?: string;
}

export function AssistantOrb({ state, className }: AssistantOrbProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 42 }} dpr={[1, 1.8]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={40} color={STATE_COLOR[state]} />
        <pointLight position={[-3, -2, -3]} intensity={15} color="#22d3ee" />
        <React.Suspense fallback={null}>
          <OrbMesh state={state} />
          <Environment preset="city" />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
