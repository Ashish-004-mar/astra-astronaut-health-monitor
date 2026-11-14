import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Stars } from "@react-three/drei";

function EarthMesh() {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Load Earth textures
  const [colorMap, cloudsMap, lightsMap, specMap] = useLoader(THREE.TextureLoader, [
    "./textures/earth.jpg",
    "./textures/earth_clouds.png",
    "./textures/earth_lights.png",
    "./textures/earth_specular.jpg",
  ]);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.08;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.095;
    }
  });

  return (
    <group>
      {/* Earth Surface Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.53, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmospheric Rayleigh Blue Glow */}
      <mesh>
        <sphereGeometry args={[2.62, 64, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function SatelliteOrbit() {
  const satRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (satRef.current) {
      const t = clock.getElapsedTime() * 0.4;
      satRef.current.position.x = Math.cos(t) * 3.8;
      satRef.current.position.z = Math.sin(t) * 3.8;
      satRef.current.position.y = Math.sin(t * 1.5) * 1.1;
    }
  });

  return (
    <group ref={satRef}>
      <mesh>
        <boxGeometry args={[0.08, 0.04, 0.16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Cyan Beacon Point */}
      <pointLight color="#38bdf8" intensity={1.5} distance={1.2} />
    </group>
  );
}

export default function RotatingEarthSection() {
  return (
    <section className="earth-section" id="earth">
      <div className="section-badge">// 3D PLANETARY ENVIRONMENT</div>
      <h2 className="section-title">CREW ORBITAL OVERVIEW</h2>
      <p className="section-subtitle">
        Continuous real-time planetary perspective rendered in WebGL with multi-layer surface textures,
        differential cloud velocity, and space weather telemetry correlation.
      </p>

      <div className="earth-canvas-container">
        <Canvas
          camera={{ position: [0, 0, 7.2], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.4} color="#cfe2f0" />
          <directionalLight position={[6, 3, 5]} intensity={1.8} color="#ffffff" />
          <Stars radius={90} depth={40} count={1200} factor={2.5} saturation={0} fade speed={0.15} />
          
          <Suspense fallback={null}>
            <EarthMesh />
            <SatelliteOrbit />
          </Suspense>
        </Canvas>

        {/* Live HUD telemetry overlays */}
        <div className="earth-telemetry-hud">
          <div className="hud-item">
            <span>ORBIT: LEO 408 KM</span>
          </div>
          <div className="hud-item">
            <span>SOLAR FLUX: NOMINAL</span>
          </div>
          <div className="hud-item">
            <span>EARTH ROTATION: 0.08 RAD/S</span>
          </div>
        </div>
      </div>
    </section>
  );
}
