"use client";

import { motion } from "framer-motion";
import { Check, Minus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCompactINR, cn } from "@/lib/utils";
import type { Vendor } from "@/lib/types";

export function ComparisonTable({ vendors }: { vendors: Vendor[] }) {
  const disclosedPrices = vendors.filter((v) => v.priceDisclosed).map((v) => v.price);
  const disclosedSlas = vendors.filter((v) => v.slaDisclosed).map((v) => v.sla);
  const best = {
    price: disclosedPrices.length ? Math.min(...disclosedPrices) : -Infinity,
    sla: disclosedSlas.length ? Math.max(...disclosedSlas) : Infinity,
    implementation: Math.min(...vendors.map((v) => v.implementationWeeks)),
    match: Math.max(...vendors.map((v) => v.requirementMatchPct)),
    score: Math.max(...vendors.map((v) => v.aiScore)),
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left text-xs uppercase tracking-wide text-foreground/40">
              <th className="px-5 py-4 font-medium">Vendor</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">SLA</th>
              <th className="px-5 py-4 font-medium">Implementation</th>
              <th className="px-5 py-4 font-medium">Support</th>
              <th className="px-5 py-4 font-medium">API</th>
              <th className="px-5 py-4 font-medium">Security</th>
              <th className="px-5 py-4 font-medium">Req. Match</th>
              <th className="px-5 py-4 font-medium">AI Score</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v, i) => (
              <motion.tr
                key={v.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="border-b border-border-subtle last:border-0 hover:bg-white/[0.02]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{v.name}</span>
                    {v.aiScore === best.score && <Badge variant="success">Top pick</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-foreground/40">{v.fileName}</p>
                </td>
                <td className={cn("px-5 py-4 font-medium", v.priceDisclosed && v.price === best.price && "text-success")}>
                  {v.priceDisclosed ? (
                    formatCompactINR(v.price)
                  ) : (
                    <span className="text-warning" title="Not stated in the proposal">Not disclosed</span>
                  )}
                </td>
                <td className={cn("px-5 py-4", v.slaDisclosed && v.sla === best.sla && "text-success font-medium")}>
                  {v.slaDisclosed ? (
                    `${v.sla}%`
                  ) : (
                    <span className="text-warning" title="No SLA commitment stated in the proposal">Not disclosed</span>
                  )}
                </td>
                <td className={cn("px-5 py-4", v.implementationWeeks === best.implementation && "text-success font-medium")}>
                  {v.implementationWeeks} weeks
                </td>
                <td className="px-5 py-4 text-foreground/70">{v.support}</td>
                <td className="px-5 py-4">
                  {v.apiSupport ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-danger" />}
                </td>
                <td className="px-5 py-4 text-foreground/70">{v.security}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${v.requirementMatchPct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                    <span className="text-xs text-foreground/60">{v.requirementMatchPct}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      "inline-flex h-8 w-12 items-center justify-center rounded-lg font-semibold",
                      v.aiScore >= 85 ? "bg-success/15 text-success" : v.aiScore >= 70 ? "bg-warning/15 text-warning" : "bg-danger/15 text-danger"
                    )}
                  >
                    {v.aiScore}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {vendors.length === 0 && (
        <CardContent className="flex items-center justify-center gap-2 p-10 text-sm text-foreground/40">
          <Minus className="h-4 w-4" /> No analyzed vendors yet.
        </CardContent>
      )}
    </Card>
  );
}
