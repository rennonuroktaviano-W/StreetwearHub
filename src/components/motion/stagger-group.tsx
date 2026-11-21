"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useMotionPrefs } from "@/components/motion/use-motion-prefs";

export function StaggerGroup({
  children,
  className = "",
  stagger = 0.1,
  y = 26,
}: {
  children: ReactNode[];
  className?: string;
  stagger?: number;
  y?: number;
}) {
  const { reduced, ready } = useMotionPrefs();

  if (!ready || reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
