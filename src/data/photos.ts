export type PhotoFrame = {
  id: string
  url: string
  position: [number, number, number]
  scale: [number, number]
  rotation: [number, number, number]
}

export const frames: PhotoFrame[] = [
  {
    id: "stack",
    url: "/media/tech/tech-code.jpg",
    position: [-2.2, 1.42, 0.12],
    scale: [1.12, 1.5],
    rotation: [0, 0.14, 0],
  },
  {
    id: "my-mi",
    url: "/media/tech/tech-portals.jpg",
    position: [-3.45, 1.22, -1.72],
    scale: [1.68, 0.94],
    rotation: [0, 0.36, 0],
  },
  {
    id: "main-site",
    url: "/media/tech/tech-web.jpg",
    position: [1.85, 1.5, -0.95],
    scale: [1.78, 1],
    rotation: [0, -0.22, 0],
  },
  {
    id: "festival",
    url: "/media/tech/tech-infra.jpg",
    position: [3.35, 1.38, 0.15],
    scale: [1.62, 0.91],
    rotation: [0, -0.48, 0],
  },
  {
    id: "events",
    url: "/media/tech/tech-events.jpg",
    position: [2.48, 1.4, 1.52],
    scale: [1.52, 0.86],
    rotation: [0, -0.12, 0],
  },
  {
    id: "infollion",
    url: "/media/tech/tech-graphs.jpg",
    position: [3.72, 1.32, -1.72],
    scale: [1.62, 0.91],
    rotation: [0, -0.18, 0],
  },
  {
    id: "rooms",
    url: "/media/tech/tech-rooms.jpg",
    position: [0.18, 1.22, -2.52],
    scale: [1.7, 0.96],
    rotation: [0, 0.04, 0],
  },
  {
    id: "passes",
    url: "/media/tech/tech-passes.jpg",
    position: [0.16, 1.24, 2.42],
    scale: [1.52, 0.86],
    rotation: [0, 0.08, 0],
  },
]

export const stills: Record<string, string> = {
  home: "/media/hero-poster.jpg",
  stack: "/media/tech/tech-code.jpg",
  "main-site": "/media/tech/tech-web.jpg",
  "my-mi": "/media/tech/tech-portals.jpg",
  rooms: "/media/tech/tech-rooms.jpg",
  events: "/media/tech/tech-events.jpg",
  infollion: "/media/tech/tech-graphs.jpg",
  passes: "/media/tech/tech-passes.jpg",
  festival: "/media/tech/tech-infra.jpg",
  about: "/media/tech/tech-infra.jpg",
  contact: "/media/tech/tech-code.jpg",
}

export function stillFor(id: string) {
  return stills[id] ?? stills["main-site"]
}

export function pickTarget(id: string) {
  if (id === "stack") return "home"
  if (id === "festival") return "about"
  return id
}
