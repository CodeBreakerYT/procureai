"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useAssistantStore } from "@/store/assistant-store";
import { AIAssistant } from "./AIAssistant";
import { AssistantChat } from "./AssistantChat";
import { cn } from "@/lib/utils";

/**
 * Large, embeddable NOVA section for dashboard/landing use. Still only
 * talks to the assistant store + <AIAssistant /> — no visual coupling.
 */
export function NovaPanel({
  className,
  greeting = "Hi, I'm NOVA. Ready to evaluate your next vendor?",
  withChat = true,
}: {
  className?: string;
  greeting?: string;
  withChat?: boolean;
}) {
  const { state, caption } = useAssistantStore();

  return (
    <div className={cn("relative overflow-hidden rounded-3xl glass-strong p-6 md:p-8", className)}>
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
        <AIAssistant state={state} size="md" caption={undefined} showCaption={false} />

        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-semibold text-gradient md:text-2xl"
          >
            {greeting}
          </motion.p>
          <p className="mt-1 text-sm text-foreground/55">{caption}</p>

          {withChat && <AssistantChat className="mt-5" />}
        </div>
      </div>
    </div>
  );
}
