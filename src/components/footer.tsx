import { ArrowUp, Mail } from "lucide-react";
import { navLinks, profile } from "@/data/resume";
import { GitHubIcon, LinkedInIcon } from "./icons";

export function Footer() {
  return (
    <footer className="bg-primary-strong text-[#f5ebdd] dark:border-t dark:border-line dark:bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <p className="font-serif text-4xl font-semibold">{profile.name}</p>
            <p className="mt-2 max-w-sm text-sm text-[#e8d5b0] dark:text-muted">
              {profile.role} · Crafted with Next.js, Three.js and a lot of gold.
            </p>
          </div>

          {/* Back to top: gold ring */}
          <a
            href="#top"
            aria-label="Back to top"
            className="group relative grid size-20 place-items-center rounded-full border-2 border-[#c9a24d] text-[#e8c77a] transition-colors hover:bg-[#c9a24d] hover:text-[#2b1b17]"
          >
            <span aria-hidden className="absolute -inset-2 rounded-full border border-[#c9a24d]/40 transition-transform duration-500 group-hover:scale-110" />
            <ArrowUp className="size-6 transition-transform group-hover:-translate-y-1" />
          </a>
        </div>

        <div className="my-10 h-px bg-gradient-to-r from-transparent via-[#c9a24d]/70 to-transparent" />

        <div className="flex flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="text-xs text-[#e8d5b0] dark:text-muted">
            © 2026 {profile.name}. All rights reserved.
          </p>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-[#f5ebdd]/80 transition-colors hover:text-[#e8c77a]">
                {l.label}
              </a>
            ))}
            <span aria-hidden className="h-4 w-px bg-[#c9a24d]/50" />
            <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-[#e8c77a]">
              <GitHubIcon className="size-5" />
            </a>
            {profile.socials.linkedin && (
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-[#e8c77a]">
                <LinkedInIcon className="size-5" />
              </a>
            )}
            <a href={`mailto:${profile.email}`} aria-label="Email" className="hover:text-[#e8c77a]">
              <Mail className="size-5" />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
