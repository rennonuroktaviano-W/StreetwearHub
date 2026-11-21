"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { Model3D } from "@/components/three/model-3d";
import { useThreeSupport } from "@/components/three/use-three-support";

function ViewerLoader() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-ink" role="status" aria-label="Memuat model 3D">
      <span className="h-8 w-8 animate-spin border-2 border-mid border-t-accent" aria-hidden />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Memuat model 3D…</span>
    </div>
  );
}

export default function ProductViewer3D({
  color,
  lowPower,
}: {
  color: string | null | undefined;
  lowPower?: boolean;
}) {
  const support = useThreeSupport();
  const disableShadows = lowPower ?? support.lowPower;

  if (support.ready && !support.webgl) return <ViewerLoader />;

  return (
    <div className="relative h-full w-full bg-ink">
      <Suspense fallback={<ViewerLoader />}>
        <Canvas
          dpr={disableShadows ? [1, 1.5] : [1, 2]}
          camera={{ position: [0, 0.4, 4.6], fov: 38 }}
          gl={{ antialias: !disableShadows, alpha: true }}
        >
          <ambientLight intensity={0.75} />
          <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow={!disableShadows} />
          <directionalLight position={[-4, 2, -3]} intensity={0.6} />
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>
          <Model3D color={color} />
          {!disableShadows && (
            <ContactShadows position={[0, -1.25, 0]} opacity={0.45} scale={6} blur={2.4} far={4} />
          )}
          <OrbitControls
            enablePan={false}
            enableZoom
            minDistance={2.8}
            maxDistance={7}
            minPolarAngle={Math.PI * 0.2}
            maxPolarAngle={Math.PI * 0.8}
            makeDefault
          />
        </Canvas>
      </Suspense>
      <p className="pointer-events-none absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted">
        Seret untuk memutar · Scroll untuk zoom
      </p>
    </div>
  );
}
