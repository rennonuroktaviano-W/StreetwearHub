"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { colorToHex } from "@/components/three/color-utils";

export function Model3D({
  color,
  modelUrl,
}: {
  color: string | null | undefined;
  modelUrl?: string | null;
}) {
  const url = modelUrl ?? "/models/SH-TSHIRT-001.glb";
  const { scene } = useGLTF(url);
  const hex = colorToHex(color);

  const clone = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          node.material = Array.isArray(node.material)
            ? node.material.map((material) => material.clone())
            : node.material.clone();
        }
      }
    });
    return copy;
  }, [scene]);

  useEffect(() => {
    const apply = (material: THREE.Material) => {
      if (material instanceof THREE.MeshStandardMaterial) {
        material.color.set(hex);
        material.roughness = 0.85;
        material.metalness = 0.02;
        material.needsUpdate = true;
      }
    };

    clone.traverse((node) => {
      if (node instanceof THREE.Mesh && node.material) {
        if (Array.isArray(node.material)) node.material.forEach(apply);
        else apply(node.material);
      }
    });
  }, [clone, hex]);

  const box = useMemo(() => new THREE.Box3().setFromObject(clone), [clone]);
  const size = useMemo(() => {
    const vector = new THREE.Vector3();
    box.getSize(vector);
    return vector;
  }, [box]);
  const center = useMemo(() => {
    const vector = new THREE.Vector3();
    box.getCenter(vector);
    return vector;
  }, [box]);

  const scale = useMemo(() => {
    const max = Math.max(size.x, size.y, size.z) || 1;
    return 2.2 / max;
  }, [size]);

  return (
    <group>
      <group
        scale={scale}
        position={[-center.x * scale, -center.y * scale, -center.z * scale]}
      >
        <primitive object={clone} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/SH-TSHIRT-001.glb");
