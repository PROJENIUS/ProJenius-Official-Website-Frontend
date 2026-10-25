/* =========================================================
   STARTUP & INNOVATION PAGE
   An entry point for founders, students and innovators.
   Journey: who it is for → the capabilities an idea can draw
   on → support across the startup journey → what happens after
   you submit → questions → submit the idea.

   Retired from this page (files kept, unmounted) because they
   repeated other sections: WhyProJenius, TechPathways,
   Everyideadiff, FindStartingPoint (stage pickers like
   Whowesupport), WorkingProcess, GettingStarted,
   StartupReadyJourney (process, replaced by the idea journey),
   ProofOfWork (placeholder projects), PjxIncubateHero and
   PjxApplication (its "submitted" message never sent anything;
   replaced by StartupIdeaForm, which uses the enquiry API).
========================================================= */

import { useRef } from "react";

import StartupSupporterHero from "../../Components/StartupInnovation/StartupSupporterHero/StartupSupporterHero.jsx";
import Whowesupport from "../../Components/StartupInnovation/Whowesupport/Whowesupport.jsx";
import CapabilityMap from "../../Components/StartupInnovation/CapabilityMap/CapabilityMap.jsx";
import StartupSupportSection from "../../Components/StartupInnovation/StartupSupport/StartupSupport.jsx";
import FaqSection from "../../Components/StartupInnovation/FaqSection/FaqSection.jsx";
import StartupIdeaForm from "../../Components/StartupInnovation/StartupIdeaForm/StartupIdeaForm.jsx";
import ServiceProcess from "../../Components/Solutions/Shared/ServiceProcess/ServiceProcess.jsx";
import ServiceCTA from "../../Components/Solutions/Shared/ServiceCTA/ServiceCTA.jsx";
import { RELATED } from "../../Components/Solutions/Shared/serviceLinks.js";
import useMetaDescription from "../../hooks/useMetaDescription.js";
import useScrollReveal from "../../hooks/useScrollReveal.js";
import "../../styles/pages/SolutionsPages.css";

const DESCRIPTION =
  "Startup and innovation support from ProJenius for founders, students and innovators: idea discussion, feasibility, technical mentorship, prototypes and MVPs across software and hardware.";

export default function StartupInnovationPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pjsv-startup">
      <StartupSupporterHero />
      <Whowesupport ctaHref="#submit-idea" />
      <CapabilityMap logoSrc="/ProJenius_Logo.svg" />
      <StartupSupportSection />

      <ServiceProcess
        id="idea-journey"
        eyebrow="After You Submit"
        title="What Happens to Your Idea"
        intro="Every submission is read by the team. This is the path from your first message to a decision about support."
        steps={[
          { title: "Submit Your Idea", text: "Share the problem, your idea and where you are today using the form below." },
          { title: "Initial Review", text: "The team reads your submission and notes any questions." },
          { title: "Discussion", text: "We arrange a conversation to understand the idea, the users and your goals." },
          { title: "Feasibility Assessment", text: "We look at what it would take to build: technology, effort and the first milestone." },
          { title: "Support Decision", text: "We agree on the next step together, and the kind of support that fits." },
        ]}
        note="Submitting an idea does not guarantee incubation, funding or resources. Support such as mentorship, technical development or resources is considered case by case, subject to review, eligibility, availability and approval."
      />

      <ServiceCTA
        id="startup-services"
        eyebrow="Already Know What You Need?"
        title="Go Straight to the Right Team"
        text="If your idea needs a specific piece of work, each service page explains how that part is done."
        primary={{ label: "Or Submit Your Whole Idea", to: "#submit-idea" }}
        related={[
          { ...RELATED.software, question: "Need a software platform or app?" },
          { ...RELATED.hardware, question: "Need electronics or a connected device?" },
          { ...RELATED.pcb, question: "Need a PCB designed?" },
          { ...RELATED.prototyping, question: "Need a physical prototype?" },
        ]}
      />

      <FaqSection askHref="/contact?type=startup&from=startup-innovation" />
      <StartupIdeaForm />
    </main>
  );
}
