// ФАЙЛ: src/components/Scene.tsx
"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";

// Всё, что подбирается вручную, собрано здесь
const GROUND_Y = -2.5; // высота земли: на ней стоят машина и тень
const CAR_SCALE = 2;
const CAR_ROTATION: [number, number, number] = [-Math.PI / 2, 0, 0];

function Ferrari() {
  const gltf = useGLTF("/ferrari.glb");

  return (
    <primitive
      object={gltf.scene}
      position={[0, GROUND_Y, 0]}
      rotation={CAR_ROTATION}
      scale={CAR_SCALE}
    />
  );
}

useGLTF.preload("/ferrari.glb");

export default function Scene() {
  return (
    <div className="h-screen w-full">
      {/* Камера на высоте машины и смотрит на неё сбоку, а не сверху */}
      <Canvas camera={{ position: [0, 0.5, 12], fov: 45 }}>
        <Suspense fallback={null}>
          <Environment files="/desert.hdr" background />

          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />

          <Ferrari />

          <ContactShadows
            position={[0, GROUND_Y, 0]}
            opacity={0.7}
            scale={20}
            blur={2.5}
            far={4}
            resolution={1024}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enableZoom={true}
          enablePan={false}
          target={[0, 0, 0]}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>
    </div>
  );
}