"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useMotionPrefs } from "@/components/motion/use-motion-prefs";

export function SmoothScroll() {
  const { reduced, mobile, ready } = useMotionPrefs();

  useEffect(() => {
    if (!ready || reduced || mobile) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [ready, reduced, mobile]);

  return null;
}
