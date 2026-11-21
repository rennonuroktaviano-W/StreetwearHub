"use client";

import dynamic from "next/dynamic";

const CardModel3D = dynamic(() => import("@/components/three/card-model-3d"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-charcoal" />,
});

export function CardModel3DLazy(props: {
  url: string;
  fallbackImage: string;
  name: string;
  color?: string | null;
}) {
  return <CardModel3D {...props} />;
}
