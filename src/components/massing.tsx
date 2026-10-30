import { ContactShadows, Environment, Image, MeshReflectorMaterial, RoundedBox } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { frames, pickTarget } from "@/data/photos"

type View = { from: [number, number, number]; to: [number, number, number] }

const views: Record<string, View> = {
  home: { from: [2.6, 2.15, 8.6], to: [-0.15, 1.15, 0] },
  festival: { from: [2.2, 2.2, 8.8], to: [2.1, 1.25, 0.15] },
  "main-site": { from: [2.4, 2.15, 8.5], to: [1.5, 1.35, -0.55] },
  "my-mi": { from: [1.6, 2.2, 8.4], to: [-1.8, 0.55, -1.2] },
  rooms: { from: [3.4, 2.4, 8.2], to: [0.2, 0.4, -2.2] },
  events: { from: [1.8, 2.15, 8.7], to: [2.1, 1.35, 1.2] },
  infollion: { from: [3.6, 2.25, 8.3], to: [1.9, 0.5, -1.3] },
  passes: { from: [2.0, 2.1, 8.8], to: [0.15, 0.85, 2.4] },
  leadership: { from: [2.5, 2.2, 8.5], to: [3.2, 1.2, -1.4] },
  stack: { from: [4.0, 2.55, 9.0], to: [0.4, 0.7, -0.2] },
  contact: { from: [1.8, 2.15, 8.4], to: [-2.8, 1.25, -1.2] },
}

const home = views.home

function useReduced() {
  const reduce = useRef(false)
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])
  return reduce
}

function Panel({
  url,
  position,
  scale,
  rotation = [0, 0, 0],
  active,
  onPick,
}: {
  url: string
  position: [number, number, number]
  scale: [number, number]
  rotation?: [number, number, number]
  active: boolean
  onPick?: () => void
}) {
  const glow = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((_, delta) => {
    if (!glow.current) return
    glow.current.emissiveIntensity = THREE.MathUtils.damp(glow.current.emissiveIntensity, active ? 0.32 : 0.05, 6, delta)
  })

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.035]} castShadow>
        <boxGeometry args={[scale[0] + 0.08, scale[1] + 0.08, 0.05]} />
        <meshStandardMaterial
          ref={glow}
          color="#1a1713"
          roughness={0.38}
          metalness={0.42}
          emissive="#f25c2a"
          emissiveIntensity={0.05}
        />
      </mesh>
      <Image
        url={url}
        scale={scale}
        radius={0.012}
        toneMapped
        zoom={1}
        onClick={(event) => {
          event.stopPropagation()
          onPick?.()
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          if (onPick) document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          document.body.style.cursor = ""
        }}
      />
    </group>
  )
}

function Rig({ focus }: { focus: string }) {
  const { camera } = useThree()
  const reduce = useReduced()
  const look = useRef(new THREE.Vector3(...home.to))
  const goalPos = useRef(new THREE.Vector3(...home.from))
  const goalLook = useRef(new THREE.Vector3(...home.to))

  useEffect(() => {
    const view = views[focus] ?? home
    goalPos.current.set(...view.from)
    goalLook.current.set(...view.to)
    if (reduce.current) {
      camera.position.copy(goalPos.current)
      look.current.copy(goalLook.current)
      camera.lookAt(look.current)
    }
  }, [camera, focus, reduce])

  useFrame((_, delta) => {
    const lambda = reduce.current ? 40 : 2.1
    const t = 1 - Math.exp(-lambda * delta)
    camera.position.lerp(goalPos.current, t)
    look.current.lerp(goalLook.current, t)
    camera.lookAt(look.current)
  })

  return null
}

function Floor() {
  const width = useThree((state) => state.size.width)
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[32, 24]} />
      <MeshReflectorMaterial
        blur={[220, 70]}
        resolution={width < 700 ? 192 : 384}
        mixBlur={0.9}
        mixStrength={12}
        roughness={0.88}
        depthScale={0.28}
        minDepthThreshold={0.35}
        maxDepthThreshold={1.3}
        color="#191512"
        metalness={0.18}
        mirror={0.08}
      />
    </mesh>
  )
}

