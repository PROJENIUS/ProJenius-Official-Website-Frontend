import { useEffect, useRef } from "react";
import { BadgeCheck, Factory, MessagesSquare, PenTool } from "lucide-react";

import PCBSectionHead from "../PCBSectionHead/PCBSectionHead.jsx";
import "./PCBHowWeWork.css";

/* =============================================================================
   HOW WE WORK — Variant 1: "The board builds itself".
   Text for the four steps scrolls on the left; on the right ONE drawing of
   the ProJenius dev board (Wi-Fi module, sensor, USB-C, pin header, LED)
   stays on screen (sticky) and builds up with the scroll:
     01 Understand  a pencil sketch of the idea
     02 Design      copper traces route themselves
     03 Fabricate   the solder mask fills in, parts drop onto their pads
     04 Validate    the LED lights, signals flow, "Test passed"
   No cards, no panels. Scroll progress goes into --pjpcb-p (0–1) and
   data-stage; the drawing is driven by CSS from those, without re-renders.
   Reduced motion: the finished board and all text are shown at rest.
   ============================================================================= */

const STEPS = [
  { Icon: MessagesSquare, title: "Understand", text: "Discuss your idea, functionality, specifications and project goals.", output: "Clear requirements" },
  { Icon: PenTool, title: "Design", text: "Develop schematics, select components and create PCB layouts for your approval.", output: "Schematic & layout" },
  { Icon: Factory, title: "Fabricate", text: "Prepare manufacturing files and coordinate fabrication with our manufacturing partner.", output: "Fabricated board" },
  { Icon: BadgeCheck, title: "Validate", text: "Test the board, show you a working demo and hand it over, with support for improvements.", output: "Tested, working PCB" },
];

/* The ProJenius dev board. The same routes are drawn three times: as design
   traces (stage 2), as copper under the solder mask (stage 3) and as the
   moving test signal (stage 4). */
const TRACES = [
  "M74 182 H118 L138 162 H228",
  "M162 104 H204 L218 118 H228",
  "M300 204 V232 L320 252 H380",
  "M262 204 V238 L240 260 H210",
  "M228 186 H172 L140 218 V236",
  "M370 297 V288 L390 268 V262",
];

/* Pads at the trace ends, vias where traces turn, mounting holes, header */
const PADS = [[74, 182], [228, 162], [162, 104], [228, 118], [300, 204], [380, 252], [262, 204], [210, 260], [228, 186], [140, 236], [370, 297], [390, 262]];
const VIAS = [[138, 162], [218, 118], [320, 252], [240, 260], [140, 218], [390, 268]];
const HOLES = [[64, 74], [416, 74], [64, 306], [416, 306]];
const HEADER = [250, 274, 298, 322, 346, 370];

function useBuildProgress(count) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const items = Array.from(el.querySelectorAll("[data-step]"));
    const apply = (p) => {
      const stage = Math.min(count - 1, Math.floor(p * count));
      el.style.setProperty("--pjpcb-p", p.toFixed(4));
      el.dataset.stage = String(stage);
      items.forEach((item, i) => {
        if (i === stage) item.dataset.active = "true";
        else delete item.dataset.active;
      });
    };

    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1);
      el.dataset.reduced = "true";
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      /* 0 when the steps' top reaches 60% of the screen, 1 when their
         bottom does. */
      const line = vh * 0.6;
      apply(Math.min(1, Math.max(0, (line - rect.top) / Math.max(1, rect.height))));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [count]);
  return ref;
}

