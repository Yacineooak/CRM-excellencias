import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-2xl bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_0%,rgba(74,181,184,0.16)_50%,rgba(255,255,255,0.08)_100%)] bg-[length:200%_100%] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_0%,rgba(74,181,184,0.16)_50%,rgba(255,255,255,0.04)_100%)]",
        className,
      )}
    />
  );
}
