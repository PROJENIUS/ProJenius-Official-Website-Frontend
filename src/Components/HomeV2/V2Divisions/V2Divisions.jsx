import { Link } from "react-router-dom";
import { ArrowUpRight, Cpu, GraduationCap, Rocket } from "lucide-react";

import "./V2Divisions.css";

/* =============================================================================
   HOME V2 — THREE DIVISIONS. Each card lists its real pages. A soft spotlight
   follows the pointer (CSS variables set on pointer move, mouse only).
   ============================================================================= */

const DIVISIONS = [
  {
    id: "solutions",
    code: "DIV 01 · SOLUTIONS",
    Icon: Cpu,
    title: "Engineering Solutions",
    text: "Software, embedded hardware, PCBs and prototypes for businesses, institutions and product teams.",
    links: [
      { to: "/services/development", label: "Software Development" },
      { to: "/services/hardware-embedded-systems", label: "Hardware & Embedded Systems" },
      { to: "/services/pcb-design-fabrication", label: "PCB Design & Fabrication" },
      { to: "/services/rapid-prototyping", label: "Rapid Prototyping" },
    ],
  },
  {
    id: "learning",
    code: "DIV 02 · LEARNING",
    Icon: GraduationCap,
    title: "Learning & Development",
    text: "Courses, internships, workshops and career guidance built on real projects, not only theory.",
    links: [
      { to: "/services/courses", label: "Courses" },
      { to: "/services/internship", label: "Internships" },
      { to: "/workshop", label: "Workshops" },
      { to: "/services/career-guidance", label: "Career Guidance" },
    ],
  },
  {
    id: "startup",
    code: "DIV 03 · STARTUP",
    Icon: Rocket,
    title: "Startup & Innovation",
    text: "For founders, students and innovators taking an idea from a rough concept to a working product.",
    links: [{ to: "/startup", label: "Submit your idea" }],
  },
];

function onPointerMove(event) {
  if (event.pointerType !== "mouse") return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

export default function V2Divisions() {
  return (
    <section className="v2-section v2d" aria-labelledby="v2d-title">
      <div className="v2-wrap">
        <p className="v2-label" data-reveal="up"><b>01</b> / What we do</p>
        <h2 id="v2d-title" className="v2-h2" data-reveal="up" data-reveal-delay="1">
          Three divisions. <span className="v2-soft">One team behind every project.</span>
        </h2>

        <ul className="v2d__grid">
          {DIVISIONS.map(({ id, code, Icon, title, text, links }, index) => (
            <li key={id} className={`v2d__card v2d__card--${id}`} onPointerMove={onPointerMove} data-reveal="up" data-reveal-delay={String(index + 1)}>
              <div className="v2d__top">
                <span className="v2d__code">{code}</span>
                <span className="v2d__icon" aria-hidden="true"><Icon size={22} strokeWidth={2} /></span>
              </div>
              <h3 className="v2d__title">{title}</h3>
              <p className="v2d__text">{text}</p>
              <ul className="v2d__links">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>
                      {link.label}
                      <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
