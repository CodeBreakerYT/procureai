"use client";

import * as React from "react";
import { useAssistantStore } from "@/store/assistant-store";

/** Keeps NOVA's active project (name + id) in sync while a project page is mounted. */
export function useSyncAssistantProject(name: string | undefined, id?: string) {
  const setActiveProject = useAssistantStore((s) => s.setActiveProject);

  React.useEffect(() => {
    setActiveProject(name, id);
    return () => setActiveProject(undefined, undefined);
  }, [name, id, setActiveProject]);
}
