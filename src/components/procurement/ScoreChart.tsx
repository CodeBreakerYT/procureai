"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Vendor } from "@/lib/types";

const COLORS = ["#6f6cff", "#22d3ee", "#a855f7", "#fbbf24"];

export function ScoreChart({ vendors }: { vendors: Vendor[] }) {
  const data = vendors.map((v) => ({ name: v.name, score: v.aiScore }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Score comparison</CardTitle>
      </CardHeader>
      <CardContent className="h-72 p-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="rgba(148,163,219,0.1)" />
            <XAxis dataKey="name" stroke="rgba(232,236,247,0.4)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(232,236,247,0.4)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "#10141f",
                border: "1px solid rgba(148,163,219,0.2)",
                borderRadius: 12,
                fontSize: 13,
              }}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={64} animationDuration={900}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
