"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { cn, getInitials } from "@/lib/utils";

export function Avatar({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border border-white/30 bg-[radial-gradient(circle_at_30%_30%,rgba(255,194,244,0.95),rgba(74,181,184,0.72))] shadow-soft dark:border-white/10",
        className,
      )}
    >
      {src && !imageError ? (
        <Image
          alt={alt}
          className="h-full w-full object-cover"
          fill
          onError={() => setImageError(true)}
          sizes="80px"
          src={src}
          unoptimized
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/95">
          {getInitials(alt || "User")}
        </div>
      )}
    </div>
  );
}
