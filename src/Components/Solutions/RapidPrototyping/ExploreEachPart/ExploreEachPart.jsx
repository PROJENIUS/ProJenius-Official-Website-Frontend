import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Box, Code2, Cpu, Lightbulb, Wifi, Wrench } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { SERVICE_ROUTES } from "../../Shared/serviceLinks.js";
import "./ExploreEachPart.css";

/* =============================================================================
   GO DEEPER INTO EACH PART — the links to the other pages, in one place.
   Row 1: the parts of a prototype as a connected chain, in build order
   (enclosure → PCB → firmware → app). The enclosure is on this page ("You
   are here"); each other part links to its own page. The connecting line
   draws across when the chain scrolls into view.
   Row 2: two other ways in: only an idea (Startup) or build it yourself
   in our lab (Incubate).
   ============================================================================= */

const CHAIN = [
  { Icon: Box, part: "Enclosure", text: "Designed in CAD and 3D printed, so everything inside fits.", page: "3D design & printing", to: "#prototyping-enclosure", here: true },
  { Icon: Cpu, part: "PCB & electronics", text: "Designed to fit the box, made by our manufacturing partner.", page: "PCB Design & Fabrication", to: SERVICE_ROUTES.pcb },
  { Icon: Wifi, part: "Firmware & sensors", text: "Sensors, the controller and the code that brings it to life.", page: "Hardware & Embedded", to: SERVICE_ROUTES.hardware },
  { Icon: Code2, part: "App & cloud", text: "Wi-Fi or Bluetooth to a dashboard or companion app.", page: "Software Development", to: SERVICE_ROUTES.software },
];

const OTHER = [
  {
    Icon: Lightbulb,
    question: "Only have an idea so far?",
    text: "Problem understanding, connections, field visits and the build, until it becomes one complete product.",
    label: "Startup & Innovation",
    to: SERVICE_ROUTES.startup,
  },
  {
    Icon: Wrench,
    question: "Want to build it yourself?",
    text: "A seat in our workspace with 24/7 access, soldering stations, 3D printers and a team to guide you.",
    label: "Incubate at ProJenius",
    to: SERVICE_ROUTES.incubate,
  },
];

export default function ExploreEachPart() {
  return (
    <section id="prototyping-connections" className="pjrpC" aria-labelledby="prototyping-connections-title">
      <div className="pjds-container">
        <header className="pjrpC__head">
          <p className="pjds-eyebrow" data-reveal="up">Explore Each Part</p>
          <h2 id="prototyping-connections-title" className="pjds-title pjrpC__title" data-reveal="up" data-reveal-delay="1">
            Go deeper into <TypedPhrase phrases={["each part.", "each layer."]} />
          </h2>
          <SectionTitleLine />
          <p className="pjds-lead pjrpC__lead" data-reveal="up" data-reveal-delay="2">
            This page covers the whole build. Each part also has its own page with the details, the process and the
            common questions.
          </p>
        </header>

        <nav aria-label="Parts of a prototype">
          <ol className="pjrpC__chain" data-reveal="up">
            {CHAIN.map(({ Icon, part, text, page, to, here }, index) => {
              const inner = (
                <>
                  <span className="pjrpC__step">{String(index + 1).padStart(2, "0")}</span>
                  <span className="pjrpC__icon" aria-hidden="true"><Icon size={30} strokeWidth={1.9} /></span>
                  <span className="pjrpC__part">{part}</span>
                  <span className="pjrpC__desc">{text}</span>
                  <span className="pjrpC__page">
                    {here ? "You are here" : page}
                    {!here && <ArrowUpRight size={16} aria-hidden="true" />}
                  </span>
                </>
              );
              return (
                <li key={part} className={`pjrpC__node${here ? " is-here" : ""}`} style={{ "--k": index }}>
                  {here ? (
                    <a className="pjrpC__card" href={to} aria-label={`${part}: covered on this page`}>{inner}</a>
                  ) : (
                    <Link className="pjrpC__card" to={to}>{inner}</Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <ul className="pjrpC__other">
          {OTHER.map(({ Icon, question, text, label, to }, index) => (
            <li key={label} data-reveal="up" data-reveal-delay={String(index + 1)}>
              <Link className="pjrpC__wide" to={to}>
                <span className="pjrpC__wide-icon" aria-hidden="true"><Icon size={30} strokeWidth={1.9} /></span>
                <span className="pjrpC__wide-body">
                  <span className="pjrpC__wide-q">{question}</span>
                  <span className="pjrpC__wide-text">{text}</span>
                </span>
                <span className="pjrpC__wide-go">
                  {label} <ArrowRight size={18} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
