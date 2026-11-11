"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import type { Project } from "@/data/resume";
import { GitHubIcon } from "../icons";
import { CategoryIcon } from "./category-icon";

/**
 * Case-study dialog built on native <dialog>: focus trapping, Esc to close
 * and an inert background come for free.
 */
export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (project && !d.open) d.showModal();
    if (!project && d.open) d.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="project-modal-title"
      className="project-modal m-auto w-[min(720px,calc(100vw-2rem))] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-3xl border border-gold/50 bg-surface p-0 text-text shadow-soft backdrop:bg-[rgb(43_27_23/0.55)] backdrop:backdrop-blur-sm"
    >
      {project && (
        <article>
          <header className="relative overflow-hidden border-b border-line bg-surface-2 px-6 pb-6 pt-8 sm:px-10">
            <CategoryIcon
              category={project.category}
              className="absolute -right-6 -top-6 size-40 text-gold opacity-15"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-text">
              {project.category}
              {project.period ? ` · ${project.period}` : ""}
            </p>
            <h3
              id="project-modal-title"
              className="mt-2 font-serif text-4xl font-semibold text-primary-strong dark:text-text"
            >
              {project.title}
            </h3>
            <p className="mt-1 text-muted">{project.subtitle}</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-line bg-surface text-primary transition-colors hover:border-gold"
            >
              <X className="size-5" />
            </button>
          </header>

          <div className="space-y-6 px-6 py-8 sm:px-10">
            <p className="text-lg leading-relaxed">{project.summary}</p>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold-text">
                What I built
              </h4>
              <ul className="space-y-3">
                {project.points.map((p) => (
                  <li key={p} className="flex gap-3 leading-relaxed text-muted">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-gold" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold-text">Stack</h4>
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li key={s} className="rounded-full bg-surface-2 px-3 py-1 text-sm font-semibold text-primary">
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {(project.github || project.live) && (
              <div className="flex flex-wrap gap-3 border-t border-line pt-6">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary"
                  >
                    <GitHubIcon className="size-4" /> View source
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-gold px-5 py-2.5 text-sm font-semibold text-primary"
                  >
                    <ExternalLink aria-hidden className="size-4" /> Live demo
                  </a>
                )}
              </div>
            )}
          </div>
        </article>
      )}
    </dialog>
  );
}