function Systems({ focus, onPick }: { focus: string; onPick: (id: string) => void }) {
  return (
    <>
      {Array.from({ length: 7 }, (_, index) => (
        <RoundedBox
          key={`portal-${index}`}
          args={[0.12, 0.64, 0.38]}
          radius={0.03}
          smoothness={3}
          position={[-2.4 + index * 0.22, 0.38, -1.55]}
          castShadow
          receiveShadow
          onClick={(event) => {
            event.stopPropagation()
            onPick("my-mi")
          }}
        >
          <meshStandardMaterial
            color={focus === "my-mi" ? "#d9c4a8" : "#b7a790"}
            roughness={0.74}
            emissive="#f25c2a"
            emissiveIntensity={focus === "my-mi" ? 0.18 : 0}
          />
        </RoundedBox>
      ))}
      <RoundedBox
        args={[4.8, 0.4, 0.7]}
        radius={0.08}
        smoothness={3}
        position={[0.1, 0.22, -2.7]}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation()
          onPick("rooms")
        }}
      >
        <meshStandardMaterial
          color={focus === "rooms" ? "#cbb39a" : "#8c7a66"}
          roughness={0.82}
          emissive="#f25c2a"
          emissiveIntensity={focus === "rooms" ? 0.16 : 0}
        />
      </RoundedBox>
      {[
        [-0.55, 0.72, 3.05],
        [0.55, 0.72, 3.05],
      ].map((position) => (
        <RoundedBox
          key={position.join("-")}
          args={[0.14, 1.4, 0.14]}
          radius={0.04}
          smoothness={3}
          position={position as [number, number, number]}
          castShadow
          onClick={(event) => {
            event.stopPropagation()
            onPick("passes")
          }}
        >
          <meshStandardMaterial color="#c4b6a3" roughness={0.7} />
        </RoundedBox>
      ))}
      <RoundedBox
        args={[1.42, 0.12, 0.18]}
        radius={0.04}
        smoothness={3}
        position={[0, 1.44, 3.05]}
        castShadow
        onClick={(event) => {
          event.stopPropagation()
          onPick("passes")
        }}
      >
        <meshStandardMaterial
          color="#c4b6a3"
          roughness={0.65}
          emissive="#f25c2a"
          emissiveIntensity={focus === "passes" ? 0.2 : 0}
        />
      </RoundedBox>
      {Array.from({ length: 5 }, (_, index) => (
        <RoundedBox
          key={`sheet-${index}`}
          args={[1.05, 0.045, 0.7]}
          radius={0.02}
          smoothness={2}
          position={[1.85 + index * 0.05, 0.14 + index * 0.09, -1.7]}
          rotation={[0, 0.16, 0.03 * index]}
          castShadow
          onClick={(event) => {
            event.stopPropagation()
            onPick("infollion")
          }}
        >
          <meshStandardMaterial
            color="#e6dccb"
            roughness={0.58}
            emissive="#f25c2a"
            emissiveIntensity={focus === "infollion" && index === 2 ? 0.14 : 0}
          />
        </RoundedBox>
      ))}
    </>
  )
}

function Scene({ focus, onPick }: { focus: string; onPick: (id: string) => void }) {
  return (
    <>
      <color attach="background" args={["#14110e"]} />
      <fog attach="fog" args={["#14110e", 16, 32]} />
      <hemisphereLight args={["#f4eadc", "#2a221c", 0.5]} />
      <directionalLight
        position={[6, 9, 6]}
        intensity={1.35}
        color="#fff3e4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 3, 1]} intensity={0.35} color="#9bb6c9" />
      <Environment preset="warehouse" environmentIntensity={0.22} />
      <Floor />
      <ContactShadows opacity={0.32} scale={20} blur={2.8} far={6} />

      {frames.map((frame) => (
        <Panel
          key={frame.id}
          url={frame.url}
          position={frame.position}
          scale={frame.scale}
          rotation={frame.rotation}
          active={
            focus === frame.id ||
            (focus === "home" && frame.id === "stack") ||
            (focus === "about" && frame.id === "festival") ||
            (focus === "contact" && frame.id === "my-mi")
          }
          onPick={() => onPick(pickTarget(frame.id))}
        />
      ))}

      <Systems focus={focus} onPick={onPick} />
      <Rig focus={focus} />
    </>
  )
}

export function Massing({ focus, onPick }: { focus: string; onPick: (id: string) => void }) {
  return (
    <Canvas
      shadows
      className="h-full w-full"
      style={{ touchAction: "pan-y" }}
      dpr={[1, 1.75]}
      camera={{ fov: 40, near: 0.2, far: 70, position: home.from }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.98 }}
    >
      <Scene focus={focus} onPick={onPick} />
    </Canvas>
  )
}
