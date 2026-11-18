import { useState } from "react";
import { ChevronDown } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { projectsFor } from "../../../Common/ProjectShowcase/projects.js";
import "./PrototypeProjects.css";

/* =============================================================================
   BUILT WITH US — "Prototypes we've taken from sketch to hand."
   Real ProJenius projects tagged "prototyping" in projects.js (photos from
   src/assets/Projects/<id>/). Three are shown; "See all projects" opens
   the rest in place. Only the category is shown (no invented timelines).
   ============================================================================= */

/* Projects with the clearest photos first */
const FIRST = ["water-quality", "road-hazard", "follower-robot"];

export default function PrototypeProjects() {
  const all = projectsFor("prototyping");
  const ordered = [
    ...FIRST.map((id) => all.find((p) => p.id === id)).filter(Boolean),
    ...all.filter((p) => !FIRST.includes(p.id)),
  ];
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? ordered : ordered.slice(0, 3);

  if (!ordered.length) return null;

  return (
    <section id="prototyping-projects" className="pjrpP" aria-labelledby="prototyping-projects-title">
      <div className="pjds-container">
        <header className="pjrpP__head">
          <div>
            <p className="pjds-eyebrow" data-reveal="up">Built With Us</p>
            <h2 id="prototyping-projects-title" className="pjds-title pjrpP__title" data-reveal="up" data-reveal-delay="1">
              Prototypes we&apos;ve taken from <TypedPhrase phrases={["sketch to hand.", "idea to device."]} />
            </h2>
            <SectionTitleLine />
          </div>
          {ordered.length > 3 && (
            <button
              type="button"
              className="pjrpP__all"
              aria-expanded={showAll}
              aria-controls="prototyping-projects-grid"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? "Show fewer" : `See all projects (${ordered.length})`}
              <ChevronDown size={18} aria-hidden="true" />
            </button>
          )}
        </header>

        <ul id="prototyping-projects-grid" className="pjrpP__grid">
          {visible.map((project, index) => (
            <li key={project.id} className="pjrpP__card" data-reveal="up" data-reveal-delay={String((index % 3) + 1)}>
              <div className="pjrpP__media">
                {project.image ? (
                  <img src={project.image} alt={project.alt || project.title} loading="lazy" decoding="async" />
                ) : (
                  <span className="pjrpP__placeholder" aria-hidden="true"><project.Icon size={40} strokeWidth={1.6} /></span>
                )}
              </div>
              <p className="pjrpP__meta">{project.category}</p>
              <h3 className="pjrpP__name">{project.title}</h3>
              <p className="pjrpP__text">{project.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
