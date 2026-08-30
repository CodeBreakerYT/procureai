"use client";

import * as React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useFBX, Environment, Sparkles, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { AssistantState } from "@/lib/types";
import { OrbitingItems } from "./OrbitingItems";

// ---------------------------------------------------------------------------
// AnyaAvatar — a real rigged 3D character standing in for NOVA, sourced from
// "Shinobu.fbx" (a VRoid-style export: skinned Body/Face/Hair meshes with
// their own embedded textures — no external texture overrides needed here).
// Same contract as any other assistant visual (state in, canvas out) so it
// drops straight into <AIAssistant visual={...} /> without touching anything
// else in the app.
//
// Gestures are driven by real Mixamo emotion clips (public/models/shinobu/emotions)
// played through a THREE.AnimationMixer bound to Shinobu's own skeleton — the clips
// share the standard "mixamorig*" bone names so they retarget onto her rig with no
// extra remapping. One clip per NOVA state (see STATE_CLIPS below).
//
// Cloning a rigged FBX needs SkeletonUtils' clone() rather than plain
// Object3D.clone() — the naive clone doesn't rebind a SkinnedMesh's skeleton
// to the newly cloned bones, which otherwise silently renders nothing.
// ---------------------------------------------------------------------------

const MODEL_URL = "/models/shinobu/shinobu.fbx";

// Mixamo emotion clips — retarget directly onto Shinobu's skeleton because
// both share Mixamo's standard "mixamorig*" bone names.
const ANIMATION_URLS = {
  idle: "/models/shinobu/emotions/idle.fbx",
  focus: "/models/shinobu/emotions/focus.fbx",
  angry: "/models/shinobu/emotions/angry.fbx",
  annoyedShake: "/models/shinobu/emotions/annoyed-shake.fbx",
} as const;

// Which clip plays for each NOVA state. The source pack only has four
// emotions (idle, focus, angry, annoyed head-shake) — no dedicated
// "thinking"/"analyzing"/"speaking" clip and no nod/wave — so those reuse
// the closest-fitting motion at a different speed. angry/annoyedShake are
// reserved for click reactions and the analysis *result* (see resultGesture
// below), not any continuous state, so they never fire while she's just
// neutrally idling or speaking.
const STATE_CLIPS: Record<AssistantState, { clip: keyof typeof ANIMATION_URLS; timeScale: number }> = {
  idle: { clip: "idle", timeScale: 1 },
  listening: { clip: "focus", timeScale: 1 },
  thinking: { clip: "idle", timeScale: 0.55 },
  analyzing: { clip: "focus", timeScale: 1.3 },
  speaking: { clip: "focus", timeScale: 0.9 },
};

