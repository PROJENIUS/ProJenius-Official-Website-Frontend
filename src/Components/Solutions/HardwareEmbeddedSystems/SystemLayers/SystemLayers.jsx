import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cloud, Code2, Cpu, Radar } from "lucide-react";

import { SERVICE_ROUTES } from "../../Shared/serviceLinks.js";
import "./SystemLayers.css";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =============================================================================
   HOW HARDWARE AND SOFTWARE WORK TOGETHER
   A connected product as four layers. Choosing a layer (buttons, so it works
   by keyboard and touch) highlights it in the signal chain and explains it.
   ============================================================================= */

const LAYERS = [
  {
    id: "sensing",
    Icon: Radar,
    label: "Sensing",
    title: "Sensors turn the physical world into signals",
    text: "Temperature, motion, distance, light, water quality: sensors measure what is happening so the device has something to act on.",
    examples: ["Sensor selection", "Signal conditioning", "Calibration"],
  },
  {
    id: "control",
    Icon: Cpu,
    label: "Control",
    title: "A microcontroller makes the decisions",
    text: "The controller reads the sensors, runs the logic and drives outputs. Its circuit, power and components are designed together.",
    examples: ["Microcontroller boards", "Circuit design", "Power and components"],
    link: { to: SERVICE_ROUTES.pcb, label: "Need it on a custom board? PCB Design & Fabrication" },
  },
  {
    id: "firmware",
    Icon: Code2,
    label: "Firmware",
    title: "Firmware makes the hardware behave reliably",
    text: "The code on the device: reading inputs, timing, control logic and communication, written so the device behaves the same way every time.",
    examples: ["Control logic", "Device communication", "Testing on hardware"],
  },
  {
    id: "output",
    Icon: Cloud,
    label: "Output & Cloud",
    title: "Results reach people and other systems",
    text: "Displays, motors and alerts act locally; connected devices send data to dashboards and applications people can use.",
    examples: ["Actuators and alerts", "IoT connectivity", "Dashboards and apps"],
    link: { to: SERVICE_ROUTES.software, label: "Need the dashboard or app? Software Development" },
  },
];

export default function SystemLayers() {
  const [activeId, setActiveId] = useState(LAYERS[0].id);
  const active = LAYERS.find((layer) => layer.id === activeId);

  return (
    <section id="hardware-system" className="pjhw-layers" aria-labelledby="hardware-system-title">
      <div className="pjds-container">
        <header className="pjhw-layers__head">
          <p className="pjds-eyebrow" data-reveal="up">How It Fits Together</p>
          <h2 id="hardware-system-title" className="pjds-title" data-reveal="up" data-reveal-delay="1">
            From a Signal <TypedPhrase phrases={["to a Result", "to a Decision", "to an Action"]} />
          </h2>
          <SectionTitleLine />
          <p className="pjds-lead" data-reveal="up" data-reveal-delay="2">
            A connected product brings electronics, firmware and software together in one build. Choose a layer
            to see what it does.
          </p>
        </header>

        <div className="pjhw-layers__body" data-reveal="up" data-reveal-delay="2">
          <div className="pjhw-layers__chain" role="group" aria-label="Layers of a connected product">
            {LAYERS.map(({ id, Icon, label }, index) => (
              <button
                key={id}
                type="button"
                className={`pjhw-layers__node${activeId === id ? " is-active" : ""}`}
                aria-pressed={activeId === id}
                aria-controls="hardware-layer-panel"
                onClick={() => setActiveId(id)}
              >
                <span className="pjhw-layers__node-icon" aria-hidden="true"><Icon size={24} strokeWidth={2} /></span>
                <span className="pjhw-layers__node-step" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="pjhw-layers__node-label">{label}</span>
              </button>
            ))}
          </div>

          <div id="hardware-layer-panel" className="pjhw-layers__panel" aria-live="polite">
            <h3 className="pjhw-layers__panel-title">{active.title}</h3>
            <p className="pjhw-layers__panel-text">{active.text}</p>
            <ul className="pjhw-layers__examples">
              {active.examples.map((item) => <li key={item}>{item}</li>)}
            </ul>
            {active.link && (
              <Link className="pjhw-layers__link" to={active.link.to}>
                {active.link.label}
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