export default function PCBHowWeWork() {
  const ref = useBuildProgress(STEPS.length);

  return (
    <section id="pcb-workflow" className="pjpcbA" aria-labelledby="pcb-workflow-title">
      <div className="pjds-container">
        <PCBSectionHead
          id="pcb-workflow-title"
          eyebrow="How We Work"
          title="From Your Concept to a"
          typed={["Ready-to-Build PCB.", "Working Board."]}
          lead="A transparent development process keeps every stage clear, collaborative and aligned with your requirements."
        />

        <div ref={ref} className="pjpcbA__scroller" data-stage="0">
          {/* The board that builds itself */}
          <div className="pjpcbA__visual" aria-hidden="true">
            <svg className="pjpcbA__svg" viewBox="0 0 480 380">
              <defs>
                <filter id="pjpcbA-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="10" />
                </filter>
                <linearGradient id="pjpcbA-mask-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#11466f" />
                  <stop offset="1" stopColor="#0a2a47" />
                </linearGradient>
                <linearGradient id="pjpcbA-shield" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#eef3f8" />
                  <stop offset="1" stopColor="#9fb0c2" />
                </linearGradient>
                <pattern id="pjpcbA-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="10" />
                </pattern>
              </defs>

              {/* 03 board: solder mask, ground-plane hatch, mounting holes */}
              <g className="pjpcbA__board">
                <rect className="pjpcbA__mask" x="40" y="50" width="400" height="280" rx="18" />
                <rect className="pjpcbA__hatch" x="40" y="50" width="400" height="280" rx="18" />
                {HOLES.map(([x, y]) => <circle key={`h-${x}-${y}`} className="pjpcbA__hole" cx={x} cy={y} r="8" />)}
              </g>

              {/* 01 sketch of the idea */}
              <g className="pjpcbA__sketch">
                <rect x="40" y="50" width="400" height="280" rx="18" />
                <rect x="40" y="158" width="34" height="48" rx="5" />
                <rect x="112" y="84" width="50" height="40" rx="4" />
                <rect x="228" y="88" width="132" height="116" rx="6" />
                <circle cx="390" cy="252" r="16" />
                <rect x="243" y="296" width="134" height="16" rx="4" />
                <text x="57" y="226">USB-C</text>
                <text x="137" y="76">sensor</text>
                <text x="294" y="152">MCU + Wi-Fi</text>
                <text x="390" y="286">LED</text>
                <text x="310" y="288">pins</text>
                <text className="pjpcbA__note" x="40" y="34">your idea…</text>
              </g>

              {/* 02 design: traces route themselves, pads appear */}
              <g className="pjpcbA__traces">
                {TRACES.map((d) => <path key={d} d={d} pathLength="1" />)}
              </g>
              <g className="pjpcbA__pads">
                {PADS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5" />)}
              </g>

              {/* 03 copper under the mask, and vias */}
              <g className="pjpcbA__copper">
                {TRACES.map((d) => <path key={d} d={d} />)}
              </g>
              <g className="pjpcbA__vias">
                {VIAS.map(([x, y]) => <circle key={`v-${x}-${y}`} cx={x} cy={y} r="4.5" />)}
              </g>

              {/* 03 parts drop onto the board */}
              <g className="pjpcbA__part" style={{ "--k": 0 }}>
                <rect x="228" y="88" width="132" height="116" rx="6" className="pjpcbA__module" />
                <path className="pjpcbA__antenna" d="M240 112 V98 H252 V112 H264 V98 H276 V112 H288 V98 H300 V112 H312 V98 H324 V112 H336 V98 H348" />
                <rect x="236" y="122" width="116" height="74" rx="4" fill="url(#pjpcbA-shield)" />
                <text x="294" y="158" className="pjpcbA__shield-text">PROJENIUS</text>
                <text x="294" y="174" className="pjpcbA__shield-sub">WI-FI · BLE</text>
                <text x="372" y="222" className="pjpcbA__silk">U1</text>
              </g>
              <g className="pjpcbA__part" style={{ "--k": 0.1 }}>
                <rect x="40" y="158" width="34" height="48" rx="5" className="pjpcbA__usb" />
                <rect x="46" y="170" width="6" height="24" rx="3" className="pjpcbA__usb-port" />
                <text x="57" y="226" className="pjpcbA__silk">J1</text>
              </g>
              <g className="pjpcbA__part" style={{ "--k": 0.2 }}>
                <rect x="112" y="84" width="50" height="40" rx="4" className="pjpcbA__ic" />
                {[0, 1, 2].map((i) => (
                  <g key={i}>
                    <rect x="104" y={90 + i * 11} width="8" height="5" className="pjpcbA__pin" />
                    <rect x="162" y={90 + i * 11} width="8" height="5" className="pjpcbA__pin" />
                  </g>
                ))}
                <text x="137" y="140" className="pjpcbA__silk">U2</text>
              </g>
              <g className="pjpcbA__part" style={{ "--k": 0.3 }}>
                <rect x="128" y="236" width="18" height="14" rx="2" className="pjpcbA__cap" />
                <text x="137" y="266" className="pjpcbA__silk">C1</text>
                <rect x="184" y="254" width="26" height="12" rx="3" className="pjpcbA__res" />
                <text x="197" y="284" className="pjpcbA__silk">R1</text>
              </g>
              <g className="pjpcbA__part" style={{ "--k": 0.4 }}>
                {HEADER.map((x) => (
                  <g key={x}>
                    <rect x={x - 7} y="297" width="14" height="14" rx="2" className="pjpcbA__header" />
                    <circle cx={x} cy="304" r="3" className="pjpcbA__header-hole" />
                  </g>
                ))}
                <text x="232" y="308" className="pjpcbA__silk">J2</text>
                <circle cx="390" cy="252" r="10" className="pjpcbA__led" />
                <text x="390" y="282" className="pjpcbA__silk">D1</text>
              </g>
              <text x="140" y="318" className="pjpcbA__brand">PROJENIUS · PJ-01</text>

              {/* 04 validate: LED lights, signal flows, test passes */}
              <circle cx="390" cy="252" r="26" className="pjpcbA__glow" filter="url(#pjpcbA-glow)" />
              <circle cx="390" cy="252" r="7" className="pjpcbA__led-on" />
              <g className="pjpcbA__pulse">
                {TRACES.map((d) => <path key={d} d={d} pathLength="1" />)}
              </g>
              <g className="pjpcbA__pass">
                <rect x="318" y="14" width="122" height="30" rx="15" />
                <path d="M334 29 l5 5 l9 -10" />
                <text x="394" y="34">Test passed</text>
              </g>
            </svg>

            <p className="pjpcbA__stage-label">
              {STEPS.map(({ title }, i) => (
                <span key={title} data-for={i}>Stage {i + 1} of {STEPS.length} · {title}</span>
              ))}
            </p>
          </div>

          <ol className="pjpcbA__steps">
            {STEPS.map(({ Icon, title, text, output }, index) => (
              <li key={title} className="pjpcbA__step" data-step>
                <span className="pjpcbA__num">
                  <Icon size={22} strokeWidth={2} aria-hidden="true" />
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="pjpcbA__title">
                  <span className="pjpcbA__sr">Step {index + 1}: </span>
                  {title}
                </h3>
                <p className="pjpcbA__text">{text}</p>
                <p className="pjpcbA__out"><span>You get</span> {output}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
