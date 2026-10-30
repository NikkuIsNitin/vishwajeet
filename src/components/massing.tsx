import { ContactShadows, Environment, Html, OrbitControls } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import { useEffect, useMemo, useRef, type ComponentRef } from "react"
import * as THREE from "three"
import { work } from "@/data/resume"

const clay = "#c4b6a3"
const clayDark = "#8c7a66"
const clayDeep = "#6f5d4c"
const floor = "#3a3229"

type View = { from: [number, number, number]; to: [number, number, number] }

const views: Record<string, View> = {
  "main-site": { from: [3.6, 2.4, 4.8], to: [0, 0.95, 0.2] },
  "my-mi": { from: [-0.4, 2.2, 3.4], to: [-1.1, 0.45, -0.7] },
  rooms: { from: [5.8, 3.6, 2.6], to: [0.2, 0.5, -1.1] },
  events: { from: [-2.4, 2.6, 5.2], to: [0.1, 0.2, 1.15] },
  infollion: { from: [4.2, 2.2, 0.4], to: [2.15, 0.4, -1.45] },
  passes: { from: [0.2, 1.8, 5.4], to: [0, 0.85, 2.15] },
}

const home: View = { from: [5.6, 3.2, 6.4], to: [0, 0.55, 0.1] }

function Block({
  id,
  focus,
  onPick,
  position,
  size,
  color,
  label,
}: {
  id: string
  focus: string
  onPick: (id: string) => void
  position: [number, number, number]
  size: [number, number, number]
  color: string
  label?: string
}) {
  const active = focus === id
  const material = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((_, delta) => {
    if (!material.current) return
    material.current.emissiveIntensity = THREE.MathUtils.damp(
      material.current.emissiveIntensity,
      active ? 0.55 : 0,
      6,
      delta,
    )
  })
  const item = work.find((entry) => entry.id === id)
  const caption = label ?? (item ? `${item.title} · ${item.metric} ${item.metricLabel}` : id)

  return (
    <mesh
      position={position}
      castShadow
      receiveShadow
      onClick={(event) => {
        event.stopPropagation()
        onPick(id)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        document.body.style.cursor = ""
      }}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        ref={material}
        color={active ? "#d9c4a8" : color}
        roughness={0.9}
        metalness={0}
        emissive="#f25c2a"
        emissiveIntensity={0}
      />
      {active && caption ? (
        <Html center position={[0, size[1] / 2 + 0.28, 0]} distanceFactor={10} zIndexRange={[8, 0]}>
          <div className="scene-label">{caption}</div>
        </Html>
      ) : null}
    </mesh>
  )
}

function EventPins({ focus, onPick }: { focus: string; onPick: (id: string) => void }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const material = useRef<THREE.MeshStandardMaterial>(null)
  const active = focus === "events"

  useEffect(() => {
    const current = mesh.current
    if (!current) return
    const dummy = new THREE.Object3D()
    for (let index = 0; index < 16; index += 1) {
      const t = index / 15
      const angle = -0.9 + t * 1.8
      dummy.position.set(Math.sin(angle) * 2.2, 0.08 + (index % 3) * 0.04, 1.15 + (1 - Math.cos(angle)) * 0.12)
      dummy.scale.set(0.14, 0.1 + (index % 4) * 0.04, 0.14)
      dummy.updateMatrix()
      current.setMatrixAt(index, dummy.matrix)
    }
    current.instanceMatrix.needsUpdate = true
  }, [])

  useFrame((_, delta) => {
    if (!material.current) return
    material.current.emissiveIntensity = THREE.MathUtils.damp(
      material.current.emissiveIntensity,
      active ? 0.7 : 0,
      6,
      delta,
    )
  })

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, 16]}
      castShadow
      onClick={(event) => {
        event.stopPropagation()
        onPick("events")
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        document.body.style.cursor = ""
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial ref={material} color={clayDeep} roughness={0.88} emissive="#f25c2a" emissiveIntensity={0} />
      {active ? (
        <Html center position={[0, 0.55, 1.2]} distanceFactor={10}>
          <div className="scene-label">Event discovery · paid build</div>
        </Html>
      ) : null}
    </instancedMesh>
  )
}

