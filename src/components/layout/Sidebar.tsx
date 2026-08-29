"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileBarChart,
  Settings,
  Sparkles,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border-subtle bg-surface/40 p-5 lg:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold tracking-tight">ProcureAI</span>
      </Link>

      <Link
        href="/projects/new"
        className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#8280ff] to-[#5b57f5] px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(111,108,255,0.6)] transition-transform hover:-translate-y-0.5"
      >
        <Plus className="h-4 w-4" /> New Project
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/[0.07] text-foreground"
                  : "text-foreground/55 hover:bg-white/[0.04] hover:text-foreground/85"
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-primary-2")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl glass p-4">
        <p className="text-xs font-medium text-foreground/70">Powered by NOVA</p>
        <p className="mt-1 text-[11px] leading-relaxed text-foreground/45">
          Your AI procurement co-pilot is active across every project.
        </p>
      </div>
    </aside>
  );
}
