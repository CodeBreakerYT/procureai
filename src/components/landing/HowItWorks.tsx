"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  UploadCloud,
  ScanSearch,
  BarChart3,
  ShieldAlert,
  Trophy,
} from "lucide-react";

const STEPS = [
  { icon: ClipboardList, title: "Define requirements", desc: "Set your procurement criteria — SLAs, budget, compliance, and must-haves." },
  { icon: UploadCloud, title: "Upload proposals", desc: "Drop in vendor PDFs and DOCX files. NOVA reads them in seconds." },
  { icon: ScanSearch, title: "AI extraction", desc: "Pricing, terms, and capabilities are extracted and structured automatically." },
  { icon: BarChart3, title: "Compare vendors", desc: "See every proposal side-by-side with animated scoring and match rates." },
  { icon: ShieldAlert, title: "Detect risks", desc: "Hidden clauses, renewal traps, and compliance gaps are flagged instantly." },
  { icon: Trophy, title: "Get a recommendation", desc: "NOVA recommends the strongest vendor with a transparent, explainable score." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-2">How it works</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          From requirements to recommendation
        </h2>
        <p className="mt-3 text-foreground/55">
          A guided, AI-assisted workflow that takes procurement teams from raw proposals to a
          confident decision.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-2xl glass p-6 transition-colors hover:border-primary/40"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary-2">
              <step.icon className="h-5 w-5" />
            </div>
            <p className="mb-1 text-xs font-medium text-foreground/35">Step {i + 1}</p>
            <h3 className="mb-1.5 font-semibold">{step.title}</h3>
            <p className="text-sm text-foreground/55">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
