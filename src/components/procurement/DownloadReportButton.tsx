"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Vendor } from "@/lib/types";

function csvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function buildCsv(projectName: string, vendors: Vendor[]): string {
  const header = [
    "Vendor",
    "File",
    "Price (INR)",
    "SLA (%)",
    "Implementation (weeks)",
    "Support",
    "API Support",
    "Security",
    "Requirement Match (%)",
    "AI Score",
    "Strengths",
    "Risks",
  ];
  const rows = vendors.map((v) => [
    v.name,
    v.fileName,
    v.priceDisclosed ? v.price : "Not disclosed",
    v.slaDisclosed ? v.sla : "Not disclosed",
    v.implementationWeeks,
    v.support,
    v.apiSupport ? "Yes" : "No",
    v.security,
    v.requirementMatchPct,
    v.aiScore,
    v.strengths.join("; "),
    v.risks.map((r) => `${r.title} (${r.level})`).join("; "),
  ]);

  const lines = [
    `Vendor Comparison Report — ${projectName}`,
    `Generated ${new Date().toISOString().slice(0, 10)}`,
    "",
    header.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
  ];
  return lines.join("\n");
}

export function DownloadReportButton({ projectName, vendors }: { projectName: string; vendors: Vendor[] }) {
  const handleDownload = () => {
    const csv = buildCsv(projectName, vendors);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-comparison.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="secondary" onClick={handleDownload} disabled={vendors.length === 0}>
      <Download className="h-4 w-4" /> Download Report
    </Button>
  );
}
