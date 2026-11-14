import {
  Suspense,
  useMemo,
  useRef,
  useEffect,
  Component,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  useTexture,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "../state/store";
import type { Region } from "../types";

/**
 * Configuration for the cinematic 3D Earth planet
 */
export const EARTH_CONFIG = {
  /** Complete one full 360-degree rotation every 50 seconds (clearly, visibly rotating in real time) */
  rotationPeriodSeconds: 50,
  /** Clouds rotate slightly faster eastward than the planet surface */
  cloudSpeedMultiplier: 1.18,
  /** Primary directional sunlight vector in world coordinates (from upper-left) */
  sunDirection: new THREE.Vector3(-4.8, 3.8, 5.0).normalize(),
  /** Atmosphere Rayleigh rim color */
  atmosphereColor: new THREE.Vector3(0.24, 0.65, 0.98),
  /** Peak atmospheric glow intensity */
  atmosphereIntensity: 1.45,
};

// Shaders for Earth surface (Day / Night blending, Specular ocean glint, and Fresnel limb)
const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const earthFragmentShader = `
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform sampler2D uSpecularMap;
  uniform vec3 uSunDirection;
  uniform vec3 uCameraPosition;
  uniform float uOpacity;
  uniform float uRotation;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    vec3 sunDir = normalize(uSunDirection);

    // Continuous dynamic texture rotation around the planetary axis
    float uOffset = uRotation / 6.28318530718;
    vec2 rotatedUv = vec2(fract(vUv.x - uOffset), vUv.y);

    vec4 dayTex = texture2D(uDayMap, rotatedUv);
    vec4 nightTex = texture2D(uNightMap, rotatedUv);
    float specStrength = texture2D(uSpecularMap, rotatedUv).r;

    float NdotL = dot(normal, sunDir);

    // Natural day/night terminator transition
    float dayFactor = smoothstep(-0.16, 0.22, NdotL);
    float nightFactor = 1.0 - smoothstep(-0.25, 0.12, NdotL);

    // Day side lighting
    vec3 dayColor = dayTex.rgb * (dayFactor * 1.18 + 0.04);

    // Night side city lights with warm golden glow
    vec3 nightColor = nightTex.rgb * vec3(1.3, 1.1, 0.75) * (nightFactor * 1.7);

    // Specular ocean reflections (Blinn-Phong)
    vec3 halfVector = normalize(sunDir + viewDir);
    float NdotH = max(dot(normal, halfVector), 0.0);
    float spec = pow(NdotH, 36.0) * specStrength * dayFactor;
    vec3 specularGlint = vec3(0.85, 0.95, 1.0) * spec * 1.6;

    // Atmospheric limb scattering on the illuminated horizon
    float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
    float rim = pow(fresnel, 3.2) * max(NdotL + 0.2, 0.0);
    vec3 rimColor = vec3(0.28, 0.65, 0.98) * rim * 0.9;

    vec3 finalColor = dayColor + nightColor + specularGlint + rimColor;
    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

// Shaders for dynamic Cloud Layer
const cloudsVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const cloudsFragmentShader = `
  uniform sampler2D uCloudMap;
  uniform vec3 uSunDirection;
  uniform vec3 uCameraPosition;
  uniform float uOpacity;
  uniform float uCloudRotation;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    vec3 sunDir = normalize(uSunDirection);

    // Continuous dynamic cloud rotation (moving faster than the land)
    float cloudOffset = uCloudRotation / 6.28318530718;
    vec2 rotatedUv = vec2(fract(vUv.x - cloudOffset), vUv.y);

    vec4 cloudTex = texture2D(uCloudMap, rotatedUv);
    float NdotL = dot(normal, sunDir);

    // Clouds receive directional sunlight; unlit side forms subtle silhouette
    float sunFactor = smoothstep(-0.15, 0.28, NdotL);
    vec3 cloudColor = vec3(0.96, 0.98, 1.0) * (sunFactor * 0.94 + 0.04);

    // Soft opacity with limb depth
    float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
    float alpha = cloudTex.r * uOpacity * (0.85 + fresnel * 0.15);

    gl_FragColor = vec4(cloudColor, alpha);
  }
