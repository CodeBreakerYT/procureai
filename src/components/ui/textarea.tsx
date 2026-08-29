import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-xl border border-border-subtle bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-primary/50 focus:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
