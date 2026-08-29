import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Calendar, IndianRupee, Layers, Users } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectTabs } from "@/components/procurement/ProjectTabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProject, getRequirements, getVendors } from "@/lib/server-store";
import { formatCompactINR } from "@/lib/utils";
import { ProjectAssistantSync } from "@/components/procurement/ProjectAssistantSync";

export default async function ProjectOverviewPage({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const requirements = getRequirements(id);
  const vendors = getVendors(id);

  return (
    <AppShell title={project.name} subtitle={project.category}>
      <ProjectAssistantSync name={project.name} id={id} />
      <ProjectTabs projectId={id} />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <Badge variant="primary">{project.status}</Badge>
              <span className="text-xs text-foreground/40">Created {project.createdAt}</span>
            </div>
            <p className="text-foreground/70">{project.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: IndianRupee, label: "Budget", value: formatCompactINR(project.budget) },
                { icon: Calendar, label: "Duration", value: `${project.durationMonths} months` },
                { icon: Users, label: "Vendors", value: String(vendors.length) },
                { icon: Layers, label: "Requirements", value: String(requirements.length) },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/[0.03] p-4">
                  <stat.icon className="mb-2 h-4 w-4 text-primary-2" />
                  <p className="text-sm font-semibold">{stat.value}</p>
                  <p className="text-xs text-foreground/45">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={`/projects/${id}/requirements`}>
                  Manage Requirements <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href={`/projects/${id}/upload`}>Upload Proposals</Link>
              </Button>
              {vendors.length > 0 && (
                <Button variant="secondary" asChild>
                  <Link href={`/projects/${id}/comparison`}>View Comparison</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold">Requirements snapshot</h3>
            <div className="grid gap-2">
              {requirements.slice(0, 6).map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
                  <span className="text-foreground/75">{r.label}</span>
                  <Badge
                    variant={r.status === "met" ? "success" : r.status === "partial" ? "warning" : "outline"}
                  >
                    {r.status}
                  </Badge>
                </div>
              ))}
              {requirements.length === 0 && (
                <p className="text-sm text-foreground/45">No requirements defined yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
