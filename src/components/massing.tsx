import {
  ContactShadows,
  Environment,
  Float,
  Html,
  Image,
  MeshReflectorMaterial,
  RoundedBox,
} from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { frames, portrait, standing } from "@/data/photos"

type View = { from: [number, number, number]; to: [number, number, number] }

const views: Record<string, View> = {
  home: { from: [1.85, 1.55, 4.15], to: [-1.55, 1.35, 0.1] },
  festival: { from: [0.35, 1.75, 5.35], to: [2.15, 1.25, 0.45] },
  "main-site": { from: [0.85, 1.55, 3.15], to: [2.55, 1.4, -0.35] },
  "my-mi": { from: [-0.35, 1.65, 2.55], to: [-2.15, 0.55, -1.35] },
  rooms: { from: [3.4, 2.35, 1.15], to: [0.15, 0.35, -2.45] },
  events: { from: [-0.15, 1.55, 5.05], to: [1.1, 1.45, 2.55] },
  infollion: { from: [3.85, 1.85, 0.15], to: [2.05, 0.45, -1.55] },
  passes: { from: [0.05, 1.45, 5.25], to: [0, 0.95, 2.85] },
  leadership: { from: [1.15, 1.65, 1.45], to: [3.05, 1.05, -2.25] },
  stack: { from: [4.25, 2.55, 3.85], to: [0.15, 0.55, -0.15] },
  contact: { from: [-1.15, 1.55, 1.15], to: [-3.35, 1.4, -1.95] },
}

const home = views.home

function useReduced() {
  const reduce = useRef(false)
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])
  return reduce
}

function Photo({
  url,
  position,
  scale,
  rotation = [0, 0, 0],
  active,
  label,
  onPick,
}: {
  url: string
  position: [number, number, number]
  scale: [number, number]
  rotation?: [number, number, number]
  active: boolean
  label?: string
  onPick?: () => void
}) {
  const group = useRef<THREE.Group>(null)
  const glow = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((_, delta) => {
    if (!glow.current) return
    glow.current.emissiveIntensity = THREE.MathUtils.damp(glow.current.emissiveIntensity, active ? 0.55 : 0.08, 6, delta)
    if (!group.current) return
    const z = active ? 0.04 : 0
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, z, 5, delta)
  })

  return (
    <group position={position} rotation={rotation}>
      <group ref={group}>
        <mesh position={[0, 0, -0.03]} castShadow>
          <planeGeometry args={[scale[0] + 0.08, scale[1] + 0.08]} />
          <meshStandardMaterial
            ref={glow}
            color="#1a1612"
            roughness={0.45}
            metalness={0.15}
            emissive="#f25c2a"
            emissiveIntensity={0.08}
          />
        </mesh>
        <Image
          url={url}
          scale={scale}
          radius={0.04}
          toneMapped
          castShadow
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
        {active && label ? (
          <Html center position={[0, scale[1] / 2 + 0.22, 0.02]} distanceFactor={8} zIndexRange={[8, 0]}>
            <div className="scene-label">{label}</div>
          </Html>
        ) : null}
      </group>
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
    const lambda = reduce.current ? 40 : 2.4
    const t = 1 - Math.exp(-lambda * delta)
    camera.position.lerp(goalPos.current, t)
    look.current.lerp(goalLook.current, t)
    camera.lookAt(look.current)
  })

  return null
}

