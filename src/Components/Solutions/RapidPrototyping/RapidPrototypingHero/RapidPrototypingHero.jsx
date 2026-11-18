import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import "./RapidPrototypingHero.css";

/* =============================================================================
   RAPID PROTOTYPING HERO — "exploded product".
   Left: the message. Right: the four layers of one product, pulled apart
   and labelled (enclosure, PCB & electronics, power & wiring, base &
   mounts). The layers drop in one by one, then float gently; a signal runs
   along the board's traces. Illustration only.
   Reduced motion: the layers are shown at rest.
   Previous version (shared cinematic hero): backup-before-cleanup/
   RapidPrototypingHero-cinematic/
   ============================================================================= */

const CX = 210;

function slab(cy, w, h, t) {
  const p = (list) => list.map(([x, y]) => `${x},${y}`).join(" ");
  return {
    top: p([[CX, cy - h], [CX + w, cy], [CX, cy + h], [CX - w, cy]]),
    left: p([[CX - w, cy], [CX, cy + h], [CX, cy + h + t], [CX - w, cy + t]]),
    right: p([[CX, cy + h], [CX + w, cy], [CX + w, cy + t], [CX, cy + h + t]]),
  };
}

/* (u, v) in [-1, 1] on a slab's top face → screen point */
const iso = (u, v, cy, w, h) => [CX + ((u - v) * w) / 2, cy + ((u + v) * h) / 2];
const face = (u0, u1, v0, v1, cy, w, h) =>
  [iso(u0, v0, cy, w, h), iso(u1, v0, cy, w, h), iso(u1, v1, cy, w, h), iso(u0, v1, cy, w, h)].map((pt) => pt.join(",")).join(" ");
const path = (list, cy, w, h) => "M" + list.map(([u, v]) => iso(u, v, cy, w, h).join(" ")).join(" L");

const W = 150;
const H = 62;
const LAYERS = [
  { id: "lid", cy: 95, num: "01", title: "Enclosure", sub: "3D designed & printed", reach: W },
  { id: "pcb", cy: 215, num: "02", title: "PCB & electronics", sub: "Shaped to fit the box", reach: W },
  { id: "power", cy: 318, num: "03", title: "Power & wiring", sub: "Battery, charging, cables", reach: 62 },
  { id: "base", cy: 412, num: "04", title: "Base & mounts", sub: "Holds it all together", reach: W },
];

const LID = slab(95, W, H, 16);
const PCB = slab(215, W, H, 6);
const POWER = slab(318, 62, 26, 22);
const BASE = slab(412, W, H, 18);

const TRACES = [
  [[-0.85, -0.2], [-0.45, -0.2], [-0.2, 0]],
  [[0.2, -0.15], [0.5, -0.5], [0.8, -0.5]],
  [[0.05, 0.2], [0.05, 0.6], [0.5, 0.8]],
  [[-0.2, 0.15], [-0.6, 0.55]],
  [[0.2, 0.05], [0.75, 0.15]],
];

