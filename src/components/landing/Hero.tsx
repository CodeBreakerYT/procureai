"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIAssistant } from "@/components/assistant/AIAssistant";
import { useAssistantStore } from "@/store/assistant-store";

export function Hero() {
  const { state, caption } = useAssistantStore();

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-16 md:pt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-foreground/60"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Powered by NOVA — your AI procurement co-pilot
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl"
          >
            Make{" "}
            <span className="text-gradient">smarter procurement</span>{" "}
            decisions with AI.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-6 max-w-xl text-lg text-foreground/60"
          >
            Analyze vendor proposals, uncover hidden risks, compare requirements, and find
            the best option — in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button size="lg" asChild>
              <Link href="/projects/new">
                Start Procurement Analysis <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#how-it-works">
                <PlayCircle className="h-4 w-4" /> See How It Works
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border-subtle pt-6"
          >
            {[
              ["3.2x", "Faster vendor selection"],
              ["₹4.3Cr+", "Risk exposure surfaced"],
              ["94%", "Requirement match accuracy"],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="text-2xl font-semibold text-gradient">{stat}</p>
                <p className="mt-1 text-xs text-foreground/45">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          id="nova"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative flex flex-col items-center justify-center rounded-[2rem] glass-strong p-10"
        >
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <p className="relative mb-2 text-xs font-medium uppercase tracking-[0.2em] text-foreground/40">
            Meet NOVA
          </p>
          <AIAssistant state={state} caption={caption} size="xl" className="relative" />
          <p className="relative mt-2 text-center text-xs text-foreground/40">
            Negotiation &amp; Optimization Virtual Assistant
          </p>
        </motion.div>
      </div>
    </section>
  );
}
