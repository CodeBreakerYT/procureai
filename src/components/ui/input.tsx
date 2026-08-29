import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-border-subtle bg-white/[0.03] px-4 py-2 text-sm text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-primary/50 focus:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
