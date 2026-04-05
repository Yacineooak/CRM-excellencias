"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export function LogoLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-2xl"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
        >
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              animate={{ scale: [0.92, 1, 0.98], rotate: [0, 2, 0] }}
              className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/20 bg-white/80 shadow-teal dark:bg-white/10"
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                animate={{ scale: [1, 1.35], opacity: [0.45, 0] }}
                className="absolute inset-0 rounded-[2rem] border border-teal/50"
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <Image
                alt="AgencyOS brand mark"
                className="h-16 w-16 object-contain"
                height={64}
                src="https://i.imgur.com/pFlN7HD.png"
                width={64}
              />
            </motion.div>
            <div className="space-y-2 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-teal">Booting workspace</p>
              <h1 className="text-2xl font-semibold">AgencyOS</h1>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
