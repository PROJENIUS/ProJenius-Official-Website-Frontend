import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Star } from "lucide-react";

import useOnScreen from "../../../hooks/useOnScreen.js";
import PCBBoard from "../../Solutions/PCBDesignFabrication/PCBBoard/PCBBoard.jsx";
import { PrototypeVisual } from "../../Solutions/RapidPrototyping/RapidPrototypingHero/RapidPrototypingHero.jsx";
import softwareShot from "../../../assets/Home/OurProjects/OurProjects_4.webp";
import trainingPhoto from "../../../assets/About/Achievements/Achievements_5.webp";
import "./V2Hero.css";

/* =============================================================================
   HOME V2 — HERO
   Left: statement, actions and proof. Right: the "bench", a sheet that cycles
   through what ProJenius builds, each with a real visual. It advances only
   while on screen, pauses on hover/focus, and can be driven with the tabs.
   ============================================================================= */

const WHATSAPP_HREF = "https://wa.me/918925450473";
const GOOGLE_PROFILE_URL = "https://www.google.com/maps/place/data=!4m2!3m1!1s0x3b00cfb5c8f13bb3:0xc245f4db34baf398";
const CYCLE_MS = 4800;

const BENCH = [
  {
    id: "software",
    tab: "Software",
    caption: "Web application · AI-Based Water Quality Monitoring",
    to: "/services/development",
    linkLabel: "Software Development",
  },
  {
    id: "electronics",
    tab: "Electronics",
    caption: "Circuit board · schematic to assembled board (illustration)",
    to: "/services/pcb-design-fabrication",
    linkLabel: "PCB Design & Fabrication",
  },
  {
    id: "prototype",
    tab: "Prototype",
    caption: "Enclosure · CAD model to printed part (illustration)",
    to: "/services/rapid-prototyping",
    linkLabel: "Rapid Prototyping",
  },
  {
    id: "training",
    tab: "Training",
    caption: "Session at SRM Institute of Science and Technology, Chennai",
    to: "/services/courses",
    linkLabel: "Learning & Development",
  },
];

function BenchVisual({ id }) {
  if (id === "software") {
    return (
      <div className="v2h-bench__browser">
        <div className="v2h-bench__browser-bar" aria-hidden="true"><span /><span /><span /></div>
        <img src={softwareShot} width="560" height="575" alt="Screenshot of the AI-Powered Water Health Monitoring web application built by ProJenius" />
      </div>
    );
  }
  if (id === "electronics") return <div className="v2h-bench__board"><PCBBoard stage="hero" /></div>;
  if (id === "prototype") return <div className="v2h-bench__proto"><PrototypeVisual /></div>;
  return (
    <img
      className="v2h-bench__photo"
      src={trainingPhoto}
      width="1280"
      height="963"
      alt="ProJenius team with students after a session at SRM Institute of Science and Technology, Chennai"
    />
  );
}

export default function V2Hero() {
  const benchRef = useRef(null);
  const isOnScreen = useOnScreen(benchRef);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = BENCH[active];

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!isOnScreen || paused || reduce) return undefined;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % BENCH.length), CYCLE_MS);
    return () => window.clearTimeout(timer);
  }, [active, isOnScreen, paused]);

  return (
    <section className="v2h" aria-labelledby="v2h-title">
      <div className="v2-wrap v2h__layout">
        <div className="v2h__copy">
          <p className="v2-label" data-reveal="up">
            <b>ProJenius</b> Innovation Technology · Madurai
          </p>
          <h1 id="v2h-title" className="v2h__title" data-reveal="up" data-reveal-delay="1">
            We build the technology <span className="v2-mark">behind your idea.</span>
          </h1>
          <p className="v2h__sub" data-reveal="up" data-reveal-delay="2">
            Software, electronics, PCBs and prototypes, and the training that grows engineers.
            One team, from the first conversation to a working result.
          </p>

          <div className="v2h__actions" data-reveal="up" data-reveal-delay="3">
            <Link className="v2-btn v2-btn--ink" to="/contact">
              Start a Project <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <a className="v2-btn v2-btn--line" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} strokeWidth={2.2} aria-hidden="true" /> WhatsApp us
            </a>
          </div>

          <ul className="v2h__proof" data-reveal="up" data-reveal-delay="4">
            <li>
              <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                <span className="v2h__stars" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} strokeWidth={0} fill="currentColor" />)}
                </span>
                <strong>4.8</strong> on Google · 57 reviews
              </a>
            </li>
            <li><strong>Software</strong> · Hardware · PCB · Prototyping · Training</li>
          </ul>
        </div>

        <div
          ref={benchRef}
          className="v2h-bench"
          data-reveal="scale"
          data-reveal-delay="2"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="v2h-bench__head">
            <span>Sheet {String(active + 1).padStart(2, "0")} / {String(BENCH.length).padStart(2, "0")} · {item.tab}</span>
            <span className="v2h-bench__live"><i aria-hidden="true" /> On the bench</span>
          </div>

          <div className="v2h-bench__tabs" role="tablist" aria-label="What ProJenius builds">
            {BENCH.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                role="tab"
                id={`v2h-tab-${entry.id}`}
                aria-selected={index === active}
                aria-controls="v2h-bench-panel"
                className="v2h-bench__tab"
                onClick={() => setActive(index)}
              >
                {entry.tab}
                {index === active && !paused && isOnScreen && <span className="v2h-bench__progress" aria-hidden="true" />}
              </button>
            ))}
          </div>

          <div id="v2h-bench-panel" className="v2h-bench__stage" role="tabpanel" aria-labelledby={`v2h-tab-${item.id}`}>
            <div key={item.id} className="v2h-bench__visual">
              <BenchVisual id={item.id} />
            </div>
          </div>

          <div className="v2h-bench__foot">
            <span className="v2h-bench__caption">{item.caption}</span>
            <Link className="v2h-bench__link" to={item.to}>
              {item.linkLabel} <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
