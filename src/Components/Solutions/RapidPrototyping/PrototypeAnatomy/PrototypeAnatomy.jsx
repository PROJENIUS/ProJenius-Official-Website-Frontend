import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { SERVICE_ROUTES } from "../../Shared/serviceLinks.js";
import "./PrototypeAnatomy.css";

/* =============================================================================
   END-TO-END PROTOTYPE — "from the outside in".
   Left: five steps joined by a line that fills downwards with the scroll.
   Right (sticky): one exploded drawing of a device that builds up:
     01 Enclosure   lid and base (3D design & printing) — everything else
                    is designed to fit inside it
     02 PCB         the board slides in, gold traces route themselves
     03 Firmware    the chips drop on and light up
     04 App         a phone appears, linked by Wi-Fi
     05 Assembled   the lid closes onto the base: one working prototype
   Scroll progress goes into --p (0–1) and data-stage, so scrolling never
   re-renders React. Reduced motion: the assembled device and all text.
   ============================================================================= */

const STEPS = [
  {
    tag: "3D Design & Printing",
    title: "The Outer Enclosure",
    text: "A prototype starts with the box it lives in: its size, its shape, how it is held, and where the buttons, ports and display go. We model the enclosure in CAD and 3D print it, so everything inside is designed to fit.",
  },
  {
    tag: "PCB Design",
    title: "The Circuit Board",
    text: "With the enclosure fixed, the board is designed to fit inside it: the right shape, mounting holes in the right place, connectors lined up with the openings. Our manufacturing partner makes it.",
    link: { label: "PCB Design & Fabrication", to: SERVICE_ROUTES.pcb },
  },
  {
    tag: "Embedded Systems",
    title: "Electronics & Firmware",
    text: "Sensors, the controller and the firmware that brings the device to life: reading inputs, making decisions and driving outputs, tested on the real board.",
    link: { label: "Hardware & Embedded Systems", to: SERVICE_ROUTES.hardware },
  },
  {
    tag: "Software",
    title: "App & Cloud",
    text: "When the device needs to talk, we connect it over Wi-Fi or Bluetooth to a dashboard or a companion app your users can open.",
    link: { label: "Software Development", to: SERVICE_ROUTES.software },
  },
  {
    tag: "Assembly & Testing",
    title: "One Working Prototype",
    text: "Everything closes into one device. We assemble it, test it, show you a working demo and hand it over, typically in about 45 days.",
  },
];

/* ---- Isometric drawing helpers (viewBox 0 0 480 460) ---------------------- */
const CX = 200;
const W = 130; // half width of a slab
const H = 56; // half depth of a slab

/* (u, v) in [-1, 1] on a slab's top face → screen point */
const iso = (u, v, cy) => [CX + ((u - v) * W) / 2, cy + ((u + v) * H) / 2];
const pts = (list) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function slab(cy, t) {
  return {
    top: pts([[CX, cy - H], [CX + W, cy], [CX, cy + H], [CX - W, cy]]),
    left: pts([[CX - W, cy], [CX, cy + H], [CX, cy + H + t], [CX - W, cy + t]]),
    right: pts([[CX, cy + H], [CX + W, cy], [CX + W, cy + t], [CX, cy + H + t]]),
  };
}

const rect = (u0, u1, v0, v1, cy) => pts([iso(u0, v0, cy), iso(u1, v0, cy), iso(u1, v1, cy), iso(u0, v1, cy)]);
const line = (list, cy) => "M" + list.map(([u, v]) => iso(u, v, cy).map((n) => n.toFixed(1)).join(" ")).join(" L");

const LID_Y = 95;
const PCB_Y = 215;
const BASE_Y = 335;
const LID = slab(LID_Y, 14);
const PCB = slab(PCB_Y, 5);
const BASE = slab(BASE_Y, 34);

