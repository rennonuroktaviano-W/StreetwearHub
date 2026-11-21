"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useThreeSupport } from "@/components/three/use-three-support";

function DropModel({ reduced }: { reduced: boolean }) {
  const { scene } = useGLTF("/models/SH-HOODIE-001.glb");
  const group = useRef<THREE.Group>(null);
  const clone = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clone.traverse((node) => {
      if (node instanceof THREE.Mesh && node.material) {
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.color.set("#8a1d26");
            material.roughness = 0.8;
            material.metalness = 0.05;
            material.needsUpdate = true;
          }
        });
      }
    });
  }, [clone]);

  const box = new THREE.Box3().setFromObject(clone);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);
  const scale = 2.4 / (Math.max(size.x, size.y, size.z) || 1);

  useFrame((_, delta) => {
    if (group.current && !reduced) group.current.rotation.y += 0.25 * delta;
  });

  return (
    <group ref={group}>
      <primitive object={clone} scale={scale} position={[-center.x * scale, -center.y * scale, -center.z * scale]} />
    </group>
  );
}

export default function FreshDropsModel() {
  const support = useThreeSupport();

  if (!support.ready || !support.webgl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src="/images/product-2.svg" alt="Jaket utility Fresh Drops" className="h-full w-full object-contain" />;
  }

  return (
    <div className="relative h-full w-full bg-charcoal" aria-label="Model 3D jaket Fresh Drops yang bisa diputar" role="img">
      <Suspense fallback={null}>
        <Canvas dpr={support.lowPower ? [1, 1.5] : [1, 2]} camera={{ position: [0, 0.2, 4.4], fov: 38 }} gl={{ alpha: true, antialias: false }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[4, 6, 5]} intensity={1.7} />
          <directionalLight position={[-4, 2, -3]} intensity={0.5} />
          <Environment preset="city" />
          <DropModel reduced={support.reduced} />
          {!support.lowPower && <ContactShadows position={[0, -1.3, 0]} opacity={0.4} scale={6} blur={2.4} far={4} />}
          <OrbitControls enablePan={false} enableZoom minDistance={2.8} maxDistance={6} minPolarAngle={Math.PI * 0.22} maxPolarAngle={Math.PI * 0.78} />
        </Canvas>
      </Suspense>
      <p className="pointer-events-none absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-[0.2em] text-muted">
        Seret untuk memutar · zoom
      </p>
    </div>
  );
}
