import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { profile } from "@/data/resume";

// Temporary foundation preview. The 3D hero replaces this in Step 3.
const swatches = [
  { name: "Wine", var: "--primary-strong" },
  { name: "Maroon / Gold", var: "--primary" },
  { name: "Gold", var: "--gold" },
  { name: "Champagne", var: "--gold-soft" },
  { name: "Surface", var: "--surface-2" },
  { name: "Text", var: "--text" },
];

export default function Home() {
  return (
    <main id="top" className="flex-1">
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_1fr] md:py-24">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-text">
            IIT Kanpur · {profile.role}
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-[1.05] text-primary-strong sm:text-6xl md:text-7xl dark:text-text">
            {profile.name}
          </h1>
          <div className="gold-rule my-6 max-w-xs" />
          <p className="max-w-xl text-lg leading-relaxed text-muted">{profile.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-soft transition-transform hover:-translate-y-0.5"
            >
              View projects
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gold px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-2"
            >
              <GitHubIcon className="size-4" />
              GitHub
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-gold"
            >
              <Mail aria-hidden className="size-4" />
              Email
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-64 sm:w-80">
          <div className="absolute -inset-3 rounded-full border border-gold/60" />
          <div className="absolute -inset-6 rounded-full border border-gold/25" />
          <div className="relative size-full overflow-hidden rounded-full border-4 border-gold shadow-soft">
            <Image
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              fill
              preload
              sizes="(min-width: 640px) 320px, 256px"
              className="object-cover object-[50%_30%]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <h2 className="mb-6 font-serif text-3xl text-primary-strong dark:text-text">
          Design tokens <span className="text-base italic text-muted">(toggle the theme to compare)</span>
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {swatches.map((s) => (
            <li key={s.var} className="rounded-xl border border-line bg-surface p-3">
              <div
                className="mb-3 h-16 rounded-lg border border-line"
                style={{ background: `var(${s.var})` }}
              />
              <p className="text-sm font-semibold">{s.name}</p>
              <p className="font-mono text-xs text-muted">{s.var}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
