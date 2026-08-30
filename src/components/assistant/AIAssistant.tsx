"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Ear, Loader2, Mic, Sparkles as SparklesIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssistantState } from "@/lib/types";
import { useAssistantStore } from "@/store/assistant-store";
import { AnyaAvatar } from "./AnyaAvatar";
import { AssistantOrb } from "./AssistantOrb";

// ---------------------------------------------------------------------------
// <AIAssistant /> — the ONE component the rest of the app is allowed to know
// about for rendering NOVA. It owns layout, state badge, and caption; it
// delegates the actual character rendering to `visual`.
//
//   Assistant Logic (store) -> Assistant State (props) -> Assistant Visual (slot)
//
// Today's `visual` default is <AnyaAvatar />, a real FBX character. To swap
// in a future GLB/GLTF 3D avatar instead:
//   <AIAssistant visual={<AvatarModel url="/models/nova.glb" state={state} />} />
// Everything else (dashboard, panels, pages) stays untouched.
// ---------------------------------------------------------------------------

const STATE_META: Record<AssistantState, { label: string; icon: LucideIcon; tone: string }> = {
  idle: { label: "Idle", icon: SparklesIcon, tone: "text-[#a5a3ff]" },
  listening: { label: "Listening", icon: Mic, tone: "text-accent" },
  thinking: { label: "Thinking", icon: Brain, tone: "text-accent-2" },
  analyzing: { label: "Analyzing", icon: Loader2, tone: "text-warning" },
  speaking: { label: "Speaking", icon: Ear, tone: "text-primary-2" },
};

export interface AIAssistantProps {
  state: AssistantState;
  caption?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showStatusBadge?: boolean;
  showCaption?: boolean;
  /**
   * Swappable visual slot. Defaults to <AnyaAvatar />.
   * Replace with a future <AvatarModel /> (R3F + GLTF loader) without
   * touching any consumer of <AIAssistant />.
   */
  visual?: React.ReactNode;
  className?: string;
  /** Forwarded to the default <AnyaAvatar /> visual. Ignored when `visual` is set. */
  cameraMode?: "full" | "face";
  /** Forwarded to the default <AnyaAvatar /> visual. Ignored when `visual` is set. */
  rotatable?: boolean;
  /** Forwarded to the default <AnyaAvatar /> visual. Ignored when `visual` is set. */
  resultGesture?: "yes" | "no" | null;
  /** Forwarded to the default <AnyaAvatar /> visual. Ignored when `visual` is set. */
  onResultGestureDone?: () => void;
}

const SIZE_MAP: Record<NonNullable<AIAssistantProps["size"]>, string> = {
  sm: "h-20 w-20",
  md: "h-40 w-40",
  lg: "h-64 w-64",
  xl: "h-80 w-80 md:h-[26rem] md:w-[26rem]",
};

export function AIAssistant({
  state,
  caption,
  size = "lg",
  showStatusBadge = true,
  showCaption = true,
  visual,
  className,
  cameraMode,
  rotatable,
  resultGesture,
  onResultGestureDone,
}: AIAssistantProps) {
  const meta = STATE_META[state];
  const Icon = meta.icon;
  const avatar3DEnabled = useAssistantStore((s) => s.avatar3DEnabled);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* --- Isolated assistant visual container ------------------------ */}
      {/* data-nova-viewport marks the exact zone reserved for the future 3D avatar. */}
      <div
        data-nova-viewport
        className={cn(
          "relative flex items-center justify-center rounded-full",
          SIZE_MAP[size]
        )}
      >
        {/* Ambient state rings — chrome around the visual, not part of it */}
        <div
          className="absolute inset-0 rounded-full transition-colors duration-700"
          style={{
            boxShadow: `0 0 90px -20px currentColor`,
          }}
        />
        <AnimatePresence>
          {(state === "listening" || state === "speaking" || state === "analyzing") && (
            <>
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0.6, scale: 0.8 }}
                  animate={{ opacity: 0, scale: 1.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                  className={cn(
                    "absolute inset-0 rounded-full border",
                    state === "analyzing" ? "border-warning/50" : "border-accent/50"
                  )}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <div className="absolute inset-[6%] rounded-full overflow-hidden">
          {visual ??
            (avatar3DEnabled ? (
              <AnyaAvatar
                state={state}
                className="h-full w-full"
                cameraMode={cameraMode}
                rotatable={rotatable}
                resultGesture={resultGesture}
                onResultGestureDone={onResultGestureDone}
              />
            ) : (
              <AssistantOrb state={state} className="h-full w-full" />
            ))}
        </div>
      </div>

      {showStatusBadge && (
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs font-medium",
            meta.tone
          )}
        >
          <Icon className={cn("h-3.5 w-3.5", state === "analyzing" && "animate-spin")} />
          {meta.label}
        </motion.div>
      )}

      {showCaption && caption && (
        <AnimatePresence mode="wait">
          <motion.p
            key={caption}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="max-w-xs text-center text-sm text-foreground/70"
          >
            {caption}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  );
}
