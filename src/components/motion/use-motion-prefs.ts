"use client";

import { useEffect, useState } from "react";

export type MotionPrefs = {
  reduced: boolean;
  mobile: boolean;
  ready: boolean;
};

export function useMotionPrefs(): MotionPrefs {
  const [prefs, setPrefs] = useState<MotionPrefs>({
    reduced: false,
    mobile: false,
    ready: false,
  });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setPrefs({
        reduced: motionQuery.matches,
        mobile: mobileQuery.matches,
        ready: true,
      });
    };

    update();
    motionQuery.addEventListener("change", update);
    mobileQuery.addEventListener("change", update);
    return () => {
      motionQuery.removeEventListener("change", update);
      mobileQuery.removeEventListener("change", update);
    };
  }, []);

  return prefs;
}
