import * as React from "react";

import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "glass-panel soft-outline relative isolate rounded-[28px] p-5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_34%,transparent_66%,rgba(74,181,184,0.12))] before:opacity-70 before:content-['']",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";
