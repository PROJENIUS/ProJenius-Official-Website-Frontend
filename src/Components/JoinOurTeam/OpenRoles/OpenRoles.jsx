import { ArrowRight, BriefcaseBusiness, CheckCircle2, Clock, MapPin, UserRound } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import { OPENINGS } from "../openings.js";
import "./OpenRoles.css";

/* =============================================================================
   JOIN OUR TEAM — OPEN ROLES (hiring posts)
   One card per role in openings.js. "Apply for this role" picks the role in
   the application form (onApply) and scrolls to it.
   ============================================================================= */

export default function OpenRoles({ onApply }) {
  return (
    <section id="open-roles" className="pjj-roles" aria-labelledby="pjj-roles-title">
      <div className="pjds-container">
        <header className="pjj-roles__head">
          <p className="pjds-eyebrow" data-reveal="up">Open Roles</p>
          <h2 id="pjj-roles-title" className="pjj-roles__title" data-reveal="up" data-reveal-delay="1">
            <span className="pjj-roles__title-static">Find Your Place</span>
            <TypedPhrase phrases={["in Our Team", "in Software", "in Hardware", "in Learning"]} />
          </h2>
          <p className="pjj-roles__intro" data-reveal="up" data-reveal-delay="2">
            Read what each role involves, then apply directly from the card.
          </p>
        </header>

        {OPENINGS.length === 0 ? (
          <p className="pjj-roles__empty" data-reveal="up">
            There are no open roles right now. You can still send a general application below.
          </p>
        ) : (
          <ul className="pjj-roles__list">
            {OPENINGS.map((role, index) => (
              <li
                key={role.id}
                id={role.id}
                className={`pjj-role pjj-role--${(index % 4) + 1}`}
                data-reveal="up"
                data-reveal-delay={String((index % 3) + 1)}
              >
                <div className="pjj-role__top">
                  <span className="pjj-role__icon" aria-hidden="true">
                    <BriefcaseBusiness size={24} strokeWidth={1.9} />
                  </span>
                  <span className="pjj-role__team">{role.team}</span>
                </div>

                <h3 className="pjj-role__title">{role.title}</h3>

                <ul className="pjj-role__facts" aria-label="Role details">
                  <li><Clock size={15} aria-hidden="true" />{role.type}</li>
                  <li><MapPin size={15} aria-hidden="true" />{role.location}</li>
                  <li><UserRound size={15} aria-hidden="true" />{role.experience}</li>
                </ul>

                <p className="pjj-role__summary">{role.summary}</p>

                <ul className="pjj-role__points">
                  {role.points.map((point) => (
                    <li key={point}><CheckCircle2 size={17} aria-hidden="true" />{point}</li>
                  ))}
                </ul>

                <button type="button" className="pjj-role__apply" onClick={() => onApply(role.title)}>
                  Apply for this role <ArrowRight size={18} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
