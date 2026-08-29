"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCompactINR } from "@/lib/utils";
import type { ProcurementProject } from "@/lib/types";

const STATUS_BADGE: Record<ProcurementProject["status"], { label: string; variant: "outline" | "primary" | "warning" | "success" }> = {
  draft: { label: "Draft", variant: "outline" },
  collecting: { label: "Collecting Proposals", variant: "primary" },
  analyzing: { label: "Analyzing", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
};

export function ProjectCard({ project }: { project: ProcurementProject }) {
  const badge = STATUS_BADGE[project.status];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }}>
      <Link href={`/projects/${project.id}`}>
        <Card className="group h-full transition-colors hover:border-primary/40">
          <CardContent className="flex h-full flex-col p-5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <Badge variant={badge.variant}>{badge.label}</Badge>
              <ArrowUpRight className="h-4 w-4 text-foreground/30 transition-colors group-hover:text-primary-2" />
            </div>
            <h3 className="font-semibold leading-snug">{project.name}</h3>
            <p className="mt-1 text-xs text-foreground/45">{project.category}</p>
            <p className="mt-3 line-clamp-2 flex-1 text-sm text-foreground/55">{project.description}</p>

            <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-4 text-xs text-foreground/50">
              <span className="font-medium text-foreground/75">{formatCompactINR(project.budget)}</span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {project.vendorCount} vendors
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {project.durationMonths}mo
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
