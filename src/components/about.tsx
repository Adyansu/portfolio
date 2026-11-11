import Image from "next/image";
import { aboutBio, aboutStats, profile } from "@/data/resume";
import { Reveal } from "./ui/reveal";

export function About() {
  return (
    <section id="about" className="border-t border-line bg-surface-2/40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_1.4fr] md:py-28">
        <Reveal className="relative mx-auto aspect-[4/5] w-64 sm:w-72">
          <div className="absolute -inset-3 rounded-[2rem] border border-gold/50" />
          <div className="relative size-full overflow-hidden rounded-[1.75rem] border-2 border-gold shadow-soft">
            <Image
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              fill
              sizes="(min-width: 640px) 288px, 256px"
              className="object-cover object-[50%_35%]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold-text">About</p>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-primary-strong sm:text-5xl dark:text-text">
            Engineer by training,
            <br />
            <span className="italic text-primary">interface builder</span> by choice.
          </h2>
          <div className="gold-rule my-6 max-w-xs" />
          <div className="space-y-4 text-base leading-relaxed text-muted sm:text-lg">
            {aboutBio.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-3">
            {aboutStats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line bg-surface p-4">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-serif text-2xl font-semibold text-primary sm:text-3xl">{s.value}</dd>
                <dd className="mt-1 text-xs leading-snug text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
