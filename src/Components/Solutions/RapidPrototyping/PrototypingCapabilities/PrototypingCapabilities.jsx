import { ArrowRight, Box, Boxes, Cog, Lightbulb, PackageCheck, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

import { contactLink } from "../../Shared/serviceLinks.js";
import "./PrototypingCapabilities.css";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =============================================================================
   WHAT CAN BE PROTOTYPED — a bento layout with one lead item.
   The five areas come from the existing ProJenius service description:
   "product concepts, custom components, functional parts and
   development-ready prototypes", plus enclosures (CAD modelling and
   3D-printed parts or enclosures).
   ============================================================================= */

const ITEMS = [
  {
    id: "enclosures",
    Icon: Box,
    title: "Product Enclosures",
    text: "CAD-modelled and 3D-printed housings that hold your electronics, so the product looks and fits like the real thing.",
    tags: ["Fit around a PCB", "Openings for ports and displays", "Mounting points"],
  },
  { id: "concept", Icon: Lightbulb, title: "Concept Models", text: "A physical version of an idea, to see its size and shape and to show it to others." },
  { id: "components", Icon: Cog, title: "Custom Components", text: "One-off parts, brackets and adapters that are not available off the shelf." },
  { id: "functional", Icon: Boxes, title: "Functional Parts", text: "Parts that have to move, fit or hold something, made to be tested in use." },
  { id: "ready", Icon: PackageCheck, title: "Development-Ready Prototypes", text: "A prototype refined enough to test with users, show to stakeholders or take to the next stage." },
];

export default function PrototypingCapabilities() {
  return (
    <section id="prototyping-capabilities" className="pjrp-caps" aria-labelledby="prototyping-capabilities-title">
      <div className="pjds-container">
        <header className="pjrp-caps__head">
          <p className="pjds-eyebrow" data-reveal="up">What Can Be Prototyped</p>
          <h2 id="prototyping-capabilities-title" className="pjds-title" data-reveal="up" data-reveal-delay="1">
            From a Rough Shape <TypedPhrase phrases={["to a Working Part", "to a Tested Model"]} />
          </h2>
          <SectionTitleLine />
          <p className="pjds-lead" data-reveal="up" data-reveal-delay="2">
            Prototypes answer different questions: does it look right, does it fit, does it work. Tell us
            which one matters and the prototype is made for that.
          </p>
        </header>

        <ul className="pjrp-caps__grid">
          {ITEMS.map(({ id, Icon, title, text, tags }, index) => (
            <li
              key={id}
              className={`pjrp-caps__item${index === 0 ? " pjrp-caps__item--lead" : ""}`}
              data-reveal="up"
              data-reveal-delay={String((index % 3) + 1)}
            >
              <span className="pjrp-caps__icon" aria-hidden="true"><Icon size={index === 0 ? 28 : 22} strokeWidth={1.9} /></span>
              <h3 className="pjrp-caps__title">{title}</h3>
              <p className="pjrp-caps__text">{text}</p>
              {tags && (
                <ul className="pjrp-caps__tags">
                  {tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <aside className="pjrp-caps__mechanical" aria-labelledby="pjrp-mechanical-title" data-reveal="up">
          <span className="pjrp-caps__mechanical-icon" aria-hidden="true"><Wrench size={24} strokeWidth={1.9} /></span>
          <div className="pjrp-caps__mechanical-copy">
            <p className="pjrp-caps__mechanical-kicker">Available as a standalone service</p>
            <h3 id="pjrp-mechanical-title">Mechanical engineering and product design</h3>
            <p>Engage us for mechanical design on its own, or as part of a wider product prototype. We can shape the CAD model, assemblies and enclosure around your requirements.</p>
            <ul className="pjrp-caps__mechanical-tags" aria-label="Mechanical engineering capabilities">
              <li>Mechanical design</li>
              <li>3D CAD modelling</li>
              <li>Assemblies and enclosures</li>
              <li>Prototype refinement</li>
            </ul>
          </div>
          <div className="pjrp-caps__mechanical-action">
            <Link className="pjrp-caps__mechanical-link" to={contactLink("development", "mechanical-engineering")}>
              Discuss mechanical design
              <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" />
            </Link>
            <p>Physical fabrication may involve external partners; the arrangement is confirmed for each project.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
