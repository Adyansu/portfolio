"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Check, Copy, Pause, Play, RotateCcw } from "lucide-react";
import {
  analyze,
  fromSlider,
  LOG_STEPS,
  netlist,
  SAMPLES,
  si,
  simulate,
  toSlider,
  type Mode,
  type Params,
} from "@/lib/circuit";
import { GitHubIcon } from "../icons";
import { Schematic, type SchematicHandle } from "./schematic";
import { WaveChart } from "./wave-chart";

const PLAY_SECONDS = 3.2; // real time for one sweep of the simulation window
const FLOW_SPEED = 160; // px/s of dot travel at peak current

const MODES: { id: Mode; label: string }[] = [
  { id: "RC", label: "RC" },
  { id: "RL", label: "RL" },
  { id: "RLC", label: "RLC" },
];

const PRESETS: { label: string; mode: Mode; params: Params }[] = [
  { label: "Ringing", mode: "RLC", params: { V: 5, R: 4, L: 0.01, C: 1e-4 } },
  { label: "Critically damped", mode: "RLC", params: { V: 5, R: 20, L: 0.01, C: 1e-4 } },
  { label: "Overdamped", mode: "RLC", params: { V: 5, R: 200, L: 0.01, C: 1e-4 } },
  { label: "Slow charge", mode: "RC", params: { V: 5, R: 1000, L: 0.01, C: 4.7e-4 } },
  { label: "Inductor ramp", mode: "RL", params: { V: 5, R: 100, L: 0.5, C: 1e-4 } },
];

const RANGES = {
  R: { min: 1, max: 10_000, unit: "Ω", label: "Resistance" },
  L: { min: 1e-4, max: 1, unit: "H", label: "Inductance" },
  C: { min: 1e-7, max: 1e-3, unit: "F", label: "Capacitance" },
} as const;

