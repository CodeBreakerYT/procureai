import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectTabs } from "@/components/procurement/ProjectTabs";
import { ProjectAssistantSync } from "@/components/procurement/ProjectAssistantSync";
import { RecommendationHero } from "@/components/procurement/RecommendationHero";
import { getProject, getTopVendorLive, getVendors, upsertVendor } from "@/lib/server-store";
import { generateRecommendationNarrative } from "@/lib/recommendation";

export default async function RecommendationPage({ params }: PageProps<"/projects/[id]/recommendation">) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const vendor = getTopVendorLive(id);

  if (vendor && !vendor.summary) {
    const others = getVendors(id).filter((v) => v.status === "analyzed" && v.id !== vendor.id);
    vendor.summary = await generateRecommendationNarrative(vendor, others);
    upsertVendor(id, vendor);
  }

  return (
    <AppShell title="AI Recommendation" subtitle={`NOVA's final recommendation for ${project.name}.`}>
      <ProjectAssistantSync name={project.name} id={id} />
      <ProjectTabs projectId={id} />

      {vendor ? (
        <RecommendationHero vendor={vendor} />
      ) : (
        <p className="py-16 text-center text-sm text-foreground/45">
          No analyzed vendors yet — upload proposals to get a recommendation.
        </p>
      )}
    </AppShell>
  );
}
