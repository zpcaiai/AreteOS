"use client";
import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Stars, Billboard, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { ConsNode } from "./Constellation";

const RADIUS = 5;
const GROUP_COLOR: Record<string, string> = {
  Foundation: "#0ea5e9", Direction: "#6366f1", Thinking: "#a855f7",
  Execution: "#10b981", Organization: "#f59e0b", Memory: "#ec4899", Value: "#eab308",
};
const colorFor = (g: string) => GROUP_COLOR[g] ?? "#64748b";

// Deterministic Fibonacci-sphere placement.
function spherePositions(n: number): THREE.Vector3[] {
  const out: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(n - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = golden * i;
    out.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r).multiplyScalar(RADIUS));
  }
  return out;
}

function Shell() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.045; });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[RADIUS - 0.05, 48, 48]} />
      <meshPhysicalMaterial color="#3a5fff" transparent opacity={0.06} roughness={0.1} metalness={0.3} clearcoat={1} wireframe />
    </mesh>
  );
}

function Node({
  node, position, selected, onSelect,
}: { node: ConsNode; position: THREE.Vector3; selected: boolean; onSelect: (n: ConsNode) => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const color = selected ? "#ffe066" : hovered ? "#ffffff" : colorFor(node.group);
  const isValue = node.group === "Value";
  const target = selected ? 1.9 : hovered ? 1.45 : 1;
  useFrame(() => {
    if (ref.current) ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.2);
  });
  const over = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; };
  const out = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = "auto"; };
  const click = (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect(node); };
  const labelPos = position.clone().multiplyScalar(1.16);
  return (
    <group>
      <mesh ref={ref} position={position} onPointerOver={over} onPointerOut={out} onClick={click}>
        <sphereGeometry args={[isValue ? 0.12 : 0.2, 20, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected || hovered ? 0.9 : 0.4} />
      </mesh>
      {(hovered || selected || !isValue) && (
        <Billboard position={[labelPos.x, labelPos.y, labelPos.z]}>
          <Text fontSize={isValue ? 0.22 : 0.3} color={color} anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#020617">
            {node.label}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

function Cloud({ nodes, onSelect, selectedId }: { nodes: ConsNode[]; onSelect: (n: ConsNode) => void; selectedId: string | null }) {
  const ref = useRef<THREE.Group>(null);
  const positions = useMemo(() => spherePositions(nodes.length), [nodes.length]);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.03; });
  return (
    <group ref={ref}>
      <Shell />
      {nodes.map((n, i) => (
        <Node key={n.id} node={n} position={positions[i]} selected={selectedId === n.id} onSelect={onSelect} />
      ))}
    </group>
  );
}

export default function ConstellationScene({
  nodes, onSelect, selectedId, onMiss,
}: { nodes: ConsNode[]; onSelect: (n: ConsNode) => void; selectedId: string | null; onMiss: () => void }) {
  return (
    <Canvas style={{ width: "100%", height: "100%", display: "block" }} camera={{ position: [0, 0, 11], fov: 55 }} dpr={[1, 2]} onPointerMissed={onMiss}>
      <color attach="background" args={["#060b18"]} />
      <fog attach="fog" args={["#060b18", 13, 28]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 7, 4]} intensity={1.3} />
      <pointLight position={[-6, -5, -3]} intensity={1.1} color="#5577ff" />
      <Stars radius={45} depth={35} count={2400} factor={3.2} saturation={0} fade speed={0.3} />
      <Cloud nodes={nodes} onSelect={onSelect} selectedId={selectedId} />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={22} />
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.18} luminanceSmoothing={0.5} />
      </EffectComposer>
    </Canvas>
  );
}
