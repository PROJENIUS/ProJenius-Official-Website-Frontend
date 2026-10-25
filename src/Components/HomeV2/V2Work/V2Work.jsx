import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { PROJECTS } from "../../Home/OurProjects/projectsData.js";
import "./V2Work.css";

/* =============================================================================
   HOME V2 — SELECTED WORK. Real ProJenius projects (homepage project data).
   The first two have screenshots and lead; the rest follow as a list.
   ============================================================================= */

export default function V2Work() {
  const featured = PROJECTS.filter((project) => project.image).slice(0, 2);
  const rest = PROJECTS.filter((project) => !featured.includes(project));

  return (
    <section className="v2-section v2w" aria-labelledby="v2w-title">
      <div className="v2-wrap">
        <div className="v2w__head">
          <div>
            <p className="v2-label" data-reveal="up"><b>03</b> / Selected work</p>
            <h2 id="v2w-title" className="v2-h2" data-reveal="up" data-reveal-delay="1">
              Ideas we have turned into <span className="v2-mark">working systems.</span>
            </h2>
          </div>
          <Link className="v2-btn v2-btn--line" to="/services/development">
            How we build software <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>

        <ul className="v2w__featured">
          {featured.map((project, index) => (
            <li key={project.id} className="v2w__card" data-reveal="up" data-reveal-delay={String(index + 1)}>
              <div className="v2w__shot">
                <img src={project.image} alt={project.alt} width="560" height="575" loading="lazy" decoding="async" />
              </div>
              <div className="v2w__body">
                <span className="v2-tag">{project.category}</span>
                <h3 className="v2w__title">{project.title}</h3>
                <p className="v2w__text">{project.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <ul className="v2w__list">
          {rest.map(({ id, title, category, description, Icon }, index) => (
            <li key={id} className="v2w__row" data-reveal="up" data-reveal-delay={String(index + 1)}>
              <span className="v2w__row-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.9} /></span>
              <div>
                <h3 className="v2w__row-title">{title}</h3>
                <p className="v2w__row-text">{description}</p>
              </div>
              <span className="v2-tag">{category}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
