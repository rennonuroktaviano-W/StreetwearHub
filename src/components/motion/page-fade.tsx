"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMotionPrefs } from "@/components/motion/use-motion-prefs";

export function PageFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { reduced } = useMotionPrefs();
  const isHome = pathname === "/";

  if (isHome || reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
