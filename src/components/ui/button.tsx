import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[#8280ff] to-[#5b57f5] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_8px_24px_-8px_rgba(111,108,255,0.6)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_10px_30px_-6px_rgba(111,108,255,0.75)] hover:-translate-y-0.5",
        secondary:
          "glass text-foreground hover:border-border-strong hover:bg-white/[0.06]",
        outline:
          "border border-border-strong bg-transparent text-foreground hover:bg-white/[0.05]",
        ghost: "text-foreground/80 hover:bg-white/[0.06] hover:text-foreground",
        destructive: "bg-danger/90 text-white hover:bg-danger",
        link: "text-primary-2 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export { Button, buttonVariants };
