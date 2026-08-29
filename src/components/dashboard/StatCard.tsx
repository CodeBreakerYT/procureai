"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon,
  label,
  value,
  delta,
  tone = "primary",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  delta?: string;
  tone?: "primary" | "accent" | "success" | "warning";
}) {
  const toneClass = {
    primary: "from-primary/25 to-primary/5 text-[#b3b1ff]",
    accent: "from-accent/25 to-accent/5 text-accent",
    success: "from-success/25 to-success/5 text-success",
    warning: "from-warning/25 to-warning/5 text-warning",
  }[tone];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="relative overflow-hidden">
        <CardContent className="p-5">
          <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br", toneClass)}>
            {icon}
          </div>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-sm text-foreground/50">{label}</p>
          {delta && <p className="mt-2 text-xs font-medium text-success">{delta}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
