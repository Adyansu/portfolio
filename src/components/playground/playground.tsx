"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "../ui/section-heading";

function LabSkeleton() {
  return (
    <div
      aria-hidden
      className="h-[760px] animate-pulse rounded-3xl border border-line bg-surface lg:h-[600px]"
    />
  );
}

// Code-split: the lab's JS only downloads when the section approaches the viewport.
const CircuitLab = dynamic(() => import("./circuit-lab").then((m) => m.CircuitLab), {
  ssr: false,
  loading: LabSkeleton,
});

export function Playground() {
  const anchor = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="playground" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <SectionHeading
          eyebrow="Playground"
          title={
            <>
              Don&apos;t just read it. <span className="italic text-primary">Play with it.</span>
            </>
          }
          intro="A pocket-sized cousin of SpiceLite: pick a circuit, drag the components, and watch the step response get solved in real time. Hover the chart to scrub through time."
        />
        <div ref={anchor}>{near ? <CircuitLab /> : <LabSkeleton />}</div>
      </div>
    </section>
  );
}
