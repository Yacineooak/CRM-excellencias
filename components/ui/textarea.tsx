import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[140px] w-full rounded-[28px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(245,252,252,0.82))] px-4 py-3 text-sm font-medium text-foreground shadow-[0_14px_30px_rgba(8,23,24,0.07)] outline-none transition duration-150 placeholder:text-muted-foreground/80 hover:-translate-y-0.5 hover:border-teal/30 hover:shadow-[0_18px_34px_rgba(74,181,184,0.12)] focus:border-teal/60 focus:ring-4 focus:ring-teal/15 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))]",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
