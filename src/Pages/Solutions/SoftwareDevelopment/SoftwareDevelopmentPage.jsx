/* =========================================================
   SOFTWARE DEVELOPMENT PAGE
   Only composes the sections; each section owns its JSX and CSS.

   Journey: what we build → how AI/automation fits → new build or
   improvement → how the work runs → after launch → estimate.
   Hero: the shared CinematicHero.
   Retired from this page (files kept, unmounted): SoftwareHeroVisual,
   DevelopmentHero, DifferentTechnologies
   (repeated WhatCanWeBuild), AlreadyHaveADigitalProduct (repeated
   AlreadyBuiltDoesntMeanDone), WhyBuildWithProJenius (repeated
   OurApproach).
========================================================= */

import { useRef } from "react";

import CinematicHero, { HeroTerminal } from "../../../Components/Common/CinematicHero/CinematicHero.jsx";
import ServiceCTA from "../../../Components/Solutions/Shared/ServiceCTA/ServiceCTA.jsx";
import { RELATED, contactLink } from "../../../Components/Solutions/Shared/serviceLinks.js";
import { heroPhotos } from "../../../Components/Common/HeroPhotoStack/heroPhotos.js";
import teamPhoto from "../../../assets/Home/Optimized/who-we-are-team-900.webp";
import OurApproach from "../../../Components/Solutions/SoftwareDevelopment/OurApproach/OurApproach.jsx";
import WhatCanWeBuild from "../../../Components/Solutions/SoftwareDevelopment/WhatCanWeBuild/WhatCanWeBuild.jsx";
import AIWorkflow from "../../../Components/Solutions/SoftwareDevelopment/AIWorkflow/AIWorkflow.jsx";
import WhereverYouAre from "../../../Components/Solutions/SoftwareDevelopment/WhereverYouAre/WhereverYouAre.jsx";
import AlreadyBuiltDoesntMeanDone from "../../../Components/Solutions/SoftwareDevelopment/AlreadyBuiltDoesntMeanDone/AlreadyBuiltDoesntMeanDone.jsx";
import HowWeTurn from "../../../Components/Solutions/SoftwareDevelopment/HowWeTurn/HowWeTurn.jsx";
import LaunchingIsNotTheEnd from "../../../Components/Solutions/SoftwareDevelopment/LaunchingIsNotTheEnd/LaunchingIsNotTheEnd.jsx";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";
import "../../../styles/pages/SolutionsPages.css";

const DESCRIPTION =
  "Software development by ProJenius: websites, web and mobile applications, SaaS platforms, AI and automation, designed and built around your business requirements.";

const ENQUIRY = contactLink("development", "software-development");

/* Hero photo: src/assets/Heroes/development/backdrop.* (see its README);
   the real team photo below is used until one is added there. */
const HERO = heroPhotos("development", { backdrop: teamPhoto });

/* Hero terminal: the steps follow how the work runs on this page
   (requirements, scope, build, test, launch, support after launch). */
const TERMINAL = [
  { kind: "cmd", text: "projenius build --app \"your business\"" },
  { kind: "info", text: "understanding what you need..." },
  { kind: "ok", text: "scope and first milestone agreed" },
  { kind: "ok", text: "design approved" },
  { kind: "ok", text: "web + mobile app built" },
  { kind: "ok", text: "tested and launched" },
  { kind: "done", text: "supported after launch" },
];

export default function SoftwareDevelopmentPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pjsv-software">
      <CinematicHero
        id="software-hero-title"
        eyebrow="Software Development"
        title="Software That Moves"
        accent="Your Business Forward"
        description="We design and build websites, web and mobile applications, SaaS platforms, AI solutions and automation tools around what your business actually needs."
        primary={{ label: "Discuss Your Project", to: ENQUIRY }}
        secondary={{ label: "Explore Our Capabilities", to: "#pj-development-build" }}
        photo={HERO.backdrop}
        aside={<HeroTerminal file="deploy.sh" label="How a software project runs" lines={TERMINAL} />}
        band={["Websites", "Web Applications", "Mobile Apps", "SaaS Platforms", "AI Solutions", "Automation"]}
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
