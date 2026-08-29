"use client";

import { motion } from "framer-motion";
import { Trophy, Sparkles, TrendingUp, ShieldAlert, Handshake, type LucideIcon } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { scoreRadarData } from "@/lib/mock-data";
import type { Vendor } from "@/lib/types";

export function RecommendationHero({ vendor }: { vendor: Vendor }) {
  const radarData = scoreRadarData(vendor);

  return (
    <div className="grid gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl glass-strong p-8 text-center md:p-12"
      >
        <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-warning/20 blur-3xl" />
        <motion.div
          initial={{ scale: 0.6, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}
          className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-warning to-danger/70"
        >
          <Trophy className="h-8 w-8 text-white" />
        </motion.div>
        <p className="relative text-xs font-medium uppercase tracking-[0.2em] text-warning">Recommended Vendor</p>
        <h2 className="relative mt-2 text-3xl font-semibold tracking-tight md:text-5xl">{vendor.name}</h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mt-2 text-5xl font-bold text-gradient md:text-6xl"
        >
          {vendor.aiScore}
          <span className="text-2xl text-foreground/40"> / 100</span>
        </motion.p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-primary-2" /> Score breakdown
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="rgba(148,163,219,0.15)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(232,236,247,0.6)", fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    dataKey="value"
                    stroke="#6f6cff"
                    fill="url(#recGradient)"
                    fillOpacity={0.6}
                    strokeWidth={2}
                    animationDuration={900}
                  />
                  <defs>
                    <linearGradient id="recGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6f6cff" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <TrendingUp className="h-4 w-4 text-primary-2" /> Why NOVA recommends {vendor.name}
            </h3>
            <p className="text-sm leading-relaxed text-foreground/70">{vendor.summary}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["Requirement match", `${vendor.requirementMatchPct}%`],
                ["Price score", vendor.priceScore],
                ["Technical score", vendor.technicalScore],
                ["Support score", vendor.supportScore],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-lg font-semibold">{value}</p>
                  <p className="text-xs text-foreground/45">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <ListCard title="Strengths" tone="success" items={vendor.strengths} />
        <ListCard title="Risks" tone="danger" items={vendor.risks.map((r) => r.title)} />
        <ListCard title="Negotiation Points" tone="primary" icon={Handshake} items={vendor.negotiationPoints} />
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
  tone,
  icon: Icon = ShieldAlert,
}: {
  title: string;
  items: string[];
  tone: "success" | "danger" | "primary";
  icon?: LucideIcon;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <h4 className="font-semibold">{title}</h4>
          <Badge variant={tone} className="ml-auto">
            {items.length}
          </Badge>
        </div>
        <ul className="grid gap-2 text-sm text-foreground/70">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
