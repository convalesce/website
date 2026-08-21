import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Closer } from "@/components/sections/closer";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Integrations } from "@/components/sections/integrations";
import { Marquee } from "@/components/sections/marquee";
import { Principles } from "@/components/sections/principles";
import { Process } from "@/components/sections/process";
import { WhyConvalesce } from "@/components/sections/why-convalesce";

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="bg-accent text-on-accent focus:ring-accent sr-only rounded-md text-small px-4 py-2 focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Marquee />
        <Process />
        <WhyConvalesce />
        <Integrations />
        <Principles />
        <Faq />
        <Closer />
      </main>

      <Footer />
    </>
  );
}
