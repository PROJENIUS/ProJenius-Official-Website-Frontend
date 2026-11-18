import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, CalendarDays, GraduationCap, MonitorSmartphone, Users } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import "./InternshipHero.css";

/* =============================================================================
   INTERNSHIP HERO — navy, our hero pattern (pill, heading + cyan typing,
   blue line, cyan CTA). Right: four fact boxes about the programme.
   Facts follow the page: 1, 3 or 6 month programmes, online and offline,
   a guided programme, for students and freshers.
   ============================================================================= */

const FACTS = [
  { Icon: CalendarDays, title: "Duration", text: "1 month, 3 months or 6 months" },
  { Icon: MonitorSmartphone, title: "Mode", text: "Online, offline or hybrid" },
  { Icon: GraduationCap, title: "Type", text: "Guided internship programme" },
  { Icon: Users, title: "Eligibility", text: "Students and freshers" },
];

const scrollToDomains = (event) => {
  const target = document.getElementById("internship-domains");
  if (!target) return;
  event.preventDefault();
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};

const InternshipHero = () => (
  <section className="pjih" aria-labelledby="pj-internship-hero-title">
    <div className="pjds-container pjih__grid">
      <div className="pjih__copy">
        <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">About the Internship</p>
        <h1 id="pj-internship-hero-title" className="pjih__title" data-reveal="up" data-reveal-delay="1">
          Practical Training{" "}
          <TypedPhrase tone="dark" phrases={["Built on Real Work.", "With Live Projects.", "With Mentor Support."]} />
        </h1>
        <SectionTitleLine />
        <p className="pjih__lead" data-reveal="up" data-reveal-delay="2">
          Gain hands-on experience through structured training, mentor support, live projects and career
          preparation, designed for students and freshers entering the tech industry.
        </p>
        <div className="pjih__actions" data-reveal="up" data-reveal-delay="3">
          <Link className="pjih__btn pjih__btn--primary" to="/contact?type=internship">
            Apply for Internship <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a className="pjih__btn pjih__btn--ghost" href="#internship-domains" onClick={scrollToDomains}>
            Explore Domains <ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      <ul className="pjih__facts" aria-label="Internship at a glance">
        {FACTS.map(({ Icon, title, text }, index) => (
          <li key={title} className="pjih__fact" data-reveal="up" data-reveal-delay={String(index + 1)}>
            <span className="pjih__fact-icon" aria-hidden="true"><Icon size={22} /></span>
            <strong>{title}</strong>
            <small>{text}</small>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default InternshipHero;
