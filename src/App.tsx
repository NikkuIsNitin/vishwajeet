import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { stillFor, stills } from "@/data/photos"
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

export default function App() {
  const reduce = useReducedMotion()
  const [focus, setFocus] = useState("home")
  const [lane, setLane] = useState<"all" | Role>("all")
  const visible = useMemo(
    () => (lane === "all" ? work : work.filter((item) => item.roles.includes(lane))),
    [lane],
  )
  const activeWork = visible.find((item) => item.id === focus)
  const stillId = activeWork?.id ?? (focus === "home" ? "home" : focus)
  const still = stillFor(stillId)
  const showFilm = focus === "home"

  useEffect(() => {
    Object.values(stills).forEach((src) => {
      const image = new window.Image()
      image.src = src
    })
  }, [])

  useEffect(() => {
    const ids = ["home", "work", ...visible.map((item) => item.id), "about", "contact"]
    const nodes = ids.map((id) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node))
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!hit) return
        setFocus(hit.target.id === "work" ? (visible[0]?.id ?? "work") : hit.target.id)
      },
      { threshold: [0.28, 0.55, 0.8], rootMargin: "-16% 0px -16% 0px" },
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
          jump("work")
        }}
      >
        Skip to work
      </a>

      <div className="fixed inset-0 z-0">
        <img src="/media/hero-poster.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <AnimatePresence mode="sync">
          {showFilm ? (
            reduce ? null : (
              <motion.div
                key="film"
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.45 }}
              >
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/media/hero-poster.jpg"
                >
                  <source src="/media/hero.mp4" type="video/mp4" />
                </video>
              </motion.div>
            )
          ) : (
            <motion.img
              key={still}
              src={still}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </AnimatePresence>
        <div className="scene-vignette" />
      </div>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 md:px-8">
        <button type="button" className="pointer-events-auto font-heading text-lg text-foreground/90" onClick={() => jump("home")}>
          VN
        </button>
        <nav aria-label="Page" className="pointer-events-auto flex items-center gap-5 text-sm text-foreground/80">
          <button type="button" className="hover:text-foreground" onClick={() => jump("work")}>
            Work
          </button>
          <button type="button" className="hover:text-foreground" onClick={() => jump("about")}>
            About
          </button>
          <button type="button" className="hover:text-foreground" onClick={() => jump("contact")}>
            Contact
          </button>
        </nav>
      </header>

      <main className="relative z-10">
        <section id="home" className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center">
          <p className="text-sm tracking-[0.18em] text-muted-foreground uppercase">IIT Bombay · class of 2027</p>
          <h1 className="mt-4 font-heading text-5xl leading-[0.92] font-medium tracking-tight md:text-7xl">{person.name}</h1>
          <p className="mt-5 max-w-lg text-[0.98rem] leading-relaxed text-foreground/85">
            I ran web and tech for Mood Indigo, then the hostel systems the campus still uses.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{roles.join(" · ")}</p>
          <dl className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {proof.slice(0, 3).map((item) => (
              <div key={item.label}>
                <dt className="font-heading text-2xl leading-none">{item.value}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{item.label}</dd>
              </div>
            ))}
          </dl>
          <button type="button" className="scroll-hint mt-16 text-sm text-foreground/75" onClick={() => jump("work")}>
            Scroll to start
          </button>
        </section>

        <section id="work" className="relative min-h-svh px-5 py-24 md:px-8">
          <div className="work-stage">
            <p className="text-sm text-muted-foreground">Work</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              {(
                [
                  ["all", "All"],
                  ["sde", "SDE / systems"],
                  ["fullstack", "Full stack"],
                  ["pm", "Tech PM"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={lane === id ? "text-primary" : "text-muted-foreground hover:text-foreground"}
                  onClick={() => setLane(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <ul className="mt-6 space-y-1">
              {visible.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`w-full py-2 text-left ${focus === item.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    onMouseEnter={() => setFocus(item.id)}
                    onFocus={() => setFocus(item.id)}
                    onClick={() => jump(item.id)}
                  >
                    <span className="font-heading text-xl">{item.title}</span>
                    <span className="mt-0.5 block text-xs">{item.metric} {item.metricLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {visible.map((item) => (
          <section key={item.id} id={item.id} className="relative min-h-[85svh] px-5 py-24 md:px-8">
            <AnimatePresence mode="wait">
              {focus === item.id ? (
                <motion.div
                  key={item.id}
                  className="work-stage"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-sm text-muted-foreground">
                    {item.context}. {item.when}
                  </p>
                  <h2 className="mt-2 font-heading text-4xl font-medium tracking-tight">{item.title}</h2>
                  <p className="mt-4 max-w-md leading-relaxed text-foreground/90">{item.body}</p>
                  <p className="mt-4 font-heading text-2xl">
                    {item.metric}{" "}
                    <span className="text-sm font-sans font-normal text-muted-foreground">{item.metricLabel}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.stack.map((tool) => (
                      <Badge key={tool}>{tool}</Badge>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </section>
        ))}

        <section id="about" className="relative min-h-svh px-5 py-24 md:px-8">
          <div className="work-stage max-w-lg">
            <h2 className="text-sm text-muted-foreground">About</h2>
            <p className="mt-4 text-sm text-muted-foreground">{festival.when}</p>
            <h3 className="mt-1 font-heading text-3xl font-medium">{festival.role}</h3>
            <p className="mt-3 leading-relaxed text-foreground/90">{festival.body}</p>
            <p className="mt-8 text-sm text-muted-foreground">{institute.when}</p>
            <h3 className="mt-1 font-heading text-3xl font-medium">{institute.role}</h3>
            <p className="text-sm text-muted-foreground">{institute.body}</p>
            <p className="mt-3 leading-relaxed text-foreground/90">{institute.summary}</p>
            <div className="mt-8 space-y-4">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <h4 className="text-xs tracking-wide text-muted-foreground uppercase">{group.label}</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <ul className="mt-8 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {also.map((item) => (
                <li key={item.title}>
                  <span className="text-foreground">{item.title}.</span> {item.detail}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted-foreground">{extra}</p>
          </div>
        </section>

        <section id="contact" className="relative min-h-svh px-5 py-24 md:px-8">
          <div className="work-stage">
            <h2 className="text-sm text-muted-foreground">Contact</h2>
            <p className="mt-3 font-heading text-4xl">{person.name}</p>
            <p className="mt-1 text-muted-foreground">
              {person.school} · {person.degree}
            </p>
            <p className="mt-5 flex flex-col gap-1">
              <a className="underline-offset-4 hover:underline" href={`mailto:${person.email}`}>
                {person.email}
              </a>
              <a className="underline-offset-4 hover:underline" href={`tel:${person.phone}`}>
                {person.phoneLabel}
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
