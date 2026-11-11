"use client";

import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from "react";
import { SAMPLES, si, type Simulation } from "@/lib/circuit";

// The viewBox tracks the rendered width so axis labels stay at real pixel sizes
// on phones instead of being scaled down to an unreadable size.
const VH = 270;
const PL = 52, PR = 56, PT = 16, PB = 34;
const PH = VH - PT - PB;

function scale(values: Float64Array) {
  let lo = 0, hi = 0;
  for (const v of values) {
    lo = Math.min(lo, v);
    hi = Math.max(hi, v);
  }
  const pad = (hi - lo || 1) * 0.1;
  return { lo: lo < 0 ? lo - pad : 0, hi: hi + pad };
}

type Props = {
  sim: Simulation;
  reveal: number; // index up to which traces are drawn (playback)
  cursor: number; // index for the crosshair
  onCursor: (k: number | null) => void;
};

export function WaveChart({ sim, reveal, cursor, onCursor }: Props) {
  const clipId = useId();
  const gradId = useId();
  const box = useRef<SVGSVGElement>(null);
  const [VW, setVW] = useState(640);
  const PW = VW - PL - PR;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setVW(Math.max(300, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const geo = useMemo(() => {
    const vs = scale(sim.v);
    const is = scale(sim.i);
    const x = (k: number) => PL + (k / (SAMPLES - 1)) * PW;
    const yV = (v: number) => PT + PH - ((v - vs.lo) / (vs.hi - vs.lo)) * PH;
    const yI = (i: number) => PT + PH - ((i - is.lo) / (is.hi - is.lo)) * PH;
    let vPath = "", iPath = "";
    for (let k = 0; k < SAMPLES; k++) {
      vPath += `${k ? "L" : "M"}${x(k).toFixed(1)} ${yV(sim.v[k]).toFixed(1)}`;
      iPath += `${k ? "L" : "M"}${x(k).toFixed(1)} ${yI(sim.i[k]).toFixed(1)}`;
    }
    const area = `${vPath}L${x(SAMPLES - 1)} ${yV(Math.max(0, vs.lo))}L${PL} ${yV(Math.max(0, vs.lo))}Z`;
    return { vs, is, x, yV, yI, vPath, iPath, area };
  }, [sim, PW]);

  function onMove(e: PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * VW;
    const k = Math.round(((px - PL) / PW) * (SAMPLES - 1));
    onCursor(Math.max(0, Math.min(SAMPLES - 1, k)));
  }

  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const cx = geo.x(cursor);

  return (
    <svg
      ref={box}
      viewBox={`0 0 ${VW} ${VH}`}
      className="h-auto w-full touch-pan-y select-none"
      onPointerMove={onMove}
      onPointerLeave={() => onCursor(null)}
      role="img"
      aria-label={`Step response over ${si(sim.T, "s")}: ${sim.vLabel} rises to ${si(
        sim.v[SAMPLES - 1],
        "V",
      )}, current peaks at ${si(sim.iPeak, "A")}.`}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={0} width={geo.x(reveal) + 1} height={VH} />
        </clipPath>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--chart-v)" stopOpacity={0.22} />
          <stop offset="1" stopColor="var(--chart-v)" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Grid + axes */}
      {ticks.map((f) => {
        const y = PT + PH * (1 - f);
        const x = PL + PW * f;
        return (
          <g key={f}>
            <line x1={PL} x2={PL + PW} y1={y} y2={y} stroke="var(--border)" />
            <line x1={x} x2={x} y1={PT} y2={PT + PH} stroke="var(--border)" strokeDasharray="2 4" />
            <text x={PL - 8} y={y + 4} textAnchor="end" className="fill-[var(--chart-v)] font-mono text-[10px]">
              {si(geo.vs.lo + (geo.vs.hi - geo.vs.lo) * f, "V", 2)}
            </text>
            <text x={PL + PW + 8} y={y + 4} className="fill-[var(--chart-i)] font-mono text-[10px]">
              {si(geo.is.lo + (geo.is.hi - geo.is.lo) * f, "A", 2)}
            </text>
            <text x={x} y={VH - 12} textAnchor="middle" className="fill-[var(--text-muted)] font-mono text-[10px]">
              {si(sim.T * f, "s", 2)}
            </text>
          </g>
        );
      })}
      {geo.vs.lo < 0 && (
        <line x1={PL} x2={PL + PW} y1={geo.yV(0)} y2={geo.yV(0)} stroke="var(--text-muted)" strokeOpacity={0.5} />
      )}

      {/* Traces, revealed left→right during playback */}
      <g clipPath={`url(#${clipId})`}>
        <path d={geo.area} fill={`url(#${gradId})`} />
        <path d={geo.iPath} fill="none" stroke="var(--chart-i)" strokeWidth={2} strokeDasharray="6 4" />
        <path d={geo.vPath} fill="none" stroke="var(--chart-v)" strokeWidth={2.5} strokeLinejoin="round" />
      </g>

      {/* Crosshair */}
      <line x1={cx} x2={cx} y1={PT} y2={PT + PH} stroke="var(--gold)" strokeWidth={1.5} />
      <circle cx={cx} cy={geo.yV(sim.v[cursor])} r={4.5} fill="var(--chart-v)" stroke="var(--surface)" strokeWidth={2} />
      <circle cx={cx} cy={geo.yI(sim.i[cursor])} r={4.5} fill="var(--chart-i)" stroke="var(--surface)" strokeWidth={2} />
    </svg>
  );
}
