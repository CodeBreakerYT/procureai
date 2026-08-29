import { FileText, Download } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockProjects } from "@/lib/mock-data";

export default function ReportsPage() {
  const completed = mockProjects.filter((p) => p.status === "completed" || p.status === "analyzing");

  return (
    <AppShell title="Reports" subtitle="Export procurement analyses and recommendations.">
      <Card>
        <CardContent className="divide-y divide-border-subtle p-0">
          {completed.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
                  <FileText className="h-5 w-5 text-primary-2" />
                </div>
                <div>
                  <p className="font-medium">{p.name} — Procurement Report</p>
                  <p className="text-xs text-foreground/45">{p.category} · Generated {p.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={p.status === "completed" ? "success" : "warning"}>{p.status}</Badge>
                <Button variant="secondary" size="sm">
                  <Download className="h-4 w-4" /> Export PDF
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
