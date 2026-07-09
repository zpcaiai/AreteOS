"use client";

/**
 * EmotionPlanetScene — the 3D "emotion planet": 171 feeling-nodes placed on a
 * sphere (semantically-near emotions sit near each other), rendered with
 * react-three-fiber. Ported from an earlier emotion-sphere and rebuilt to match
 * AreteOS conventions (TypeScript, drei, postprocessing, slate palette).
 *
 * Globe labels are localized (zh in zh-locale) and rendered with a subsetted
 * Noto Sans CJK SC webfont (public/fonts/emotion-cjk.woff) — drei's default font
 * can't draw CJK. Hover shows the zh · en pair; the detail panel shows both.
 */

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Stars, Billboard, Text, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { EmotionNode } from "@/data/emotionSphere";

const RADIUS = 4.18;

/** A visually distinct color for each node (rainbow by index), matching the original. */
export function nodeColor(index: number, total: number): string {
  const hue = (index / Math.max(total, 1)) * 360;
  const sat = 70 + (index % 5) * 4;
  const lit = 62 + (index % 3) * 5;
  return `hsl(${hue.toFixed(1)},${sat}%,${lit}%)`;
}

/** Normalize a raw (x,y,z) onto the sphere surface; null if degenerate. */
function onSphere(n: { x: number; y: number; z: number }, scale = RADIUS): THREE.Vector3 | null {
  const v = new THREE.Vector3(n.x ?? 0, n.y ?? 0, n.z ?? 0);
  if (v.length() < 1e-6) return null;
  return v.normalize().multiplyScalar(scale);
}

function Shell() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.045;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[RADIUS - 0.06, 48, 48]} />
      <meshPhysicalMaterial color="#3a5fff" transparent opacity={0.055} roughness={0.1} metalness={0.3} clearcoat={1} wireframe />
    </mesh>
  );
}

function EmotionDot({
  node,
  position,
  color,
  selected,
  hovered,
  label,
  font,
  onSelect,
  onHover,
}: {
  node: EmotionNode;
  position: THREE.Vector3;
  color: string;
  selected: boolean;
  hovered: boolean;
  label: string;
  font: string;
  onSelect: (n: EmotionNode) => void;
  onHover: (n: EmotionNode | null) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const target = selected ? 1.9 : hovered ? 1.45 : 1;
  useFrame(() => {
    if (ref.current) ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.2);
  });
  const dotColor = selected ? "#ffe066" : hovered ? "#ffffff" : color;
  const labelColor = dotColor;
  const fontSize = selected ? 0.24 : hovered ? 0.21 : 0.155;
  const labelPos = position.clone().multiplyScalar(1.24);

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(node);
    document.body.style.cursor = "pointer";
  };
  const out = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(null);
    document.body.style.cursor = "auto";
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(node);
  };

  return (
    <group>
      <mesh ref={ref} position={position} onPointerOver={over} onPointerOut={out} onClick={click}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial color={dotColor} emissive={dotColor} emissiveIntensity={selected || hovered ? 0.9 : 0.4} />
      </mesh>
      <Billboard position={[labelPos.x, labelPos.y, labelPos.z]} follow>
        <Text
          font={font}
          fontSize={fontSize}
          color={labelColor}
          anchorX="center"
          anchorY="middle"
          outlineColor="#020610"
          outlineWidth={selected || hovered ? 0.018 : 0.008}
          fillOpacity={selected || hovered ? 1 : 0.9}
          onPointerOver={over}
          onPointerOut={out}
          onClick={click}
        >
          {label}
        </Text>
      </Billboard>
      {hovered && !selected && (
        <Html position={[labelPos.x, labelPos.y, labelPos.z]} center distanceFactor={9} zIndexRange={[40, 0]} pointerEvents="none">
          <div className="pointer-events-none -translate-y-7 whitespace-nowrap rounded-md border border-slate-700 bg-slate-950/90 px-2 py-1 text-xs text-slate-100 shadow-lg">
            {[node.zh, node.en].filter(Boolean).join(" · ")}
          </div>
        </Html>
      )}
    </group>
  );
}

function Cloud({
  nodes,
  selectedId,
  hoveredId,
  labelFor,
  font,
  onSelect,
  onHover,
}: {
  nodes: EmotionNode[];
  selectedId: string | null;
  hoveredId: string | null;
  labelFor: (n: EmotionNode) => string;
  font: string;
  onSelect: (n: EmotionNode) => void;
  onHover: (n: EmotionNode | null) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const placed = useMemo(
    () =>
      nodes
        .map((n, i) => ({ node: n, i, pos: onSphere(n) }))
        .filter((p): p is { node: EmotionNode; i: number; pos: THREE.Vector3 } => p.pos !== null),
    [nodes],
  );
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.033;
  });
  return (
    <group ref={ref}>
      <Shell />
      {placed.map(({ node, i, pos }) => (
        <EmotionDot
          key={node.id}
          node={node}
          position={pos}
          color={nodeColor(i, placed.length)}
          selected={selectedId === node.id}
          hovered={hoveredId === node.id}
          label={labelFor(node)}
          font={font}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </group>
  );
}

export default function EmotionPlanetScene({
  nodes,
  selectedId,
  hoveredId,
  labelFor,
  font,
  onSelect,
  onHover,
  onMiss,
}: {
  nodes: EmotionNode[];
  selectedId: string | null;
  hoveredId: string | null;
  labelFor: (n: EmotionNode) => string;
  font: string;
  onSelect: (n: EmotionNode) => void;
  onHover: (n: EmotionNode | null) => void;
  onMiss: () => void;
}) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%", display: "block" }}
      camera={{ position: [0, 0, 8.8], fov: 48 }}
      dpr={[1, 2]}
      onPointerMissed={onMiss}
    >
      <color attach="background" args={["#060b18"]} />
      <fog attach="fog" args={["#060b18", 9, 20]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 7, 4]} intensity={1.3} />
      <pointLight position={[-6, -5, -3]} intensity={1.1} color="#5577ff" />
      <Stars radius={38} depth={30} count={2500} factor={3.1} saturation={0} fade speed={0.3} />
      <Cloud nodes={nodes} selectedId={selectedId} hoveredId={hoveredId} labelFor={labelFor} font={font} onSelect={onSelect} onHover={onHover} />
      <OrbitControls enablePan={false} minDistance={2.8} maxDistance={18} />
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.18} luminanceSmoothing={0.5} />
      </EffectComposer>
    </Canvas>
  );
}
