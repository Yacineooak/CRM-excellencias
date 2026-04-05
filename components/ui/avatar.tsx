import Image from "next/image";

import { cn } from "@/lib/utils";

export function Avatar({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border border-white/30 bg-white/60 shadow-soft dark:border-white/10 dark:bg-white/10",
        className,
      )}
    >
      <Image alt={alt} className="h-full w-full object-cover" fill sizes="80px" src={src} />
    </div>
  );
}
