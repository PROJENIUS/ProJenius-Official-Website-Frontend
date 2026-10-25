import { ArrowDown, ArrowRight, ArrowUpRight, BriefcaseBusiness } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import { OPENINGS } from "../openings.js";
import "./JoinHero.css";

/* =============================================================================
   JOIN OUR TEAM — HERO
   Navy hero like the other pages: pill, static line + typed line, lead and
   two actions. On the right a "Now hiring" panel lists the open roles from
   openings.js; each row jumps to that role's card.
   ============================================================================= */

export default function JoinHero() {
  return (
    <section className="pjj-hero" aria-labelledby="pjj-hero-title">
      <div className="pjds-container pjj-hero__layout">
        <div className="pjj-hero__copy">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Careers at ProJenius</p>
          <h1 id="pjj-hero-title" className="pjj-hero__title" data-reveal="up" data-reveal-delay="1">
            <span className="pjj-hero__title-static">Build the Future</span>
            <TypedPhrase tone="dark" phrases={["With ProJenius", "of Technology", "on Real Projects"]} />
          </h1>
          <p className="pjj-hero__lead" data-reveal="up" data-reveal-delay="2">
            Join a team that builds software, IoT systems and products, and trains the next
            generation of engineers. See our open roles and apply in a few minutes.
          </p>
          <div className="pjj-hero__actions" data-reveal="up" data-reveal-delay="3">
            <a className="pjds-btn pjds-btn--primary pjds-btn--on-dark" href="#open-roles">
              View Open Roles <ArrowDown size={18} aria-hidden="true" />
            </a>
            <a className="pjds-btn pjds-btn--ghost" href="#apply">
              Apply Now <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="pjj-hero__panel" data-reveal="right" data-reveal-delay="2">
          <p className="pjj-hero__panel-label">
            <span className="pjj-hero__live" aria-hidden="true" />
            {OPENINGS.length ? `Now hiring · ${OPENINGS.length} open ${OPENINGS.length === 1 ? "role" : "roles"}` : "General applications open"}
          </p>
          {OPENINGS.length > 0 && (
            <ul className="pjj-hero__roles">
              {OPENINGS.map((role) => (
                <li key={role.id}>
                  <a href={`#${role.id}`}>
                    <span className="pjj-hero__role-icon" aria-hidden="true">
                      <BriefcaseBusiness size={20} strokeWidth={1.9} />
                    </span>
                    <span className="pjj-hero__role-text">
                      <strong>{role.title}</strong>
                      <span>{role.team} · {role.type}</span>
                    </span>
                    <ArrowUpRight className="pjj-hero__role-go" size={18} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="pjj-hero__panel-note">
            Don&apos;t see your role? You can still send a general application below.
          </p>
        </div>
      </div>
    </section>
  );
}
