import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { Button } from "@/components/ui/button";
import { mockProjects } from "@/lib/mock-data";

export default function ProjectsPage() {
  return (
    <AppShell title="Projects" subtitle="Every procurement initiative NOVA is tracking for you.">
      <div className="mb-6 flex justify-end">
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </AppShell>
  );
}
