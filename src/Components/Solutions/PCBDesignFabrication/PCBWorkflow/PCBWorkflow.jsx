import { useRef, useState } from "react";

import PCBBoard from "../PCBBoard/PCBBoard.jsx";
import "./PCBWorkflow.css";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =============================================================================
   DESIGN-TO-BOARD WORKFLOW — tabs (WAI-ARIA tab pattern, arrow keys move
   between stages). The same board illustration is redrawn for each stage.
   ============================================================================= */

const STAGES = [
  {
    id: "schematic",
    label: "Schematic",
    title: "Capture the circuit",
    text: "The circuit is drawn as a schematic: components, connections, power and the interfaces the board needs.",
    output: "Schematic and component list",
  },
  {
    id: "layout",
    label: "Layout",
    title: "Place and route the board",
    text: "Components are placed on the board outline and the connections are routed as copper traces.",
    output: "Board layout",
  },
  {
    id: "review",
    label: "Review",
    title: "Check before anything is made",
    text: "The layout is reviewed against the schematic and the board's constraints, and issues are fixed on screen, where changes are cheap.",
    output: "Reviewed, corrected design",
  },
  {
    id: "fabrication",
    label: "Fabrication",
    title: "Turn the design into a physical board",
    text: "Manufacturing files are prepared and the board is made by our manufacturing partner: one custom board, or as many as you need.",
    output: "Fabricated bare board",
  },
  {
    id: "assembly",
    label: "Test & Handover",
    title: "Test, demo and hand over",
    text: "The board is powered up and tested with its firmware, we show you a working demo, and then it is handed over to you.",
    output: "Tested board, demo and handover",
  },
];

export default function PCBWorkflow() {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef([]);
  const stage = STAGES[index];

  const onKeyDown = (event) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next = null;
    if (event.key in keys) next = (index + keys[event.key] + STAGES.length) % STAGES.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = STAGES.length - 1;
    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="pcb-workflow" className="pjpcb-flow" aria-labelledby="pcb-workflow-title">
      <div className="pjds-container">
        <header className="pjpcb-flow__head">
          <p className="pjds-eyebrow" data-reveal="up">Design-to-Board Workflow</p>
          <h2 id="pcb-workflow-title" className="pjds-title" data-reveal="up" data-reveal-delay="1">
            From Schematic to <TypedPhrase phrases={["a Working Board", "a Finished PCB"]} />
          </h2>
          <SectionTitleLine />
          <p className="pjds-lead" data-reveal="up" data-reveal-delay="2">
            Five stages, each with a clear output. Select a stage to see what happens.
          </p>
        </header>

        <div className="pjpcb-flow__tabs" role="tablist" aria-label="PCB workflow stages" data-reveal="up" data-reveal-delay="2">
          {STAGES.map((item, i) => (
            <button
              key={item.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              id={`pcb-tab-${item.id}`}
              type="button"
              role="tab"
              className="pjpcb-flow__tab"
              aria-selected={i === index}
              aria-controls="pcb-workflow-panel"
              tabIndex={i === index ? 0 : -1}
              onClick={() => setIndex(i)}
              onKeyDown={onKeyDown}
            >
              <span className="pjpcb-flow__tab-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div
          id="pcb-workflow-panel"
          className="pjpcb-flow__panel"
          role="tabpanel"
          aria-labelledby={`pcb-tab-${stage.id}`}
          data-reveal="up"
          data-reveal-delay="3"
        >
          {/* Keyed so the short fade-in replays on every stage change. */}
          <div key={stage.id} className="pjpcb-flow__visual">
            <PCBBoard stage={stage.id} label={`Board illustration at the ${stage.label} stage`} />
          </div>
          <div className="pjpcb-flow__copy">
            <p className="pjpcb-flow__step">Stage {index + 1} of {STAGES.length}</p>
            <h3 className="pjpcb-flow__title">{stage.title}</h3>
            <p className="pjpcb-flow__text">{stage.text}</p>
            <p className="pjpcb-flow__output">
              <span>Output</span>
              {stage.output}
            </p>
          </div>
        </div>

        <p className="pjpcb-flow__partner-note" data-reveal="up" data-reveal-delay="1">
          PCB design and development are scoped by ProJenius. Board fabrication and assembly are arranged through external partners when required, with the delivery approach confirmed for each project.
        </p>
      </div>
    </section>
  );
}
