"use client";

import { Moon, Sun } from "lucide-react";

/**
 * Day (ivory) / night (wine) toggle.
 * Icons swap purely via CSS (`dark:` variant), so there is no hydration
 * mismatch and no flash. The choice is persisted in localStorage and
 * re-applied before paint by the inline script in layout.tsx.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";

    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };

    // Smooth cross-fade where the View Transitions API is supported.
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduceMotion) doc.startViewTransition(apply);
    else apply();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle day and night theme"
      title="Toggle theme"
      className="group relative grid size-10 place-items-center rounded-full border border-line text-primary transition-colors hover:border-gold hover:bg-surface-2"
    >
      <Sun
        aria-hidden
        className="size-[18px] transition-transform duration-500 group-hover:rotate-45 dark:hidden"
      />
      <Moon
        aria-hidden
        className="hidden size-[18px] transition-transform duration-500 group-hover:-rotate-12 dark:block"
      />
    </button>
  );
}
