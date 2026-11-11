import { About } from "@/components/about";
import { Hero } from "@/components/hero/hero";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <About />
    </main>
  );
}