function Floor() {
  const width = useThree((state) => state.size.width)
  const resolution = width < 700 ? 256 : 512
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[28, 22]} />
      <MeshReflectorMaterial
        blur={[280, 90]}
        resolution={resolution}
        mixBlur={0.85}
        mixStrength={18}
        roughness={0.82}
        depthScale={0.35}
        minDepthThreshold={0.35}
        maxDepthThreshold={1.35}
        color="#1c1814"
        metalness={0.28}
        mirror={0.15}
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
          args={[0.12, 0.72, 0.42]}
          radius={0.03}
          smoothness={3}
          position={[-2.55 + index * 0.24, 0.42, -1.45]}
          castShadow
          receiveShadow
          onClick={(event) => {
            event.stopPropagation()
            onPick("my-mi")
          }}
        >
          <meshStandardMaterial
            color={focus === "my-mi" ? "#d9c4a8" : "#c4b6a3"}
            roughness={0.72}
            metalness={0.08}
            emissive="#f25c2a"
            emissiveIntensity={focus === "my-mi" ? 0.28 : 0}
          />
        </RoundedBox>
      ))}
      <RoundedBox
        args={[5.4, 0.46, 0.78]}
        radius={0.08}
        smoothness={3}
        position={[0.15, 0.24, -2.55]}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation()
          onPick("rooms")
        }}
      >
        <meshStandardMaterial
          color={focus === "rooms" ? "#cbb39a" : "#8c7a66"}
          roughness={0.8}
          emissive="#f25c2a"
          emissiveIntensity={focus === "rooms" ? 0.22 : 0}
        />
      </RoundedBox>
      {[
        [-0.62, 0.78, 2.88],
        [0.62, 0.78, 2.88],
      ].map((position) => (
        <RoundedBox
          key={position.join("-")}
          args={[0.16, 1.52, 0.16]}
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
        args={[1.58, 0.14, 0.22]}
        radius={0.04}
        smoothness={3}
        position={[0, 1.56, 2.88]}
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
          emissiveIntensity={focus === "passes" ? 0.3 : 0}
        />
      </RoundedBox>
      {Array.from({ length: 5 }, (_, index) => (
        <RoundedBox
          key={`sheet-${index}`}
          args={[1.18, 0.05, 0.78]}
          radius={0.02}
          smoothness={2}
          position={[2.05 + index * 0.05, 0.16 + index * 0.1, -1.55]}
          rotation={[0, 0.18, 0.04 * index]}
          castShadow
          onClick={(event) => {
            event.stopPropagation()
            onPick("infollion")
          }}
        >
          <meshStandardMaterial
            color="#e6dccb"
            roughness={0.55}
            emissive="#f25c2a"
            emissiveIntensity={focus === "infollion" && index === 2 ? 0.2 : 0}
          />
        </RoundedBox>
      ))}
    </>
  )
}

function Scene({ focus, onPick }: { focus: string; onPick: (id: string) => void }) {
  const reduce = useReduced()
  const portraitActive = focus === "home"
  const standingActive = focus === "contact"

  return (
    <>
      <color attach="background" args={["#12100c"]} />
      <fog attach="fog" args={["#12100c", 10, 22]} />
      <hemisphereLight args={["#f4eadc", "#2a221c", 0.42]} />
      <directionalLight
        position={[5.5, 8.5, 4.2]}
        intensity={1.7}
        color="#fff3e4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 3.2, -2]} intensity={0.45} color="#8ab4d4" />
      <Environment preset="warehouse" environmentIntensity={0.32} />
      <Floor />
      <ContactShadows opacity={0.38} scale={18} blur={2.6} far={6} />

      <group position={portrait.position}>
        {[
          [-0.72, 0.72, -0.18],
          [0.72, 0.72, -0.18],
          [-0.72, 0.72, 0.22],
          [0.72, 0.72, 0.22],
        ].map((post) => (
          <mesh key={post.join("-")} position={post as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.045, 0.05, 1.44, 12]} />
            <meshStandardMaterial color="#c4b6a3" roughness={0.62} metalness={0.12} />
          </mesh>
        ))}
      </group>

      <Photo
        url={portrait.url}
        position={portrait.position}
        scale={portrait.scale}
        active={portraitActive}
        label="Vishwajeet Natu"
        onPick={() => onPick("home")}
      />
      <Photo
        url={standing.url}
        position={standing.position}
        scale={standing.scale}
        rotation={standing.rotation}
        active={standingActive}
        label="IIT Bombay"
        onPick={() => onPick("contact")}
      />

      {frames.map((frame) => {
        const active =
          focus === frame.id || (focus === "festival" && (frame.id === "festival" || frame.id === "festival-flames"))
        const pick = () => onPick(frame.id === "festival-flames" ? "festival" : frame.id)
        const node = (
          <Photo
            url={frame.url}
            position={frame.position}
            scale={frame.scale}
            rotation={frame.rotation}
            active={active}
            label={frame.label}
            onPick={pick}
          />
        )
        if (reduce.current) return <group key={frame.id}>{node}</group>
        return (
          <Float key={frame.id} speed={0.6} rotationIntensity={0.08} floatIntensity={0.18}>
            {node}
          </Float>
        )
      })}

      <Systems focus={focus} onPick={onPick} />
      <Rig focus={focus} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.82} intensity={0.22} mipmapBlur />
      </EffectComposer>
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
      camera={{ fov: 34, near: 0.1, far: 60, position: home.from }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.08 }}
    >
      <Scene focus={focus} onPick={onPick} />
    </Canvas>
  )
}
