import { Link } from "react-router-dom";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import "./WorkshopFormats.css";

/* =============================================================================
   DESIGNED AROUND YOUR INSTITUTION
   -----------------------------------------------------------------------------
   "Designed Around Your Institution" — the four workshop formats, each with
   a small glyph showing the scale of that format. Purely presentational:
   no state, no effects. Self-contained. Navy section (third on the page).
   ============================================================================= */

/* ===========================================================================
   CONTENT
   =========================================================================== */
const WORKSHOP_FORMATS = [
  {
    glyph: "day",
    title: "One-Day Workshop",
    text: "An intensive practical learning experience focused on a specific technology or topic.",
  },
  {
    glyph: "camp",
    title: "Hands-On Bootcamp",
    text: "A multi-session experience combining learning, practical activities, and project building.",
  },
  {
    glyph: "dept",
    title: "Department Workshop",
    text: "A customized workshop aligned with a specific academic department or student group.",
  },
  {
    glyph: "club",
    title: "Institution / Club Workshop",
    text: "Technology and innovation sessions designed for technical clubs, innovation clubs, student communities, or institution-wide programs.",
  },
];

/* ===========================================================================
   FORMAT GLYPH
   Decorative diagram: one block, several sessions, one department group,
   or a whole connected institution.
   =========================================================================== */
const BOOTCAMP_BARS = [
  [6, 36, 16],
  [50, 28, 24],
  [94, 20, 32],
  [138, 10, 42],
];
const DEPT_COLUMNS = [20, 60, 100, 140];
const DEPT_ROWS = [20, 44];
const CLUB_POINTS = [
  [16, 44],
  [52, 16],
  [92, 44],
  [132, 16],
  [166, 44],
];
const CLUB_LINKS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [1, 3],
  [0, 2],
  [2, 4],
];

function FormatGlyph({ type }) {
  return (
    <svg
      className="pj-workshop-institution__glyph"
      viewBox="0 0 180 64"
      aria-hidden="true"
      focusable="false"
    >
      {type === "day" && (
        <>
          <rect className="pj-workshop-institution__fill" x="6" y="12" width="168" height="40" rx="6" />
          <path className="pj-workshop-institution__line" d="M22 28h64M22 38h38" />
        </>
      )}

      {type === "camp" &&
        BOOTCAMP_BARS.map(([x, y, h]) => (
          <rect key={x} className="pj-workshop-institution__fill" x={x} y={y + 2} width="34" height={h} rx="5" />
        ))}

      {type === "dept" && (
        <>
          <rect className="pj-workshop-institution__frame" x="4" y="6" width="76" height="52" rx="8" />
          {DEPT_COLUMNS.map((x, columnIndex) =>
            DEPT_ROWS.map((y) => (
              <circle
                key={`${x}-${y}`}
                className={`pj-workshop-institution__node ${
                  columnIndex < 2 ? "pj-workshop-institution__node--on" : "pj-workshop-institution__node--off"
                }`}
                cx={x}
                cy={y}
                r="7"
              />
            ))
          )}
        </>
      )}

      {type === "club" && (
        <>
          {CLUB_LINKS.map(([a, b]) => (
            <path
              key={`${a}${b}`}
              className="pj-workshop-institution__line"
              d={`M${CLUB_POINTS[a][0]} ${CLUB_POINTS[a][1]}L${CLUB_POINTS[b][0]} ${CLUB_POINTS[b][1]}`}
            />
          ))}
          {CLUB_POINTS.map((point) => (
            <circle
              key={point.join("-")}
              className="pj-workshop-institution__node pj-workshop-institution__node--on"
              cx={point[0]}
              cy={point[1]}
              r="7"
            />
          ))}
        </>
      )}
    </svg>
  );
}

export default function WorkshopFormats() {
  return (
    <section
      className="pj-workshop-institution"
      id="pj-workshop-institution"
      aria-labelledby="pj-workshop-institution-title"
    >
      <div className="pj-workshop-institution__wrap">
        {/* =====================================================================
            INSTITUTION — HEADING
            ===================================================================== */}
        <div className="pj-workshop-institution__head">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Workshop Formats</p>
          <h2 className="pj-workshop-institution__title" id="pj-workshop-institution-title" data-reveal="up" data-reveal-delay="1">
            Designed Around <TypedPhrase tone="dark" phrases={["Your Institution.", "Your Students.", "Your Schedule."]} />
          </h2>
          <SectionTitleLine />
          <p className="pj-workshop-institution__lead" data-reveal="up" data-reveal-delay="2">
            Every institution has different objectives, student groups, schedules, and learning
            requirements. Workshops can be structured accordingly.
          </p>
        </div>

        {/* =====================================================================
            INSTITUTION — FORMAT LIST
            ===================================================================== */}
        <div className="pj-workshop-institution__list">
          {WORKSHOP_FORMATS.map((format, index) => (
            <article key={format.title} className="pj-workshop-institution__item" data-reveal="up" data-reveal-delay={String(index + 1)}>
              <FormatGlyph type={format.glyph} />
              <h3 className="pj-workshop-institution__item-title">{format.title}</h3>
              <p className="pj-workshop-institution__text">{format.text}</p>
              <Link className="pj-workshop-institution__link" to="/contact?type=workshop">
                Ask about this format
                <span className="pj-workshop-institution__sr-only">: {format.title}</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
