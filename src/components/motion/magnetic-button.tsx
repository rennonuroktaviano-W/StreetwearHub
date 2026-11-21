"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMotionPrefs } from "@/components/motion/use-motion-prefs";

export function MagneticButton({
  children,
  href,
  className = "",
  strength = 14,
}: {
  children: ReactNode;
  href: string;
  className?: string;
  strength?: number;
}) {
  const { reduced, mobile, ready } = useMotionPrefs();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18 });
  const springY = useSpring(y, { stiffness: 220, damping: 18 });

  const enabled = ready && !reduced && !mobile;

  return (
    <motion.span
      className="inline-block"
      style={enabled ? { x: springX, y: springY } : undefined}
      onMouseMove={
        enabled
          ? (event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              x.set(((event.clientX - rect.left) / rect.width - 0.5) * strength);
              y.set(((event.clientY - rect.top) / rect.height - 0.5) * strength);
            }
          : undefined
      }
      onMouseLeave={
        enabled
          ? () => {
              x.set(0);
              y.set(0);
            }
          : undefined
      }
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.span>
  );
}
