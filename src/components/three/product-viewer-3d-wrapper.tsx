"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useThreeSupport } from "@/components/three/use-three-support";

const Viewer = dynamic(() => import("@/components/three/product-viewer-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink" role="status" aria-label="Memuat model 3D">
      <span className="h-8 w-8 animate-spin border-2 border-mid border-t-accent" aria-hidden />
    </div>
  ),
});

export function ProductViewer3DWrapper({
  color,
  fallbackImage,
  name,
  modelUrl,
}: {
  color: string | null | undefined;
  fallbackImage: string | null;
  name: string;
  modelUrl?: string | null;
}) {
  const support = useThreeSupport();

  if (support.ready && !support.webgl) {
    return (
      <div className="relative h-full w-full bg-ink">
        {fallbackImage ? (
          <Image src={fallbackImage} alt={name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain" />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-6xl text-mid">SH</div>
        )}
        <p className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted">
          Mode 2D · Perangkat tidak mendukung 3D
        </p>
      </div>
    );
  }

  if (!support.ready) return <div className="h-full w-full bg-ink" />;

  return <Viewer color={color} lowPower={support.lowPower} modelUrl={modelUrl} />;
}
