import { useEffect, useRef, useState } from "react";
import {
  Target,
  GraduationCap,
  Cpu,
  Brain,
  Rocket,
  Network,
} from "lucide-react";

import "./OurStory.css";

const JOURNEY_DATA = [
  {
    year: "Jan-2024",
    title: "Identifying the Technology Gap",
    subtitle:
      "Bridging the Gap Between Classroom Learning and Real-World Innovation",
    description:
      "ProJenius Innovation Technology Private Limited began with a vision to bridge the gap between academic learning and real-world technology application. We recognised that students in schools and colleges needed more opportunities for hands-on experience, practical engineering, and technology-driven problem-solving. Our mission was to create an environment where learners could move beyond theoretical knowledge and explore innovation through real-world projects and emerging technologies.",
    tags: ["Technology Innovation", "Practical Learning", "Technical Skills"],
    icon: Target,
  },
  {
    year: "Jun-2024",
    title: "Technical Training & Mentorship",
    subtitle: "Empowering Students Through Hands-On Technology Education",
    description:
      "To address this gap, we focused on technical training, student mentorship, and practical technology education. By encouraging learners to work with emerging technologies, we aimed to strengthen their technical skills and problem-solving abilities. Our approach connects theoretical knowledge with practical implementation, helping students explore fields such as Artificial Intelligence (AI), the Internet of Things (IoT), embedded systems, electronics, and software development.",
    tags: ["Technical Training", "Student Mentorship", "Emerging Technologies"],
    icon: GraduationCap,
  },
  {
    year: "Jan-2025",
    title: "Product Development & Rapid Prototyping",
    subtitle: "Transforming Innovative Ideas into Working Prototypes",
    description:
      "Through mentoring and collaborative learning, we encountered ideas with the potential to solve real-world problems. This inspired us to expand beyond training into product development, research, and rapid prototyping. By combining hardware engineering, embedded systems, PCB design, software development, and IoT technologies, we began exploring ways to transform concepts into functional prototypes and practical technology solutions.",
    tags: ["Product Development", "Rapid Prototyping", "Research & Development"],
    icon: Cpu,
  },
  {
    year: "Jun-2025",
    title: "AI, IoT & Emerging Technology Solutions",
    subtitle: "Engineering Smarter Solutions for Real-World Challenges",
    description:
      "Our focus expanded towards developing technology-driven solutions using Artificial Intelligence, Machine Learning, IoT, embedded systems, and intelligent automation. We explored applications across agriculture, accessibility, safety, and resource management, demonstrating how emerging technologies can support practical problem-solving. Through experimentation, interdisciplinary engineering, and continuous development, we continued strengthening our approach to innovation and product engineering.",
    tags: ["Artificial Intelligence", "IoT Solutions", "Embedded Systems"],
    icon: Brain,
  },
  {
    year: "Jan-2026",
    title: "Innovation, Recognition & Growth",
    subtitle: "Advancing Research, Product Engineering & Startup Innovation",
    description:
      "As ProJenius continued its journey, we strengthened our focus on research and development, technology projects, innovation challenges, and practical product engineering. These activities helped us explore new ideas, improve technical capabilities, and encourage students and innovators to develop solutions beyond the classroom. We continue to pursue opportunities that connect technology development with entrepreneurship, collaborative innovation, and startup support.",
    tags: ["Innovation & R&D", "Product Engineering", "Startup Support"],
    icon: Rocket,
  },
  {
    year: "Jun-2026",
    title: "Building an Innovation & Technology Ecosystem",
    subtitle: "Connecting Students, Startups, Academia & Industry",
    description:
      "Our long-term vision is to build a collaborative innovation ecosystem that connects students, innovators, startups, academic institutions, and industry. Through hands-on technology training, mentorship, hackathons, research collaboration, rapid prototyping, and startup support, we aim to help promising ideas progress from concept validation to product development. ProJenius aspires to make technology innovation more accessible by connecting education, engineering, entrepreneurship, and real-world implementation.",
    tags: [
      "Academia–Industry Collaboration",
      "Technology Incubation",
      "Innovation Ecosystem",
    ],
    icon: Network,
  },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const JOURNEY_WORD = "Journey";

function TypedJourneyWord({ active }) {
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const reduce = prefersReducedMotion();

  useEffect(() => {
    if (!active || reduce) return undefined;

    let timer;
    if (!deleting && length < JOURNEY_WORD.length) {
      timer = window.setTimeout(() => setLength((value) => value + 1), length === 0 ? 260 : 105);
    } else if (!deleting) {
      timer = window.setTimeout(() => setDeleting(true), 1500);
    } else if (length > 0) {
      timer = window.setTimeout(() => setLength((value) => value - 1), 55);
    } else {
      timer = window.setTimeout(() => setDeleting(false), 350);
    }

    return () => window.clearTimeout(timer);
  }, [active, deleting, length, reduce]);

  const shown = reduce ? JOURNEY_WORD : JOURNEY_WORD.slice(0, length);

  return (
    <span className="journey-heading-word">
      <span className="pjds-sr-only">{JOURNEY_WORD}</span>
      <span className="journey-heading-sizer" aria-hidden="true">{JOURNEY_WORD}</span>
      <span className="journey-heading-live" aria-hidden="true">
        {shown}
        {!reduce && active && <span className="journey-heading-caret" />}
      </span>
    </span>
  );
}

/* =========================================================
   JOURNEY CARD
========================================================= */

function JourneyCard({
  item,
  index,
  active,
  revealed,
  onHover,
  onLeave,
  cardRef,
}) {
  const Icon = item.icon;
  const isLeft = index % 2 === 0;

  return (
    <li
      ref={cardRef}
      className={[
        "journey-card-wrap",
        isLeft ? "journey-card-left" : "journey-card-right",
        active ? "journey-card-active" : "",
        revealed ? "journey-card-revealed" : "",
      ].join(" ")}
      data-index={index}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
    >
      <div className="journey-card">
        <div className="journey-card-top">
          <span className="journey-year">{item.year}</span>
        </div>

        <h3>{item.title}</h3>

        <p className="journey-subtitle">{item.subtitle}</p>

        <p className="journey-description">{item.description}</p>

        <div className="journey-tags" role="group" aria-label="Milestone themes">
          {item.tags.map((tag) => (
            <span key={tag} className="journey-tag">
              {tag}
            </span>
          ))}
        </div>

        <span className="journey-hover-line" aria-hidden="true" />
      </div>

      <div className="journey-card-connector" aria-hidden="true" />

      <div className="journey-node" aria-hidden="true">
        <Icon size={18} strokeWidth={1.9} />
      </div>
    </li>
  );
}

/* =========================================================
   OUR STORY
========================================================= */

export default function OurStory() {
  const sectionRef = useRef(null);
  const progressRef = useRef(null);
  const cardRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [revealedCards, setRevealedCards] = useState([]);
  const [titleActive, setTitleActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") {
      setTitleActive(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setTitleActive(entry.isIntersecting);
    }, { threshold: 0.05 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* =======================================================
     SCROLL PROGRESS
     The cyan line follows the page scroll. It is written straight to a CSS
     variable (no React state, so no re-render per frame), throttled to one
     update per animation frame, and only listens while the section is on
     screen.
  ======================================================= */

  useEffect(() => {
    const section = sectionRef.current;
    const bar = progressRef.current;

    if (!section || !bar) {
      return undefined;
    }

    let frame = 0;
    let listening = false;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const travel = Math.max(rect.height - viewportHeight * 0.32, 1);
      const progress = Math.min(1, Math.max(0, (viewportHeight * 0.58 - rect.top) / travel));
      bar.style.setProperty("--pja-story-progress", progress.toFixed(4));
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const start = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);
      requestUpdate();
    };

    const stop = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return () => {
        stop();
        if (frame) cancelAnimationFrame(frame);
      };
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else {
        stop();
        update();
      }
    });
    observer.observe(section);

    return () => {
      observer.disconnect();
      stop();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* =======================================================
     ACTIVE CARD OBSERVER
  ======================================================= */

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);

    if (!cards.length || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - window.innerHeight * 0.48) -
              Math.abs(b.boundingClientRect.top - window.innerHeight * 0.48)
          );

        if (visible.length) {
          setActiveIndex(Number(visible[0].target.dataset.index));
        }
      },
      {
        threshold: 0.42,
        rootMargin: "-12% 0px -38% 0px",
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  /* =======================================================
     CARD REVEAL (each card appears when you reach it, both
     scroll directions)
  ======================================================= */

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);

    if (!cards.length) {
      return undefined;
    }

    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setRevealedCards(cards.map((_, index) => index));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);

          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setRevealedCards((prev) => (prev.includes(index) ? prev : [...prev, index]));
          } else if (!entry.isIntersecting) {
            setRevealedCards((prev) => prev.filter((i) => i !== index));
          }
        });
      },
      {
        threshold: [0, 0.3],
        rootMargin: "0px 0px -8% 0px",
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      ref={sectionRef}
      id="about-journey"
      className="our-journey-section"
      aria-labelledby="our-journey-title"
    >
      <div className="pjds-container">
        <header className="our-journey-header">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Our Story</p>

          <h2 id="our-journey-title" data-reveal="up" data-reveal-delay="1">
            Our <TypedJourneyWord active={titleActive} />
          </h2>

          <span className="journey-title-bar" aria-hidden="true" data-reveal="line" data-reveal-delay="2" />

          <p data-reveal="up" data-reveal-delay="2">
            From a bold idea to a growing innovation ecosystem — every milestone has shaped who we are.
          </p>
        </header>

        <div className="journey-timeline">
          <div className="journey-axis" aria-hidden="true" />
          <div ref={progressRef} className="journey-axis-progress" aria-hidden="true" />

          <ol className="journey-items">
            {JOURNEY_DATA.map((item, index) => (
              <JourneyCard
                key={`${item.year}-${item.title}`}
                item={item}
                index={index}
                active={activeIndex === index}
                revealed={revealedCards.includes(index)}
                onHover={setActiveIndex}
                onLeave={() => setActiveIndex(-1)}
                cardRef={(node) => {
                  cardRefs.current[index] = node;
                }}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
