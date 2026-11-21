"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useThreeSupport } from "@/components/three/use-three-support";
import { colorToHex } from "@/components/three/color-utils";

function TinyModel({ url, color, paused }: { url: string; color: string; paused: boolean }) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);
  const hex = colorToHex(color);

  const clone = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clone.traverse((node) => {
      if (node instanceof THREE.Mesh && node.material) {
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.color.set(hex);
            material.roughness = 0.85;
            material.metalness = 0.02;
            material.needsUpdate = true;
          }
        });
      }
    });
  }, [clone, hex]);

  const box = new THREE.Box3().setFromObject(clone);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);
  const scale = 2.2 / (Math.max(size.x, size.y, size.z) || 1);

  useFrame((_, delta) => {
    if (group.current && !paused) group.current.rotation.y += 0.35 * delta;
  });

  return (
    <group ref={group}>
      <primitive object={clone} scale={scale} position={[-center.x * scale, -center.y * scale, -center.z * scale]} />
    </group>
  );
}

export default function CardModel3D({
  url,
  fallbackImage,
  name,
  color,
}: {
  url: string;
  fallbackImage: string;
  name: string;
  color?: string | null;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const support = useThreeSupport();

  useEffect(() => {
    const node = holder.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={holder}
      className="relative h-full w-full"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      aria-label={`Model 3D ${name}`}
      role="img"
    >
      {!visible || !support.webgl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={fallbackImage} alt={name} className="h-full w-full object-contain" />
      ) : (
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center" role="status" aria-label="Memuat model 3D">
              <span className="h-6 w-6 animate-spin border-2 border-mid border-t-accent" aria-hidden />
            </div>
          }
        >
          <Canvas dpr={support.lowPower ? [1, 1.5] : [1, 2]} camera={{ position: [0, 0.2, 4.4], fov: 38 }} gl={{ alpha: true, antialias: false }}>
            <ambientLight intensity={1} />
            <directionalLight position={[3, 5, 4]} intensity={1.6} />
            <directionalLight position={[-3, 2, -2]} intensity={0.6} />
            <TinyModel url={url} color={color ?? "#2e2e2e"} paused={hovered || support.reduced} />
          </Canvas>
        </Suspense>
      )}
    </div>
  );
}
