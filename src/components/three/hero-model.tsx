"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { Model3D } from "@/components/three/model-3d";
import { useThreeSupport } from "@/components/three/use-three-support";

function SpinningModel({ paused, reduced }: { paused: boolean; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!ref.current || paused || reduced) return;
    ref.current.rotation.y += 0.3 * delta;
  });

  return (
    <group ref={ref}>
      <Model3D color="#1a1a1a" modelUrl="/models/SH-HOODIE-001.glb" />
    </group>
  );
}

export default function HeroModel() {
  const support = useThreeSupport();
  const [hovered, setHovered] = useState(false);

  if (support.ready && !support.webgl) {
    return (
      <div className="relative h-full w-full bg-black-sh">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/placeholder-hero.svg" alt="Model streetwear StreetwearHub" className="h-full w-full object-cover" />
      </div>
    );
  }

  if (!support.ready) return <div className="h-full w-full bg-black-sh" />;

  const disableShadows = support.lowPower;

  return (
    <div
      className="h-full w-full bg-black-sh"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      aria-label="Model 3D kaos StreetwearHub"
      role="img"
    >
      <Suspense fallback={null}>
        <Canvas dpr={disableShadows ? [1, 1.5] : [1, 2]} camera={{ position: [0, 0.2, 4.8], fov: 38 }} gl={{ antialias: !disableShadows, alpha: true }}>
          <ambientLight intensity={0.85} />
          <directionalLight position={[4, 6, 5]} intensity={1.5} />
          <directionalLight position={[-4, 2, -3]} intensity={0.5} />
          <Suspense fallback={null}>
            <Environment preset="city" />
          </Suspense>
          <SpinningModel paused={hovered} reduced={support.reduced} />
          {!disableShadows && <ContactShadows position={[0, -1.25, 0]} opacity={0.4} scale={6} blur={2.4} far={4} />}
        </Canvas>
      </Suspense>
    </div>
  );
}
