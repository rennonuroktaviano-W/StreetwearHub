"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { colorToHex } from "@/components/three/color-utils";

export function Model3D({ color }: { color: string | null | undefined }) {
  const hex = colorToHex(color);

  const materials = useMemo(
    () => ({
      fabric: new THREE.MeshStandardMaterial({
        color: hex,
        roughness: 0.85,
        metalness: 0.02,
        side: THREE.DoubleSide,
      }),
      rib: new THREE.MeshStandardMaterial({
        color: new THREE.Color(hex).multiplyScalar(0.82),
        roughness: 0.9,
        side: THREE.DoubleSide,
      }),
      thread: new THREE.MeshStandardMaterial({
        color: new THREE.Color(hex).lerp(new THREE.Color("#f5f5f3"), 0.25),
        roughness: 0.8,
      }),
    }),
    [hex],
  );

  return (
    <group scale={1.15} position={[0, -0.1, 0]}>
      <mesh material={materials.fabric} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.7, 0.28]} />
      </mesh>
      <mesh material={materials.fabric} position={[-1.0, 0.45, 0]} rotation={[0, 0, 0.22]} castShadow>
        <boxGeometry args={[0.62, 0.9, 0.26]} />
      </mesh>
      <mesh material={materials.fabric} position={[1.0, 0.45, 0]} rotation={[0, 0, -0.22]} castShadow>
        <boxGeometry args={[0.62, 0.9, 0.26]} />
      </mesh>
      <mesh material={materials.rib} position={[0, 0.98, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.3, 0.075, 12, 32]} />
      </mesh>
      <mesh material={materials.thread} position={[0, 0.18, 0.151]}>
        <boxGeometry args={[0.5, 0.05, 0.01]} />
      </mesh>
      <mesh material={materials.thread} position={[0, -0.12, 0.151]}>
        <boxGeometry args={[0.34, 0.04, 0.01]} />
      </mesh>
      <mesh material={materials.rib} position={[0, -0.87, 0]} castShadow>
        <boxGeometry args={[1.52, 0.1, 0.3]} />
      </mesh>
      <mesh material={materials.rib} position={[-1.0, -0.02, 0]} rotation={[0, 0, 0.22]} castShadow>
        <boxGeometry args={[0.64, 0.1, 0.28]} />
      </mesh>
      <mesh material={materials.rib} position={[1.0, -0.02, 0]} rotation={[0, 0, -0.22]} castShadow>
        <boxGeometry args={[0.64, 0.1, 0.28]} />
      </mesh>
    </group>
  );
}
