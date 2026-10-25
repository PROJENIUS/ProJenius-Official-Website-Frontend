import { Box, Boxes, Cog, Lightbulb, PackageCheck } from "lucide-react";

import "./PrototypingCapabilities.css";

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
            From a Rough Shape to a Working Part
          </h2>
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
      </div>
    </section>
  );
}
