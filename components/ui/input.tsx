import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-border bg-white/70 px-4 py-2 text-sm text-foreground outline-none transition focus:border-teal/60 focus:ring-2 focus:ring-teal/30 dark:bg-white/5",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
