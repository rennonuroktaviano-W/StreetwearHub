"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionPrefs } from "@/components/motion/use-motion-prefs";

export function ParallaxImage({
  children,
  className = "",
  distance = 12,
  axis = "y",
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  axis?: "x" | "y";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced, mobile, ready } = useMotionPrefs();

  useEffect(() => {
    if (!ready || reduced || mobile || !ref.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    const context = gsap.context(() => {
      gsap.fromTo(
        el,
        { [axis === "y" ? "yPercent" : "xPercent"]: -distance / 2 },
        {
          [axis === "y" ? "yPercent" : "xPercent"]: distance / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, el);

    return () => context.revert();
  }, [ready, reduced, mobile, distance, axis]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
