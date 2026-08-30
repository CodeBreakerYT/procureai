import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectTabs } from "@/components/procurement/ProjectTabs";
import { ProjectAssistantSync } from "@/components/procurement/ProjectAssistantSync";
import { ComparisonTable } from "@/components/procurement/ComparisonTable";
import { ScoreChart } from "@/components/procurement/ScoreChart";
import { DownloadReportButton } from "@/components/procurement/DownloadReportButton";
import { Button } from "@/components/ui/button";
import { getProject, getVendors } from "@/lib/server-store";

export default async function ComparisonPage({ params }: PageProps<"/projects/[id]/comparison">) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const vendors = (await getVendors(id)).filter((v) => v.status === "analyzed");

  return (
    <AppShell title="Vendor Comparison" subtitle={`Side-by-side comparison for ${project.name}.`}>
      <ProjectAssistantSync name={project.name} id={id} />
      <ProjectTabs projectId={id} />

      <div className="grid gap-6">
        <ScoreChart vendors={vendors} />
        <ComparisonTable vendors={vendors} />

        <div className="flex justify-end gap-3">
          <DownloadReportButton projectName={project.name} vendors={vendors} />
          <Button variant="secondary" asChild>
            <Link href={`/projects/${id}/risks`}>View Risk Analysis</Link>
          </Button>
          <Button asChild>
            <Link href={`/projects/${id}/recommendation`}>
              View Recommendation <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
