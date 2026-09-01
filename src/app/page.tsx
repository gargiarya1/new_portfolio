import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Resume } from "@/components/sections/Resume";
import { Contact } from "@/components/sections/Contact";
import { Guestbook } from "@/components/sections/Guestbook";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Resume />
        <Contact />
        <Guestbook />
      </main>
      <Footer />
    </>
  );
}
