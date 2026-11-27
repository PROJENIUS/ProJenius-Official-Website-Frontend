import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { SERVICE_ROUTES, contactLink } from "../../Shared/serviceLinks.js";
import { PROJECTS } from "../../../Common/ProjectShowcase/projects.js";
import "./WhyPeopleBuildWithUs.css";

/* =============================================================================
   HARDWARE PITCH — what working with ProJenius on hardware actually means,
   in plain words. Three parts:
     1. the pitch: "You bring the problem. We build the device." plus a short
        paragraph and the names of real ProJenius builds (from projects.js);
     2. "What you walk away with": a handover-receipt card; each item ticks
        itself off as it scrolls into view (both directions);
     3. "Where you might be today": three first-person situations, each with
        what we do and a link to the right page.
   Only confirmed facts: ProJenius designs, builds and tests the device, shows
   a working demo and hands it over; board manufacturing is by a partner.
   ============================================================================= */

const HANDOVER = [
  "A working prototype, tested on the bench",
  "Circuit schematic and board design files",
  "Firmware source code",
  "A live demo before handover",
  "A clear path to the next version",
];

/* Second card: what helps us start (same list as the page's closing card) */
const NEEDS = [
  "What the device should do, and for whom",
  "Inputs and sensors, and the outputs you expect",
  "Power source and where it will be used",
  "Connectivity, if any (Wi-Fi, Bluetooth, none)",
  "Quantity and timeline",
];

const SITUATIONS = [
  {
    quote: "I have an idea, but no electronics team.",
    answer: "We take it from the first sketch: choosing the parts, designing the circuit, writing the firmware and building a first working prototype.",
    link: { label: "Talk to us about your idea", to: contactLink("development", "hardware-pitch-idea") },
  },
  {
    quote: "My breadboard works. Now I need a real board.",
    answer: "We turn the wiring into a proper circuit board, clean up the firmware and test everything together as one device.",
    link: { label: "PCB Design & Fabrication", to: SERVICE_ROUTES.pcb },
  },
  {
    quote: "My device needs to talk to an app.",
    answer: "We add Wi-Fi or Bluetooth to the device and send its data to a dashboard or app your users can open.",
    link: { label: "Software Development", to: SERVICE_ROUTES.software },
  },
];

/* Real ProJenius builds tagged for hardware */
const BUILDS = PROJECTS.filter((p) => p.services.includes("hardware") && !p.confidential).map((p) => p.title);

export default function WhyPeopleBuildWithUs() {
  /* Which card of the deck is in front: "get" or "need" */
  const [front, setFront] = useState("get");

  return (
    <section id="hardware-pitch" className="pjhw-pitch" aria-labelledby="hardware-pitch-title">
      <div className="pjds-container">
        {/* ---------- 1 + 2: pitch and handover ---------- */}
        <div className="pjhw-pitch__top">
          <div className="pjhw-pitch__copy">
            <p className="pjds-eyebrow" data-reveal="up">Why People Build With Us</p>
            <h2 id="hardware-pitch-title" className="pjds-title pjhw-pitch__title" data-reveal="up" data-reveal-delay="1">
              <span className="pjhw-pitch__title-lead">You bring the problem.</span>{" "}
              <TypedPhrase phrases={["We build the device.", "We make it work."]} />
            </h2>
            <SectionTitleLine />
            <p className="pjhw-pitch__lede" data-reveal="up" data-reveal-delay="2">
              Most hardware ideas stall somewhere between a sketch and a working board. That is the part we take off
              your plate.
            </p>
            <p className="pjhw-pitch__body" data-reveal="up" data-reveal-delay="3">
              We choose the parts, design the circuit, write the firmware and connect the device to the cloud or an
              app when it needs one. Then we test it on the bench and show it to you working, before we hand it over.
              One team, from the first conversation to the device in your hands.
            </p>

            {BUILDS.length > 0 && (
              <div className="pjhw-pitch__builds" data-reveal="up" data-reveal-delay="4">
                <span className="pjhw-pitch__builds-label">Recent builds</span>
                <ul>
                  {BUILDS.map((name) => <li key={name}>{name}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Two-card deck: "what you get" in front, "what we need" peeking
              behind. Hover fans the back card out; clicking it (or the
              buttons above) brings it to the front. */}
          <div className="pjhw-pitch__deck" data-front={front} data-reveal="up" data-reveal-delay="2">
            <div className="pjhw-pitch__switch" role="group" aria-label="Choose a card">
              <button type="button" aria-pressed={front === "get"} onClick={() => setFront("get")}>You get</button>
              <button type="button" aria-pressed={front === "need"} onClick={() => setFront("need")}>You bring</button>
            </div>

            <div className="pjhw-pitch__stack">
              <aside
                className="pjhw-pitch__receipt pjhw-pitch__receipt--get"
                aria-labelledby="hardware-pitch-receipt-title"
                aria-hidden={front !== "get"}
              >
                <div className="pjhw-pitch__receipt-head">
                  <span className="pjhw-pitch__receipt-code">HANDOVER · PJ-HW</span>
                  <h3 id="hardware-pitch-receipt-title" className="pjhw-pitch__receipt-title">What you walk away with</h3>
                </div>
                <ul className="pjhw-pitch__receipt-list">
                  {HANDOVER.map((item, index) => (
                    <li key={item} className="pjhw-pitch__receipt-item" data-reveal="left" data-reveal-delay={String(Math.min(index + 1, 4))}>
                      <span className="pjhw-pitch__tick" aria-hidden="true"><Check size={15} strokeWidth={3} /></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="pjhw-pitch__receipt-foot">Checked together with you, before handover.</p>
                {front !== "get" && (
                  <button type="button" className="pjhw-pitch__peek" tabIndex={-1} aria-hidden="true" onClick={() => setFront("get")} />
                )}
              </aside>

              <aside
                className="pjhw-pitch__receipt pjhw-pitch__receipt--need"
                aria-labelledby="hardware-pitch-need-title"
                aria-hidden={front !== "need"}
              >
                <div className="pjhw-pitch__receipt-head">
                  <span className="pjhw-pitch__receipt-code">START · PJ-HW</span>
                  <h3 id="hardware-pitch-need-title" className="pjhw-pitch__receipt-title">What we need from you</h3>
                </div>
                <ol className="pjhw-pitch__receipt-list">
                  {NEEDS.map((item, index) => (
                    <li key={item} className="pjhw-pitch__receipt-item">
                      <span className="pjhw-pitch__count" aria-hidden="true">{index + 1}</span>
                      {item}
                    </li>
                  ))}
                </ol>
                <p className="pjhw-pitch__receipt-foot">A rough idea is enough to begin.</p>
                {front !== "need" && (
                  <button type="button" className="pjhw-pitch__peek" tabIndex={-1} aria-hidden="true" onClick={() => setFront("need")} />
                )}
              </aside>
            </div>
          </div>
        </div>

        {/* ---------- 3: where you might be today ---------- */}
        <div className="pjhw-pitch__where">
          <p className="pjhw-pitch__where-label" data-reveal="up">Where you might be today</p>
          <ol className="pjhw-pitch__situations">
            {SITUATIONS.map(({ quote, answer, link }, index) => (
              <li key={quote} className="pjhw-pitch__situation" data-reveal="up" data-reveal-delay={String(index + 1)}>
                <span className="pjhw-pitch__mark" aria-hidden="true">“</span>
                <p className="pjhw-pitch__quote">{quote}</p>
                <p className="pjhw-pitch__answer">
                  <span>What we do</span>
                  {answer}
                </p>
                <Link className="pjhw-pitch__link" to={link.to}>
                  {link.label} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
