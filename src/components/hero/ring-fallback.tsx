/** Lightweight SVG ring: placeholder while 3D loads, and fallback without WebGL. */
export function RingFallback({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id="platinum-band" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7f7f8" />
          <stop offset="0.45" stopColor="#c9cbd0" />
          <stop offset="0.7" stopColor="#8e929b" />
          <stop offset="1" stopColor="#e5e4e2" />
        </linearGradient>
        <linearGradient id="sapphire" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b86f0" />
          <stop offset="1" stopColor="#0b2370" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="112" r="62" fill="none" stroke="url(#platinum-band)" strokeWidth="16" />
      <path d="M86 52 L114 52 L110 44 L90 44 Z" fill="url(#platinum-band)" />
      <path d="M80 32 L120 32 L100 56 Z M86 22 L114 22 L120 32 L80 32 Z" fill="url(#sapphire)" />
    </svg>
  );
}
