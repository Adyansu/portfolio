import { About } from "@/components/about";
import { Achievements } from "@/components/achievements";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero/hero";
import { Playground } from "@/components/playground/playground";
import { Projects } from "@/components/projects/projects";
import { Skills } from "@/components/skills";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Playground />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
