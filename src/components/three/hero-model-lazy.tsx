"use client";

import dynamic from "next/dynamic";

const HeroModel = dynamic(() => import("@/components/three/hero-model"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-black-sh" role="status" aria-label="Memuat model 3D">
      <span className="h-8 w-8 animate-spin border-2 border-mid border-t-accent" aria-hidden />
    </div>
  ),
});

export function HeroModelLazy() {
  return <HeroModel />;
}
