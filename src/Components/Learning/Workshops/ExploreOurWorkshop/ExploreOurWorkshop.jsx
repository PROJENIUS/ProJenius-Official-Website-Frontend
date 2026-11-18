import { Link } from "react-router-dom";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import "./ExploreOurWorkshop.css";

/* =============================================================================
   EXPLORE OUR WORKSHOP
   -----------------------------------------------------------------------------
   "Explore Our Workshop Areas" — eight workshop-area cards plus the
   "Request a Customized Workshop" call to action. Purely presentational:
   no state, no effects. Self-contained (icons and data live in this file).
   Light section (second on the Workshops page).
   ============================================================================= */

const CONTACT_WORKSHOP = "/contact?type=workshop";

/* ===========================================================================
   CONTENT
   span = desktop column width out of 12 (allowed: 3, 4, 5, 6)
   =========================================================================== */
const WORKSHOP_AREAS = [
  {
    icon: "ai",
    title: "AI & Machine Learning",
    span: 5,
    topics: ["Artificial Intelligence", "Machine Learning", "Computer Vision", "Generative AI", "Practical AI Applications"],
  },
  {
    icon: "iot",
    title: "IoT & Embedded Systems",
    span: 4,
    topics: ["IoT fundamentals", "ESP32", "Sensors", "Connected devices", "Smart systems"],
  },
  {
    icon: "robotics",
    title: "Robotics & Automation",
    span: 3,
    topics: ["Robotics fundamentals", "Sensors and actuators", "Robot building", "Automation", "Robot control"],
  },
  {
    icon: "software",
    title: "Software & Development",
    span: 3,
    topics: ["Web development", "Application development", "Python", "AI-powered applications", "Software projects"],
  },
  {
    icon: "pcb",
    title: "Electronics & PCB",
    span: 4,
    topics: ["Electronics fundamentals", "Circuit building", "PCB design", "Embedded systems", "Hardware integration"],
  },
  {
    icon: "proto",
    title: "Product & Rapid Prototyping",
    span: 5,
    topics: ["3D printing", "Product design", "Rapid prototyping", "MVP concepts", "Hardware integration"],
  },
  {
    icon: "startup",
    title: "Innovation & Startup",
    span: 6,
    topics: ["Problem identification", "Ideation", "Design thinking", "MVP thinking", "Innovation"],
  },
  {
    icon: "emerging",
    title: "Emerging Technologies",
    span: 6,
    custom: true,
    description:
      "Customized workshops built around the technologies your students or institution want to explore right now.",
  },
];

/* ===========================================================================
   ICONS (decorative, drawn with currentColor)
   =========================================================================== */
const ICON_SHAPES = {
  ai: (
    <>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="5" cy="6" r="1.8" />
      <circle cx="19" cy="6" r="1.8" />
      <circle cx="5" cy="18" r="1.8" />
      <circle cx="19" cy="18" r="1.8" />
      <path d="M6.5 7l4 3.5M17.5 7l-4 3.5M6.5 17l4-3.5M17.5 17l-4-3.5" />
    </>
  ),
  iot: (
    <>
      <path d="M4 9.5a11 11 0 0 1 16 0M7 13a6.5 6.5 0 0 1 10 0" />
      <rect x="9.5" y="16" width="5" height="5" rx="1" />
    </>
  ),
  robotics: (
    <>
      <rect x="5" y="8" width="14" height="10" rx="2.5" />
      <path d="M12 5V8M9.5 13h.01M14.5 13h.01M9 21v-3M15 21v-3" />
      <circle cx="12" cy="3.8" r="1" />
    </>
  ),
  software: <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />,
  pcb: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 4v5h4l2 2v4h5M4 14h6l2 2v4" />
      <circle cx="9" cy="9" r=".8" />
    </>
  ),
  proto: <path d="M12 3 4 7.5v9L12 21l8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9" />,
  startup: (
    <>
      <path d="M12 3c3 2 5 5.5 5 9l-2.5 3h-5L7 12c0-3.5 2-7 5-9zM9.5 15 7 20l4-2M14.5 15l2.5 5-4-2" />
      <circle cx="12" cy="10" r="1.6" />
    </>
  ),
  /* Light bulb (a plain idea icon rather than a "sparkle"). */
  emerging: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5A4.5 4.5 0 0 0 12 4a4.5 4.5 0 0 0-4.5 7.5c.8.8 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6M10 21h4" />
    </>
  ),
};

function AreaIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_SHAPES[name]}
    </svg>
  );
}

/* ===========================================================================
   AREA CARD (used only inside this section)
   =========================================================================== */
function AreaCard({ area, index }) {
  const cardClassName = [
    "pj-workshop-explore__card",
    `pj-workshop-explore__card--span-${area.span}`,
    area.span >= 5 ? "pj-workshop-explore__card--wide" : "",
    area.custom ? "pj-workshop-explore__card--custom" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClassName} data-reveal="up" data-reveal-delay={String((index % 3) + 1)}>
      <div className="pj-workshop-explore__icon">
        <AreaIcon name={area.icon} />
      </div>
      <h3 className="pj-workshop-explore__card-title">{area.title}</h3>

      {area.custom ? (
        <p className="pj-workshop-explore__desc">{area.description}</p>
      ) : (
        <>
          <p className="pj-workshop-explore__sub">Topics may include</p>
          <ul className="pj-workshop-explore__topics">
            {area.topics.map((topic) => (
              <li key={topic} className="pj-workshop-explore__topic">
                {topic}
              </li>
            ))}
          </ul>
        </>
      )}

      <Link className="pj-workshop-explore__link" to={CONTACT_WORKSHOP}>
        Request this workshop
        <span className="pj-workshop-explore__sr-only">: {area.title}</span>
      </Link>
    </article>
  );
}

export default function ExploreOurWorkshop() {
  return (
    <section
      className="pj-workshop-explore"
      id="workshop-areas"
      aria-labelledby="pj-workshop-explore-title"
    >
      <div className="pj-workshop-explore__wrap">
        {/* =====================================================================
            EXPLORE — HEADING
            ===================================================================== */}
        <div className="pj-workshop-explore__head">
          <p className="pjds-eyebrow" data-reveal="up">Workshop Areas</p>
          <h2 className="pj-workshop-explore__title" id="pj-workshop-explore-title" data-reveal="up" data-reveal-delay="1">
            Explore Our <TypedPhrase phrases={["Workshop Areas.", "Technology Topics.", "Hands-On Sessions."]} />
          </h2>
          <SectionTitleLine />
          <p className="pj-workshop-explore__lead" data-reveal="up" data-reveal-delay="2">
            Workshops can be designed around different technologies, student levels, departments, and
            institutional requirements.
          </p>
        </div>

        {/* =====================================================================
            EXPLORE — AREA CARDS
            ===================================================================== */}
        <div className="pj-workshop-explore__grid">
          {WORKSHOP_AREAS.map((area, index) => (
            <AreaCard key={area.title} area={area} index={index} />
          ))}
        </div>

        {/* =====================================================================
            EXPLORE — CUSTOM WORKSHOP CALL TO ACTION
            ===================================================================== */}
        <div className="pj-workshop-explore__cta" data-reveal="up" data-reveal-delay="1">
          <p className="pj-workshop-explore__cta-text">
            <b>These are areas, not fixed syllabi.</b>
            Tell us what your students want to explore and we will shape the workshop around it.
          </p>
          <Link className="pj-workshop-explore__cta-btn" to={CONTACT_WORKSHOP}>
            Request a Customized Workshop
          </Link>
        </div>
      </div>
    </section>
  );
}
