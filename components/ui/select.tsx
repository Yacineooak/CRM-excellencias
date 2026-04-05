import * as React from "react";
import { ChevronDown, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, icon, ...props }, ref) => {
    return (
      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-teal/80">
          <span className="rounded-full bg-[linear-gradient(135deg,rgba(74,181,184,0.2),rgba(255,255,255,0.82))] p-2 shadow-[0_12px_26px_rgba(74,181,184,0.18)] ring-1 ring-white/50 dark:bg-[linear-gradient(135deg,rgba(74,181,184,0.22),rgba(255,255,255,0.08))] dark:ring-white/10">
            {icon ?? <Sparkles className="size-3.5" />}
          </span>
        </div>
        <select
          ref={ref}
          className={cn(
            "h-14 w-full appearance-none rounded-[24px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,251,251,0.82))] pl-16 pr-14 text-ellipsis whitespace-nowrap text-sm font-semibold leading-none text-foreground shadow-[0_16px_34px_rgba(8,23,24,0.08)] outline-none transition duration-150 hover:-translate-y-0.5 hover:border-teal/35 hover:shadow-[0_22px_40px_rgba(74,181,184,0.16)] focus:border-teal/60 focus:ring-4 focus:ring-teal/15 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] dark:text-white",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition group-focus-within:text-teal">
          <span className="rounded-full border border-white/50 bg-white/65 p-2 shadow-[0_10px_20px_rgba(8,23,24,0.07)] dark:border-white/10 dark:bg-white/10">
            <ChevronDown className="size-4" />
          </span>
        </div>
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