function AnyaModel({
  state,
  cameraMode,
  resultGesture,
  onResultGestureDone,
  waveTriggerRef,
}: {
  state: AssistantState;
  cameraMode: "full" | "face";
  resultGesture?: "yes" | "no" | null;
  onResultGestureDone?: () => void;
  waveTriggerRef: React.MutableRefObject<(() => void) | null>;
}) {
  const fbx = useFBX(MODEL_URL);
  const animFbx = {
    idle: useFBX(ANIMATION_URLS.idle),
    focus: useFBX(ANIMATION_URLS.focus),
    angry: useFBX(ANIMATION_URLS.angry),
    annoyedShake: useFBX(ANIMATION_URLS.annoyedShake),
  };
  const groupRef = React.useRef<THREE.Group>(null);
  const { camera } = useThree();
  const activeActionRef = React.useRef<THREE.AnimationAction | null>(null);

  const model = React.useMemo(() => {
    const cloned = cloneSkinned(fbx) as THREE.Group;

    cloned.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.frustumCulled = false;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats as THREE.MeshStandardMaterial[]) {
          m.side = THREE.DoubleSide;
          m.roughness = 0.65;
          m.metalness = 0.03;
          m.envMapIntensity = 0.6;
          m.needsUpdate = true;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 3.1 / maxDim;
    cloned.scale.setScalar(scale);
    cloned.position.set(-center.x * scale, -box.min.y * scale - (size.y * scale) / 2 + 0.15, -center.z * scale);

    return cloned;
  }, [fbx]);

  // One AnimationMixer driving Shinobu's own skeleton, fed by clips lifted
  // from the four Mixamo FBX files above (each is skeleton-only — no mesh —
  // so we only ever read .animations[0] off it, never render it).
  const { mixer, actions } = React.useMemo(() => {
    const m = new THREE.AnimationMixer(model);
    const a: Partial<Record<keyof typeof ANIMATION_URLS, THREE.AnimationAction>> = {};
    for (const key of Object.keys(animFbx) as (keyof typeof ANIMATION_URLS)[]) {
      const sourceClip = animFbx[key].animations[0];
      if (!sourceClip) continue;
      // Drop any leg/foot/toe rotation tracks — on a short/stylized rig a
      // full-body mocap hip-sway reads as a twisted, floating stance rather
      // than a subtle idle sway. Keeps her standing normally while the
      // upper-body motion (spine, arms, head) still plays in full.
      const tracks = sourceClip.tracks.filter((track) => !/(UpLeg|Leg|Foot|Toe)/i.test(track.name));
      const clip = new THREE.AnimationClip(sourceClip.name, sourceClip.duration, tracks);
      const action = m.clipAction(clip);
      action.setLoop(THREE.LoopRepeat, Infinity);
      a[key] = action;
    }
    return { mixer: m, actions: a };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  const stateRef = React.useRef(state);
  stateRef.current = state;
  const isGesturingRef = React.useRef(false);

  /** Base (looping) clip for whatever NOVA state is currently active. */
  const playBaseClip = React.useCallback(
    (immediate: boolean) => {
      const { clip, timeScale } = STATE_CLIPS[stateRef.current];
      const next = actions[clip];
      if (!next) return;
      const prev = activeActionRef.current;
      next.setLoop(THREE.LoopRepeat, Infinity);
      next.timeScale = timeScale;
      next.reset().play();
      if (!immediate && prev && prev !== next) {
        next.crossFadeFrom(prev, 0.5, true);
      } else {
        next.fadeIn(immediate ? 0 : 0.4);
      }
      activeActionRef.current = next;
    },
    [actions]
  );

  /** Play one clip once, interrupting whatever's active, then hand back to the base clip. */
  const playOneShot = React.useCallback(
    (key: keyof typeof ANIMATION_URLS, fade = 0.4) => {
      const gesture = actions[key];
      const prev = activeActionRef.current;
      if (!gesture || gesture === prev) return;
      gesture.setLoop(THREE.LoopOnce, 1);
      gesture.clampWhenFinished = true;
      gesture.timeScale = 1;
      gesture.reset().fadeIn(fade).play();
      if (prev) gesture.crossFadeFrom(prev, fade, false);
      activeActionRef.current = gesture;
      isGesturingRef.current = true;
    },
    [actions]
  );

  // First clip ever assigned should be fully visible immediately — fading it
  // in from weight 0 with nothing underneath briefly shows the FBX's raw bind
  // pose (a T-pose), which read as "broken" for an instant on every load.
  const mountedRef = React.useRef(false);
  React.useEffect(() => {
    playBaseClip(!mountedRef.current);
    mountedRef.current = true;
  }, [state, playBaseClip]);

  // Analysis result: there's no dedicated nod/shake pair in this pack, so a
  // positive result plays an attentive "focus" beat and a negative result
  // plays the annoyed head-shake — then hands back to whatever state clip is
  // current (idle, speaking, ...). Cleared via the callback so the caller can
  // reset the prop without replaying it on the next render.
  React.useEffect(() => {
    if (!resultGesture) return;
    playOneShot(resultGesture === "yes" ? "focus" : "annoyedShake", 0.35);
    onResultGestureDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultGesture]);

  // Idle personality flourishes: every so often while just standing around,
  // play one of the other clips once as a one-shot gesture instead of only
  // ever breathing in place, then settle back into the idle loop. Only fires
  // in the idle state so it never fights with a real state-driven clip.
  const nextGestureAtRef = React.useRef(6 + Math.random() * 6);
  const elapsedRef = React.useRef(0);

  React.useEffect(() => {
    const onFinished = (event: { action: THREE.AnimationAction }) => {
      if (!isGesturingRef.current || event.action !== activeActionRef.current) return;
      isGesturingRef.current = false;
      playBaseClip(false);
      nextGestureAtRef.current = elapsedRef.current + 10 + Math.random() * 8;
    };
    mixer.addEventListener("finished", onFinished);
    return () => mixer.removeEventListener("finished", onFinished);
  }, [mixer, playBaseClip]);

  // Reaction on click — exposed imperatively rather than as an R3F onClick on
  // the mesh itself, because the orbiting decorative items sit in front of
  // Shinobu from the camera's point of view at various points in their loop
  // and would otherwise steal the raycast hit. The outer DOM container's
  // onClick (see <AnyaAvatar>) calls this for any click anywhere in the
  // avatar viewport. "Angry" doubles as a playful "don't poke me" reaction.
  React.useEffect(() => {
    waveTriggerRef.current = () => {
      if (isGesturingRef.current) return;
      playOneShot("angry", 0.25);
    };
    return () => {
      waveTriggerRef.current = null;
    };
  }, [playOneShot, waveTriggerRef]);

  useFrame((frameState, delta) => {
    mixer.update(delta);
    elapsedRef.current = frameState.clock.getElapsedTime();
    if (state !== "idle" || isGesturingRef.current) return;
    if (elapsedRef.current < nextGestureAtRef.current) return;
    const options = (["focus", "angry", "annoyedShake"] as const).filter((key) => actions[key]);
    if (options.length === 0) return;
    playOneShot(options[Math.floor(Math.random() * options.length)]);
  });

  React.useEffect(() => {
    if (cameraMode === "face") {
      camera.position.set(0, 1.55, 1.7);
      camera.lookAt(0, 1.55, 0);
    } else {
      camera.position.set(0, 0.15, 4.6);
      camera.lookAt(0, 0.1, 0);
    }
  }, [camera, cameraMode]);

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

export interface AnyaAvatarProps {
  state: AssistantState;
  className?: string;
  /** "face" frames a close-up on Shinobu's head; "full" (default) shows the whole body. */
  cameraMode?: "full" | "face";
  /** Lets the viewer drag to orbit the camera around Shinobu. Off by default. */
  rotatable?: boolean;
  /** Plays a one-shot "focus" (yes) or annoyed head-shake ("no") for an analysis result, then returns to the current state's clip. */
  resultGesture?: "yes" | "no" | null;
  /** Called right after the result gesture starts, so the caller can clear the prop and avoid replaying it. */
  onResultGestureDone?: () => void;
}

/** If the 3D model fails to load for any reason, fail silently rather than taking the whole app down. */
class AvatarErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error("AnyaAvatar failed to load", error);
  }
  render() {
    if (this.state.error) return null;
    return this.props.children;
  }
}

export function AnyaAvatar({
  state,
  className,
  cameraMode = "full",
  rotatable = false,
  resultGesture,
  onResultGestureDone,
}: AnyaAvatarProps) {
  const waveTriggerRef = React.useRef<(() => void) | null>(null);
  return (
    <div className={className} onClick={() => waveTriggerRef.current?.()} style={{ cursor: "pointer" }}>
      <Canvas
        camera={{ position: [0, 0.15, 4.6], fov: 38 }}
        dpr={[1, 1.8]}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }}
      >
        {/* Soft fill so shadow sides don't go pure black */}
        <ambientLight intensity={0.5} color="#e7ecff" />
        {/* Key light — warm, angled front-upper, does most of the modeling */}
        <directionalLight position={[2.2, 3.2, 3]} intensity={2} color="#fff2e0" />
        {/* Fill light — cool, opposite side, much dimmer than key */}
        <directionalLight position={[-2.5, 0.8, 1.5]} intensity={0.7} color="#bcdcff" />
        {/* Rim/back light — separates her silhouette from the backdrop */}
        <directionalLight position={[0, 1.5, -3]} intensity={0.75} color="#ffd9f0" />
        <AvatarErrorBoundary>
          <React.Suspense fallback={null}>
            <AnyaModel
              state={state}
              cameraMode={cameraMode}
              resultGesture={resultGesture}
              onResultGestureDone={onResultGestureDone}
              waveTriggerRef={waveTriggerRef}
            />
            {cameraMode === "full" && <OrbitingItems />}
            <Sparkles count={22} scale={3.2} size={2} speed={0.35} color="#ffd7ec" opacity={0.4} />
            <Environment preset="apartment" environmentIntensity={0.4} />
          </React.Suspense>
        </AvatarErrorBoundary>
        {rotatable && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            target={cameraMode === "face" ? [0, 1.55, 0] : [0, 0.1, 0]}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.8}
          />
        )}
      </Canvas>
    </div>
  );
}

useFBX.preload(MODEL_URL);
for (const url of Object.values(ANIMATION_URLS)) useFBX.preload(url);
