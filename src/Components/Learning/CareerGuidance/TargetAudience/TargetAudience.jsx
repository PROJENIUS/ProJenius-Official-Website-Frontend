import { Backpack, BriefcaseBusiness, GraduationCap, RefreshCw } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import "./TargetAudience.css";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =========================================================
   WHO IS THIS MENTORSHIP FOR?
   Four equal, centred cards, each with a soft coloured icon
   circle (the icon makes a half turn on hover, like the
   homepage services). Heading follows the site rules: pill
   label, static line, typed blue line.
========================================================= */

const AUDIENCE = [
  {
    title: "College Students",
    text: "Get ahead of campus placements with industry-ready skills and an impressive portfolio.",
    tone: "blue",
    Icon: Backpack,
  },
  {
    title: "Recent Graduates",
    text: "Bridge the gap between academic theory and what companies actually hire for.",
    tone: "green",
    Icon: GraduationCap,
  },
  {
    title: "Career Switchers",
    text: "Transition into tech roles smoothly with a focused, fast-tracked learning roadmap.",
    tone: "orange",
    Icon: RefreshCw,
  },
  {
    title: "Working Professionals",
    text: "Upskill to secure promotions or switch to higher-paying companies and roles.",
    tone: "purple",
    Icon: BriefcaseBusiness,
  },
];

export default function TargetAudience() {
  return (
    <section id="target-audience" className="cgaud-section" aria-labelledby="cgaud-title">
      <div className="cgaud-container">
        <header className="cgaud-header">
          <p className="pjds-eyebrow" data-reveal="up">Target Audience</p>
          <h2 id="cgaud-title" className="cgaud-title" data-reveal="up" data-reveal-delay="1">
            <span className="cgaud-title-static">Who is This</span>
            <TypedPhrase phrases={["Mentorship For?", "Guidance For?", "Program Built For?"]} />
          </h2>
          <SectionTitleLine />
          <p className="cgaud-subtitle" data-reveal="up" data-reveal-delay="2">
            Whether you are starting from campus or looking to grow your tech career, our 1:1 guidance
            is shaped around where you are now.
          </p>
        </header>

        <ul className="cgaud-grid" data-reveal="up" data-reveal-delay="3">
          {AUDIENCE.map(({ title, text, tone, Icon }) => (
            <li key={title} className={`cgaud-card cgaud-card--${tone}`}>
              <span className="cgaud-icon" aria-hidden="true">
                <Icon size={28} strokeWidth={1.9} />
              </span>
              <h3 className="cgaud-card-title">{title}</h3>
              <p className="cgaud-card-text">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
