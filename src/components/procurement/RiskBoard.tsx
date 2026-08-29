"use client";

import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, ShieldCheck, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RiskItem, RiskLevel } from "@/lib/types";

const LEVEL_META: Record<RiskLevel, { icon: LucideIcon; label: string; color: string; badge: "danger" | "warning" | "success" }> = {
  high: { icon: AlertTriangle, label: "High Risk", color: "text-danger", badge: "danger" },
  medium: { icon: AlertCircle, label: "Medium Risk", color: "text-warning", badge: "warning" },
  low: { icon: ShieldCheck, label: "Low Risk", color: "text-success", badge: "success" },
};

export function RiskBoard({ risks }: { risks: RiskItem[] }) {
  const levels: RiskLevel[] = ["high", "medium", "low"];

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {levels.map((level, colIdx) => {
        const meta = LEVEL_META[level];
        const Icon = meta.icon;
        const items = risks.filter((r) => r.level === level);

        return (
          <motion.div key={level} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: colIdx * 0.08 }}>
            <Card className={cn("h-full border-t-2", level === "high" && "border-t-danger", level === "medium" && "border-t-warning", level === "low" && "border-t-success")}>
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-5 w-5", meta.color)} />
                    <h3 className="font-semibold">{meta.label}</h3>
                  </div>
                  <Badge variant={meta.badge}>{items.length}</Badge>
                </div>

                <div className="grid gap-2.5">
                  {items.map((r) => (
                    <div key={r.id} className="rounded-xl bg-white/[0.03] p-3.5">
                      <p className="text-sm text-foreground/85">{r.title}</p>
                      {r.vendorName && (
                        <Badge variant="outline" className="mt-2">
                          {r.vendorName}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {items.length === 0 && <p className="text-sm text-foreground/35">No {level} risks detected.</p>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
