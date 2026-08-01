"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useTheme } from "next-themes";
import type { Group } from "three";

function SlowSpin({
  children,
  speed = 0.1,
}: {
  children: React.ReactNode;
  speed?: number;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * speed;
      ref.current.rotation.y += delta * speed * 1.4;
    }
  });
  return <group ref={ref}>{children}</group>;
}

function CenterpieceKnot({ dark }: { dark: boolean }) {
  return (
    <Float speed={1.4} rotationIntensity={0.9} floatIntensity={1.1}>
      <mesh scale={1.1}>
        <torusKnotGeometry args={[1, 0.32, 220, 32]} />
        <MeshDistortMaterial
          color={dark ? "#c9b6e4" : "#b9a6e0"}
          distort={0.35}
          speed={1.6}
          roughness={0.3}
          metalness={0.15}
          emissive={dark ? "#8b6fb3" : "#e0bfd1"}
          emissiveIntensity={dark ? 0.45 : 0.22}
        />
      </mesh>
    </Float>
  );
}

function FloatingSphere({
  position,
  scale,
  color,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}) {
  return (
    <Float speed={speed} rotationIntensity={0.6} floatIntensity={2.2}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 48, 48]} />
        <MeshDistortMaterial
          color={color}
          distort={0.25}
          speed={1.2}
          roughness={0.35}
          metalness={0.1}
          emissive={color}
          emissiveIntensity={0.25}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

function FloatingRing({
  position,
  scale,
  color,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
}) {
  return (
    <Float speed={1.1} rotationIntensity={1.6} floatIntensity={1.4}>
      <mesh position={position} scale={scale} rotation={[0.6, 0.4, 0]}>
        <torusGeometry args={[1, 0.12, 24, 80]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <>
      <ambientLight intensity={dark ? 0.7 : 1} />
      <pointLight position={[5, 5, 5]} intensity={dark ? 80 : 60} color="#f0bfd1" />
      <pointLight position={[-5, -3, -5]} intensity={dark ? 70 : 50} color="#b9a6e0" />
      <pointLight position={[0, -4, 3]} intensity={dark ? 40 : 25} color="#d9a99b" />
      <directionalLight position={[2, 4, 4]} intensity={dark ? 0.6 : 0.9} color="#ffffff" />

      <SlowSpin speed={0.06}>
        <CenterpieceKnot dark={dark} />
      </SlowSpin>

      <FloatingSphere position={[-1.9, 1.5, 0.4]} scale={0.42} color="#f0bfd1" speed={1.6} />
      <FloatingSphere position={[1.9, -1.3, 0.5]} scale={0.32} color="#d9a99b" speed={2} />
      <FloatingSphere position={[1.7, 1.6, -0.2]} scale={0.22} color="#b9a6e0" speed={2.4} />
      <FloatingRing position={[-1.8, -1.4, 0.3]} scale={0.48} color="#d9a99b" />

      <Sparkles
        count={60}
        scale={7}
        size={2.4}
        speed={0.35}
        opacity={dark ? 0.7 : 0.45}
        color={dark ? "#e0b4a6" : "#8b6fb3"}
      />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.4], fov: 44 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