export default function RapidPrototypingHero() {
  return (
    <section className="pjrp-hero2" aria-labelledby="prototype-hero-title">
      <div className="pjds-container pjrp-hero2__inner">
        {/* ---------- Message ---------- */}
        <div className="pjrp-hero2__copy">
          <p className="pjrp-hero2__kicker">Rapid Prototyping · End to End</p>
          <h1 id="prototype-hero-title" className="pjrp-hero2__title">
            <span>From idea to a working product</span>
            <span className="pjrp-hero2__typed">
              <TypedPhrase phrases={["you can hold.", "that just works."]} tone="dark" />
            </span>
          </h1>
          <p className="pjrp-hero2__desc">
            Enclosure, electronics, firmware and app, designed together by one team in Madurai, so every part fits
            the first time.
          </p>
          <div className="pjrp-hero2__actions">
            <Link className="pjrp-hero2__btn pjrp-hero2__btn--primary" to={contactLink("development", "rapid-prototyping")}>
              Start your prototype <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a className="pjrp-hero2__btn pjrp-hero2__btn--ghost" href="#prototyping-build">
              See how it comes together <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* ---------- Exploded product (illustration) ---------- */}
        <figure className="pjrp-hero2__visual" aria-label="Illustration: the layers of one prototype, from the enclosure to the base">
          <svg className="pjrp-hero2__svg" viewBox="0 0 600 520" role="img" aria-hidden="true">
            {/* Guide joining the layers */}
            <line className="pjrp-hero2__guide" x1={CX - W} y1="111" x2={CX - W} y2="412" />

            {/* Labels with leader lines */}
            {LAYERS.map(({ id, cy, num, title, sub, reach }, i) => (
              <g key={`label-${id}`} className="pjrp-hero2__label" style={{ "--i": i }}>
                <line x1={CX + reach + 8} y1={cy} x2="398" y2={cy} />
                <circle cx="398" cy={cy} r="3" />
                <text x="412" y={cy - 3}>
                  <tspan className="pjrp-hero2__label-num">{num}</tspan>
                  <tspan className="pjrp-hero2__label-title" dx="8">{title}</tspan>
                </text>
                <text className="pjrp-hero2__label-sub" x="412" y={cy + 16}>{sub}</text>
              </g>
            ))}

            {/* 04 Base */}
            <g className="pjrp-hero2__drop" style={{ "--i": 3 }}>
              <g className="pjrp-hero2__float">
                <polygon className="pjrp-hero2__white-l" points={BASE.left} />
                <polygon className="pjrp-hero2__white-r" points={BASE.right} />
                <polygon className="pjrp-hero2__white-t" points={BASE.top} />
                {[[-0.75, -0.75], [0.75, -0.75], [0.75, 0.75], [-0.75, 0.75]].map(([u, v]) => {
                  const [x, y] = iso(u, v, 412, W, H);
                  return <ellipse key={`${u}${v}`} className="pjrp-hero2__screw" cx={x} cy={y} rx="7" ry="4" />;
                })}
              </g>
            </g>

            {/* 03 Power */}
            <g className="pjrp-hero2__drop" style={{ "--i": 2 }}>
              <g className="pjrp-hero2__float">
                <polygon className="pjrp-hero2__amber-l" points={POWER.left} />
                <polygon className="pjrp-hero2__amber-r" points={POWER.right} />
                <polygon className="pjrp-hero2__amber-t" points={POWER.top} />
                <text className="pjrp-hero2__volt" x={CX} y="322">3.7V</text>
              </g>
            </g>

            {/* 02 PCB */}
            <g className="pjrp-hero2__drop" style={{ "--i": 1 }}>
              <g className="pjrp-hero2__float">
                <polygon className="pjrp-hero2__pcb-side" points={PCB.left} />
                <polygon className="pjrp-hero2__pcb-side" points={PCB.right} />
                <polygon className="pjrp-hero2__pcb-top" points={PCB.top} />
                <g className="pjrp-hero2__traces">
                  {TRACES.map((t) => <path key={t.join()} d={path(t, 215, W, H)} />)}
                </g>
                <g className="pjrp-hero2__signal">
                  {TRACES.map((t) => <path key={t.join()} d={path(t, 215, W, H)} pathLength="1" />)}
                </g>
                {TRACES.map((t) => {
                  const end = t[t.length - 1];
                  const [x, y] = iso(end[0], end[1], 215, W, H);
                  return <circle key={`pad-${t.join()}`} className="pjrp-hero2__pad" cx={x} cy={y} r="4.5" />;
                })}
                <polygon className="pjrp-hero2__chip" points={face(-0.22, 0.22, -0.22, 0.22, 207, W, H)} />
              </g>
            </g>

            {/* 01 Lid */}
            <g className="pjrp-hero2__drop" style={{ "--i": 0 }}>
              <g className="pjrp-hero2__float">
                <polygon className="pjrp-hero2__white-l" points={LID.left} />
                <polygon className="pjrp-hero2__white-r" points={LID.right} />
                <polygon className="pjrp-hero2__white-t" points={LID.top} />
                <polygon className="pjrp-hero2__window" points={face(0.05, 0.55, -0.6, -0.1, 95, W, H)} />
                <circle className="pjrp-hero2__knob" cx={iso(-0.35, 0.25, 95, W, H)[0]} cy={iso(-0.35, 0.25, 95, W, H)[1]} r="9" />
                <circle className="pjrp-hero2__led" cx={iso(-0.55, -0.5, 95, W, H)[0]} cy={iso(-0.55, -0.5, 95, W, H)[1]} r="3" />
              </g>
            </g>
          </svg>
        </figure>
      </div>
    </section>
  );
}
