export type PhotoFrame = {
  id: string
  url: string
  position: [number, number, number]
  scale: [number, number]
  rotation: [number, number, number]
}

export const portrait = {
  url: "/photos/portrait.jpg",
  position: [-2.15, 1.62, 0.1] as [number, number, number],
  scale: [1.42, 1.9] as [number, number],
}

export const standing = {
  url: "/photos/standing.jpg",
  position: [-3.7, 1.48, -1.85] as [number, number, number],
  scale: [1.18, 1.18] as [number, number],
  rotation: [0, 0.36, 0] as [number, number, number],
}

export const frames: PhotoFrame[] = [
  {
    id: "main-site",
    url: "/photos/festival-fireworks.jpg",
    position: [1.85, 1.58, -0.95],
    scale: [1.72, 0.97],
    rotation: [0, -0.22, 0],
  },
  {
    id: "festival",
    url: "/photos/festival-stage.jpg",
    position: [3.35, 1.42, 0.15],
    scale: [1.58, 0.89],
    rotation: [0, -0.48, 0],
  },
  {
    id: "events",
    url: "/photos/festival-performer.jpg",
    position: [2.45, 1.55, 1.55],
    scale: [0.88, 1.18],
    rotation: [0, -0.12, 0],
  },
  {
    id: "leadership",
    url: "/photos/festival-team.jpg",
    position: [3.85, 1.38, -1.75],
    scale: [1.62, 0.91],
    rotation: [0, -0.18, 0],
  },
  {
    id: "festival-flames",
    url: "/photos/festival-flames.jpg",
    position: [1.15, 1.32, 2.15],
    scale: [1.38, 0.9],
    rotation: [0, 0.22, 0],
  },
]
