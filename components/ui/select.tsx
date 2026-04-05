import * as React from "react";
import { ChevronDown, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-teal/80">
          <span className="rounded-full bg-teal/12 p-1.5 shadow-[0_0_0_1px_rgba(74,181,184,0.1)]">
            <Sparkles className="size-3.5" />
          </span>
        </div>
        <select
          ref={ref}
          className={cn(
            "h-12 w-full appearance-none rounded-[20px] border border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,252,252,0.82))] pl-14 pr-12 text-sm font-medium text-foreground shadow-[0_14px_28px_rgba(8,23,24,0.08)] outline-none transition duration-300 hover:-translate-y-0.5 hover:border-teal/30 hover:shadow-[0_18px_36px_rgba(74,181,184,0.14)] focus:border-teal/60 focus:ring-4 focus:ring-teal/15 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))]",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground transition group-focus-within:text-teal">
          <ChevronDown className="size-4" />
        </div>
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
