/* =========================================================
   SOFTWARE DEVELOPMENT PAGE
   Only composes the sections; each section owns its JSX and CSS.

   Journey: what we build → how AI/automation fits → new build or
   improvement → how the work runs → after launch → estimate.
   Retired from this page (files kept, unmounted): SoftwareHeroVisual
   (replaced by the shared hero photo stack), DevelopmentHero
   (replaced by the shared ServiceHero), DifferentTechnologies
   (repeated WhatCanWeBuild), AlreadyHaveADigitalProduct (repeated
   AlreadyBuiltDoesntMeanDone), WhyBuildWithProJenius (repeated
   OurApproach).
========================================================= */

import { useRef } from "react";

import ServiceHero from "../../../Components/Solutions/Shared/ServiceHero/ServiceHero.jsx";
import ServiceCTA from "../../../Components/Solutions/Shared/ServiceCTA/ServiceCTA.jsx";
import { RELATED, contactLink } from "../../../Components/Solutions/Shared/serviceLinks.js";
import HeroPhotoStack from "../../../Components/Common/HeroPhotoStack/HeroPhotoStack.jsx";
import { heroPhotos } from "../../../Components/Common/HeroPhotoStack/heroPhotos.js";
import waterMonitoringImage from "../../../assets/Home/OurProjects/OurProjects_4.webp";
import roadHazardImage from "../../../assets/Home/OurProjects/OurProjects_5.webp";
import hospitalAccessImage from "../../../assets/Home/OurProjects/OurProjects_3.webp";
import benchPhoto from "../../../assets/Home/OurProjects/OurProjects_2.webp";
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

/* Hero photos: src/assets/Heroes/development/ (see its README); these real
   project screenshots (cards) and work photo (backdrop, no text in it) are
   used until photos are added there. */
const HERO = heroPhotos("development", {
  backdrop: benchPhoto,
  cards: [
    { image: waterMonitoringImage, category: "AI + IoT", title: "AI-Based Water Quality Monitoring" },
    { image: roadHazardImage, category: "AI Platform", title: "AI-Based Road Hazard Detection" },
    { image: hospitalAccessImage, category: "Web Platform", title: "Smart Hospital Access System" },
  ],
});

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
        phrases={["Your Business Forward", "Ideas Into Digital Products", "Real-World Work Forward"]}
        description="We design and build websites, web and mobile applications, SaaS platforms, AI solutions and automation tools around what your business actually needs."
        primary={{ label: "Discuss Your Project", to: ENQUIRY }}
        secondary={{ label: "Explore Our Capabilities", to: "#pj-development-build" }}
        backdrop={HERO.backdrop}
        visual={<HeroPhotoStack items={HERO.cards} label="Software projects by ProJenius" badge={{ title: "Built for real use", text: "Software by ProJenius" }} />}
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
