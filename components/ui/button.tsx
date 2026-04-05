import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium leading-none transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.985]",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#4ab5b8,#2c9598)] text-white shadow-[0_18px_40px_rgba(74,181,184,0.3)] hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(74,181,184,0.4)]",
        secondary:
          "border border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,252,252,0.7))] text-foreground shadow-[0_14px_34px_rgba(9,23,24,0.08)] hover:-translate-y-0.5 hover:border-teal/30 hover:text-teal dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))]",
        ghost:
          "bg-transparent text-foreground hover:bg-foreground/5 dark:hover:bg-white/5",
        destructive:
          "bg-red-500 text-white hover:-translate-y-0.5 hover:bg-red-600",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
