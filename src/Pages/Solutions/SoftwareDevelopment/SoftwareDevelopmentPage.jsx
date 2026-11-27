/* =========================================================
   SOFTWARE DEVELOPMENT PAGE
   Only composes the sections; each section owns its JSX and CSS.

   Journey: what we build → how AI/automation fits → new build or
   improvement → how the work runs → after launch → estimate.
   Hero: ServiceHero (copy left, SoftwareHeroVisual right).
   Retired from this page (files kept, unmounted):
   HowWeTurn (8-step process; backup-before-cleanup/HowWeTurn-8-steps),
   DevelopmentHero, DifferentTechnologies
   (repeated WhatWeBuild), AlreadyHaveADigitalProduct (repeated
   ExistingProducts), WhyBuildWithProJenius (repeated
   OurApproach).
========================================================= */

import { useRef } from "react";

import ServiceHero from "../../../Components/Solutions/Shared/ServiceHero/ServiceHero.jsx";
import SoftwareHeroVisual from "../../../Components/Solutions/SoftwareDevelopment/SoftwareHeroVisual/SoftwareHeroVisual.jsx";
import ServiceCTA from "../../../Components/Solutions/Shared/ServiceCTA/ServiceCTA.jsx";
import { RELATED, contactLink } from "../../../Components/Solutions/Shared/serviceLinks.js";
/* Hero content and photos: Admin → Page Heroes → Software Development
   (built-in: src/pageHeroes/heroDefaults.js). */
import usePageHero from "../../../pageHeroes/usePageHero.js";
import { HERO_DEFAULTS } from "../../../pageHeroes/heroDefaults.js";
import OurApproach from "../../../Components/Solutions/SoftwareDevelopment/OurApproach/OurApproach.jsx";
import WhatWeBuild from "../../../Components/Solutions/SoftwareDevelopment/WhatWeBuild/WhatWeBuild.jsx";
import AiAndAutomation from "../../../Components/Solutions/SoftwareDevelopment/AiAndAutomation/AiAndAutomation.jsx";
import WhereYouStart from "../../../Components/Solutions/SoftwareDevelopment/WhereYouStart/WhereYouStart.jsx";
import ExistingProducts from "../../../Components/Solutions/SoftwareDevelopment/ExistingProducts/ExistingProducts.jsx";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";
import "../../../styles/pages/SolutionsPages.css";

const DESCRIPTION =
  "Software development by ProJenius: websites, web and mobile applications, SaaS platforms, AI and automation, designed and built around your business requirements.";

const ENQUIRY = contactLink("development", "software-development");

export default function SoftwareDevelopmentPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);
  const hero = usePageHero("software-development", HERO_DEFAULTS["software-development"]);

  return (
    <main ref={pageRef} className="pjsv-page pjsv-software">
      <ServiceHero
        id="software-hero-title"
        eyebrow={hero.eyebrow}
        title={hero.title}
        phrases={hero.phrases}
        description={hero.description}
        primary={hero.primary}
        secondary={hero.secondary}
        backdrop={hero.backdrop}
        visual={<SoftwareHeroVisual screens={[{ image: hero.screen1, alt: hero.screen1Alt }, { image: hero.screen2, alt: hero.screen2Alt }]} />}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Solutions" }, { label: "Software Development" }]}
        className="pjsv-hero--software"
      />

      <OurApproach />
      <WhatWeBuild />
      <AiAndAutomation />
      <WhereYouStart />
      <ExistingProducts />

      <ServiceCTA
        id="software-estimate"
        eyebrow="Project Estimate"
        title="Get a Clear Estimate for"
        typed={["Your Project", "Your Product", "Your Idea"]}
        text="There is no one-size price list. Every estimate is prepared for your requirement, so share what you want to build and we will come back with a scope, an estimate and the next steps."
        primary={{ label: "Get a Project Estimate", to: ENQUIRY }}
        checklistTitle="What an estimate depends on"
        checklist={[
          "Scope: the pages, screens and users involved",
          "Features and how complex they are",
          "Integrations with other systems, APIs or data",
          "Technical requirements such as hosting and security",
          "Your timeline",
        ]}
        related={[
          { ...RELATED.hardware, question: "Need electronics or a connected device for your product?" },
          { ...RELATED.prototyping, question: "Need a physical prototype alongside the software?" },
          { ...RELATED.startup, question: "Building a complete product from an idea?" },
        ]}
      />
    </main>
  );
}
