/* =========================================================
   HARDWARE & EMBEDDED SYSTEMS PAGE
   Journey: how a connected product fits together → what we
   build → project work → how a hardware project runs → start.
========================================================= */

import { useRef } from "react";

import HardwareEmbeddedSystemsHero from "../../../Components/Solutions/HardwareEmbeddedSystems/HardwareEmbeddedSystemsHero/HardwareEmbeddedSystemsHero.jsx";
import SystemLayers from "../../../Components/Solutions/HardwareEmbeddedSystems/SystemLayers/SystemLayers.jsx";
import HardwareCapabilities from "../../../Components/Solutions/HardwareEmbeddedSystems/HardwareCapabilities/HardwareCapabilities.jsx";
import HardwareProjects from "../../../Components/Solutions/HardwareEmbeddedSystems/HardwareProjects/HardwareProjects.jsx";
import ServiceProcess from "../../../Components/Solutions/Shared/ServiceProcess/ServiceProcess.jsx";
import ServiceCTA from "../../../Components/Solutions/Shared/ServiceCTA/ServiceCTA.jsx";
import { RELATED, contactLink } from "../../../Components/Solutions/Shared/serviceLinks.js";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";
import "../../../styles/pages/SolutionsPages.css";

const DESCRIPTION =
  "Hardware and embedded systems by ProJenius: microcontroller systems, firmware, sensor integration and connected IoT devices, from the first circuit to a working prototype.";

export default function HardwareEmbeddedSystemsPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pjsv-hardware">
      <HardwareEmbeddedSystemsHero />
      <SystemLayers />
      <HardwareCapabilities />
      <HardwareProjects />

      <ServiceProcess
        id="hardware-process"
        eyebrow="How We Work"
        title="How a Hardware Project Moves Forward"
        intro="Hardware gets more expensive to change as it progresses, so the early decisions are made carefully and tested on real parts."
        steps={[
          { title: "Requirement", text: "What the device must do, where it will be used and how it will be powered." },
          { title: "Architecture", text: "Choosing the controller, sensors, outputs and how the device connects." },
          { title: "Circuit & Firmware", text: "Designing the circuit and writing the firmware that runs on it." },
          { title: "Integration & Testing", text: "Bringing hardware, firmware and software together and testing on the bench." },
          { title: "Prototype & Next Steps", text: "A working prototype, and a clear view of what comes next: board, enclosure or refinement." },
        ]}
      />

      <ServiceCTA
        id="hardware-cta"
        eyebrow="Start a Hardware Project"
        title="Tell Us What Your Device Needs to Do"
        text="Whether you have a rough idea or a breadboard prototype, describe the problem and we will help you plan the electronics and firmware behind it."
        primary={{ label: "Discuss Hardware Requirements", to: contactLink("development", "hardware-embedded-systems") }}
        checklistTitle="What helps us start"
        checklist={[
          "What the device should do and for whom",
          "Inputs and sensors, and the outputs you expect",
          "Power source and where it will be used",
          "Connectivity, if any (Wi-Fi, Bluetooth, none)",
          "Quantity and timeline",
        ]}
        related={[
          { ...RELATED.pcb, question: "Need a custom circuit board?" },
          { ...RELATED.prototyping, question: "Need an enclosure or physical prototype?" },
          { ...RELATED.software, question: "Need a dashboard or app to connect your device?" },
        ]}
      />
    </main>
  );
}
