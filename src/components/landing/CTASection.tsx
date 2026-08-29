"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2rem] glass-strong px-8 py-16 text-center"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <h2 className="relative text-3xl font-semibold tracking-tight md:text-4xl">
          Ready to let NOVA evaluate your next vendor?
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-foreground/55">
          Start a procurement analysis in minutes — no setup, no spreadsheets, no guesswork.
        </p>
        <div className="relative mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/projects/new">
              Start Procurement Analysis <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>

      <footer className="mt-16 flex flex-col items-center gap-4 border-t border-border-subtle pt-8 text-xs text-foreground/40 sm:flex-row sm:justify-between">
        <p>© 2026 ProcureAI. All rights reserved.</p>
        <p>Built for the AI Product Buildathon.</p>
      </footer>
    </section>
  );
}