function LogSlider({
  k,
  value,
  onChange,
}: {
  k: keyof typeof RANGES;
  value: number;
  onChange: (v: number) => void;
}) {
  const r = RANGES[k];
  const id = `slider-${k}`;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-semibold">
          {r.label} <span className="font-serif italic text-muted">{k}</span>
        </label>
        <output htmlFor={id} className="font-mono text-sm font-semibold text-primary">
          {si(value, r.unit, 2)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={LOG_STEPS}
        value={toSlider(value, r.min, r.max)}
        onChange={(e) => onChange(fromSlider(Number(e.target.value), r.min, r.max))}
        aria-valuetext={si(value, r.unit, 2)}
        className="w-full accent-[var(--primary)]"
      />
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-bg/60 p-3">
      {/* No `uppercase`: it would turn ζ/τ into Ζ/Τ, which read as Latin Z/T */}
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-0.5 font-mono text-lg font-semibold text-primary">{value}</p>
      {hint && <p className="text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

export function CircuitLab() {
  const reduce = useReducedMotion() ?? false;
  const [mode, setMode] = useState<Mode>("RLC");
  const [params, setParams] = useState<Params>(PRESETS[0].params);
  const [playing, setPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(SAMPLES - 1);
  const [hover, setHover] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const [copied, setCopied] = useState(false);

  const sim = useMemo(() => simulate(mode, params), [mode, params]);
  const info = useMemo(() => analyze(mode, params), [mode, params]);

  const root = useRef<HTMLDivElement>(null);
  const schematic = useRef<SchematicHandle>(null);
  const flow = useRef(0);
  const autoplayed = useRef(false);
  const live = useRef({ playing, playhead, hover, sim });
  useEffect(() => {
    live.current = { playing, playhead, hover, sim };
  }, [playing, playhead, hover, sim]);

  function replay() {
    setHover(null);
    setPlayhead(0);
    setPlaying(true);
  }

  // Track visibility: autoplay the first time the lab is seen; pause rAF offscreen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && !autoplayed.current && !reduce) {
          autoplayed.current = true;
          setPlayhead(0);
          setPlaying(true);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  // Animation loop: advances playback and moves the current-flow dots.
  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const L = live.current;
      let ph = L.playhead;
      if (L.playing) {
        ph = Math.min(SAMPLES - 1, ph + (dt / PLAY_SECONDS) * (SAMPLES - 1));
        L.playhead = ph;
        setPlayhead(ph);
        if (ph >= SAMPLES - 1) {
          L.playing = false;
          setPlaying(false);
        }
      }
      const k = L.hover ?? Math.round(ph);
      const rel = L.sim.iPeak ? L.sim.i[k] / L.sim.iPeak : 0;
      flow.current += rel * FLOW_SPEED * dt;
      schematic.current?.setFlow(flow.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  function update(next: Partial<Params>, nextMode: Mode = mode) {
    setParams((p) => ({ ...p, ...next }));
    setMode(nextMode);
    setPlaying(false);
    setPlayhead(SAMPLES - 1);
  }

  const reveal = playing ? playhead : SAMPLES - 1;
  const cursor = hover ?? Math.round(reveal);
  const vNow = sim.v[cursor];
  const iNow = sim.i[cursor];
  const net = netlist(mode, params, sim.T);

  let vPeak = 0;
  for (const v of sim.v) vPeak = Math.max(vPeak, v);

  async function copyNetlist() {
    try {
      await navigator.clipboard.writeText(net);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <div ref={root} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-gold font-serif text-lg font-semibold text-primary">
            Ω
          </span>
          <div>
            <p className="font-serif text-2xl font-semibold leading-none text-primary-strong dark:text-text">
              Circuit Lab
            </p>
            <p className="text-xs text-muted">Transient step response, solved live in your browser</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LayoutGroup id="circuit-mode">
            <div role="group" aria-label="Circuit type" className="flex rounded-full border border-line bg-surface p-1">
              {MODES.map((m) => {
                const active = m.id === mode;
                return (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update({}, m.id)}
                    className={`relative rounded-full px-4 py-1.5 font-mono text-sm font-semibold transition-colors ${
                      active ? "text-on-primary" : "text-primary hover:text-primary-strong"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="circuit-mode-pill"
                        className="absolute inset-0 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
          <button
            type="button"
            onClick={() => (playing ? setPlaying(false) : playhead >= SAMPLES - 1 ? replay() : setPlaying(true))}
            aria-label={playing ? "Pause simulation playback" : "Play simulation"}
            className="grid size-10 place-items-center rounded-full bg-primary text-on-primary shadow-soft transition-transform hover:-translate-y-0.5"
          >
            {playing ? <Pause className="size-4" /> : playhead >= SAMPLES - 1 ? <RotateCcw className="size-4" /> : <Play className="size-4" />}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr]">
        {/* Controls */}
        <div className="space-y-6 border-b border-line p-5 lg:border-b-0 lg:border-r">
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label htmlFor="slider-V" className="text-sm font-semibold">
                Source <span className="font-serif italic text-muted">V</span>
              </label>
              <output htmlFor="slider-V" className="font-mono text-sm font-semibold text-primary">
                {si(params.V, "V")}
              </output>
            </div>
            <input
              id="slider-V"
              type="range"
              min={1}
              max={12}
              step={0.5}
              value={params.V}
              onChange={(e) => update({ V: Number(e.target.value) })}
              className="w-full accent-[var(--primary)]"
            />
          </div>
          <LogSlider k="R" value={params.R} onChange={(R) => update({ R })} />
          {mode !== "RC" && <LogSlider k="L" value={params.L} onChange={(L) => update({ L })} />}
          {mode !== "RL" && <LogSlider k="C" value={params.C} onChange={(C) => update({ C })} />}

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-text">Presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setParams(p.params);
                    setMode(p.mode);
                    replay();
                  }}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-gold hover:bg-surface-2"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2">
            {info.kind === "first-order" ? (
              <>
                <Metric label="Time constant τ" value={si(info.tau, "s")} hint={mode === "RC" ? "τ = RC" : "τ = L / R"} />
                <Metric label="Settles in" value={si(5 * info.tau, "s")} hint="≈ 5τ (99.3%)" />
                <Metric
                  label={mode === "RC" ? "Peak current" : "Final current"}
                  value={si(params.V / params.R, "A")}
                  hint="V / R"
                />
                <Metric label={`Final ${sim.vLabel}`} value={si(sim.v[SAMPLES - 1], "V")} />
              </>
            ) : (
              <>
                <Metric label="Natural freq f₀" value={si(info.f0, "Hz")} hint="1 / 2π√(LC)" />
                <Metric label="Damping ζ" value={info.zeta.toFixed(3)} hint="(R/2)·√(C/L)" />
                <Metric
                  label="Peak V_C"
                  value={si(vPeak, "V")}
                  hint={vPeak > params.V * 1.001 ? `${(((vPeak - params.V) / params.V) * 100).toFixed(1)}% overshoot` : "no overshoot"}
                />
                <div className="grid place-items-center rounded-2xl border border-gold/60 bg-surface-2 p-3 text-center">
                  <p className="font-serif text-lg font-semibold italic leading-tight text-primary">{info.regime}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Visuals */}
        <div className="min-w-0 p-5">
          <div className="grid items-center gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
            <div className="mx-auto w-full max-w-[420px]">
              <Schematic ref={schematic} mode={mode} params={params} vNow={vNow} iNow={iNow} iPeak={sim.iPeak} />
            </div>
            <div>
              <WaveChart sim={sim} reveal={reveal} cursor={cursor} onCursor={setHover} />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 font-mono text-xs">
                <span className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[var(--chart-v)]">
                    <span className="h-0.5 w-4 bg-[var(--chart-v)]" /> {sim.vLabel}
                  </span>
                  <span className="flex items-center gap-1.5 text-[var(--chart-i)]">
                    <span className="h-0 w-4 border-t-2 border-dashed border-[var(--chart-i)]" /> I
                  </span>
                </span>
                <span className="text-muted">
                  t = {si(sim.t[cursor], "s")} · {hover === null ? "hover the chart to scrub" : "scrubbing"}
                </span>
              </div>
            </div>
          </div>

          {/* Explainers */}
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <details className="group rounded-2xl border border-line p-4 open:bg-bg/60">
              <summary className="cursor-pointer list-none text-sm font-semibold text-primary marker:hidden">
                <span className="mr-1 inline-block transition-transform group-open:rotate-90">›</span> How it works
              </summary>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                <p>
                  Each circuit is written as a state-space system <span className="font-mono">x′ = A·x + b</span> (inductor
                  current and capacitor voltage as states) and stepped with <strong>BDF2 (Gear-2)</strong>, the stiff-stable
                  integration method SPICE offers for <span className="font-mono">.tran</span> analysis.
                </p>
                <p>
                  The step size adapts to the fastest pole, so even a heavily overdamped circuit stays accurate. Results
                  match the analytic solutions to within 0.01%. Gold dots move at a speed proportional to the current.
                </p>
              </div>
            </details>
            <details className="group rounded-2xl border border-line p-4 open:bg-bg/60">
              <summary className="cursor-pointer list-none text-sm font-semibold text-primary marker:hidden">
                <span className="mr-1 inline-block transition-transform group-open:rotate-90">›</span> SPICE netlist
              </summary>
              <div className="relative mt-3">
                <pre className="overflow-x-auto rounded-xl bg-[#2b1b17] p-3 font-mono text-xs leading-relaxed text-[#f0d79a]">
                  {net}
                </pre>
                <button
                  type="button"
                  onClick={copyNetlist}
                  aria-label={copied ? "Netlist copied" : "Copy netlist"}
                  className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/10 text-[#f0d79a] hover:bg-white/20"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </button>
                <a
                  href="https://github.com/Adyansu/SpiceLite"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <GitHubIcon className="size-3.5" /> SpiceLite, my C++ simulator
                </a>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
