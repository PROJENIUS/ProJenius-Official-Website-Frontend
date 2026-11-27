/* =========================================================
   STARTUP & INNOVATION PAGE
   For people with just an idea: ProJenius takes it all the way
   to one complete product. Incubation is part of this page
   (the /incubate page and its apply form hold the details).
   Navy / light sections alternate; the last one is light.

   1 Hero                       short: idea → complete product
   2 Who we support             (light)
   3 Your idea decides the path pick an idea type; the path and
                                the solution pages that build it
   4 Incubate at ProJenius      facilities + apply (light)
   5 What happens after you submit
   6 Questions                  shared sticky FAQ layout (light)
   7 Submit your idea           the Contact page's startup form,
                                locked to startup (last section: light)

   Not used on purpose (they repeat the sections above):
   "Find your starting point" (= Who we support) and "Startup
   support areas" (IP / registration / ongoing support are in
   the FAQ). Retired files are kept, unmounted:
   StartupSupporterHero, FaqSection, StartupIdeaForm, CapabilityMap,
   StartupSupport and the older startup sections.
========================================================= */

import { useRef } from "react";

import StartupJourneyHero from "../../Components/StartupInnovation/StartupJourneyHero/StartupJourneyHero.jsx";
import Whowesupport from "../../Components/StartupInnovation/Whowesupport/Whowesupport.jsx";
import TechnologyPathways from "../../Components/StartupInnovation/TechnologyPathways/TechnologyPathways.jsx";
import IncubateAtProjenius from "../../Components/StartupInnovation/IncubateAtProjenius/IncubateAtProjenius.jsx";
import WhatCanWeHelpYouWith from "../../Components/Contact/WhatCanWeHelpYouWith/WhatCanWeHelpYouWith.jsx";
import ServiceProcess from "../../Components/Solutions/Shared/ServiceProcess/ServiceProcess.jsx";
import ServiceFaq from "../../Components/Common/ServiceFaq/ServiceFaq.jsx";
import useMetaDescription from "../../hooks/useMetaDescription.js";
import useScrollReveal from "../../hooks/useScrollReveal.js";
import "../../styles/pages/SolutionsPages.css";

const DESCRIPTION =
  "Startup and innovation support from ProJenius: from just an idea to one complete product, with problem understanding, networking, field visits, prototyping, PCB design, software building and incubation at ProJenius.";

/* The idea form is the last section of this page. */
const SUBMIT_IDEA = "#submit-idea";

const FAQ_ITEMS = [
  { q: "Can I approach ProJenius with only an idea?", a: "Yes. A rough idea is enough to start. We help you shape it into a clear problem and a plan." },
  { q: "Do I need a complete technical specification?", a: "No. You do not need a full specification. We work through the requirements with you in the first conversations." },
  { q: "Can ProJenius help with prototype development?", a: "Yes. We support the path from research and design to a working prototype or first version of the product." },
  { q: "Can you help with both software and hardware?", a: "Yes. We work across software and hardware, so one idea can combine both in a single build." },
  { q: "Do you support AI/ML and SaaS ideas?", a: "Yes. AI/ML and SaaS ideas are part of what we support, from the data and models to the product around them." },
  { q: "Can you help with PCB and 3D prototype development?", a: "Yes. We support PCB design and 3D design and printing to turn a concept into something you can hold and test." },
  { q: "Do you provide patent support?", a: "We guide you on how to start the process of protecting your idea and what to prepare." },
  { q: "Do you provide startup registration support?", a: "Yes. We guide you on setting up the business and the registrations and paperwork it needs." },
  { q: "Can students approach ProJenius?", a: "Yes. Students are welcome to approach us with project ideas and academic innovation work." },
  { q: "Is there a fee to incubate at ProJenius?", a: "Applying is free. If your application is accepted, there is a one-time registration fee of ₹1,000 when you join. Your seat and the services you need, such as lab use, prototyping, PCB, software and mentoring, are charged separately, based on what you need." },
  { q: "How do we start?", a: "Send us a short message about your idea. We reply to arrange an initial conversation about what you want to build." },
];

export default function StartupInnovationPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pjsv-startup">
      <StartupJourneyHero />

      <Whowesupport ctaHref={SUBMIT_IDEA} />

      <TechnologyPathways />

      <IncubateAtProjenius />

      <ServiceProcess
        id="idea-journey"
        eyebrow="After You Submit"
        title="What Happens to"
        typed={["Your Idea", "Your Submission"]}
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

      <ServiceFaq id="startup-faq" items={FAQ_ITEMS} askTo="/contact?type=startup&from=startup-faq" />

      {/* The same form as the Contact page's "Startup & Innovation" enquiry
          (same fields, required rules, attachment and backend), locked to
          startup. Edit it once in WhatCanWeHelpYouWith.jsx. */}
      <WhatCanWeHelpYouWith
        lockedType="startup"
        sectionId="submit-idea"
        source="startup-innovation"
        eyebrow="Submit Your Idea"
        title="Tell Us What You Want"
        typed={["to Build.", "to Solve.", "to Create."]}
        description="A rough idea is enough to start. Share the problem and where you are today, and we will get back to you to arrange an initial conversation."
      />
    </main>
  );
}
