"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { projects, type Project, type ProjectCategory } from "@/data/resume";
import { GitHubIcon } from "../icons";
import { SectionHeading } from "../ui/section-heading";
import { CategoryIcon } from "./category-icon";
import { ProjectModal } from "./project-modal";
import { TiltCard } from "./tilt-card";

type Filter = "All" | ProjectCategory;
const filters: Filter[] = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <TiltCard className="rounded-3xl">
      <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-colors group-hover:border-gold">
        {/* Decorative header */}
        <div className="relative h-32 overflow-hidden border-b border-line bg-surface-2">
          <div
            aria-hidden
            className="absolute inset-0 opacity-60 [background-image:radial-gradient(var(--gold)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
          <CategoryIcon
            category={project.category}
            className="absolute -bottom-4 right-4 size-28 text-gold opacity-25 transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-6"
          />
          <div className="absolute left-5 top-5 flex items-center gap-2">
            <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-primary">
              {project.category}
            </span>
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
                <Sparkles aria-hidden className="size-3" /> Featured
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-serif text-2xl font-semibold text-primary-strong dark:text-text">
            {/* Stretched button: the whole card opens the case study */}
            <button
              type="button"
              onClick={onOpen}
              className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-3xl focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-gold"
            >
              {project.title}
            </button>
          </h3>
          <p className="mt-1 text-sm font-semibold text-gold-text">{project.subtitle}</p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>

          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {project.stack.slice(0, 4).map((s) => (
              <li key={s} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {s}
              </li>
            ))}
            {project.stack.length > 4 && (
              <li className="px-1 py-0.5 text-xs text-muted">+{project.stack.length - 4}</li>
            )}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Case study
              <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} source on GitHub`}
                className="relative z-10 grid size-9 place-items-center rounded-full border border-line text-primary transition-colors hover:border-gold"
              >
                <GitHubIcon className="size-4" />
              </a>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<Project | null>(null);
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="border-t border-line bg-surface-2/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading
          eyebrow="Projects"
          title={
            <>
              Things I&apos;ve <span className="italic text-primary">crafted</span>
            </>
          }
          intro="From full-stack web apps to a renderer written from scratch. Open any card for the case study."
        />

        {/* Filters */}
        <LayoutGroup>
          <div role="group" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={`relative rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    active ? "border-transparent text-on-primary" : "border-line text-primary hover:border-gold"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{f}</span>
                </button>
              );
            })}
          </div>

          <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((p) => (
                <motion.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <ProjectCard project={p} onOpen={() => setOpen(p)} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  );
}
