/**
 * Tiny transient circuit solver for the Circuit Lab.
 *
 * Each circuit is a linear state-space system  x' = A·x + b  (step input at t = 0,
 * everything at rest). It is integrated with BDF2 (Gear-2), the stiff-stable
 * method SPICE offers for `.tran`, so even heavily overdamped circuits don't
 * blow up the way explicit methods (Euler / RK4) would.
 */

export type Mode = "RC" | "RL" | "RLC";
export type Params = { V: number; R: number; L: number; C: number };

export type Simulation = {
  t: Float64Array;
  v: Float64Array; // voltage across C (RC, RLC) or L (RL)
  i: Float64Array; // loop current
  T: number;
  vLabel: string;
  iPeak: number;
};

export const SAMPLES = 600;
const SUBSTEPS = 4;

type Vec2 = [number, number];
type Mat2 = [[number, number], [number, number]];

function system(mode: Mode, { V, R, L, C }: Params): { A: Mat2; b: Vec2 } {
  switch (mode) {
    case "RC": // x = [vC]
      return { A: [[-1 / (R * C), 0], [0, 0]], b: [V / (R * C), 0] };
    case "RL": // x = [i]
      return { A: [[-R / L, 0], [0, 0]], b: [V / L, 0] };
    case "RLC": // x = [i, vC]
      return { A: [[-R / L, -1 / L], [1 / C, 0]], b: [V / L, 0] };
  }
}

/** Solve (k·I − h·A)·x = r for a 2×2 system. */
function solve(k: number, h: number, A: Mat2, r: Vec2): Vec2 {
  const m00 = k - h * A[0][0];
  const m01 = -h * A[0][1];
  const m10 = -h * A[1][0];
  const m11 = k - h * A[1][1];
  const det = m00 * m11 - m01 * m10;
  return [(r[0] * m11 - m01 * r[1]) / det, (m00 * r[1] - m10 * r[0]) / det];
}

export type Analysis =
  | { kind: "first-order"; tau: number }
  | { kind: "second-order"; alpha: number; w0: number; f0: number; zeta: number; regime: string };

export function analyze(mode: Mode, { R, L, C }: Params): Analysis {
  if (mode === "RC") return { kind: "first-order", tau: R * C };
  if (mode === "RL") return { kind: "first-order", tau: L / R };
  const alpha = R / (2 * L);
  const w0 = 1 / Math.sqrt(L * C);
  const zeta = alpha / w0;
  const regime =
    Math.abs(zeta - 1) < 0.02 ? "Critically damped" : zeta < 1 ? "Underdamped" : "Overdamped";
  return { kind: "second-order", alpha, w0, f0: w0 / (2 * Math.PI), zeta, regime };
}

/** Simulation window: long enough to show the circuit settle (or ring a few times). */
export function timeWindow(mode: Mode, p: Params) {
  const a = analyze(mode, p);
  if (a.kind === "first-order") return 5 * a.tau;
  const alpha = p.R / (2 * p.L);
  const w0 = 1 / Math.sqrt(p.L * p.C);
  if (alpha < w0) {
    const wd = Math.sqrt(w0 * w0 - alpha * alpha);
    return Math.min(5 / alpha, (8 * 2 * Math.PI) / wd);
  }
  const slow = alpha - Math.sqrt(alpha * alpha - w0 * w0); // slowest pole
  return 7 / slow;
}

/** Magnitude of the fastest natural frequency (1/s). */
function fastestRate(mode: Mode, p: Params) {
  const a = analyze(mode, p);
  if (a.kind === "first-order") return 1 / a.tau;
  const alpha = p.R / (2 * p.L);
  const w0 = 1 / Math.sqrt(p.L * p.C);
  return alpha > w0 ? alpha + Math.sqrt(alpha * alpha - w0 * w0) : w0;
}

