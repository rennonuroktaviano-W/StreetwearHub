"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMotionPrefs } from "@/components/motion/use-motion-prefs";

export function CustomCursor() {
  const { reduced, mobile, ready } = useMotionPrefs();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 32, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 32, mass: 0.4 });
  const [hovering, setHovering] = useState(false);
  const [fine, setFine] = useState(false);

  const enabled = ready && !reduced && !mobile && fine;

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement | null;
      setHovering(Boolean(target?.closest("[data-cursor]")));
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] border border-accent mix-blend-difference"
      style={{ x: springX, y: springY }}
      animate={{
        width: hovering ? 52 : 18,
        height: hovering ? 52 : 18,
        opacity: hovering ? 0.9 : 0.55,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    />
  );
}
