/** Lightweight SVG ring: placeholder while 3D loads, and fallback without WebGL. */
export function RingFallback({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id="gold-band" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4dc9a" />
          <stop offset="0.45" stopColor="#c9a24d" />
          <stop offset="0.7" stopColor="#8c6a1f" />
          <stop offset="1" stopColor="#e8c77a" />
        </linearGradient>
        <linearGradient id="ruby" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d23a52" />
          <stop offset="1" stopColor="#5a0a18" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="112" r="62" fill="none" stroke="url(#gold-band)" strokeWidth="16" />
      <path d="M86 52 L114 52 L110 44 L90 44 Z" fill="url(#gold-band)" />
      <path d="M80 32 L120 32 L100 56 Z M86 22 L114 22 L120 32 L80 32 Z" fill="url(#ruby)" />
    </svg>
  );
}
