/* =========================================================
   PCB DESIGN & FABRICATION PAGE
   The board: ProJenius designs it, a manufacturing partner
   makes it (one board or many), ProJenius tests it, shows a
   working demo and hands it over.
   Hero (split, with the four stages) → complete PCB solutions
   (6 stages) → how we work (4 steps) → our work & engineering
   (6 photos) → common questions (10) → closing card.
   Application areas was removed (backup-before-cleanup/PCB-ApplicationAreas).
   Every section animates on scroll, up and down (useScrollReveal).

   Not mounted any more (files kept): PCBCapabilities,
   PCBWorkflow, PCBBoard. The shared ProjectShowcase is replaced
   here by PCBWork.
========================================================= */

import { useRef } from "react";

import PCBDesignFabricationHero from "../../../Components/Solutions/PCBDesignFabrication/PCBDesignFabricationHero/PCBDesignFabricationHero.jsx";
import PCBSolutions from "../../../Components/Solutions/PCBDesignFabrication/PCBSolutions/PCBSolutions.jsx";
import PCBHowWeWork from "../../../Components/Solutions/PCBDesignFabrication/PCBHowWeWork/PCBHowWeWork.jsx";
import PCBWork from "../../../Components/Solutions/PCBDesignFabrication/PCBWork/PCBWork.jsx";
import PCBFaq from "../../../Components/Solutions/PCBDesignFabrication/PCBFaq/PCBFaq.jsx";
import ServiceCTA from "../../../Components/Solutions/Shared/ServiceCTA/ServiceCTA.jsx";
import { RELATED, contactLink } from "../../../Components/Solutions/Shared/serviceLinks.js";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";
import "../../../styles/pages/SolutionsPages.css";

const DESCRIPTION =
  "PCB design and fabrication by ProJenius: schematic and circuit design, PCB layout, manufacturing through our partner (one board or many), then testing, a working demo and handover.";

export default function PCBDesignFabricationPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pjsv-pcb">
      <PCBDesignFabricationHero />

      <PCBSolutions />

      <PCBHowWeWork />
      <PCBWork />
      <PCBFaq />

      <ServiceCTA
        id="pcb-cta"
        eyebrow="Start a PCB Requirement"
        title="Share Your Circuit,"
        typed={["Get a Board Plan", "Get Clear Next Steps"]}
        text="Whether you have a full schematic or only know what the board must do, tell us about it and we will suggest the right starting point."
        primary={{ label: "Discuss PCB Requirements", to: contactLink("development", "pcb-design-fabrication") }}
        checklistTitle="What helps us start"
        checklist={[
          "A schematic or block diagram, if you have one",
          "Key components, or a component list",
          "Board size, connectors and mounting constraints",
          "How many boards you need",
          "Your timeline",
        ]}
        related={[
          { ...RELATED.hardware, question: "Need firmware or electronics integration?" },
          { ...RELATED.prototyping, question: "Need the whole product built?" },
          { ...RELATED.startup, question: "Developing a complete product?" },
        ]}
      />
    </main>
  );
}
