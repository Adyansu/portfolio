"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useState, useSyncExternalStore } from "react";
import { RingFallback } from "./ring-fallback";

// Three.js is code-split and only loaded in the browser.
const RingScene = dynamic(() => import("./ring-scene"), { ssr: false });

let webglCache: boolean | undefined;
function detectWebGL() {
  if (webglCache === undefined) {
    try {
      const c = document.createElement("canvas");
      webglCache = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglCache = false;
    }
  }
  return webglCache;
}
const noop = () => () => {};

export function HeroVisual() {
  const reducedMotion = useReducedMotion() ?? false;
  // false on the server, real value on the client (no hydration mismatch).
  const webgl = useSyncExternalStore(noop, detectWebGL, () => false);
  const [ready, setReady] = useState(false);

  return (
    <div className="relative aspect-square w-full max-w-[560px]">
      {/* Warm glow behind the ring */}
      <div
        aria-hidden
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,var(--gold-soft)_0%,transparent_68%)] opacity-80 dark:opacity-50"
      />
      {/* Static ring shows until the 3D scene fades in (and is the fallback without WebGL) */}
      <RingFallback
        className={`absolute inset-[18%] transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {webgl && <RingScene reducedMotion={reducedMotion} onReady={() => setReady(true)} />}
    </div>
  );
}
