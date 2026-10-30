export type Role = "sde" | "fullstack" | "pm"

export const person = {
  name: "Vishwajeet Natu",
  degree: "B.Tech, Civil Engineering",
  school: "IIT Bombay",
  graduation: "2027",
  cpi: "8.64",
  email: "vishwajeet.natu@iitb.ac.in",
  phone: "9960389919",
  phoneLabel: "99603 89919",
} as const

export const roles = ["Software engineer", "Full stack", "Tech PM"] as const

export const proof = [
  { value: "20M+", label: "hits on the main site" },
  { value: "165K+", label: "registrations through My MI" },
  { value: "163K+", label: "festival footfall" },
  { value: "8+", label: "engineers on the main site" },
  { value: "300+", label: "volunteers in the tech group" },
] as const

export type WorkItem = {
  id: string
  title: string
  context: string
  when: string
  metric: string
  metricLabel: string
  stack: string[]
  roles: Role[]
  body: string
}

export const work: WorkItem[] = [
  {
    id: "main-site",
    title: "Main website",
    context: "Mood Indigo, IIT Bombay",
    when: "Nov 2025 – Dec 2025",
    metric: "20M+",
    metricLabel: "hits",
    stack: ["React.js", "Three.js"],
    roles: ["fullstack", "pm"],
    body: "I led 8+ developers on the Mood Indigo main site in React.js and Three.js. I reviewed and merged the work. Layouts were mobile-first, and the JS animations had to hold frame rate on phones while the site took 20M+ hits.",
  },
  {
    id: "my-mi",
    title: "My MI Portal",
    context: "Mood Indigo, IIT Bombay",
    when: "Jun 2025 – Oct 2025",
    metric: "165K+",
    metricLabel: "registrations",
    stack: ["Node.js", "MySQL"],
    roles: ["sde", "fullstack"],
    body: "I built My MI as 7+ portals on Node.js and MySQL. The backend took 165K+ registrations at peak. Dashboards are personal, served from indexed queries, with session access that changes by role.",
  },
  {
    id: "rooms",
    title: "Accommodation allocation",
    context: "Mood Indigo, IIT Bombay",
    when: "Dec 2025",
    metric: "7K+",
    metricLabel: "participants housed",
    stack: ["AWS S3"],
    roles: ["sde", "pm"],
    body: "I automated room assignment for 7K+ participants against hostel inventory. The gate checked the guest against the booking. That cut 40+ man-hours. Entry images and government IDs sit in AWS S3, access-controlled.",
  },
  {
    id: "events",
    title: "Event discovery",
    context: "Freelance",
    when: "Mar 2026 – Jul 2026",
    metric: "Paid",
    metricLabel: "end to end",
    stack: ["Next.js", "Express.js", "PostgreSQL", "AWS S3"],
    roles: ["fullstack"],
    body: "A client paid me to build an event site in Next.js, Express.js, and PostgreSQL. Listings link to performers, hosts, and geocoded venues. Admins can edit events, upload to S3, and save drafts. Visitors get city filters, full-text search, and wishlists.",
  },
  {
    id: "infollion",
    title: "Intelligence platform",
    context: "Infollion Research Services",
    when: "May 2026 – Jul 2026",
    metric: "927",
    metricLabel: "industries checked",
    stack: ["TypeScript", "React.js", "Node.js", "PostgreSQL", "D3.js"],
    roles: ["sde"],
    body: "Software engineering intern. LLM pipelines on Qwen3 through Ollama, and on Gemini 2.5 Flash, built 22 domain taxonomies. Output had to pass a schema check, be deduplicated, and clear a score of 0.85. I compared that with 927 industries mapped by hand, and shipped two D3.js graphs with zoom and pan.",
  },
  {
    id: "passes",
    title: "Security passes",
    context: "Mood Indigo, IIT Bombay",
    when: "Nov 2025 – Dec 2025",
    metric: "QR",
    metricLabel: "gate entry",
    stack: ["Docker", "Redis"],
    roles: ["sde"],
    body: "QR entry records visitors and issues a campus pass after verification. An admin scanner at the gate reads the code, finds the user, and logs the entry. Services run in Docker. Redis keeps the hot lookups under a second.",
  },
]

export const also = [
  {
    title: "Mood Indigo app",
    detail: "React Native on Android and iOS. Events, passes, maps, and profiles over authenticated REST.",
    roles: ["fullstack"] as Role[],
  },
  {
    title: "Raasha Apparel",
    detail: "Developer intern. React storefront, Node.js API, SQL catalogue and orders, courier and payment webhooks.",
    roles: ["fullstack"] as Role[],
  },
  {
    title: "Amenities booking",
    detail: "Next.js and PostgreSQL for Hostel Affairs. Room slots, admin approval, live / inactive / draft listings.",
    roles: ["fullstack", "pm"] as Role[],
  },
]

export const festival = {
  role: "Web and Tech Head",
  when: "Apr 2025 – Apr 2026",
  body: "Core Group Member, 55th Mood Indigo. Footfall 163K+, 240+ events, 9K+ colleges. The festival’s stated net worth was INR 145M+. I ran SEO, caching, and visual consistency across the public sites on DigitalOcean, Nginx, and Cloudflare, and dealt with incidents at peak. The volunteer group was two tiers and 300+ people, across 25+ pages, 5+ portals, and the mobile app. Certificate issue for 20K+ certificates cut 30% of that workload. The security system eased crowd flow and cut manual effort by 40%. Indigo Squad grew through rank-based referral loops, not paid ads. I also mentored 50+ students through Abhyuday’s Career Consult Campaign.",
} as const

export const institute = {
  role: "Institute System Administrator",
  body: "Hostel Affairs, IIT Bombay",
  when: "Jul 2026 – present",
  summary:
    "Technical liaison between the Computer Centre and students. I sit on a 16-member council for digital policy covering 15K+ students, run network and infrastructure for 21 hostels, and standardised hosting for 10+ multi-tier councils. The amenities portal and a campus eateries portal (feedback, orders, hygiene, facilities) are part of that work.",
} as const

export const skillGroups = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL"],
  },
  {
    label: "Frontend",
    items: ["React.js", "Next.js", "React Native", "Three.js", "D3.js"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express.js", "PostgreSQL", "MySQL", "Redis"],
  },
  {
    label: "Infrastructure",
    items: ["Docker", "AWS S3", "Cloudflare", "Nginx", "Git", "Linux"],
  },
] as const

export const extra = "2nd in Web Brawl GC with a Hostel 5 team of 3+ people."
