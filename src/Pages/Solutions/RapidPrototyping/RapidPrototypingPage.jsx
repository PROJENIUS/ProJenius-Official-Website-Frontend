/* =========================================================
   RAPID PROTOTYPING PAGE
   ProJenius builds the whole product, from the outside in:
   enclosure, PCB, firmware and app, typically in about 45 days.

   1 Hero            the four layers of one product, exploded
   2 Enclosure       "it starts with the outer box"
   3 End-to-end      the device builds up as you scroll
   4 Five steps      how a project runs, ~45 days
   5 Built with us   real ProJenius projects
   6 Each part       links to the PCB, Hardware and Software
                     pages, plus Startup and Incubate (the one
                     place for links to other pages)
   7 FAQ             sticky questions, shared layout
   8 Closing card

   Backups: backup-before-cleanup/RapidPrototyping-WhatWeBuild-cards/
   and backup-before-cleanup/RapidPrototypingHero-cinematic/.
========================================================= */

import { useRef } from "react";
import { Link } from "react-router-dom";

import RapidPrototypingHero from "../../../Components/Solutions/RapidPrototyping/RapidPrototypingHero/RapidPrototypingHero.jsx";
import ItStartsWithTheOuterBox from "../../../Components/Solutions/RapidPrototyping/ItStartsWithTheOuterBox/ItStartsWithTheOuterBox.jsx";
import EndToEndPrototype from "../../../Components/Solutions/RapidPrototyping/EndToEndPrototype/EndToEndPrototype.jsx";
import ServiceProcess from "../../../Components/Solutions/Shared/ServiceProcess/ServiceProcess.jsx";
import BuiltWithUs from "../../../Components/Solutions/RapidPrototyping/BuiltWithUs/BuiltWithUs.jsx";
import ExploreEachPart from "../../../Components/Solutions/RapidPrototyping/ExploreEachPart/ExploreEachPart.jsx";
import ServiceFaq from "../../../Components/Common/ServiceFaq/ServiceFaq.jsx";
import ServiceCTA from "../../../Components/Solutions/Shared/ServiceCTA/ServiceCTA.jsx";
import { SERVICE_ROUTES, contactLink } from "../../../Components/Solutions/Shared/serviceLinks.js";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";
import "../../../styles/pages/SolutionsPages.css";

const DESCRIPTION =
  "Rapid prototyping by ProJenius: enclosure design and 3D printing, PCB design, embedded firmware and apps, built together from idea to a working prototype, typically in about 45 days.";

/* Answers use only what ProJenius has confirmed (no fixed prices). */
const FAQ_ITEMS = [
  {
    q: "How long does a prototype take?",
    a: "A complete prototype typically takes about 45 days. The exact timeline depends on the project and is agreed in the scope before work starts.",
  },
  {
    q: "Do you build the whole product, or only parts of it?",
    a: "Both. We can build the whole prototype (enclosure, electronics, firmware and app) or only the part you need.",
  },
  {
    q: "Why do you design the enclosure first?",
    a: "The enclosure sets the size of the board, where the buttons and ports go, how heat escapes and how the product survives a drop. Designing it first means everything inside fits the first time.",
  },
  {
    q: "What do I need to start? Is a sketch enough?",
    a: "Yes, a sketch or a photo is enough. Tell us what the product should do; a CAD file, key dimensions and your timeline help if you have them.",
  },
  {
    q: "Which materials do you print in?",
    a: "PLA, PETG, TPU and resin, chosen for how the part will be used: strength, flexibility, heat or finish.",
  },
  {
    q: "Who makes the circuit board?",
    a: (
      <>
        We design the board to fit the enclosure and our manufacturing partner makes it. We then test it on the
        prototype. More on <Link to={SERVICE_ROUTES.pcb}>PCB Design &amp; Fabrication</Link>.
      </>
    ),
  },
  {
    q: "Can the prototype connect to an app?",
    a: (
      <>
        Yes. We connect the device over Wi-Fi or Bluetooth to a dashboard or companion app. See{" "}
        <Link to={SERVICE_ROUTES.software}>Software Development</Link>.
      </>
    ),
  },
  {
    q: "What do I get at handover?",
    a: "A working, tested prototype shown to you in a live demo, along with the design files, the source code and a clear path to production.",
  },
  {
    q: "Can the design go into production later?",
    a: "Yes. The enclosure is printable today and designed so it can be moulded later, and the handover includes a path to production.",
  },
  {
    q: "How much does a prototype cost?",
    a: "It depends on what the product needs. After a free discovery call we share a scope with clear deliverables, timeline and price, so there are no surprises.",
  },
];

export default function RapidPrototypingPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pjsv-prototyping">
      <RapidPrototypingHero />

      <ItStartsWithTheOuterBox />

      <EndToEndPrototype />

      <ServiceProcess
        id="prototyping-process"
        eyebrow="How It Works"
        title="Five Steps From"
        typed={["Idea to Product", "Idea to Prototype"]}
        intro="A complete prototype typically takes about 45 days, depending on the project."
        steps={[
          { title: "Free Discovery Call", text: "You explain the idea; we ask the right questions." },
          { title: "Scope & Quote", text: "Clear deliverables, timeline and price. No surprises." },
          { title: "Design", text: "CAD, schematic and app screens, reviewed with you." },
          { title: "Prototype & Test", text: "We build, test and iterate until it works." },
          { title: "Handover", text: "Files, source code and a path to production." },
        ]}
      />

      <BuiltWithUs />

      <ExploreEachPart />

      <ServiceFaq id="prototyping-faq" items={FAQ_ITEMS} askTo={contactLink("development", "prototyping-faq")} />

      <ServiceCTA
        id="prototyping-cta"
        eyebrow="Start a Prototype"
        title="Bring Your Idea,"
        typed={["We Will Build It", "We Will Help Shape It"]}
        text="A sketch or a photo is enough to start. Tell us what the product should do and we will plan the build with you."
        primary={{ label: "Discuss Your Prototype", to: contactLink("development", "rapid-prototyping") }}
        checklistTitle="What to bring"
        checklist={[
          "A sketch, photo or reference of the idea",
          "A CAD file, if you already have one",
          "Key dimensions and anything it must fit around",
          "Whether it needs to look right, work, or both",
          "Quantity and timeline",
        ]}
      />
    </main>
  );
}
