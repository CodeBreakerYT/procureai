"use client";

import { motion } from "framer-motion";
import { Mic, Brain, Radar, MessagesSquare, LineChart, Lock } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI proposal analysis",
    desc: "NOVA reads full vendor proposals and extracts pricing, SLAs, and terms automatically.",
  },
  {
    icon: Radar,
    title: "Risk detection engine",
    desc: "Surfaces renewal traps, missing clauses, and compliance gaps before you sign.",
  },
  {
    icon: LineChart,
    title: "Live vendor scoring",
    desc: "Animated, explainable scores across price, technical fit, support, and risk.",
  },
  {
    icon: MessagesSquare,
    title: "Conversational assistant",
    desc: "Ask NOVA anything about your vendors — pricing, risks, comparisons, and more.",
  },
  {
    icon: Mic,
    title: "Voice-ready architecture",
    desc: "Built for speech-to-text and text-to-speech from day one, plus a future 3D avatar.",
  },
  {
    icon: Lock,
    title: "Enterprise-grade security",
    desc: "Structured for SOC 2-ready pipelines, encrypted storage, and auditable decisions.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Command center</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Built like an AI command center, not a form
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl glass p-6"
          >
            <f.icon className="mb-4 h-6 w-6 text-primary-2" />
            <h3 className="mb-1.5 font-semibold">{f.title}</h3>
            <p className="text-sm text-foreground/55">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