`;

// Shaders for outer Atmospheric Glow (Rayleigh scattering halo)
const atmosphereVertexShader = `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const atmosphereFragmentShader = `
  uniform vec3 uSunDirection;
  uniform vec3 uCameraPosition;
  uniform vec3 uAtmosphereColor;
  uniform float uIntensity;

  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    vec3 sunDir = normalize(uSunDirection);

    // Inverted Fresnel for outer halo
    float VdotN = max(dot(viewDir, normal), 0.0);
    float rim = pow(1.0 - VdotN, 3.6);

    // Atmosphere glows intensely on the sunlit limb, tapering to dark space
    float NdotL = dot(normal, sunDir);
    float sunBias = smoothstep(-0.25, 0.5, NdotL);

    float alpha = rim * (sunBias * 0.88 + 0.12) * uIntensity;
    vec3 color = mix(uAtmosphereColor, vec3(0.7, 0.92, 1.0), sunBias * 0.45);

    gl_FragColor = vec4(color, alpha);
  }
`;

/**
 * Realistic 3D Earth system with multi-layer surface, moving clouds, and Rayleigh atmosphere glow
 */
function Earth({
  large = false,
  moving = true,
}: {
  large?: boolean;
  moving?: boolean;
}) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const rotationAngle = useRef(0);
  const cloudRotationAngle = useRef(0);

  // Load textures
  const [dayMap, nightMap, cloudsMap, specularMap] = useTexture([
    "/textures/earth.jpg",
    "/textures/earth_lights.png",
    "/textures/earth_clouds.png",
    "/textures/earth_specular.jpg",
  ]);

  useEffect(() => {
    [dayMap, nightMap, cloudsMap, specularMap].forEach((tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    });
  }, [dayMap, nightMap, cloudsMap, specularMap]);

  // Planet radius based on large view mode
  const radius = large ? 3.6 : 4.7;

  // Custom Shader Materials (fully initialized with 100% opacity)
  const earthMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: earthVertexShader,
        fragmentShader: earthFragmentShader,
        uniforms: {
          uDayMap: { value: dayMap },
          uNightMap: { value: nightMap },
          uSpecularMap: { value: specularMap },
          uSunDirection: { value: EARTH_CONFIG.sunDirection },
          uCameraPosition: { value: new THREE.Vector3(0, 0, 8) },
          uOpacity: { value: 1.0 },
          uRotation: { value: 0.0 },
        },
        transparent: true,
      }),
    [dayMap, nightMap, specularMap],
  );

  const cloudsMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: cloudsVertexShader,
        fragmentShader: cloudsFragmentShader,
        uniforms: {
          uCloudMap: { value: cloudsMap },
          uSunDirection: { value: EARTH_CONFIG.sunDirection },
          uCameraPosition: { value: new THREE.Vector3(0, 0, 8) },
          uOpacity: { value: 0.85 },
          uCloudRotation: { value: 0.0 },
        },
        transparent: true,
        depthWrite: false,
      }),
    [cloudsMap],
  );

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        uniforms: {
          uSunDirection: { value: EARTH_CONFIG.sunDirection },
          uCameraPosition: { value: new THREE.Vector3(0, 0, 8) },
          uAtmosphereColor: { value: EARTH_CONFIG.atmosphereColor },
          uIntensity: { value: EARTH_CONFIG.atmosphereIntensity },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );

  // Delta-time based continuous rotation and camera position update
  useFrame(({ camera }, dt) => {
    // Keep camera position updated for accurate lighting/Fresnel calculations
    earthMaterial.uniforms.uCameraPosition.value.copy(camera.position);
    cloudsMaterial.uniforms.uCameraPosition.value.copy(camera.position);
    atmosphereMaterial.uniforms.uCameraPosition.value.copy(camera.position);

    if (moving) {
      const baseSpeed = (Math.PI * 2) / EARTH_CONFIG.rotationPeriodSeconds;
      const step = dt * baseSpeed;
      const cloudStep = dt * (baseSpeed * EARTH_CONFIG.cloudSpeedMultiplier);

      rotationAngle.current = (rotationAngle.current + step) % (Math.PI * 2);
      cloudRotationAngle.current =
        (cloudRotationAngle.current + cloudStep) % (Math.PI * 2);

      // 1. Update shader texture rotation coordinates
      earthMaterial.uniforms.uRotation.value = rotationAngle.current;
      cloudsMaterial.uniforms.uCloudRotation.value = cloudRotationAngle.current;

      // 2. Also rotate 3D mesh objects in scene graph
      if (earthRef.current) {
        earthRef.current.rotation.y = rotationAngle.current;
      }
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y = cloudRotationAngle.current;
      }
    }
  });

  return (
    <group
      position={large ? [0, -0.5, -3] : [3.8, -2.8, -7]}
      rotation={[0.36, 0, 0.16]}
    >
      {/* 1. Earth Planetary Globe */}
      <mesh ref={earthRef} material={earthMaterial}>
        <sphereGeometry args={[radius, 64, 64]} />
      </mesh>

      {/* 2. Dynamic Clouds Layer */}
      <mesh ref={cloudsRef} material={cloudsMaterial} scale={1.014}>
        <sphereGeometry args={[radius, 64, 64]} />
      </mesh>

      {/* 3. Atmospheric Rayleigh Scattering Halo */}
      <mesh ref={atmosphereRef} material={atmosphereMaterial} scale={1.04}>
        <sphereGeometry args={[radius, 48, 48]} />
      </mesh>

      {/* 4. Orbital Trajectory Ring */}
      <mesh rotation={[Math.PI / 2.3, 0.25, -0.15]}>
        <torusGeometry args={[radius * 1.25, 0.007, 8, 160]} />
        <meshBasicMaterial color="#4fb6c9" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/**
 * Subtle cosmic dust particles floating in the outer orbital space
 */
function SpaceParticles({ count = 120 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const dist = 5.0 + Math.random() * 7.0;
      pos[i * 3] = dist * Math.cos(phi) * Math.cos(theta);
      pos[i * 3 + 1] = dist * Math.sin(phi);
      pos[i * 3 + 2] = dist * Math.cos(phi) * Math.sin(theta);
    }
    return pos;
  }, [count]);

  useFrame((_, dt) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += dt * 0.012;
      pointsRef.current.rotation.x += dt * 0.006;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        color="#7ed4e6"
        transparent
        opacity={0.45}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Low Earth orbit research satellite
 */
function Satellite({ moving }: { moving: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current && moving) {
      const t = clock.elapsedTime * 0.06;
      g.current.position.set(Math.sin(t) * 6, Math.cos(t) * 2 - 1, -3);
      g.current.rotation.y = t;
    }
  });
  return (
    <group ref={g} position={[-4, 1, -3]} scale={0.15}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#c2d5dc" metalness={0.7} roughness={0.3} />
      </mesh>
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * 1.9, 0, 0]}>
          <boxGeometry args={[2.5, 0.06, 1.2]} />
          <meshStandardMaterial
            color="#275888"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Parallax wrapper that smoothly responds to mouse movement
 */
