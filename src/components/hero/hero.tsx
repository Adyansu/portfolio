"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { profile } from "@/data/resume";
import { HeroVisual } from "./hero-visual";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const words = profile.name.split(" ");

  const fadeUp = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <section
      id="top"
      className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center gap-4 px-4 py-10 sm:px-6 md:grid-cols-[1.15fr_1fr] md:py-0"
    >
      <div className="relative z-10 order-2 md:order-1">
        <motion.p
          {...fadeUp(0)}
          className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-text"
        >
          IIT Kanpur · Final year · Open to frontend roles
        </motion.p>

        {/* Letter-by-letter name reveal */}
        <h1
          aria-label={profile.name}
          className="font-serif text-6xl font-semibold leading-[0.95] text-primary-strong sm:text-7xl lg:text-8xl dark:text-text"
        >
          {words.map((word, w) => (
            <span key={word} aria-hidden className="block overflow-hidden pb-2">
              {word.split("").map((ch, c) => (
                <motion.span
                  key={c}
                  className="inline-block"
                  initial={reduce ? { opacity: 0 } : { y: "110%" }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.15 + w * 0.25 + c * 0.04, ease }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9, ease }}
          className="gold-rule my-6 max-w-sm origin-left"
        />

        <motion.p {...fadeUp(1)} className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {profile.tagline}
        </motion.p>

        <motion.div {...fadeUp(1.25)} className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-soft transition-transform hover:-translate-y-0.5"
          >
            View my work
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-gold px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-2"
          >
            Get in touch
          </a>
          <span className="mx-1 hidden h-6 w-px bg-line sm:block" aria-hidden />
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="grid size-11 place-items-center rounded-full border border-line text-primary transition-colors hover:border-gold"
          >
            <GitHubIcon className="size-5" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Send an email"
            className="grid size-11 place-items-center rounded-full border border-line text-primary transition-colors hover:border-gold"
          >
            <Mail aria-hidden className="size-5" />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease }}
        className="order-1 mx-auto w-full max-w-[300px] sm:max-w-[420px] md:order-2 md:max-w-none"
      >
        <HeroVisual />
      </motion.div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-text md:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-gold" />
        </span>
      </a>
    </section>
  );
}
