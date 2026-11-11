import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <Reveal className={`mb-12 ${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold-text">{eyebrow}</p>
      <h2 className="font-serif text-4xl font-semibold leading-tight text-primary-strong sm:text-5xl dark:text-text">
        {title}
      </h2>
      <div className={`gold-rule mt-6 max-w-xs ${center ? "mx-auto" : ""}`} />
      {intro && <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">{intro}</p>}
    </Reveal>
  );
}
