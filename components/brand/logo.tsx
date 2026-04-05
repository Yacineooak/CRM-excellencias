import Image from "next/image";

import logoMark from "@/app/icon.png";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-2 shadow-soft dark:bg-white/10">
        <Image
          alt="AgencyOS logo"
          className={cn("object-contain", compact ? "h-8 w-8" : "h-10 w-10")}
          height={40}
          src={logoMark}
          width={40}
        />
      </div>
      {!compact && (
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">AgencyOS</p>
          <p className="text-lg font-semibold">Creative Command Center</p>
        </div>
      )}
    </div>
  );
}
