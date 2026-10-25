import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Boxes, BriefcaseBusiness, CircuitBoard, CodeXml, GraduationCap, MessageSquare } from "lucide-react";

import "./OurServices.css";

/* =============================================================================
   OUR SERVICES — the five approved service categories and their routes.
   The first service is presented as the navy "featured" card; the closing
   tile routes undecided visitors to the Contact page.
   ============================================================================= */

const SERVICES = [
  {
    title: "Software Development",
    description: "Websites, mobile apps, and custom software built for businesses and organizations.",
    to: "/services/development",
    Icon: CodeXml,
    featured: true,
  },
  {
    title: "Rapid Prototyping",
    description:
      "Rapid prototyping and 3D printing for product concepts, custom components, functional parts and development-ready prototypes.",
    to: "/services/rapid-prototyping",
    Icon: Boxes,
  },
  {
    title: "PCB Design & Fabrication",
    description: "PCB design and fabrication for electronic systems and product development.",
    to: "/services/pcb-design-fabrication",
    Icon: CircuitBoard,
  },
  {
    title: "Courses",
    description: "Practical technology courses for students, professionals, teams, and institutions.",
    to: "/services/courses",
    Icon: GraduationCap,
  },
  {
    title: "Internships",
    description: "Gain hands-on technical experience through guided projects and practical learning.",
    to: "/services/internship",
    Icon: BriefcaseBusiness,
  },
];

const SERVICE_PHRASES = ["Software & IoT", "Embedded Systems", "Product Development"];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ServicesTypingLine({ active }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const reduceMotion = prefersReducedMotion();
  const phrase = SERVICE_PHRASES[phraseIndex];

  useEffect(() => {
    if (!active || reduceMotion) return undefined;

    let delay;
    let next;
    if (!isDeleting && length < phrase.length) {
      delay = 90;
      next = () => setLength((value) => value + 1);
    } else if (!isDeleting) {
      delay = 1500;
      next = () => setIsDeleting(true);
    } else if (length > 0) {
      delay = 55;
      next = () => setLength((value) => value - 1);
    } else {
      delay = 350;
      next = () => {
        setIsDeleting(false);
        setPhraseIndex((value) => (value + 1) % SERVICE_PHRASES.length);
      };
    }

    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [active, reduceMotion, isDeleting, length, phrase]);

  const shown = reduceMotion ? SERVICE_PHRASES[0] : phrase.slice(0, length);

  return (
    <span className="pjh-services__typed">
      <span className="pjds-sr-only">{SERVICE_PHRASES.join(", ")}</span>
      <span className="pjh-services__typed-text" aria-hidden="true">
        {shown}
        {!reduceMotion && <span className="pjh-services__cursor">|</span>}
      </span>
    </span>
  );
}

export default function OurServices() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="home-services" className={`pjh-services${isVisible ? " is-visible" : ""}`} aria-labelledby="pjh-services-title">
      <div className="pjds-container">
        <header className="pjh-services__header">
          <div>
            <p className="pjds-eyebrow" data-reveal="up">Our Services</p>
            <h2 id="pjh-services-title" className="pjds-title pjh-services__section-title" data-reveal="up" data-reveal-delay="1">
              <span className="pjh-services__title-static">Technology Solutions for</span>
              <ServicesTypingLine active={isVisible} />
            </h2>
            <span className="pjh-services__title-line" aria-hidden="true" data-reveal="line" data-reveal-delay="2" />
          </div>
          <p className="pjds-lead pjh-services__intro" data-reveal="up" data-reveal-delay="2">
            From software and electronics to prototypes and practical training, we help businesses,
            startups, institutions, and learners turn ideas into working technology.
          </p>
        </header>

        <ul className="pjh-services__grid">
          {SERVICES.map(({ title, description, to, Icon, featured }, index) => (
            <li
              key={to}
              className="pjh-services__item"
              data-reveal="up"
              data-reveal-delay={String((index % 3) + 1)}
            >
              <Link to={to} className={`pjh-services__card${featured ? " pjh-services__card--featured" : ""}`}>
                <span className="pjh-services__top">
                  <span className="pjh-services__icon" aria-hidden="true">
                    <Icon size={24} strokeWidth={1.8} />
                  </span>
                  <span className="pjh-services__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>
                <h3 className="pjh-services__title">{title}</h3>
                <p className="pjh-services__text">{description}</p>
                <span className="pjh-services__cta">
                  Explore service<span className="pjds-sr-only">: {title}</span>
                  <span className="pjh-services__cta-icon" aria-hidden="true">
                    <ArrowRight size={16} />
                  </span>
                </span>
              </Link>
            </li>
          ))}

          <li className="pjh-services__item" data-reveal="up" data-reveal-delay="3">
            <div className="pjh-services__card pjh-services__card--cta">
              <span className="pjh-services__icon" aria-hidden="true">
                <MessageSquare size={22} strokeWidth={1.8} />
              </span>
              <h3 className="pjh-services__title">Not sure where to start?</h3>
              <p className="pjh-services__text">
                Tell us what you are working on and we will point you to the right ProJenius pathway.
              </p>
              <Link to="/contact" className="pjds-btn pjds-btn--dark pjh-services__cta-button">
                Talk to Our Team
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