function ParallaxWrapper({
  children,
  moving = true,
}: {
  children: ReactNode;
  moving?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ pointer }, dt) => {
    if (!group.current || !moving) return;
    const targetX = pointer.x * 0.32;
    const targetY = pointer.y * 0.22;
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      targetX,
      2.0,
      dt,
    );
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      targetY,
      2.0,
      dt,
    );
  });
  return <group ref={group}>{children}</group>;
}

/**
 * Interactive Astronaut suit model with selectable body regions
 */
function Suit({
  selected,
  onSelect,
  moving,
}: {
  selected?: Region;
  onSelect?: (r: Region) => void;
  moving: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current && moving) {
      ref.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.055;
      ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.35) * 0.025;
    }
  });
  const mat = (region: Region) => ({
    color: selected === region ? "#d0eef0" : "#d4d9d7",
    metalness: 0.15,
    roughness: 0.6,
    emissive: selected === region ? "#174d57" : "#000000",
    emissiveIntensity: 0.45,
  });
  return (
    <group ref={ref} rotation={[0, -0.14, 0]}>
      <RoundedBox
        args={[1.15, 1.3, 0.55]}
        radius={0.16}
        position={[0, 0.15, -0.38]}
      >
        <meshStandardMaterial color="#819394" />
      </RoundedBox>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.("Head");
        }}
        position={[0, 1.45, 0]}
      >
        <mesh>
          <sphereGeometry args={[0.64, 40, 32]} />
          <meshStandardMaterial {...mat("Head")} />
        </mesh>
        <mesh position={[0, 0.01, 0.24]} scale={[0.83, 0.77, 0.81]}>
          <sphereGeometry args={[0.62, 40, 32]} />
          <meshStandardMaterial
            color="#0a1824"
            metalness={0.87}
            roughness={0.17}
          />
        </mesh>
        <mesh position={[-0.2, 0.22, 0.675]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.32, 0.035, 0.015]} />
          <meshBasicMaterial color="#83cbd3" />
        </mesh>
        {[-1, 1].map((x) => (
          <mesh
            key={x}
            position={[x * 0.62, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.16, 0.16, 0.1, 20]} />
            <meshStandardMaterial color="#617d85" />
          </mesh>
        ))}
      </group>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.("Chest");
        }}
      >
        <RoundedBox
          args={[1.14, 1.22, 0.7]}
          radius={0.23}
          position={[0, 0.25, 0]}
        >
          <meshStandardMaterial {...mat("Chest")} />
        </RoundedBox>
        <RoundedBox
          args={[0.69, 0.51, 0.12]}
          radius={0.06}
          position={[0, 0.39, 0.4]}
        >
          <meshStandardMaterial
            color="#374d54"
            metalness={0.3}
            roughness={0.5}
          />
        </RoundedBox>
        <mesh position={[0, 0.44, 0.47]}>
          <boxGeometry args={[0.43, 0.14, 0.02]} />
          <meshBasicMaterial color="#74d7cb" />
        </mesh>
        {[-0.19, 0, 0.19].map((x) => (
          <mesh
            key={x}
            position={[x, 0.24, 0.48]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
            <meshStandardMaterial color={x === 0 ? "#f3aa66" : "#a9bcbc"} />
          </mesh>
        ))}
        <mesh position={[0.43, 0.7, 0.34]}>
          <boxGeometry args={[0.16, 0.08, 0.04]} />
          <meshStandardMaterial color="#ed764e" />
        </mesh>
      </group>
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.("Muscles");
        }}
      >
        {[-1, 1].map((x) => (
          <group key={x}>
            <group position={[x * 0.83, 0.22, 0]} rotation={[0, 0, x * 0.22]}>
              <mesh>
                <capsuleGeometry args={[0.235, 0.6, 8, 20]} />
                <meshStandardMaterial {...mat("Muscles")} />
              </mesh>
              <mesh position={[0, -0.43, 0]}>
                <cylinderGeometry args={[0.24, 0.24, 0.12, 24]} />
                <meshStandardMaterial color="#52666b" />
              </mesh>
              <mesh position={[0, -0.7, 0.05]}>
                <capsuleGeometry args={[0.21, 0.22, 8, 20]} />
                <meshStandardMaterial {...mat("Muscles")} />
              </mesh>
            </group>
            <group position={[x * 0.31, -1.1, 0]} rotation={[0, 0, x * -0.06]}>
              <mesh>
                <capsuleGeometry args={[0.27, 0.93, 8, 24]} />
                <meshStandardMaterial {...mat("Muscles")} />
              </mesh>
              <mesh position={[0, -0.22, 0.03]}>
                <boxGeometry args={[0.43, 0.27, 0.47]} />
                <meshStandardMaterial color="#b5c1bf" />
              </mesh>
              <mesh position={[0, -0.72, 0]}>
                <cylinderGeometry args={[0.28, 0.28, 0.14, 24]} />
                <meshStandardMaterial color="#52666b" />
              </mesh>
              <RoundedBox
                args={[0.55, 0.4, 0.83]}
                radius={0.12}
                position={[0, -0.94, 0.16]}
              >
                <meshStandardMaterial color="#b7c4c3" />
              </RoundedBox>
            </group>
          </group>
        ))}
      </group>
      {selected && (
        <mesh
          position={
            selected === "Head"
              ? [0, 1.45, 0.1]
              : selected === "Chest"
                ? [0, 0.35, 0.1]
                : [0, -1, 0.1]
          }
          rotation={[0, 0, 0]}
        >
          <torusGeometry
            args={[selected === "Head" ? 0.74 : 0.8, 0.008, 8, 64]}
          />
          <meshBasicMaterial color="#71e0d2" transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  );
}

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-fallback">
        3D view unavailable · use region controls below
      </div>
    ) : (
      this.props.children
    );
  }
}

