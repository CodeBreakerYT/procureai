"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAssistantStore } from "@/store/assistant-store";
import { AIAssistant } from "./AIAssistant";
import { AssistantChat } from "./AssistantChat";
import { cn } from "@/lib/utils";

/**
 * Persistent, page-agnostic NOVA presence. Mounted once in the root layout
 * so the assistant's identity and conversation continue across every route.
 */
export function AssistantDock() {
  const { state, caption, isExpanded, setExpanded, activeProjectName } = useAssistantStore();

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="fixed bottom-6 right-6 z-50 w-[23rem] max-w-[calc(100vw-2rem)] rounded-3xl glass-strong p-5 shadow-2xl"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0">
                  <AIAssistant state={state} size="sm" showCaption={false} showStatusBadge={false} />
                </div>
                <div>
                  <p className="text-sm font-semibold">NOVA</p>
                  <p className="text-[11px] text-foreground/50">
                    {activeProjectName ? `Assisting · ${activeProjectName}` : "Negotiation & Optimization Virtual Assistant"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="rounded-lg p-1.5 text-foreground/50 hover:bg-white/10 hover:text-foreground"
                aria-label="Collapse NOVA"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {caption && (
              <p className="mb-3 rounded-xl bg-white/[0.04] px-3 py-2 text-xs text-foreground/60">{caption}</p>
            )}
            <AssistantChat />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(true)}
            className={cn(
              "fixed bottom-6 right-6 z-50 flex h-20 w-20 items-center justify-center rounded-full glass-strong glow-primary"
            )}
            aria-label="Open NOVA assistant"
          >
            <AIAssistant state={state} size="sm" showCaption={false} showStatusBadge={false} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
