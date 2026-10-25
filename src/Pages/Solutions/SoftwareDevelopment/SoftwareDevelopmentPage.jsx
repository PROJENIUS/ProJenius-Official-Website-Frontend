/* =========================================================
   SOFTWARE DEVELOPMENT PAGE
   Only composes the sections; each section owns its JSX and CSS.

   Journey: what we build → how AI/automation fits → new build or
   improvement → how the work runs → after launch → estimate.
   Retired from this page (files kept, unmounted): DevelopmentHero
   (replaced by the shared ServiceHero), DifferentTechnologies
   (repeated WhatCanWeBuild), AlreadyHaveADigitalProduct (repeated
   AlreadyBuiltDoesntMeanDone), WhyBuildWithProJenius (repeated
   OurApproach).
========================================================= */

import { useRef } from "react";

import ServiceHero from "../../../Components/Solutions/Shared/ServiceHero/ServiceHero.jsx";
import ServiceCTA from "../../../Components/Solutions/Shared/ServiceCTA/ServiceCTA.jsx";
import { RELATED, contactLink } from "../../../Components/Solutions/Shared/serviceLinks.js";
import SoftwareHeroVisual from "../../../Components/Solutions/SoftwareDevelopment/SoftwareHeroVisual/SoftwareHeroVisual.jsx";
import OurApproach from "../../../Components/Solutions/SoftwareDevelopment/OurApproach/OurApproach.jsx";
import WhatCanWeBuild from "../../../Components/Solutions/SoftwareDevelopment/WhatCanWeBuild/WhatCanWeBuild.jsx";
import AIWorkflow from "../../../Components/Solutions/SoftwareDevelopment/AIWorkflow/AIWorkflow.jsx";
import WhereverYouAre from "../../../Components/Solutions/SoftwareDevelopment/WhereverYouAre/WhereverYouAre.jsx";
import AlreadyBuiltDoesntMeanDone from "../../../Components/Solutions/SoftwareDevelopment/AlreadyBuiltDoesntMeanDone/AlreadyBuiltDoesntMeanDone.jsx";
import HowWeTurn from "../../../Components/Solutions/SoftwareDevelopment/HowWeTurn/HowWeTurn.jsx";
import LaunchingIsNotTheEnd from "../../../Components/Solutions/SoftwareDevelopment/LaunchingIsNotTheEnd/LaunchingIsNotTheEnd.jsx";
import heroBackdrop from "../../../assets/Home/HeroSlides/hero-slide-1.webp";
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

  return (
    <main ref={pageRef} className="pjsv-page pjsv-software">
      <ServiceHero
        id="software-hero-title"
        eyebrow="Software Development"
        title="Software That Moves"
        highlight="Your Business Forward"
        description="We design and build websites, web and mobile applications, SaaS platforms, AI solutions and automation tools around what your business actually needs."
        primary={{ label: "Discuss Your Project", to: ENQUIRY }}
        secondary={{ label: "Explore Our Capabilities", to: "#pj-development-build" }}
        backdrop={heroBackdrop}
        visual={<SoftwareHeroVisual />}
      />

      <OurApproach />
      <WhatCanWeBuild />
      <AIWorkflow />
      <WhereverYouAre />
      <AlreadyBuiltDoesntMeanDone />
      <HowWeTurn />
      <LaunchingIsNotTheEnd />

      <ServiceCTA
        id="software-estimate"
        eyebrow="Project Estimate"
        title="Get a Clear Estimate for Your Project"
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
