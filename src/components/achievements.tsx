"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { Award, Trophy } from "lucide-react";
import { achievements, extracurriculars } from "@/data/resume";
import { Reveal } from "./ui/reveal";
import { SectionHeading } from "./ui/section-heading";

/** "AIR 1289" → counts 0→1289 with the "AIR " prefix kept. Non-numeric metrics just render. */
function CountUp({ metric }: { metric: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const match = metric.match(/^(\D*)(\d+)(\D*)$/);
  const hasNumber = match !== null;
  const target = match ? Number(match[2]) : 0;
  // Starts at the real value so server HTML, crawlers and no-JS visitors see it;
  // counts up from 0 only once the card actually scrolls into view.
  const mv = useMotionValue(target);
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString("en-IN"));

  useEffect(() => {
    if (!hasNumber || !inView || reduce) return;
    const controls = animate(mv, target, {
      from: 0,
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, reduce, target, mv, hasNumber]);

  if (!match) return <span ref={ref}>{metric}</span>;
  return (
    <span ref={ref} aria-label={metric}>
      <span aria-hidden>
        {match[1]}
        <motion.span>{text}</motion.span>
        {match[3]}
      </span>
    </span>
  );
}

export function Achievements() {
  return (
    <section id="achievements" className="border-t border-line bg-surface-2/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading
          eyebrow="Achievements"
          title={
            <>
              A few <span className="italic text-primary">milestones</span>
            </>
          }
        />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <li key={a.title}>
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-soft">
                  {/* Medal */}
                  <div className="mb-5 flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-full border-2 border-gold bg-surface-2 text-primary transition-transform duration-500 group-hover:rotate-[360deg]">
                      <Award aria-hidden className="size-6" />
                    </span>
                    <span aria-hidden className="h-px flex-1 translate-x-3 bg-gradient-to-r from-gold/60 to-transparent" />
                  </div>
                  <p className="font-serif text-5xl font-semibold tabular-nums text-primary">
                    <CountUp metric={a.metric} />
                  </p>
                  <h3 className="mt-2 text-base font-bold text-text">{a.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{a.detail}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-10">
          <div className="rounded-3xl border border-line bg-surface p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-text">
              <Trophy aria-hidden className="size-4" /> Beyond the code
            </h3>
            <ul className="grid gap-3 sm:grid-cols-3">
              {extracurriculars.map((e) => (
                <li key={e} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
