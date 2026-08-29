"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "", label: "Overview" },
  { key: "requirements", label: "Requirements" },
  { key: "upload", label: "Upload Proposals" },
  { key: "analysis", label: "AI Analysis" },
  { key: "comparison", label: "Comparison" },
  { key: "risks", label: "Risks" },
  { key: "recommendation", label: "Recommendation" },
];

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl glass p-1">
      {TABS.map((tab) => {
        const href = tab.key ? `/projects/${projectId}/${tab.key}` : `/projects/${projectId}`;
        const active = pathname === href;
        return (
          <Link
            key={tab.key}
            href={href}
            className={cn(
              "shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-gradient-to-b from-[#8280ff] to-[#5b57f5] text-white shadow-md"
                : "text-foreground/55 hover:bg-white/[0.05] hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
