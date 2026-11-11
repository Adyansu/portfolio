"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Briefcase, GraduationCap } from "lucide-react";
import { education, experience } from "@/data/resume";
import { Reveal } from "./ui/reveal";
import { SectionHeading } from "./ui/section-heading";

export function Experience() {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="experience" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading
          eyebrow="Experience"
          title={
            <>
              Where I&apos;ve <span className="italic text-primary">shipped</span> and studied
            </>
          }
        />

        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          {/* Work timeline */}
          <div ref={track} className="relative pl-10 sm:pl-14">
            <div aria-hidden className="absolute bottom-2 left-[15px] top-2 w-px bg-line sm:left-[23px]" />
            <motion.div
              aria-hidden
              style={{ scaleY: reduce ? 1 : progress }}
              className="absolute bottom-2 left-[15px] top-2 w-px origin-top bg-gold sm:left-[23px]"
            />

            {experience.map((job) => (
              <Reveal key={job.company} className="relative">
                <span className="absolute -left-10 top-1 grid size-8 place-items-center rounded-full border border-gold bg-bg text-primary sm:-left-14 sm:size-12">
                  <Briefcase aria-hidden className="size-4 sm:size-5" />
                </span>
                <article className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
                  <header className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-3xl font-semibold text-primary-strong dark:text-text">
                        {job.company}
                      </h3>
                      <p className="text-sm font-semibold text-gold-text">{job.role}</p>
                    </div>
                    <p className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
                      {job.period}
                    </p>
                  </header>
                  <ul className="mt-5 space-y-3">
                    {job.points.map((p) => (
                      <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted sm:text-base">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label="Focus areas">
                    {job.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-primary"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Education */}
          <div>
            <Reveal>
              <h3 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-text">
                <GraduationCap aria-hidden className="size-4" /> Education
              </h3>
            </Reveal>
            <ol className="space-y-4">
              {education.map((e, i) => (
                <li key={e.degree}>
                  <Reveal delay={i * 0.08}>
                    <div className="group rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-gold">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-xl font-semibold text-primary-strong dark:text-text">
                            {e.degree}
                          </p>
                          <p className="mt-1 text-sm text-muted">{e.institute}</p>
                        </div>
                        <p className="shrink-0 font-serif text-xl font-semibold text-primary">{e.score}</p>
                      </div>
                      <p className="mt-3 text-xs font-semibold text-gold-text">{e.period}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
