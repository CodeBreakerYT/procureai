"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIAssistant } from "@/components/assistant/AIAssistant";
import { useAssistantStore } from "@/store/assistant-store";
import { cn } from "@/lib/utils";

const STEPS = [
  "Reading documents",
  "Extracting pricing",
  "Matching requirements",
  "Checking contract terms",
  "Detecting risks",
  "Generating recommendation",
];

export function AnalysisSequence({ projectId }: { projectId: string }) {
  const { state, caption, setState, say } = useAssistantStore();
  const [activeStep, setActiveStep] = React.useState(-1);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    setState("analyzing", "I'm analyzing the proposals.");
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setActiveStep(i), 700 + i * 1000));
    });
    timers.push(
      setTimeout(() => {
        setDone(true);
        say("Analysis complete. Vendor A comes out on top — take a look at the comparison.");
      }, 700 + STEPS.length * 1000 + 400)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
      <Card className="flex flex-col items-center p-8 text-center lg:sticky lg:top-8">
        <AIAssistant state={state} caption={caption} size="lg" />
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-6 font-semibold">Analysis progress</h3>
          <div className="grid gap-3">
            {STEPS.map((step, i) => {
              const isDone = i < activeStep || done;
              const isActive = i === activeStep && !done;
              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: i <= activeStep || done ? 1 : 0.35, x: 0 }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors",
                    isActive
                      ? "border-primary/50 bg-primary/5"
                      : isDone
                        ? "border-success/30 bg-success/5"
                        : "border-border-subtle bg-white/[0.02]"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      isDone ? "bg-success/20 text-success" : isActive ? "bg-primary/20 text-primary-2" : "bg-white/[0.06] text-foreground/40"
                    )}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className={cn("text-sm", isDone ? "text-foreground/70" : isActive ? "font-medium" : "text-foreground/40")}>
                    {step}
                  </span>
                  {isActive && (
                    <span className="ml-auto flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="h-1.5 w-1.5 rounded-full bg-primary-2"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                        />
                      ))}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex flex-col items-start gap-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">Analysis complete</p>
                  <p className="mt-0.5 text-sm text-foreground/55">
                    3 vendors analyzed against 6 requirements. Recommendation ready.
                  </p>
                </div>
                <Button asChild>
                  <Link href={`/projects/${projectId}/comparison`}>
                    View Comparison <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
