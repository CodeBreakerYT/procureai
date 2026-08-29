import { FolderKanban, Users, PiggyBank, ClipboardCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { NovaPanel } from "@/components/assistant/NovaPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { dashboardStats, mockProjects, recentInsights } from "@/lib/mock-data";
import { formatCompactINR } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" subtitle="Welcome back — here's what NOVA has been working on.">
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<FolderKanban className="h-5 w-5" />} label="Active projects" value={String(dashboardStats.activeProjects)} tone="primary" />
          <StatCard icon={<Users className="h-5 w-5" />} label="Vendors analyzed" value={String(dashboardStats.vendorsAnalyzed)} tone="accent" />
          <StatCard
            icon={<PiggyBank className="h-5 w-5" />}
            label="Potential savings identified"
            value={formatCompactINR(dashboardStats.potentialSavings)}
            delta="+12% vs last quarter"
            tone="success"
          />
          <StatCard icon={<ClipboardCheck className="h-5 w-5" />} label="Pending reviews" value={String(dashboardStats.pendingReviews)} tone="warning" />
        </div>

        <NovaPanel />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active procurement projects</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/projects">View all</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {mockProjects.slice(0, 4).map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Recent AI insights</h2>
            <Card>
              <CardContent className="divide-y divide-border-subtle p-0">
                {recentInsights.map((insight) => (
                  <Link
                    key={insight.id}
                    href={`/projects/${insight.projectId}`}
                    className="block p-4 transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <Badge variant="accent">NOVA</Badge>
                      <span className="text-[11px] text-foreground/35">{insight.time}</span>
                    </div>
                    <p className="text-sm text-foreground/75">{insight.text}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
