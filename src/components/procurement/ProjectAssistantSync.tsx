"use client";

import { useSyncAssistantProject } from "@/hooks/use-sync-assistant-project";

/** Tiny client boundary so server-rendered project pages can sync NOVA's context. */
export function ProjectAssistantSync({ name, id }: { name: string; id?: string }) {
  useSyncAssistantProject(name, id);
  return null;
}
