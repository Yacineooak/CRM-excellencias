import * as React from "react";

import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("glass-panel soft-outline rounded-[28px] p-5", className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";
