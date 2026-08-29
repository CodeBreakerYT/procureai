import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectTabs } from "@/components/procurement/ProjectTabs";
import { ProjectAssistantSync } from "@/components/procurement/ProjectAssistantSync";
import { AnalysisSequence } from "@/components/procurement/AnalysisSequence";
import { getProject } from "@/lib/mock-data";

export default async function AnalysisPage({ params }: PageProps<"/projects/[id]/analysis">) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  return (
    <AppShell title="AI Analysis" subtitle={`NOVA is analyzing proposals for ${project.name}.`}>
      <ProjectAssistantSync name={project.name} id={id} />
      <ProjectTabs projectId={id} />
      <AnalysisSequence projectId={id} />
    </AppShell>
  );
}
