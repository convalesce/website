import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Closer } from "@/components/sections/closer";
import { ContextEngine } from "@/components/sections/context-engine";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Integrations } from "@/components/sections/integrations";
import { Marquee } from "@/components/sections/marquee";
import { Principles } from "@/components/sections/principles";
import { Process } from "@/components/sections/process";
import { WhyHeal } from "@/components/sections/why-heal";

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="bg-accent text-on-accent focus:ring-accent sr-only rounded-md px-4 py-2 text-[14px] focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Marquee />
        <Process />
        <WhyHeal />
        <ContextEngine />
        <Integrations />
        <Principles />
        <Faq />
        <Closer />
      </main>

      <Footer />
    </>
  );
}