function Rig({ focus }: { focus: string }) {
  const { camera } = useThree()
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null)
  const dragging = useRef(false)
  const reduce = useRef(false)
  const look = useRef(new THREE.Vector3(...home.to))
  const goalPos = useRef(new THREE.Vector3(...home.from))
  const goalLook = useRef(new THREE.Vector3(...home.to))

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  useEffect(() => {
    const view = views[focus] ?? home
    goalPos.current.set(...view.from)
    goalLook.current.set(...view.to)
    dragging.current = false
    if (reduce.current) {
      camera.position.copy(goalPos.current)
      look.current.copy(goalLook.current)
      controls.current?.target.copy(look.current)
      controls.current?.update()
    }
  }, [camera, focus])

  useFrame((_, delta) => {
    if (dragging.current) return
    const lambda = reduce.current ? 40 : 2.8
    const t = 1 - Math.exp(-lambda * delta)
    camera.position.lerp(goalPos.current, t)
    look.current.lerp(goalLook.current, t)
    const rig = controls.current
    if (!rig) return
    rig.target.copy(look.current)
    rig.update()
  })

  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.08}
      minPolarAngle={0.7}
      maxPolarAngle={1.28}
      onStart={() => {
        dragging.current = true
      }}
      onEnd={() => {
        dragging.current = false
      }}
    />
  )
}

function Scene({ focus, onPick }: { focus: string; onPick: (id: string) => void }) {
  const posts = useMemo(
    () =>
      [
        [-0.82, 0.72, -0.18],
        [0.82, 0.72, -0.18],
        [-0.82, 0.72, 0.78],
        [0.82, 0.72, 0.78],
      ] as [number, number, number][],
    [],
  )

  return (
    <>
      <color attach="background" args={["#16140f"]} />
      <fog attach="fog" args={["#16140f", 12, 26]} />
      <hemisphereLight args={["#f4eadc", "#3a2c20", 0.45]} />
      <directionalLight position={[6, 10, 5]} intensity={1.55} color="#fff6ea" castShadow shadow-mapSize={[1024, 1024]} />
      <Environment preset="studio" environmentIntensity={0.28} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.05]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={floor} roughness={0.96} />
      </mesh>
      <ContactShadows opacity={0.42} scale={14} blur={2.4} far={5} />

      <Block id="rooms" focus={focus} onPick={onPick} position={[-0.1, 0.42, -2.15]} size={[6.4, 0.84, 1.05]} color={clayDark} />
      <Block id="rooms" focus={focus} onPick={onPick} position={[3.15, 0.58, -0.15]} size={[1.05, 1.16, 3.2]} color={clayDeep} />
      <Block id="rooms" focus={focus} onPick={onPick} position={[-3.35, 0.32, 0.15]} size={[0.9, 0.64, 2.4]} color={clayDeep} />

      {Array.from({ length: 7 }, (_, index) => (
        <Block
          key={`portal-${index}`}
          id="my-mi"
          focus={focus}
          onPick={onPick}
          position={[-2.05 + index * 0.36, 0.38, -0.78]}
          size={[0.09, 0.62, 0.38]}
          color={clay}
          label={index === 3 ? undefined : ""}
        />
      ))}

      {posts.map((position) => (
        <Block
          key={position.join("-")}
          id="main-site"
          focus={focus}
          onPick={onPick}
          position={position}
          size={[0.12, 1.44, 0.12]}
          color={clay}
          label=""
        />
      ))}
      <Block id="main-site" focus={focus} onPick={onPick} position={[0, 1.48, 0.3]} size={[1.86, 0.08, 0.12]} color={clay} />
      <Block
        id="main-site"
        focus={focus}
        onPick={onPick}
        position={[0, 1.48, 0.3]}
        size={[0.12, 0.08, 1.12]}
        color={clay}
        label=""
      />
      <Block id="main-site" focus={focus} onPick={onPick} position={[0, 0.16, 0.3]} size={[0.22, 0.22, 0.22]} color="#f25c2a" label="" />

      <Block id="passes" focus={focus} onPick={onPick} position={[-0.7, 0.7, 2.2]} size={[0.16, 1.4, 0.16]} color={clay} label="" />
      <Block id="passes" focus={focus} onPick={onPick} position={[0.7, 0.7, 2.2]} size={[0.16, 1.4, 0.16]} color={clay} label="" />
      <Block id="passes" focus={focus} onPick={onPick} position={[0, 1.42, 2.2]} size={[1.62, 0.12, 0.2]} color={clay} />

      {Array.from({ length: 5 }, (_, index) => (
        <Block
          key={`sheet-${index}`}
          id="infollion"
          focus={focus}
          onPick={onPick}
          position={[2.05 + index * 0.06, 0.12 + index * 0.11, -1.5]}
          size={[1.15, 0.04, 0.74]}
          color="#e6dccb"
          label={index === 2 ? undefined : ""}
        />
      ))}

      <EventPins focus={focus} onPick={onPick} />
      <Rig focus={focus} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.88} intensity={0.28} mipmapBlur />
      </EffectComposer>
    </>
  )
}

export function Massing({ focus, onPick }: { focus: string; onPick: (id: string) => void }) {
  return (
    <Canvas
      shadows
      className="h-full w-full"
      dpr={[1, 1.5]}
      camera={{ fov: 32, near: 0.1, far: 50, position: home.from }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
    >
      <Scene focus={focus} onPick={onPick} />
    </Canvas>
  )
}
