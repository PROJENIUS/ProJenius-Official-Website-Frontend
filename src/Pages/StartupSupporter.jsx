import React from "react";

/* ==========================================================================
   StartupSupport.jsx (Page)
   RULES FOLLOWED : no inline style | no <style> tag | no CSS module
                    only .jsx and .css files | zero external dependencies
   Imports all modular sections from src/components/
   ========================================================================== */

/* ---------- Component Imports from src/components/ ---------- */

import StartupSupporterHero from "../Components/StartupSupporter/StartupSupporterHero/StartupSupporterHero.jsx";
import WhyProJenius from "../Components/StartupSupporter/WhyProjenius/WhyProJenius.jsx";
import Whowesupport from "../Components/StartupSupporter/Whowesupport/Whowesupport.jsx";
import CapabilityMap from "../Components/StartupSupporter/CapabilityMap/CapabilityMap.jsx";
import TechPathways from "../Components/StartupSupporter/TechPathways/TechPathways.jsx";
import Everyideadiff from "../Components/StartupSupporter/Everyideadiff/Everyideadiff.jsx";
import WorkingProcess from "../Components/StartupSupporter/WorkingProcess/WorkingProcess.jsx";
import StartupSupportSection from "../Components/StartupSupporter/StartupSupport/StartupSupport.jsx";
import StartupReadyJourney from "../Components/StartupSupporter/StartupReadyJourney/StartupReadyJourney.jsx";
import ProofOfWork from "../Components/StartupSupporter/ProofOfWork/ProofOfWork.jsx";
import FindStartingPoint from "../Components/StartupSupporter/FindStartingPoint/FindStartingPoint.jsx";
import GettingStarted from "../Components/StartupSupporter/GettingStarted/GettingStarted.jsx";
import FaqSection from "../Components/StartupSupporter/FaqSection/FaqSection.jsx";
import PjxIncubateHero from "../Components/StartupSupporter/Pjxincubatehero/PjxIncubateHero.jsx";
import PjxApplication from "../Components/StartupSupporter/Pjxapplication/PjxApplication.jsx";


export default function StartupSupport() {
  return (
    <main className="startup-support-page">
      {/* 1. First Page: Startup Supporter Hero */}
      <section id="supporter-hero">
        <StartupSupporterHero />
      </section>

      {/* 2. Why ProJenius */}
      <section id="why-projenius">
        <WhyProJenius />
      </section>

      {/* 3. Who We Support */}
      <section id="who-we-support">
        <Whowesupport />
      </section>

      {/* 4. Capability Map */}
      <section id="capability-map">
        <CapabilityMap />
      </section>

      {/* 5. Tech Pathways */}
      <section id="tech-pathways">
        <TechPathways />
      </section>

      {/* 6. Every Idea is Different */}
      <section id="every-idea-diff">
        <Everyideadiff />
      </section>

      {/* 7. Working Process */}
      <section id="working-process">
        <WorkingProcess />
      </section>

      {/* 8. Startup Support Focus Areas */}
      <section id="startup-support-areas">
        <StartupSupportSection />
      </section>

      {/* 9. Startup Ready Journey */}
      <section id="startup-journey">
        <StartupReadyJourney />
      </section>

      {/* 10. Proof of Work (Projects) */}
      <section id="proof-of-work">
        <ProofOfWork />
      </section>

      {/* 11. Find Starting Point */}
      <section id="starting-point">
        <FindStartingPoint />
      </section>

      {/* 12. Getting Started */}
      <section id="getting-started">
        <GettingStarted />
      </section>

      {/* 13. FAQ Section */}
      <section id="faq">
        <FaqSection />
      </section>

      {/* 14. Second Last: Incubate Hero */}
      <section id="incubate-hero">
        <PjxIncubateHero />
      </section>

      {/* 15. Last Page: Incubation Application Form & PDF Builder */}
      <section id="application">
        <PjxApplication />
      </section>
    </main>
  );
}
