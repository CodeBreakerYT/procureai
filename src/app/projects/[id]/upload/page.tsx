import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectTabs } from "@/components/procurement/ProjectTabs";
import { ProjectAssistantSync } from "@/components/procurement/ProjectAssistantSync";
import { VendorUploadZone } from "@/components/procurement/VendorUploadZone";
import { getProject, getVendors } from "@/lib/server-store";

export default async function UploadPage({ params }: PageProps<"/projects/[id]/upload">) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  return (
    <AppShell title="Upload Proposals" subtitle={`Add vendor proposals for ${project.name}.`}>
      <ProjectAssistantSync name={project.name} id={id} />
      <ProjectTabs projectId={id} />
      <VendorUploadZone projectId={id} initialVendors={await getVendors(id)} />
    </AppShell>
  );
}
