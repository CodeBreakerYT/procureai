import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectTabs } from "@/components/procurement/ProjectTabs";
import { ProjectAssistantSync } from "@/components/procurement/ProjectAssistantSync";
import { RiskBoard } from "@/components/procurement/RiskBoard";
import { Button } from "@/components/ui/button";
import { getAllRisksLive, getProject } from "@/lib/server-store";

export default async function RisksPage({ params }: PageProps<"/projects/[id]/risks">) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const risks = await getAllRisksLive(id);

  return (
    <AppShell title="Risk Analysis" subtitle={`Risks NOVA detected across proposals for ${project.name}.`}>
      <ProjectAssistantSync name={project.name} id={id} />
      <ProjectTabs projectId={id} />

      <RiskBoard risks={risks} />

      <div className="mt-6 flex justify-end">
        <Button asChild>
          <Link href={`/projects/${id}/recommendation`}>
            View Recommendation <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}
