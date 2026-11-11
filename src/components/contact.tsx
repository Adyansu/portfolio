"use client";

import { useState, type FormEvent } from "react";
import { Check, Copy, Download, Loader2, Mail, MapPin, Send } from "lucide-react";
import { profile } from "@/data/resume";
import { GitHubIcon, LinkedInIcon } from "./icons";
import { Reveal } from "./ui/reveal";
import { SectionHeading } from "./ui/section-heading";

/**
 * Optional: set NEXT_PUBLIC_WEB3FORMS_KEY (free at web3forms.com) to deliver
 * messages straight to your inbox. Without it the form opens a prefilled email.
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

function validate(data: { name: string; email: string; message: string }): Errors {
  const e: Errors = {};
  if (!data.name.trim()) e.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email address.";
  if (data.message.trim().length < 10) e.message = "Write at least a short sentence (10+ characters).";
  return e;
}

const field =
  "w-full rounded-2xl border border-line bg-surface px-4 py-3 text-text placeholder:text-muted/70 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (!WEB3FORMS_KEY) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio enquiry from ${data.name}`,
          from_name: "Portfolio contact form",
          ...data,
          botcheck: fd.get("botcheck") ? true : undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const clearError = (k: keyof Errors) => errors[k] && setErrors((e) => ({ ...e, [k]: undefined }));

  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let&apos;s build something <span className="italic text-primary">beautiful</span>
            </>
          }
          intro="I'm looking for frontend engineering roles and internships. Whether it's an opportunity, a project or just a hello, my inbox is open."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          {/* Direct channels */}
          <Reveal className="space-y-4">
            <div className="rounded-3xl border border-line bg-surface p-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold-text">Email</p>
              <div className="flex items-center justify-between gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="break-all font-serif text-xl font-semibold text-primary-strong hover:text-primary sm:text-2xl dark:text-text"
                >
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-primary transition-colors hover:border-gold"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </button>
              </div>
              <p aria-live="polite" className="mt-1 h-4 text-xs text-gold-text">
                {copied ? "Copied to clipboard" : ""}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-3xl border border-line bg-surface p-5 transition-colors hover:border-gold"
              >
                <GitHubIcon className="size-6 text-primary" />
                <span className="text-sm font-semibold">GitHub</span>
              </a>
              {profile.socials.linkedin ? (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-3xl border border-line bg-surface p-5 transition-colors hover:border-gold"
                >
                  <LinkedInIcon className="size-6 text-primary" />
                  <span className="text-sm font-semibold">LinkedIn</span>
                </a>
              ) : (
                <a
                  href={profile.resume}
                  download
                  className="group flex items-center gap-3 rounded-3xl border border-line bg-surface p-5 transition-colors hover:border-gold"
                >
                  <Download aria-hidden className="size-6 text-primary" />
                  <span className="text-sm font-semibold">Resume</span>
                </a>
              )}
            </div>

            <p className="flex items-center gap-2 px-2 text-sm text-muted">
              <MapPin aria-hidden className="size-4 text-gold-text" /> {profile.location}
            </p>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8"
            >
              {/* Honeypot for bots */}
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Priya Sharma"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    onChange={() => clearError("name")}
                    className={field}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs font-medium text-primary">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="priya@company.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    onChange={() => clearError("email")}
                    className={field}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs font-medium text-primary">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="mb-2 block text-sm font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="We're hiring a frontend engineer and loved your portfolio…"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  onChange={() => clearError("message")}
                  className={`${field} resize-y`}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1.5 text-xs font-medium text-primary">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {status === "sending" ? (
                    <Loader2 aria-hidden className="size-4 animate-spin" />
                  ) : WEB3FORMS_KEY ? (
                    <Send aria-hidden className="size-4" />
                  ) : (
                    <Mail aria-hidden className="size-4" />
                  )}
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
                <p aria-live="polite" className="text-sm font-medium">
                  {status === "sent" && <span className="text-gold-text">Thanks! I&apos;ll get back to you soon.</span>}
                  {status === "error" && (
                    <span className="text-primary">Couldn&apos;t send right now. Email me directly instead.</span>
                  )}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
