"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, CircleDashed, CircleAlert, XCircle, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Requirement, RequirementPriority, RequirementStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRIORITY_BADGE: Record<RequirementPriority, "danger" | "warning" | "primary" | "outline"> = {
  mandatory: "danger",
  high: "warning",
  medium: "primary",
  low: "outline",
};

const STATUS_META: Record<RequirementStatus, { icon: LucideIcon; variant: "success" | "warning" | "danger" | "outline"; label: string }> = {
  met: { icon: CheckCircle2, variant: "success", label: "Met" },
  partial: { icon: CircleAlert, variant: "warning", label: "Partial" },
  unmet: { icon: XCircle, variant: "danger", label: "Unmet" },
  pending: { icon: CircleDashed, variant: "outline", label: "Pending" },
};

export function RequirementBoard({ projectId, initial }: { projectId: string; initial: Requirement[] }) {
  const [requirements, setRequirements] = React.useState<Requirement[]>(initial);
  const [label, setLabel] = React.useState("");
  const [priority, setPriority] = React.useState<RequirementPriority>("high");

  const persist = (next: Requirement[]) => {
    fetch(`/api/projects/${projectId}/requirements`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requirements: next }),
    }).catch(() => {
      // Best-effort: the board still works locally if the backend is unreachable.
    });
  };

  const addRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    setRequirements((prev) => {
      const next = [...prev, { id: crypto.randomUUID(), label: label.trim(), priority, status: "pending" as const }];
      persist(next);
      return next;
    });
    setLabel("");
  };

  const removeRequirement = (id: string) => {
    setRequirements((prev) => {
      const next = prev.filter((r) => r.id !== id);
      persist(next);
      return next;
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent className="p-5">
          <form onSubmit={addRequirement} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. SSO support, SLA ≥ 99.9%, Data encryption..."
              className="flex-1"
            />
            <Select value={priority} onValueChange={(v) => setPriority(v as RequirementPriority)}>
              <SelectTrigger className="sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mandatory">Mandatory</SelectItem>
                <SelectItem value="high">High priority</SelectItem>
                <SelectItem value="medium">Medium priority</SelectItem>
                <SelectItem value="low">Low priority</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        <AnimatePresence initial={false}>
          {requirements.map((r) => {
            const statusMeta = STATUS_META[r.status];
            const StatusIcon = statusMeta.icon;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                layout
              >
                <Card>
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <StatusIcon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          statusMeta.variant === "success" && "text-success",
                          statusMeta.variant === "warning" && "text-warning",
                          statusMeta.variant === "danger" && "text-danger",
                          statusMeta.variant === "outline" && "text-foreground/30"
                        )}
                      />
                      <span className="text-sm font-medium">{r.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={PRIORITY_BADGE[r.priority]}>{r.priority}</Badge>
                      <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                      <button
                        onClick={() => removeRequirement(r.id)}
                        className="rounded-lg p-1.5 text-foreground/30 hover:bg-danger/10 hover:text-danger"
                        aria-label="Remove requirement"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {requirements.length === 0 && (
          <p className="py-8 text-center text-sm text-foreground/40">
            No requirements yet — add your first one above.
          </p>
        )}
      </div>
    </div>
  );
}
