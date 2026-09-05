"use client";

import { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const COLORS = [
  { name: "Purple", value: "#7C3AED" },
  { name: "Green", value: "#22C55E" },
  { name: "Orange", value: "#F97316" },
  { name: "Blue", value: "#3B82F6" },
];

const MATERIALS = ["standard", "wireframe"] as const;

function Shape({
  color,
  wireframe,
}: {
  color: string;
  wireframe: boolean;
}) {
  return (
    <mesh rotation={[0.4, 0.4, 0]}>
      <torusKnotGeometry args={[1, 0.35, 128, 32]} />
      <meshStandardMaterial color={color} wireframe={wireframe} />
    </mesh>
  );
}

export default function ThreeDDemoPage() {
  const [color, setColor] = useState(COLORS[0].value);
  const [materialIndex, setMaterialIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-2">3D Configurator</h1>
        <p className="text-sm text-gray-500">
          Drag to rotate. Change the color and material style below.
        </p>
      </div>

      <div className="w-full max-w-lg aspect-square rounded-xl border bg-gray-50 overflow-hidden">
        {prefersReducedMotion ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm text-center p-6">
            3D scene hidden because "reduce motion" is enabled on this device.
            <br />
            (Static preview: a torus knot shape in {color})
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                Loading 3D scene...
              </div>
            }
          >
            <Canvas camera={{ position: [0, 0, 4] }} dpr={[1, 1.5]}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[3, 3, 3]} intensity={1} />
              <Shape color={color} wireframe={materialIndex === 1} />
              <OrbitControls enablePan={false} />
            </Canvas>
          </Suspense>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              aria-label={`Set color to ${c.name}`}
              className={`h-8 w-8 rounded-full border-2 ${
                color === c.value ? "border-black scale-110" : "border-gray-300"
              } transition-transform`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>

        <div className="flex gap-2">
          {MATERIALS.map((m, i) => (
            <button
              key={m}
              onClick={() => setMaterialIndex(i)}
              className={`px-4 py-2 rounded-full text-sm border ${
                materialIndex === i
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {m === "standard" ? "Solid" : "Wireframe"}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}