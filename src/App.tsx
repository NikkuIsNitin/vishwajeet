import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  also,
  extra,
  festival,
  institute,
  person,
  proof,
  roles,
  skillGroups,
  work,
  type Role,
  type WorkItem,
} from "@/data/resume"

const Massing = lazy(async () => {
  const module = await import("@/components/massing")
  return { default: module.Massing }
})

const lanes: { id: "all" | Role; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sde", label: "SDE / systems" },
  { id: "fullstack", label: "Full stack" },
  { id: "pm", label: "Tech PM" },
]

const nav = ["work", "leadership", "stack", "contact"] as const

function Panel({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="overlay-panel"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: 8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const [lane, setLane] = useState<(typeof lanes)[number]["id"]>("all")
  const visible = useMemo(
    () => (lane === "all" ? work : work.filter((item) => item.roles.includes(lane))),
    [lane],
  )
  const notes = useMemo(
    () => (lane === "all" ? also : also.filter((item) => item.roles.includes(lane))),
    [lane],
  )
  const [focus, setFocus] = useState("home")
  const activeWork = visible.find((item) => item.id === focus)
  const showNotes = focus === "also"

  useEffect(() => {
    const ids = ["home", "festival", "work", ...visible.map((item) => item.id), "also", "leadership", "stack", "contact"]
    const nodes = ids.map((id) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node))
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit?.target.id) setFocus(hit.target.id === "work" ? (visible[0]?.id ?? "work") : hit.target.id)
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-18% 0px -18% 0px" },
    )
    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [visible])

  function jump(id: string) {
    const target = id === "work" ? (visible[0]?.id ?? "work") : id
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document.getElementById(target)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" })
    setFocus(target)
  }

  return (
    <div className="relative">
      <a
        href="#work"
        className="absolute top-3 left-3 z-50 -translate-y-24 rounded-md bg-foreground px-3 py-2 text-sm text-background focus:translate-y-0"
        onClick={(event) => {
          event.preventDefault()
          jump(visible[0]?.id ?? "work")
        }}
      >
        Skip to work
      </a>

      <div className="fixed inset-0 z-0" aria-label="Campus of the systems">
        <Suspense
          fallback={
            <img
              src="/photos/portrait.jpg"
              alt=""
              className="h-full w-full object-cover object-[center_18%] opacity-80"
            />
          }
        >
          <Massing focus={focus === "also" || focus === "work" ? (visible[0]?.id ?? "home") : focus} onPick={jump} />
        </Suspense>
        <div className="scene-vignette" />
      </div>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-4 md:p-5">
        <p className="font-heading text-lg text-foreground/90">VN</p>
        <nav aria-label="Page" className="pointer-events-auto flex flex-wrap justify-end gap-1">
          {nav.map((id) => (
            <Button key={id} variant="ghost" size="sm" className="capitalize" onClick={() => jump(id)}>
              {id}
            </Button>
          ))}
        </nav>
      </header>

      <aside className="overlay-slot z-20">
        <AnimatePresence mode="wait">
          {focus === "home" ? (
            <Panel key="home">
              <p className="text-sm text-muted-foreground">
                {person.school} · {person.degree} · class of {person.graduation} · CPI {person.cpi}
              </p>
              <h1 className="mt-3 font-heading text-[2.6rem] leading-[0.92] font-medium tracking-tight md:text-[3.1rem]">
                {person.name}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                {roles.map((role) => (
                  <Badge key={role}>{role}</Badge>
                ))}
              </div>
              <p className="mt-5 text-[0.98rem] leading-relaxed text-foreground/90">
                IIT Bombay, class of {person.graduation}. I ran web and tech for Mood Indigo, then the hostel systems the
                campus still uses.
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
                {proof.slice(0, 4).map((item) => (
                  <div key={item.label}>
                    <dt className="font-heading text-2xl leading-none">{item.value}</dt>
                    <dd className="mt-1 text-xs text-muted-foreground">{item.label}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          ) : null}

          {focus === "festival" ? (
            <Panel key="festival">
              <p className="text-sm text-muted-foreground">{festival.when}</p>
              <h2 className="mt-1 font-heading text-3xl font-medium">{festival.role}</h2>
              <p className="mt-3 leading-relaxed text-foreground/90">{festival.body}</p>
            </Panel>
          ) : null}

          {activeWork ? <WorkPanel key={activeWork.id} item={activeWork} lane={lane} onLane={setLane} /> : null}

          {showNotes && notes.length > 0 ? (
            <Panel key="also">
              <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {notes.map((item) => (
                  <li key={item.title}>
                    <span className="text-foreground">{item.title}.</span> {item.detail}
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}

          {focus === "leadership" ? (
            <Panel key="leadership">
              <h2 className="text-sm text-muted-foreground">Leadership</h2>
              <p className="mt-3 text-sm text-muted-foreground">{institute.when}</p>
              <h3 className="mt-1 font-heading text-3xl font-medium">{institute.role}</h3>
              <p className="text-sm text-muted-foreground">{institute.body}</p>
              <p className="mt-3 leading-relaxed text-foreground/90">{institute.summary}</p>
            </Panel>
          ) : null}

          {focus === "stack" ? (
            <Panel key="stack">
              <h2 className="text-sm text-muted-foreground">Stack</h2>
              <div className="mt-4 space-y-4">
                {skillGroups.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-xs tracking-wide text-muted-foreground uppercase">{group.label}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <Badge key={item}>{item}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm text-muted-foreground">{extra}</p>
            </Panel>
          ) : null}

          {focus === "contact" ? (
            <Panel key="contact">
              <h2 className="text-sm text-muted-foreground">Contact</h2>
              <p className="mt-3 font-heading text-3xl text-foreground">{person.name}</p>
              <p className="mt-1 text-muted-foreground">
                {person.school} · {person.degree}
              </p>
              <p className="mt-4 flex flex-col gap-1">
                <a className="text-foreground underline-offset-4 hover:underline" href={`mailto:${person.email}`}>
                  {person.email}
                </a>
                <a className="text-foreground underline-offset-4 hover:underline" href={`tel:${person.phone}`}>
                  {person.phoneLabel}
                </a>
              </p>
            </Panel>
          ) : null}
        </AnimatePresence>
      </aside>

      <div className="relative z-10 pointer-events-none">
        <section id="home" className="min-h-svh" />
        <section id="festival" className="min-h-svh" />
        <section id="work" className="h-px scroll-mt-6" />
        {visible.map((item) => (
          <section key={item.id} id={item.id} className="min-h-svh" />
        ))}
        {notes.length > 0 ? <section id="also" className="min-h-[70svh]" /> : null}
        <section id="leadership" className="min-h-svh" />
        <section id="stack" className="min-h-svh" />
        <section id="contact" className="min-h-svh" />
      </div>
    </div>
  )
}

function WorkPanel({
  item,
  lane,
  onLane,
}: {
  item: WorkItem
  lane: "all" | Role
  onLane: (value: "all" | Role) => void
}) {
  return (
    <Panel>
      <h2 className="text-sm text-muted-foreground">Work</h2>
      <Tabs value={lane} onValueChange={(value) => onLane(value as "all" | Role)} className="mt-3">
        <TabsList className="pointer-events-auto h-auto flex-wrap gap-x-3 gap-y-1">
          {lanes.map((entry) => (
            <TabsTrigger key={entry.id} value={entry.id}>
              {entry.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <p className="mt-5 text-sm text-muted-foreground">
        {item.context}. {item.when}
      </p>
      <h3 className="mt-1 font-heading text-3xl font-medium tracking-tight">{item.title}</h3>
      <p className="mt-3 leading-relaxed text-foreground/90">{item.body}</p>
      <p className="mt-3 font-heading text-xl">
        {item.metric} <span className="text-sm font-sans font-normal text-muted-foreground">{item.metricLabel}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.stack.map((tool) => (
          <Badge key={tool}>{tool}</Badge>
        ))}
      </div>
    </Panel>
  )
}
