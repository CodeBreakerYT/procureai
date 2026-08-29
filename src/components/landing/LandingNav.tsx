"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">ProcureAI</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-foreground/60 md:flex">
          <a href="#how-it-works" className="hover:text-foreground">How it works</a>
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#nova" className="hover:text-foreground">Meet NOVA</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/projects/new">Start Free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
