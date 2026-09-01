"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Group } from "three";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useThemeAccent } from "@/lib/theme-accent-context";

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

function CenterpieceKnot({ color, emissive }: { color: string; emissive: string }) {
  return (
    <Float speed={1.4} rotationIntensity={0.9} floatIntensity={1.1}>
      <mesh scale={1.1}>
        <torusKnotGeometry args={[1, 0.32, 220, 32]} />
        <MeshDistortMaterial
          color={color}
          distort={0.35}
          speed={1.6}
          roughness={0.25}
          metalness={0.25}
          emissive={emissive}
          emissiveIntensity={0.5}
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
          roughness={0.3}
          metalness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
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
          roughness={0.35}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={0.35}
        />
      </mesh>
    </Float>
  );
}

function Scene({ spin, colors }: { spin: boolean; colors: SceneColors }) {
  return (
    <>
      <ambientLight intensity={0.65} />
      <pointLight position={[5, 5, 5]} intensity={90} color={colors.blush} />
      <pointLight position={[-5, -3, -5]} intensity={80} color={colors.lavender} />
      <pointLight position={[0, -4, 3]} intensity={45} color={colors.rosegold} />
      <directionalLight position={[2, 4, 4]} intensity={0.5} color="#ffffff" />

      <SlowSpin speed={spin ? 0.06 : 0}>
        <CenterpieceKnot color={colors.lavender} emissive={colors.lavenderDeep} />
      </SlowSpin>

      <FloatingSphere position={[-1.9, 1.5, 0.4]} scale={0.42} color={colors.blush} speed={1.6} />
      <FloatingSphere position={[1.9, -1.3, 0.5]} scale={0.32} color={colors.rosegold} speed={2} />
      <FloatingSphere position={[1.7, 1.6, -0.2]} scale={0.22} color={colors.cyan} speed={2.4} />
      <FloatingRing position={[-1.8, -1.4, 0.3]} scale={0.48} color={colors.rosegold} />

      <Sparkles count={55} scale={7} size={2.2} speed={0.3} opacity={0.65} color={colors.lavender} />
    </>
  );
}

type SceneColors = {
  lavender: string;
  lavenderDeep: string;
  blush: string;
  rosegold: string;
  cyan: string;
};

export default function HeroScene() {
  const reducedMotion = usePrefersReducedMotion();
  const { preset } = useThemeAccent();

  const colors: SceneColors = {
    lavender: preset.colors.lavender,
    lavenderDeep: preset.colors.lavenderDeep,
    blush: preset.colors.blush,
    rosegold: preset.colors.rosegold,
    cyan: preset.colors.cyan,
  };

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.4], fov: 44 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <Suspense fallback={null}>
        <Scene spin={!reducedMotion} colors={colors} />
      </Suspense>
    </Canvas>
  );
}
