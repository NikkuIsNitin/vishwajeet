export type PhotoFrame = {
  id: string
  url: string
  label: string
  position: [number, number, number]
  scale: [number, number]
  rotation: [number, number, number]
}

export const portrait = {
  url: "/photos/portrait.jpg",
  position: [-1.85, 1.58, 0.15] as [number, number, number],
  scale: [1.38, 1.84] as [number, number],
}

export const standing = {
  url: "/photos/standing.jpg",
  position: [-3.55, 1.48, -2.15] as [number, number, number],
  scale: [1.42, 1.42] as [number, number],
  rotation: [0, 0.42, 0] as [number, number, number],
}

export const frames: PhotoFrame[] = [
  {
    id: "main-site",
    url: "/photos/festival-fireworks.jpg",
    label: "20M+ hits",
    position: [2.75, 1.48, -0.55],
    scale: [2.35, 1.32],
    rotation: [0, -0.38, 0],
  },
  {
    id: "festival",
    url: "/photos/festival-stage.jpg",
    label: "163K+ footfall",
    position: [3.55, 1.18, 1.55],
    scale: [2.05, 1.15],
    rotation: [0, -0.72, 0],
  },
  {
    id: "events",
    url: "/photos/festival-performer.jpg",
    label: "240+ events",
    position: [1.15, 1.52, 2.75],
    scale: [1.08, 1.44],
    rotation: [0, 0.18, 0],
  },
  {
    id: "leadership",
    url: "/photos/festival-team.jpg",
    label: "300+ volunteers",
    position: [3.25, 1.08, -2.45],
    scale: [2.15, 1.2],
    rotation: [0, -0.22, 0],
  },
  {
    id: "festival-flames",
    url: "/photos/festival-flames.jpg",
    label: "55th Mood Indigo",
    position: [0.25, 1.22, 3.55],
    scale: [1.72, 1.12],
    rotation: [0, 0.48, 0],
  },
]
