"use client";

import { useImperativeHandle, useRef, type Ref } from "react";
import { si, type Mode, type Params } from "@/lib/circuit";

/* Loop geometry: current flows clockwise around this rectangle. */
const X0 = 50, X1 = 330, Y0 = 40, Y1 = 190;
const W = X1 - X0, H = Y1 - Y0;
const PERIMETER = 2 * (W + H);
export const DOTS = 16;

/** Point at arc-length s along the loop (clockwise from the source's + terminal). */
function pointAt(s: number): [number, number] {
  s = ((s % PERIMETER) + PERIMETER) % PERIMETER;
  const leftUp = (Y1 - Y0) / 2; // from source mid up to top-left corner
  if (s < leftUp) return [X0, (Y0 + Y1) / 2 - s];
  s -= leftUp;
  if (s < W) return [X0 + s, Y0];
  s -= W;
  if (s < H) return [X1, Y0 + s];
  s -= H;
  if (s < W) return [X1 - s, Y1];
  s -= W;
  return [X0, Y1 - s];
}

export type SchematicHandle = { setFlow: (offset: number) => void };

function Resistor({ x, y, vertical = false }: { x: number; y: number; vertical?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${vertical ? 90 : 0})`}>
      <rect x={-34} y={-12} width={68} height={24} fill="var(--surface)" />
      <polyline
        points="-34,0 -25,0 -20,-9 -12,9 -4,-9 4,9 12,-9 20,9 25,0 34,0"
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </g>
  );
}

function Inductor({ x, y, vertical = false, glow }: { x: number; y: number; vertical?: boolean; glow: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${vertical ? 90 : 0})`}>
      <rect x={-34} y={-14} width={68} height={22} fill="var(--surface)" />
      <ellipse cx={0} cy={-2} rx={34} ry={14} fill="var(--gold)" opacity={0.35 * glow} />
      <path
        d="M-34 0 H-28 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 a7 7 0 0 1 14 0 H34"
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2.5}
      />
    </g>
  );
}

function Capacitor({ x, y, vertical = false, charge }: { x: number; y: number; vertical?: boolean; charge: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${vertical ? 90 : 0})`}>
      <rect x={-8} y={-20} width={16} height={40} fill="var(--surface)" />
      <rect x={-5} y={-16} width={10} height={32} fill="var(--gold)" opacity={0.75 * Math.min(1, Math.abs(charge))} />
      <line x1={-6} y1={-18} x2={-6} y2={18} stroke="var(--primary)" strokeWidth={3} />
      <line x1={6} y1={-18} x2={6} y2={18} stroke="var(--primary)" strokeWidth={3} />
    </g>
  );
}

function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="fill-[var(--text-muted)] font-sans text-[13px] font-semibold">
      {children}
    </text>
  );
}

type Props = {
  mode: Mode;
  params: Params;
  vNow: number;
  iNow: number;
  iPeak: number;
  ref?: Ref<SchematicHandle>;
};

/** Live schematic: gold dots ride the loop at a speed set by the current. */
export function Schematic({ mode, params, vNow, iNow, iPeak, ref }: Props) {
  const dots = useRef<(SVGCircleElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    setFlow(offset: number) {
      dots.current.forEach((c, k) => {
        if (!c) return;
        const [x, y] = pointAt(offset + (k * PERIMETER) / DOTS);
        c.setAttribute("cx", x.toFixed(1));
        c.setAttribute("cy", y.toFixed(1));
      });
    },
  }));

  const midY = (Y0 + Y1) / 2;
  const charge = params.V ? vNow / params.V : 0;
  const glow = iPeak ? (iNow / iPeak) ** 2 : 0;

  return (
    <svg
      viewBox="0 0 420 230"
      role="img"
      aria-label={`${mode} circuit schematic: ${si(params.V, "V")} step source with ${mode
        .split("")
        .join(", ")} in series`}
      className="h-auto w-full"
    >
      {/* Wire loop */}
      <rect x={X0} y={Y0} width={W} height={H} rx={6} fill="none" stroke="var(--text-muted)" strokeOpacity={0.55} strokeWidth={2} />

      {/* Charge carriers */}
      <g>
        {Array.from({ length: DOTS }, (_, k) => {
          const [x, y] = pointAt((k * PERIMETER) / DOTS);
          return (
            <circle
              key={k}
              ref={(el) => {
                dots.current[k] = el;
              }}
              cx={x}
              cy={y}
              r={3.2}
              fill="var(--gold)"
            />
          );
        })}
      </g>

      {/* Source */}
      <g transform={`translate(${X0} ${midY})`}>
        <circle r={20} fill="var(--surface)" stroke="var(--primary)" strokeWidth={2.5} />
        <text y={-4} textAnchor="middle" className="fill-[var(--primary)] font-sans text-[14px] font-bold">+</text>
        <text y={13} textAnchor="middle" className="fill-[var(--primary)] font-sans text-[14px] font-bold">−</text>
      </g>
      <Label x={X0 - 28} y={midY + 4} anchor="end">{si(params.V, "V")}</Label>

      {/* Components */}
      <Resistor x={X0 + 90} y={Y0} />
      <Label x={X0 + 90} y={Y0 - 18}>{`R ${si(params.R, "Ω", 2)}`}</Label>

      {mode === "RC" && (
        <>
          <Capacitor x={X1} y={midY} vertical charge={charge} />
          <Label x={X1 + 16} y={midY + 4} anchor="start">{`C ${si(params.C, "F", 2)}`}</Label>
        </>
      )}
      {mode === "RL" && (
        <>
          <Inductor x={X1} y={midY} vertical glow={glow} />
          <Label x={X1 + 22} y={midY + 4} anchor="start">{`L ${si(params.L, "H", 2)}`}</Label>
        </>
      )}
      {mode === "RLC" && (
        <>
          <Inductor x={X0 + 200} y={Y0} glow={glow} />
          <Label x={X0 + 200} y={Y0 - 22}>{`L ${si(params.L, "H", 2)}`}</Label>
          <Capacitor x={X1} y={midY} vertical charge={charge} />
          <Label x={X1 + 16} y={midY + 4} anchor="start">{`C ${si(params.C, "F", 2)}`}</Label>
        </>
      )}

      {/* Live meters */}
      <text x={X0 + 20} y={Y1 + 30} className="fill-[var(--chart-v)] font-mono text-[12px] font-semibold">
        {`V = ${si(vNow, "V")}`}
      </text>
      <text x={X1 - 20} y={Y1 + 30} textAnchor="end" className="fill-[var(--chart-i)] font-mono text-[12px] font-semibold">
        {`I = ${si(iNow, "A")}`}
      </text>
    </svg>
  );
}
