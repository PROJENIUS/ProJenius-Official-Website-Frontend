/* =========================================================
   HARDWARE & EMBEDDED SYSTEMS PAGE
   The "brain" of a device: sensing, control, firmware and
   connectivity. Circuit boards live on PCB Design; the whole
   product on Rapid Prototyping.
   Hero → what we build (4 cards) → what we engineer (6
   numbered rows; the row in the middle of the screen lights
   up on scroll) → the pitch: what you get and where you might
   be today (replaced the sliding project cards) → closing card.

   Not mounted any more (files kept): SystemLayers,
   HardwareCapabilities, HardwareProjects (replaced by the
   shared ProjectShowcase). The 5-step "How a Hardware Project
   Moves Forward" process was replaced by What We Engineer.
========================================================= */

import { useRef } from "react";
import { Code2, Cpu, Radar, Wifi } from "lucide-react";

import HardwareEmbeddedSystemsHero from "../../../Components/Solutions/HardwareEmbeddedSystems/HardwareEmbeddedSystemsHero/HardwareEmbeddedSystemsHero.jsx";
import ServiceOfferings from "../../../Components/Solutions/Shared/ServiceOfferings/ServiceOfferings.jsx";
import HardwareServices from "../../../Components/Solutions/HardwareEmbeddedSystems/HardwareServices/HardwareServices.jsx";
import HardwarePitch from "../../../Components/Solutions/HardwareEmbeddedSystems/HardwarePitch/HardwarePitch.jsx";
import ServiceCTA from "../../../Components/Solutions/Shared/ServiceCTA/ServiceCTA.jsx";
import { RELATED, contactLink } from "../../../Components/Solutions/Shared/serviceLinks.js";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import useScrollReveal from "../../../hooks/useScrollReveal.js";
import "../../../styles/pages/SolutionsPages.css";

const DESCRIPTION =
  "Hardware and embedded systems by ProJenius: sensors, microcontroller systems, firmware and connected IoT devices, from the first circuit to a working prototype.";

const OFFERINGS = [
  {
    id: "sensing",
    Icon: Radar,
    title: "Sensors & Sensing",
    points: ["Temperature, motion, distance, light, water quality", "Sensor selection", "Signal conditioning and calibration"],
  },
  {
    id: "control",
    Icon: Cpu,
    title: "Embedded Control",
    points: ["Microcontroller-based systems", "ESP32, STM32, Arduino", "Circuit, power and components designed together"],
  },
  {
    id: "firmware",
    Icon: Code2,
    title: "Firmware",
    points: ["Inputs, timing and control logic", "Tested on the actual device", "Behaves the same way every time"],
  },
  {
    id: "iot",
    Icon: Wifi,
    title: "IoT & Cloud",
    points: ["Wi-Fi and Bluetooth connectivity", "Motors, displays and alerts", "Data to dashboards and apps"],
  },
];

export default function HardwareEmbeddedSystemsPage() {
  const pageRef = useRef(null);
  useMetaDescription(DESCRIPTION);
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjsv-page pjsv-hardware">
      <HardwareEmbeddedSystemsHero />

      <ServiceOfferings
        id="hardware-build"
        eyebrow="What We Build"
        title="The Brain Inside"
        typed={["Your Device", "Your Product"]}
        lead="Sensors to read the world, a controller to decide, firmware to run it and a connection to share the results."
        topic="Hardware & Embedded Systems"
        items={OFFERINGS}
      />

      <HardwareServices />

      <HardwarePitch />

      <ServiceCTA
        id="hardware-cta"
        eyebrow="Start a Hardware Project"
        title="Tell Us What Your Device"
        typed={["Needs to Do", "Should Measure", "Should Control"]}
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
          { ...RELATED.prototyping, question: "Need the whole product built?" },
          { ...RELATED.software, question: "Need a dashboard or app for your device?" },
        ]}
      />
    </main>
  );
}
