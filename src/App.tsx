import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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
  const [focus, setFocus] = useState(work[0].id)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (visible.some((item) => item.id === focus) || !visible[0]) return
    setFocus(visible[0].id)
  }, [focus, visible])

  function open(id: string) {
    setFocus(id)
  }

  function jump(id: string) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
  }

  return (
    <div className="relative min-h-svh lg:h-svh lg:overflow-hidden">
      <a
        href="#work"
        className="absolute top-3 left-3 z-50 -translate-y-24 rounded-md bg-foreground px-3 py-2 text-sm text-background focus:translate-y-0"
        onClick={(event) => {
          event.preventDefault()
          jump("work")
        }}
      >
        Skip to work
      </a>

      <section className="relative h-[42svh] lg:absolute lg:inset-0 lg:h-svh" aria-label="Campus of the systems">
        <Suspense fallback={<div className="h-full w-full bg-background" />}>
          <Massing focus={focus} onPick={open} />
        </Suspense>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-5">
          <p className="font-heading text-lg text-foreground/90">VN</p>
          <nav aria-label="Page" className="pointer-events-auto flex flex-wrap justify-end gap-1">
            {(["work", "leadership", "stack", "contact"] as const).map((id) => (
              <Button key={id} variant="ghost" size="sm" className="capitalize" onClick={() => jump(id)}>
                {id}
              </Button>
            ))}
          </nav>
        </div>
        <p className="pointer-events-none absolute bottom-3 left-4 hidden text-xs text-muted-foreground lg:block">
          Drag to turn. Click a block.
        </p>
      </section>

      <div className="relative z-10 border-t border-border bg-card lg:absolute lg:top-0 lg:right-0 lg:h-svh lg:w-[26.5rem] lg:overflow-y-auto lg:border-t-0 lg:border-l lg:bg-card/90 lg:backdrop-blur-md">
        <motion.main
          className="px-5 py-8 md:px-6"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm text-muted-foreground">
            {person.school} · {person.degree} · class of {person.graduation} · CPI {person.cpi}
          </p>
          <h1 className="mt-3 font-heading text-[2.7rem] leading-[0.92] font-medium tracking-tight">{person.name}</h1>
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
            {proof.map((item) => (
              <div key={item.label}>
                <dt className="font-heading text-2xl leading-none">{item.value}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{item.label}</dd>
              </div>
            ))}
          </dl>

          <section id="work" className="mt-10 scroll-mt-6">
            <h2 className="text-sm text-muted-foreground">Work</h2>
            <Tabs
              value={lane}
              onValueChange={(value) => setLane(value as (typeof lanes)[number]["id"])}
              className="mt-3"
            >
              <TabsList className="h-auto flex-wrap gap-x-3 gap-y-1">
                {lanes.map((item) => (
                  <TabsTrigger key={item.id} value={item.id}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Accordion
              type="single"
              value={visible.some((item) => item.id === focus) ? focus : visible[0]?.id}
              onValueChange={(value) => value && open(value)}
              className="mt-2"
            >
              {visible.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span>
                      <span className="block font-heading text-xl font-medium tracking-tight">{item.title}</span>
                      <span className="mt-1 block text-sm font-normal text-muted-foreground">
                        {item.context}. {item.when}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-relaxed text-foreground/90">{item.body}</p>
                    <p className="mt-2 font-heading text-lg">
                      {item.metric}{" "}
                      <span className="text-sm font-sans font-normal text-muted-foreground">{item.metricLabel}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.stack.map((tool) => (
                        <Badge key={tool}>{tool}</Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {notes.length > 0 ? (
              <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {notes.map((item) => (
                  <li key={item.title}>
                    <span className="text-foreground">{item.title}.</span> {item.detail}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <Separator className="my-8" />

          <section id="leadership" className="scroll-mt-6">
            <h2 className="text-sm text-muted-foreground">Leadership</h2>
            <p className="mt-1 text-sm text-muted-foreground">{festival.when}</p>
            <h3 className="mt-1 font-heading text-2xl font-medium">{festival.role}</h3>
            <p className="mt-3 leading-relaxed text-foreground/90">{festival.body}</p>
            <p className="mt-6 text-sm text-muted-foreground">{institute.when}</p>
            <h3 className="mt-1 font-heading text-2xl font-medium">{institute.role}</h3>
            <p className="text-sm text-muted-foreground">{institute.body}</p>
            <p className="mt-3 leading-relaxed text-foreground/90">{institute.summary}</p>
          </section>

          <Separator className="my-8" />

          <section id="stack" className="scroll-mt-6">
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
          </section>

          <footer id="contact" className="mt-10 scroll-mt-6 border-t border-border pt-6 text-sm">
            <h2 className="text-sm text-muted-foreground">Contact</h2>
            <p className="mt-3 font-heading text-2xl text-foreground">{person.name}</p>
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
          </footer>
        </motion.main>
      </div>
    </div>
  )
}