function hasWebGL() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * Background Space Canvas: Renders deep cosmic space, stars, particles, and the cinematic 3D Earth
 */
export function SpaceBackground({ large = false }: { large?: boolean }) {
  const { quality } = useStore();
  const supported = useMemo(hasWebGL, []);

  return (
    <div
      className={"space-background " + (large ? "large" : "")}
      aria-hidden="true"
    >
      {supported && (
        <Boundary>
          <Canvas
            dpr={quality === "low" ? 1 : [1, 1.5]}
            camera={{ position: [0, 0, 8], fov: 45 }}
            frameloop="always"
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            {/* Ambient cosmic starlight */}
            <ambientLight intensity={0.4} color="#cfe2f0" />

            {/* Distant stars */}
            <Stars
              radius={90}
              depth={35}
              count={quality === "low" ? 700 : 1800}
              factor={2.2}
              saturation={0}
              fade
              speed={0.15}
            />

            {/* Parallax wrapped Earth and celestial elements */}
            <ParallaxWrapper moving={true}>
              <Suspense fallback={null}>
                <Earth large={large} moving={true} />
              </Suspense>
              <SpaceParticles count={quality === "low" ? 60 : 130} />
              <Satellite moving={true} />
            </ParallaxWrapper>
          </Canvas>
        </Boundary>
      )}
    </div>
  );
}

