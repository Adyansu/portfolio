"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

const PLATINUM = "#e5e4e2";
const SAPPHIRE = "#1f4fd1";

const BAND_RADIUS = 1.25;
const BAND_TUBE = 0.2;
const TOP = BAND_RADIUS + BAND_TUBE;

/** Round-brilliant-ish gem profile, lathed into a faceted solid. */
function useGemGeometry() {
  return useMemo(() => {
    const profile = [
      new THREE.Vector2(0, -0.42), // culet
      new THREE.Vector2(0.34, -0.02), // pavilion → girdle
      new THREE.Vector2(0.36, 0.02), // girdle
      new THREE.Vector2(0.24, 0.2), // crown → table edge
      new THREE.Vector2(0, 0.2), // table centre
    ];
    const geo = new THREE.LatheGeometry(profile, 12);
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Ring({ animate }: { animate: boolean }) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const gem = useGemGeometry();

  useFrame((state, delta) => {
    if (spin.current && animate) spin.current.rotation.y += delta * 0.4;
    if (tilt.current) {
      // Ease the whole ring toward the pointer (pointer spans the full page).
      const { x, y } = state.pointer;
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, 0.18 - y * 0.35, 3, delta);
      tilt.current.rotation.z = THREE.MathUtils.damp(tilt.current.rotation.z, -x * 0.25, 3, delta);
    }
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>
        {/* Band */}
        <mesh castShadow>
          <torusGeometry args={[BAND_RADIUS, BAND_TUBE, 64, 220]} />
          <meshPhysicalMaterial
            color={PLATINUM}
            metalness={1}
            roughness={0.12}
            clearcoat={0.8}
            clearcoatRoughness={0.08}
            envMapIntensity={1.6}
          />
        </mesh>

        {/* Setting (bezel) */}
        <mesh position={[0, TOP + 0.06, 0]}>
          <cylinderGeometry args={[0.32, 0.18, 0.22, 48]} />
          <meshPhysicalMaterial color={PLATINUM} metalness={1} roughness={0.16} envMapIntensity={1.6} />
        </mesh>

        {/* Prongs */}
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.3, TOP + 0.36, Math.sin(a) * 0.3]}
              rotation={[Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35]}
            >
              <capsuleGeometry args={[0.035, 0.3, 4, 12]} />
              <meshPhysicalMaterial color={PLATINUM} metalness={1} roughness={0.16} />
            </mesh>
          );
        })}

        {/* Sapphire */}
        <mesh geometry={gem} position={[0, TOP + 0.6, 0]}>
          {/* Opaque faceted gem: transmission renders black on a transparent canvas.
              Sapphire is corundum, like ruby, so the IOR stays 1.77. */}
          <meshPhysicalMaterial
            color={SAPPHIRE}
            emissive="#071a5c"
            emissiveIntensity={0.4}
            metalness={0.15}
            roughness={0.04}
            clearcoat={1}
            clearcoatRoughness={0}
            ior={1.77}
            specularIntensity={1}
            specularColor="#dbe7ff"
            envMapIntensity={2.4}
            flatShading
          />
        </mesh>
      </group>
    </group>
  );
}

export default function RingScene({
  reducedMotion,
  onReady,
}: {
  reducedMotion: boolean;
  onReady?: () => void;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  // Stop rendering entirely when the hero is scrolled out of view.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "100px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animate = !reducedMotion;

  return (
    <div
      ref={wrapper}
      className="absolute inset-0 transition-opacity duration-1000"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.2, 8], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={inView ? (animate ? "always" : "demand") : "never"}
        eventSource={typeof document !== "undefined" ? document.documentElement : undefined}
        eventPrefix="client"
        onCreated={() => {
          setReady(true);
          onReady?.();
        }}
        aria-hidden
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={1.4} />

        <Float
          speed={animate ? 1.4 : 0}
          rotationIntensity={animate ? 0.25 : 0}
          floatIntensity={animate ? 0.7 : 0}
        >
          <group position={[0, -0.35, 0]}>
            <Ring animate={animate} />
          </group>
        </Float>

        {animate && (
          <Sparkles count={50} scale={[5, 4, 3]} size={2.2} speed={0.35} color="#dfe6f5" opacity={0.85} />
        )}

        <ContactShadows
          position={[0, -1.85, 0]}
          opacity={0.35}
          scale={7}
          blur={2.6}
          far={3}
          color="#2e3340"
          resolution={256}
          frames={animate ? Infinity : 1}
        />

        {/* Procedural studio lighting: no HDR download needed */}
        <Environment resolution={256}>
          {/* Neutral grey base so polished platinum reflects cool steel tones, not black or bronze */}
          <color attach="background" args={["#767a84"]} />
          <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[0, 0, 6]} scale={[10, 4, 1]} />
          <Lightformer form="rect" intensity={1.5} color="#eef2ff" position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
          <group rotation={[-Math.PI / 3, 0, 1]}>
            <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
            <Lightformer form="ring" color="#ffffff" intensity={6} onUpdate={(self) => self.lookAt(0, 0, 0)} position={[10, 10, 0]} scale={10} />
          </group>
        </Environment>
      </Canvas>
    </div>
  );
}
