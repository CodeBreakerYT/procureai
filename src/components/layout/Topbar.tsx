"use client";

import { Bell, Search } from "lucide-react";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex flex-col gap-4 border-b border-border-subtle px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-foreground/50">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-border-subtle bg-white/[0.03] px-3 py-2 text-sm text-foreground/40 sm:flex">
          <Search className="h-4 w-4" />
          <span>Search projects, vendors...</span>
        </div>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-white/[0.03] text-foreground/60 hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent-2" />
      </div>
    </header>
  );
}
