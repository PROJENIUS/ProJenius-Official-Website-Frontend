/* =========================================================
   PCB DESIGN & FABRICATION PAGE
   Circuit boards and electronics only; turning a design into a
   physical model or enclosure lives on Rapid Prototyping.
   Journey: capabilities → design-to-board workflow → start.
========================================================= */

import { useRef } from "react";

import PCBDesignFabricationHero from "../../../Components/Solutions/PCBDesignFabrication/PCBDesignFabricationHero/PCBDesignFabricationHero.jsx";
import PCBCapabilities from "../../../Components/Solutions/PCBDesignFabrication/PCBCapabilities/PCBCapabilities.jsx";
import PCBWorkflow from "../../../Components/Solutions/PCBDesignFabrication/PCBWorkflow/PCBWorkflow.jsx";
import ServiceCTA from "../../../Components/Solutions/Shared/ServiceCTA/ServiceCTA.jsx";
import { RELATED, contactLink } from "../../../Components/Solutions/Shared/serviceLinks.js";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";
import "../../../styles/pages/SolutionsPages.css";

const DESCRIPTION =
  "PCB design and fabrication by ProJenius: schematic and circuit design, PCB layout, prototype and MVP electronics, and fabrication and assembly support for electronic products.";

export default function PCBDesignFabricationPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pjsv-pcb">
      <PCBDesignFabricationHero />
      <PCBCapabilities />
      <PCBWorkflow />

      <ServiceCTA
        id="pcb-cta"
        eyebrow="Start a PCB Requirement"
        title="Share Your Circuit, Get a Board Plan"
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
          { ...RELATED.prototyping, question: "Need an enclosure or physical prototype?" },
          { ...RELATED.startup, question: "Developing a complete product?" },
        ]}
      />
    </main>
  );
}
