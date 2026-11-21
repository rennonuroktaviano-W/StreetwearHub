"use client";

import { useEffect, useState } from "react";

export type ThreeSupport = {
  ready: boolean;
  webgl: boolean;
  reduced: boolean;
  lowPower: boolean;
};

function detect(): ThreeSupport {
  if (typeof window === "undefined") {
    return { ready: false, webgl: false, reduced: false, lowPower: false };
  }

  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    webgl = false;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.matchMedia("(max-width: 767px)").matches;
  const lowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  return {
    ready: true,
    webgl,
    reduced,
    lowPower: small || (typeof lowMemory === "number" && lowMemory <= 2),
  };
}

export function useThreeSupport(): ThreeSupport {
  const [state, setState] = useState<ThreeSupport>(detect);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setState((current) => ({ ...current, reduced: query.matches }));
    };
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return state;
}
