"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mic, Send } from "lucide-react";
import { useAssistantStore } from "@/store/assistant-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SUGGESTED_QUERIES = [
  "Which vendor is cheapest?",
  "Why did you recommend Vendor A?",
  "What are Vendor B's biggest risks?",
  "Compare Vendor A and Vendor C.",
];

export function AssistantChat({ className }: { className?: string }) {
  const { messages, sendUserMessage, state, setState } = useAssistantStore();
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = (text: string) => {
    if (!text.trim() || state === "thinking") return;
    setInput("");
    void sendUserMessage(text);
  };

  const toggleMic = () => {
    if (state === "listening") {
      setState("idle");
    } else {
      setState("listening");
      // Simulated speech-to-text capture window — a real implementation
      // wires this to the Web Speech API / backend STT stream.
      setTimeout(() => setState("idle"), 2200);
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div ref={scrollRef} className="flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
              m.role === "assistant"
                ? "self-start glass text-foreground/90"
                : "self-end bg-gradient-to-b from-[#8280ff] to-[#5b57f5] text-white"
            )}
          >
            {m.text}
          </motion.div>
        ))}
        {state === "thinking" && (
          <div className="self-start glass flex gap-1 rounded-2xl px-4 py-3">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-foreground/50"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {SUGGESTED_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => submit(q)}
            className="rounded-full border border-border-subtle bg-white/[0.03] px-3 py-1 text-[11px] text-foreground/60 transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
      >
        <button
          type="button"
          onClick={toggleMic}
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors",
            state === "listening"
              ? "border-accent bg-accent/15 text-accent"
              : "border-border-subtle bg-white/[0.03] text-foreground/60 hover:text-foreground"
          )}
          aria-label="Toggle voice input"
        >
          <Mic className="h-4 w-4" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask NOVA about your vendors..."
          className="h-11 flex-1 rounded-xl border border-border-subtle bg-white/[0.03] px-4 text-sm outline-none placeholder:text-foreground/35 focus:border-primary/50"
        />
        <Button type="submit" size="icon" aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
