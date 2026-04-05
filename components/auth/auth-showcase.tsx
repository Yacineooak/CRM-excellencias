"use client";

import type { MotionValue } from "framer-motion";
import { motion, useScroll, useTransform } from "framer-motion";

import { Card } from "@/components/ui/card";

function FloatingOrb({ rotate }: { rotate: MotionValue<string> }) {
  return (
    <motion.div
      className="absolute right-8 top-10 h-28 w-28 rounded-full bg-gradient-to-br from-teal/40 to-white/10 blur-2xl"
      style={{ rotate }}
    />
  );
}

export function AuthShowcase() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], ["0deg", "16deg"]);

  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-[linear-gradient(135deg,#0c1617_0%,#102425_45%,#071011_100%)] p-10 text-white lg:flex lg:flex-col">
      <FloatingOrb rotate={rotate} />
      <div className="absolute inset-0 bg-hero-grid opacity-80" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-teal-200">Premium agency ops</p>
          <h2 className="mt-6 max-w-lg text-5xl font-semibold leading-tight text-balance">
            A creative operating system built for client trust and delivery speed.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
            Move from lead nurturing to project execution, live reviews, analytics, and admin
            control in one refined interface.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="border-white/10 bg-white/10 text-white">
            <p className="text-sm uppercase tracking-[0.26em] text-white/60">Realtime delivery</p>
            <h3 className="mt-3 text-2xl font-semibold">Kanban + mentions + notifications</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Stay aligned as task statuses, comments, and assignments change.
            </p>
          </Card>
          <Card className="border-white/10 bg-white/10 text-white">
            <p className="text-sm uppercase tracking-[0.26em] text-white/60">Admin control</p>
            <h3 className="mt-3 text-2xl font-semibold">Users, roles, projects, analytics</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Designed for agencies who need a polished client-facing operating system.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
