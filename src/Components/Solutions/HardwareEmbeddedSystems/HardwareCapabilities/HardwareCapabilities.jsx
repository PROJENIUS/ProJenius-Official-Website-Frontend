import { Link } from "react-router-dom";
import { ArrowRight, Blocks, CircuitBoard, Code2, Cpu, Radar, Wifi } from "lucide-react";

import { SERVICE_ROUTES } from "../../Shared/serviceLinks.js";
import "./HardwareCapabilities.css";

/* =============================================================================
   HARDWARE & EMBEDDED CAPABILITIES — an editorial list, not a card grid.
   Wording follows what ProJenius already describes on the site (services,
   startup capability map and projects).
   ============================================================================= */

const CAPABILITIES = [
  {
    Icon: Cpu,
    title: "Embedded Systems",
    text: "Microcontroller-based systems that read inputs, run control logic and drive outputs for a specific job.",
  },
  {
    Icon: Code2,
    title: "Firmware Development",
    text: "Firmware and control logic that make hardware behave reliably, tested on the actual device.",
  },
  {
    Icon: Radar,
    title: "Sensor Integration",
    text: "Connecting the sensors a product needs and turning physical signals into data people can use.",
  },
  {
    Icon: Wifi,
    title: "IoT & Connected Devices",
    text: "Devices that send their data to dashboards, alerts and applications over a network.",
  },
  {
    Icon: CircuitBoard,
    title: "Circuit Design & Components",
    text: "Circuit design, component selection and integration for sensing, control and power.",
    link: { to: SERVICE_ROUTES.pcb, label: "Board design is covered on PCB Design & Fabrication" },
  },
  {
    Icon: Blocks,
    title: "Hardware–Software Integration",
    text: "Bringing electronics, firmware and software together so the whole product works as one.",
  },
];

export default function HardwareCapabilities() {
  return (
    <section id="hardware-capabilities" className="pjhw-caps" aria-labelledby="hardware-capabilities-title">
      <div className="pjds-container pjhw-caps__layout">
        <header className="pjhw-caps__head">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Capabilities</p>
          <h2 id="hardware-capabilities-title" className="pjds-title pjds-title--on-dark" data-reveal="up" data-reveal-delay="1">
            What We Help You Build
          </h2>
          <p className="pjds-lead pjds-lead--on-dark" data-reveal="up" data-reveal-delay="2">
            From a single sensor prototype to a connected device, the work covers the electronics, the
            firmware that runs them and the way they connect to everything else.
          </p>
        </header>

        <ol className="pjhw-caps__list">
          {CAPABILITIES.map(({ Icon, title, text, link }, index) => (
            <li key={title} className="pjhw-caps__item" data-reveal="up" data-reveal-delay={String((index % 3) + 1)}>
              <span className="pjhw-caps__num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="pjhw-caps__icon" aria-hidden="true"><Icon size={22} strokeWidth={2} /></span>
              <div className="pjhw-caps__text">
                <h3>{title}</h3>
                <p>{text}</p>
                {link && (
                  <Link className="pjhw-caps__link" to={link.to}>
                    {link.label}
                    <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
