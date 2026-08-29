import { create } from "zustand";
import type { AssistantMessage, AssistantState } from "@/lib/types";
import { getMockChatResponse } from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// NOVA's brain lives here, entirely separate from how it's drawn on screen.
//
//   Assistant Logic  ->  Assistant State  ->  Assistant Visual
//
// `AssistantOrb` (today) or a future R3F GLB avatar both just read
// `state` + `caption` from this store. Swapping the visual never touches
// this file.
// ---------------------------------------------------------------------------

const STATE_CAPTIONS: Record<AssistantState, string> = {
  idle: "I'm ready to help.",
  listening: "I'm listening...",
  thinking: "Let me analyze that.",
  analyzing: "Analyzing vendor proposals...",
  speaking: "",
};

interface AssistantStore {
  state: AssistantState;
  caption: string;
  messages: AssistantMessage[];
  isExpanded: boolean;
  activeProjectName?: string;
  activeProjectId?: string;

  setState: (state: AssistantState, caption?: string) => void;
  setExpanded: (expanded: boolean) => void;
  setActiveProject: (name?: string, id?: string) => void;
  say: (text: string) => void;
  sendUserMessage: (text: string) => Promise<void>;
  reset: () => void;
}

let speakTimeout: ReturnType<typeof setTimeout> | null = null;

export const useAssistantStore = create<AssistantStore>((set, get) => ({
  state: "idle",
  caption: STATE_CAPTIONS.idle,
  messages: [
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I'm NOVA. Ready to evaluate your next vendor?",
      timestamp: Date.now(),
    },
  ],
  isExpanded: false,
  activeProjectName: undefined,
  activeProjectId: undefined,

  setState: (state, caption) => {
    set({ state, caption: caption ?? STATE_CAPTIONS[state] });
  },

  setExpanded: (expanded) => set({ isExpanded: expanded }),
  setActiveProject: (name, id) => set({ activeProjectName: name, activeProjectId: id }),

  say: (text) => {
    if (speakTimeout) clearTimeout(speakTimeout);
    set((s) => ({
      state: "speaking",
      caption: text,
      messages: [...s.messages, { id: crypto.randomUUID(), role: "assistant", text, timestamp: Date.now() }],
    }));
    speakTimeout = setTimeout(() => {
      set({ state: "idle", caption: STATE_CAPTIONS.idle });
    }, Math.max(2200, text.length * 45));
  },

  sendUserMessage: async (text) => {
    const userMsg: AssistantMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      timestamp: Date.now(),
    };
    set((s) => ({ messages: [...s.messages, userMsg], state: "thinking", caption: STATE_CAPTIONS.thinking }));

    const projectId = get().activeProjectId;
    let response: string;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, message: text }),
      });
      if (!res.ok) throw new Error("chat request failed");
      const data = (await res.json()) as { reply: string };
      response = data.reply;
    } catch {
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
      response = getMockChatResponse(text);
    }

    get().say(response);
  },

  reset: () => set({ state: "idle", caption: STATE_CAPTIONS.idle }),
}));

export { STATE_CAPTIONS };
