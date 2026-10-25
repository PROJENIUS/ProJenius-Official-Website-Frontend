/* =========================================================
   RAPID PROTOTYPING PAGE
   Turning a design into a physical model or part. Circuit
   boards live on PCB Design & Fabrication.
   Journey: what can be prototyped → the iterative process →
   what to bring and related services.
========================================================= */

import { useRef } from "react";

import RapidPrototypingHero from "../../../Components/Solutions/RapidPrototyping/RapidPrototypingHero/RapidPrototypingHero.jsx";
import PrototypingCapabilities from "../../../Components/Solutions/RapidPrototyping/PrototypingCapabilities/PrototypingCapabilities.jsx";
import ServiceProcess from "../../../Components/Solutions/Shared/ServiceProcess/ServiceProcess.jsx";
import ServiceCTA from "../../../Components/Solutions/Shared/ServiceCTA/ServiceCTA.jsx";
import { RELATED, contactLink } from "../../../Components/Solutions/Shared/serviceLinks.js";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";
import "../../../styles/pages/SolutionsPages.css";

const DESCRIPTION =
  "Rapid prototyping and 3D printing by ProJenius for product concepts, enclosures, custom components, functional parts and development-ready prototypes.";

export default function RapidPrototypingPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pjsv-prototyping">
      <RapidPrototypingHero />
      <PrototypingCapabilities />

      <ServiceProcess
        id="prototyping-process"
        eyebrow="Prototyping Process"
        title="Concept to Prototype, One Iteration at a Time"
        intro="A first prototype is rarely the last. Each round answers a question and makes the next version better."
        tone="dark"
        steps={[
          { title: "Concept", text: "Your sketch, photo or idea, and what the prototype needs to prove." },
          { title: "Design", text: "The part is modelled in CAD with the dimensions and details that matter." },
          { title: "Prototype", text: "The design is made into a physical part, typically by 3D printing." },
          { title: "Test", text: "Check the fit, the look and how it works in your hands or your product." },
          { title: "Refine", text: "Adjust the design based on what the test showed." },
        ]}
        loop="Refine and prototype again until it fits and works"
      />

      <ServiceCTA
        id="prototyping-cta"
        eyebrow="Start a Prototype"
        title="Bring Your Idea, We Will Help Shape It"
        text="A sketch or a photo is enough to start. Tell us what the part is for and we will suggest how to prototype it."
        primary={{ label: "Discuss Your Prototype", to: contactLink("development", "rapid-prototyping") }}
        checklistTitle="What to bring"
        checklist={[
          "A sketch, photo or reference of the idea",
          "A CAD file, if you already have one",
          "Key dimensions and anything it must fit around",
          "Whether it needs to look right, work, or both",
          "Quantity and timeline",
        ]}
        related={[
          { ...RELATED.pcb, question: "Need a custom PCB inside your prototype?" },
          { ...RELATED.hardware, question: "Need embedded firmware or electronics integration?" },
          { ...RELATED.startup, question: "Developing a startup product?" },
        ]}
      />
    </main>
  );
}