export function simulate(mode: Mode, p: Params): Simulation {
  const { A, b } = system(mode, p);
  const T = timeWindow(mode, p);
  const n = SAMPLES;
  // Resolve the fastest pole with ~10 steps per time constant (stiff overdamped
  // circuits need many more substeps than gentle ones).
  const fast = fastestRate(mode, p);
  const substeps = Math.min(200, Math.max(SUBSTEPS, Math.ceil((fast * T) / (n - 1) / 0.1)));
  const h = T / ((n - 1) * substeps);

  const t = new Float64Array(n);
  const v = new Float64Array(n);
  const i = new Float64Array(n);

  let prev: Vec2 = [0, 0];
  let x: Vec2 = [0, 0];
  let first = true;

  const record = (k: number, s: Vec2) => {
    t[k] = (k * T) / (n - 1);
    if (mode === "RC") {
      v[k] = s[0];
      i[k] = (p.V - s[0]) / p.R;
    } else if (mode === "RL") {
      i[k] = s[0];
      v[k] = p.V - s[0] * p.R;
    } else {
      i[k] = s[0];
      v[k] = s[1];
    }
  };
  record(0, x);

  for (let k = 1; k < n; k++) {
    for (let s = 0; s < substeps; s++) {
      let next: Vec2;
      if (first) {
        // Backward Euler bootstrap: (I − hA)x₁ = x₀ + h·b
        next = solve(1, h, A, [x[0] + h * b[0], x[1] + h * b[1]]);
        first = false;
      } else {
        // BDF2: (3I − 2hA)xₙ₊₁ = 4xₙ − xₙ₋₁ + 2h·b
        next = solve(3, 2 * h, A, [
          4 * x[0] - prev[0] + 2 * h * b[0],
          4 * x[1] - prev[1] + 2 * h * b[1],
        ]);
      }
      prev = x;
      x = next;
    }
    record(k, x);
  }

  let iPeak = 0;
  for (const val of i) iPeak = Math.max(iPeak, Math.abs(val));

  return { t, v, i, T, vLabel: mode === "RL" ? "V_L" : "V_C", iPeak };
}

/* ---------- formatting ---------- */

const PREFIXES: [number, string][] = [
  [1e6, "M"],
  [1e3, "k"],
  [1, ""],
  [1e-3, "m"],
  [1e-6, "µ"],
  [1e-9, "n"],
];

/** 0.0047 → "4.7 m" + unit */
export function si(x: number, unit: string, digits = 3): string {
  if (!Number.isFinite(x)) return "—";
  if (Math.abs(x) < 1e-12) return `0 ${unit}`;
  const a = Math.abs(x);
  const [f, p] = PREFIXES.find(([f]) => a >= f * 0.9995) ?? PREFIXES[PREFIXES.length - 1];
  return `${Number((x / f).toPrecision(digits))} ${p}${unit}`;
}

/** SPICE-style number: 0.0001 → "100u", 4700 → "4.7k" */
export function spiceNum(x: number): string {
  const table: [number, string][] = [
    [1e6, "meg"],
    [1e3, "k"],
    [1, ""],
    [1e-3, "m"],
    [1e-6, "u"],
    [1e-9, "n"],
  ];
  const [f, p] = table.find(([f]) => Math.abs(x) >= f * 0.9995) ?? table[table.length - 1];
  return `${Number((x / f).toPrecision(3))}${p}`;
}

export function netlist(mode: Mode, p: Params, T: number): string {
  const lines = [`* Circuit Lab: ${mode} step response`, `V1 1 0 DC ${spiceNum(p.V)}`];
  if (mode === "RC") lines.push(`R1 1 2 ${spiceNum(p.R)}`, `C1 2 0 ${spiceNum(p.C)}`);
  if (mode === "RL") lines.push(`R1 1 2 ${spiceNum(p.R)}`, `L1 2 0 ${spiceNum(p.L)}`);
  if (mode === "RLC")
    lines.push(`R1 1 2 ${spiceNum(p.R)}`, `L1 2 3 ${spiceNum(p.L)}`, `C1 3 0 ${spiceNum(p.C)}`);
  lines.push(`.tran ${spiceNum(T / (SAMPLES - 1))} ${spiceNum(T)}`, ".end");
  return lines.join("\n");
}

/* ---------- log sliders ---------- */

export const LOG_STEPS = 1000;
export function fromSlider(pos: number, min: number, max: number) {
  const raw = min * Math.pow(max / min, pos / LOG_STEPS);
  return Number(raw.toPrecision(2)); // snap to 2 significant figures
}
export function toSlider(value: number, min: number, max: number) {
  return Math.round((Math.log(value / min) / Math.log(max / min)) * LOG_STEPS);
}