const TRACES = [
  [[-0.8, -0.1], [-0.45, -0.1], [-0.25, 0]],
  [[0.25, -0.2], [0.45, -0.45], [0.55, -0.6]],
  [[0.1, 0.25], [0.1, 0.55], [0.45, 0.7]],
  [[-0.15, 0.25], [-0.45, 0.55], [-0.7, 0.6]],
  [[0.25, 0.05], [0.7, 0.1]],
];

function useBuildProgress(count) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const items = Array.from(el.querySelectorAll("[data-step]"));
    const steps = el.querySelector("[data-steps]");
    const apply = (p) => {
      const stage = Math.min(count - 1, Math.floor(p * count));
      el.style.setProperty("--p", p.toFixed(4));
      el.dataset.stage = String(stage);
      items.forEach((item, i) => {
        if (i === stage) item.dataset.active = "true";
        else delete item.dataset.active;
        if (i < stage) item.dataset.done = "true";
        else delete item.dataset.done;
      });
    };

    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1);
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const box = (steps || el).getBoundingClientRect();
      const line = (window.innerHeight || 1) * 0.6;
      apply(Math.min(1, Math.max(0, (line - box.top) / Math.max(1, box.height))));
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

export default function PrototypeAnatomy() {
  const ref = useBuildProgress(STEPS.length);

  return (
    <section id="prototyping-build" className="pjrpA" aria-labelledby="prototyping-build-title">
      <div className="pjds-container">
        <header className="pjrpA__head">
          <p className="pjds-eyebrow" data-reveal="up">End-to-End Prototype</p>
          <h2 id="prototyping-build-title" className="pjds-title pjrpA__title" data-reveal="up" data-reveal-delay="1">
            From the Outer Box <TypedPhrase phrases={["to a Working Product.", "to the Last Wire."]} />
          </h2>
          <SectionTitleLine />
          <p className="pjds-lead pjrpA__lead" data-reveal="up" data-reveal-delay="2">
            We build the whole prototype, from the outside in. Every part is designed around the one before it, so
            it all fits and works together.
          </p>
        </header>

        <div ref={ref} className="pjrpA__scroller" data-stage="0">
          {/* ---------- Steps, joined by a line that fills downwards ---------- */}
          <ol className="pjrpA__steps" data-steps>
            <span className="pjrpA__rail" aria-hidden="true"><span className="pjrpA__rail-fill" /></span>
            {STEPS.map(({ tag, title, text, link }, index) => (
              <li key={title} className="pjrpA__step" data-step>
                <span className="pjrpA__dot" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="pjrpA__tag">{tag}</span>
                <h3 className="pjrpA__name">{title}</h3>
                <p className="pjrpA__text">{text}</p>
                {link && (
                  <Link className="pjrpA__link" to={link.to}>
                    {link.label} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </li>
            ))}
          </ol>

          {/* ---------- The device that builds itself (illustration) ---------- */}
          <div className="pjrpA__visual" aria-hidden="true">
            <svg className="pjrpA__svg" viewBox="0 0 480 466">
              <defs>
                <filter id="pjrpA-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>

              {/* Guides joining the exploded layers */}
              <g className="pjrpA__guides">
                <line x1={CX - W} y1={LID_Y + 14} x2={CX - W} y2={BASE_Y} />
                <line x1={CX + W} y1={LID_Y + 14} x2={CX + W} y2={BASE_Y} />
                <line x1={CX} y1={LID_Y + H + 14} x2={CX} y2={BASE_Y + H} />
              </g>

              {/* Base of the enclosure */}
              <g className="pjrpA__layer pjrpA__base">
                <polygon className="pjrpA__shell-l" points={BASE.left} />
                <polygon className="pjrpA__shell-r" points={BASE.right} />
                <polygon className="pjrpA__shell-t" points={BASE.top} />
                <polygon className="pjrpA__cavity" points={rect(-0.85, 0.85, -0.85, 0.85, BASE_Y)} />
                <polygon className="pjrpA__port" points={pts([[CX + W * 0.55, BASE_Y + H * 0.45 + 12], [CX + W * 0.75, BASE_Y + H * 0.25 + 12], [CX + W * 0.75, BASE_Y + H * 0.25 + 20], [CX + W * 0.55, BASE_Y + H * 0.45 + 20]])} />
              </g>

              {/* Circuit board */}
              <g className="pjrpA__layer pjrpA__pcb">
                <polygon className="pjrpA__pcb-side" points={PCB.left} />
                <polygon className="pjrpA__pcb-side" points={PCB.right} />
                <polygon className="pjrpA__pcb-top" points={PCB.top} />
                <g className="pjrpA__traces">
                  {TRACES.map((t) => <path key={t.join()} d={line(t, PCB_Y)} pathLength="1" />)}
                </g>
                {[[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]].map(([u, v]) => {
                  const [x, y] = iso(u, v, PCB_Y);
                  return <circle key={`${u}${v}`} className="pjrpA__hole" cx={x} cy={y} r="4.5" />;
                })}
                {/* Chips drop on at stage 3 */}
                <g className="pjrpA__chips">
                  <polygon className="pjrpA__chip pjrpA__chip--mcu" points={rect(-0.25, 0.25, -0.2, 0.25, PCB_Y - 8)} />
                  <polygon className="pjrpA__chip" points={rect(0.45, 0.75, -0.75, -0.5, PCB_Y - 6)} />
                  <polygon className="pjrpA__chip" points={rect(-0.85, -0.6, -0.25, 0.05, PCB_Y - 6)} />
                  <circle className="pjrpA__led" cx={iso(0.5, 0.72, PCB_Y)[0]} cy={iso(0.5, 0.72, PCB_Y)[1] - 6} r="6" />
                  <circle className="pjrpA__led-glow" cx={iso(0.5, 0.72, PCB_Y)[0]} cy={iso(0.5, 0.72, PCB_Y)[1] - 6} r="12" filter="url(#pjrpA-glow)" />
                </g>
              </g>

              {/* Lid of the enclosure, with a display window */}
              <g className="pjrpA__layer pjrpA__lid">
                <polygon className="pjrpA__shell-l" points={LID.left} />
                <polygon className="pjrpA__shell-r" points={LID.right} />
                <polygon className="pjrpA__shell-t" points={LID.top} />
                <polygon className="pjrpA__screen" points={rect(-0.45, 0.35, -0.5, 0.1, LID_Y)} />
                <polygon className="pjrpA__screen-on" points={rect(-0.45, 0.35, -0.5, 0.1, LID_Y)} />
                <circle className="pjrpA__button" cx={iso(0.6, 0.55, LID_Y)[0]} cy={iso(0.6, 0.55, LID_Y)[1]} r="7" />
              </g>

              {/* Companion app, linked over Wi-Fi */}
              <g className="pjrpA__app">
                <path className="pjrpA__wave" d="M340 205 q14 -14 28 0" />
                <path className="pjrpA__wave" d="M333 196 q21 -21 42 0" />
                <rect className="pjrpA__phone" x="378" y="140" width="76" height="140" rx="14" />
                <rect className="pjrpA__phone-screen" x="385" y="152" width="62" height="114" rx="6" />
                <polyline className="pjrpA__chart" points="392,240 402,228 412,234 422,214 432,220 440,204" />
                <rect className="pjrpA__phone-bar" x="392" y="162" width="34" height="6" rx="3" />
                <rect className="pjrpA__phone-bar" x="392" y="174" width="22" height="6" rx="3" />
              </g>

              {/* Done */}
              <g className="pjrpA__ready">
                <rect x="112" y="432" width="176" height="28" rx="14" />
                <path d="M130 446 l5 5 l9 -10" />
                <text x="210" y="451">Prototype ready</text>
              </g>
            </svg>

            <p className="pjrpA__stage-label">
              {STEPS.map(({ title }, i) => (
                <span key={title} data-for={i}>Step {i + 1} of {STEPS.length} · {title}</span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
