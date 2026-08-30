import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectTabs } from "@/components/procurement/ProjectTabs";
import { ProjectAssistantSync } from "@/components/procurement/ProjectAssistantSync";
import { RequirementBoard } from "@/components/procurement/RequirementBoard";
import { Button } from "@/components/ui/button";
import { getProject, getRequirements } from "@/lib/server-store";

export default async function RequirementsPage({ params }: PageProps<"/projects/[id]/requirements">) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  return (
    <AppShell title="Requirements" subtitle={`Define what matters most for ${project.name}.`}>
      <ProjectAssistantSync name={project.name} id={id} />
      <ProjectTabs projectId={id} />

      <RequirementBoard projectId={id} initial={await getRequirements(id)} />

      <div className="mt-6 flex justify-end">
        <Button asChild>
          <Link href={`/projects/${id}/upload`}>
            Continue to Upload Proposals <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}