/**
 * Foreground Astronaut Canvas: Renders interactive suit with lighting synchronized to Earthshine
 */
export default function Astronaut3D({
  landing = false,
  resetKey = 0,
}: {
  landing?: boolean;
  resetKey?: number;
}) {
  const { region, select, quality, reduced } = useStore();
  const supported = useMemo(hasWebGL, []);

  return (
    <div
      className={"astronaut-canvas " + (landing ? "landing-suit" : "")}
      role="img"
      aria-label="Interactive 3D astronaut. Drag to rotate, scroll to zoom. Use the region buttons for keyboard selection."
    >
      {supported ? (
        <Boundary>
          <Canvas
            key={resetKey}
            dpr={quality === "low" ? 1 : [1, 1.5]}
            camera={{ position: [0, 0.1, 6.8], fov: 44 }}
            frameloop="always"
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            {/* Ambient starlight */}
            <ambientLight intensity={1.2} color="#d6ebf5" />

            {/* Primary sunlight matching space direction (upper-left) */}
            <directionalLight
              position={[-4.5, 4.5, 5]}
              intensity={3.2}
              color="#ffffff"
            />

            {/* Secondary fill light */}
            <directionalLight
              position={[2, 3.5, -2]}
              intensity={0.7}
              color="#9ac9e3"
            />

            {/* Earthshine: cool-blue diffuse reflection bounce from Earth in background */}
            <pointLight
              position={[3.5, -2, -1]}
              intensity={18}
              distance={12}
              color="#4fb5e6"
            />

            {/* Interactive astronaut suit */}
            <Suit
              selected={landing ? undefined : region}
              onSelect={landing ? undefined : select}
              moving={!reduced}
            />

            <OrbitControls
              enablePan={false}
              minDistance={4.7}
              maxDistance={8}
              minPolarAngle={0.5}
              maxPolarAngle={2.4}
              enableDamping={!reduced}
            />
          </Canvas>
        </Boundary>
      ) : (
        <div className="scene-fallback">
          3D view unavailable. Select a body region below.
        </div>
      )}
    </div>
  );
}
