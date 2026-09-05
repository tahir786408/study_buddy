"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Fragment shader: an aurora-style gradient that gently drifts over time
// and leans toward the mouse position for a subtle interactive feel.
const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    // aspect-correct the coordinates so the pattern doesn't stretch
    uv.x *= u_resolution.x / u_resolution.y;

    // mouse influence: pulls the flow field gently toward the cursor
    vec2 mouseInfluence = (u_mouse - 0.5) * 0.3;
    uv += mouseInfluence;

    // layered sine waves drifting over time create the "aurora" flow
    float wave1 = sin(uv.x * 3.0 + u_time * 0.4) * 0.5 + 0.5;
    float wave2 = sin(uv.y * 4.0 - u_time * 0.3 + wave1 * 2.0) * 0.5 + 0.5;
    float pattern = (wave1 + wave2) * 0.5;

    // custom palette — purple to teal, matching the site's brand color
    vec3 colorA = vec3(0.486, 0.231, 0.929); // #7C3AED purple
    vec3 colorB = vec3(0.129, 0.784, 0.706); // teal
    vec3 color = mix(colorA, colorB, pattern);

    // subtle grain pass on top for texture
    float grain = fract(sin(dot(uv * u_time, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.03;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function ShaderPlane({ mouse }: { mouse: React.RefObject<[number, number]> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, gl, viewport } = useThree();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    function handleVisibility() {
      setHidden(document.hidden);
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(size.width, size.height) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  useFrame((state) => {
    if (!materialRef.current || hidden) return; // pause animation when tab is hidden
    materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.u_resolution.value.set(
      size.width * Math.min(gl.getPixelRatio(), 1.5),
      size.height * Math.min(gl.getPixelRatio(), 1.5)
    );
    materialRef.current.uniforms.u_mouse.value.set(mouse.current[0], mouse.current[1]);
  });

    return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// Static fallback shown to users who prefer reduced motion —
// same purple-to-teal palette as the shader, just as a fixed gradient.
function StaticFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(135deg, #7C3AED 0%, #21C8B4 100%)",
      }}
    />
  );
}

export default function HeroShaderPage() {
  const mouse = useRef<[number, number]>([0.5, 0.5]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function handlePointerMove(e: React.PointerEvent) {
    mouse.current = [
      e.clientX / window.innerWidth,
      1 - e.clientY / window.innerHeight,
    ];
  }

  return (
    <main
      onPointerMove={handlePointerMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {prefersReducedMotion ? (
        <StaticFallback />
      ) : (
                <div className="absolute inset-0" style={{ width: "100%", height: "100%" }}>
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: false }}
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <ShaderPlane mouse={mouse} />
          </Canvas>
        </div>
      )}

      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
          Muhammad Tahir Fareed
        </h1>
        <p className="mt-3 text-lg text-white/90 drop-shadow">
          Building StudyBuddy — an AI-powered study companion
        </p>
      </div>
    </main>
  );
}