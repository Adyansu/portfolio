import { BookOpen, Box, BrainCircuit, Code2, Layout, Server, Wrench } from "lucide-react";
import { courses, skills } from "@/data/resume";
import { Reveal } from "./ui/reveal";
import { SectionHeading } from "./ui/section-heading";

const groupIcons: Record<string, typeof Layout> = {
  Frontend: Layout,
  Backend: Server,
  Languages: Code2,
  Graphics: Box,
  "AI / ML": BrainCircuit,
  Tools: Wrench,
};

export function Skills() {
  return (
    <section id="skills" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading
          eyebrow="Skills"
          title={
            <>
              The <span className="italic text-primary">toolkit</span>
            </>
          }
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skills).map(([group, items], i) => {
            const Icon = groupIcons[group] ?? Code2;
            return (
              <Reveal key={group} delay={(i % 3) * 0.08}>
                <div className="h-full rounded-3xl border border-line bg-surface p-6 transition-colors hover:border-gold">
                  <h3 className="mb-4 flex items-center gap-3 font-serif text-2xl font-semibold text-primary-strong dark:text-text">
                    <span className="grid size-10 place-items-center rounded-full bg-surface-2 text-primary">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    {group}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <li
                        key={s}
                        className="shimmer cursor-default rounded-full border border-line px-3 py-1.5 text-sm font-medium text-text hover:border-gold hover:text-primary"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10">
          <div className="rounded-3xl border border-dashed border-gold/50 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-text">
              <BookOpen aria-hidden className="size-4" /> Relevant coursework
            </h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {courses.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <span aria-hidden className="size-1 rotate-45 bg-gold" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
