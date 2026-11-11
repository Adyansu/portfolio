# Adyansu Beura · Portfolio

Personal portfolio of **Adyansu Beura**, final-year Electrical Engineering undergraduate at IIT Kanpur, applying for frontend engineering roles.

**Live site:** _coming soon on Vercel_

A maroon, gold and ivory design with a real-time 3D hero and an interactive circuit simulator, built to show frontend craft rather than just describe it.

## Highlights

- **3D gold ring hero:** React Three Fiber scene with a procedurally lit gold band and a faceted ruby. It tilts toward the pointer anywhere on the page. The Three.js bundle is code-split and client-only, falls back to SVG without WebGL, pauses rendering when off-screen, and stays still under `prefers-reduced-motion`.
- **Circuit Lab:** an in-browser RC / RL / RLC transient simulator.
  - Circuits are modelled as state-space systems and integrated with **BDF2 (Gear-2)**.
  - The step size adapts to the circuit's fastest pole, so stiff circuits stay stable.
  - Results match the analytic step responses to within 0.01%.
  - The UI has a live schematic with current-flow animation, a scrubbable dual-axis chart, damping metrics, and a generated SPICE netlist.
- **Day and night themes:** CSS-variable design tokens, no flash of the wrong theme on load, and View Transitions for a smooth switch.
- **Interaction details:**
  - Letter-by-letter name reveal and scroll-drawn timeline.
  - Pointer-tilt project cards with case-study dialogs built on native `<dialog>`, which provides the focus trap and Esc to close.
  - Animated filters, count-up stats, active-section nav highlight, and a reading-progress bar.
- **Accessibility and performance:**
  - Semantic landmarks, `aria-current`, labelled controls, and visible focus rings.
  - Reduced-motion support throughout.
  - Statically prerendered page.
  - Heavy demos are lazy-loaded only when they near the viewport.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, CSS custom-property design tokens |
| Motion | Motion (Framer Motion), View Transitions API |
| 3D | Three.js, React Three Fiber, drei |
| Hosting | Vercel |

## Project structure

```
src/
  app/            layout, global styles and design tokens, page
  components/     sections (hero, about, experience, projects, playground, …)
    hero/         3D ring scene + SVG fallback
    playground/   Circuit Lab (schematic, chart, controls)
  data/resume.ts  all site content in one typed file
  hooks/          useActiveSection
  lib/circuit.ts  BDF2 transient solver, SI / SPICE formatting, netlist export
```

All text content lives in [`src/data/resume.ts`](src/data/resume.ts), so the site can be updated without touching components.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

### Optional: contact form delivery

Create a free access key at [web3forms.com](https://web3forms.com) and set it as an environment variable (locally in `.env.local`, or in Vercel's project settings):

```
NEXT_PUBLIC_WEB3FORMS_KEY=your-key
```

Without it, the contact form opens a pre-filled email instead.

## Contact

- GitHub: [@Adyansu](https://github.com/Adyansu)
- Related projects: [SpiceLite](https://github.com/Adyansu/SpiceLite) · [Eventrix](https://github.com/Adyansu/Eventrix)
