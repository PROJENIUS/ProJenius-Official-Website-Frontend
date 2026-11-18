import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { FACILITIES } from "../incubateData.js";
import "./IncubateFacilities.css";

/* =============================================================================
   FACILITIES — what incubated teams can use at ProJenius.
   Photo cards (photo from src/assets/Incubate/<id>/, icon if none yet).
   ============================================================================= */

export default function IncubateFacilities() {
  return (
    <section id="incubate-facilities" className="pjinc-fac" aria-labelledby="incubate-facilities-title">
      <div className="pjds-container">
        <header className="pjinc-fac__head">
          <p className="pjds-eyebrow" data-reveal="up">Facilities</p>
          <h2 id="incubate-facilities-title" className="pjds-title pjinc-fac__title" data-reveal="up" data-reveal-delay="1">
            Everything You Need <TypedPhrase phrases={["to Build", "Under One Roof", "to Launch"]} />
          </h2>
          <SectionTitleLine />
          <p className="pjds-lead pjinc-fac__lead" data-reveal="up" data-reveal-delay="2">
            A place to work, a lab to build in and a team around you.
          </p>
        </header>

        <ul className="pjinc-fac__grid">
          {FACILITIES.map(({ id, Icon, title, text, image }, index) => (
            <li key={id} className="pjinc-fac__card" data-reveal="up" data-reveal-delay={String((index % 3) + 1)}>
              <div className="pjinc-fac__media">
                {image ? (
                  <img src={image} alt="" loading="lazy" decoding="async" />
                ) : null}
                <span className="pjinc-fac__icon" aria-hidden="true"><Icon size={20} strokeWidth={2} /></span>
              </div>
              <div className="pjinc-fac__body">
                <h3 className="pjinc-fac__name">{title}</h3>
                <p className="pjinc-fac__text">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
