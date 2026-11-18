import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import "./PCBSolutions.css";

/* =============================================================================
   PCB SOLUTIONS — "What we do": six numbered stages of PCB development,
   centred heading (pill, fixed words, cyan typing, line) and a 3 × 2 grid.
   The cards rise in one by one with the page's scroll reveal.
   Manufacturing is done by a partner; ProJenius coordinates it, then tests,
   demos and hands over the board.
   ============================================================================= */

const SOLUTIONS = [
  {
    stage: "Design",
    title: "PCB Design & Layout",
    text: "Custom circuit schematics, component selection, routing and board layout built around your project requirements.",
  },
  {
    stage: "Prototyping",
    title: "PCB Prototyping",
    text: "Prototype development and design iterations to help validate your electronics before moving towards production.",
  },
  {
    stage: "Manufacturing",
    title: "PCB Fabrication",
    text: "Fabrication coordination with our manufacturing partner for boards based on the required specifications and design files.",
  },
  {
    stage: "Assembly",
    title: "PCB Assembly",
    text: "Component sourcing and assembly support, including through-hole and surface-mount requirements where available.",
  },
  {
    stage: "Engineering",
    title: "Hardware Integration",
    text: "Integration of microcontrollers, sensors, power circuits, communication modules and embedded electronics.",
  },
  {
    stage: "Validation",
    title: "Testing & Debugging",
    text: "Continuity checks, functional validation, debugging and design improvements, with a working demo before handover.",
  },
];

export default function PCBSolutions() {
  return (
    <section id="pcb-build" className="pjpcb-sol" aria-labelledby="pcb-build-title">
      <div className="pjds-container">
        <header className="pjpcb-sol__head">
          <p className="pjds-eyebrow" data-reveal="up">What We Do</p>
          <h2 id="pcb-build-title" className="pjds-title pjpcb-sol__title" data-reveal="up" data-reveal-delay="1">
            Complete PCB Solutions, <TypedPhrase phrases={["Under One Roof.", "Design to Delivery."]} />
          </h2>
          <SectionTitleLine />
          <p className="pjds-lead pjpcb-sol__lead" data-reveal="up" data-reveal-delay="2">
            From the first circuit concept to a fabrication-ready design, we support the essential stages of PCB
            development.
          </p>
        </header>

        <ol className="pjpcb-sol__grid">
          {SOLUTIONS.map(({ stage, title, text }, index) => (
            <li
              key={title}
              className="pjpcb-sol__card"
              data-reveal="up"
              data-reveal-delay={String((index % 3) + 1)}
            >
              <span className="pjpcb-sol__stage">
                {String(index + 1).padStart(2, "0")} — {stage}
              </span>
              <h3 className="pjpcb-sol__name">{title}</h3>
              <p className="pjpcb-sol__text">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
