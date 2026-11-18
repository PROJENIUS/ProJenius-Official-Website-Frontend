import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

import TypedPhrase from "../TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../SectionTitleLine/SectionTitleLine.jsx";
import { whatsappHref } from "../../../utils/whatsapp.js";
import { projectsFor } from "./projects.js";
import "./ProjectShowcase.css";

/* =============================================================================
   PROJECT SHOWCASE — shared "projects we have built" section for service
   pages. Shows the projects tagged with `service` in projects.js, as one row
   of cards that scrolls sideways (arrows on desktop, swipe on touch), so the
   section fits one screen however many projects there are.
   Each card has a WhatsApp button with a message naming that project.
   ============================================================================= */

export default function ProjectShowcase({
  service,
  id = `${service}-projects`,
  eyebrow = "Our Work",
  title = "Projects We Have",
  typed = ["Built", "Delivered"],
  lead = "",
}) {
  const projects = projectsFor(service);
  const railRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setEdges({ start: rail.scrollLeft <= 2, end: rail.scrollLeft >= max - 2 });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    updateEdges();
    rail.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      rail.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollByCard = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".pj-projects__card");
    const step = card ? card.getBoundingClientRect().width + 20 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  if (!projects.length) return null;
  const titleId = `${id}-title`;
  const scrollable = !(edges.start && edges.end);

  return (
    <section id={id} className="pj-projects" aria-labelledby={titleId}>
      <div className="pjds-container">
        <header className="pj-projects__head">
          <div className="pj-projects__head-copy">
            <p className="pjds-eyebrow" data-reveal="up">{eyebrow}</p>
            <h2 id={titleId} className="pjds-title pj-projects__title" data-reveal="up" data-reveal-delay="1">
              {title} <TypedPhrase phrases={typed} />
            </h2>
            <SectionTitleLine />
            {lead && <p className="pjds-lead pj-projects__lead" data-reveal="up" data-reveal-delay="2">{lead}</p>}
          </div>

          {scrollable && (
            <div className="pj-projects__arrows">
              <button
                type="button"
                className="pj-projects__arrow"
                onClick={() => scrollByCard(-1)}
                disabled={edges.start}
                aria-label="Previous projects"
                aria-controls={`${id}-rail`}
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="pj-projects__arrow"
                onClick={() => scrollByCard(1)}
                disabled={edges.end}
                aria-label="More projects"
                aria-controls={`${id}-rail`}
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </header>

        <ul ref={railRef} id={`${id}-rail`} className="pj-projects__rail" aria-label="Projects">
          {projects.map((project) => {
            const name = project.confidential ? project.category : project.title;
            return (
              <li key={project.id} className="pj-projects__card">
                <div className="pj-projects__media">
                  {project.image ? (
                    <img src={project.image} alt={project.confidential ? "" : project.alt || name} loading="lazy" decoding="async" />
                  ) : (
                    <span className="pj-projects__placeholder" aria-hidden="true">
                      <project.Icon size={44} strokeWidth={1.6} />
                    </span>
                  )}
                  <span className="pj-projects__badge">
                    {project.confidential ? "NDA project" : project.category}
                  </span>
                </div>

                <div className="pj-projects__body">
                  <h3 className="pj-projects__name">{name}</h3>
                  <p className="pj-projects__text">{project.description}</p>
                  {project.tech?.length > 0 && (
                    <ul className="pj-projects__tech" aria-label="Technology">
                      {project.tech.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  )}
                  <a
                    className="pj-projects__wa"
                    href={whatsappHref(`Hi ProJenius, I saw your "${name}" project and would like to discuss something similar.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    Discuss a Similar Project
                    <span className="pjds-sr-only"> like {name} on WhatsApp (opens in a new tab)</span>
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
