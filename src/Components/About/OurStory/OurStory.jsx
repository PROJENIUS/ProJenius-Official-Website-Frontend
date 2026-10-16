import React, { useEffect, useRef, useState } from "react";
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

// "Our " is always visible (white, static).
// Only the blue word is typed, held, deleted, and typed again (loop).
const TITLE_WHITE = "Our ";
const TITLE_BLUE = "Journey";

// typewriter timing (ms)
const FIRST_DELAY = 350; // wait before the very first letter
const TYPE_SPEED = 110; // per letter while typing
const DELETE_SPEED = 65; // per letter while deleting
const HOLD_TIME = 1800; // full word stays visible (cursor blinks)
const EMPTY_PAUSE = 450; // empty pause before typing again

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    <article
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

        <div className="journey-tags">
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
    </article>
  );
}

/* =========================================================
   OUR STORY
========================================================= */

export default function OurStory() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [phase, setPhase] = useState("typing"); // "typing" | "deleting"
  const [introDone, setIntroDone] = useState(false); // first typing finished
  const [revealedCards, setRevealedCards] = useState([]);

  const typedText = TITLE_BLUE.slice(0, typedCount);

  // cursor blinks only while the full word is resting; solid while moving
  const isHolding =
    phase === "typing" && typedCount >= TITLE_BLUE.length;

  /* =======================================================
     SCROLL PROGRESS
  ======================================================= */

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    let frame = 0;

    const updateProgress = () => {
      frame = 0;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;

      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = section.offsetHeight;

      /*
       * The blue line follows the user's actual page scroll.
       * It does NOT run by itself.
       */
      const travelDistance = Math.max(
        sectionHeight - viewportHeight * 0.32,
        1
      );

      const currentTravel =
        window.scrollY + viewportHeight * 0.58 - sectionTop;

      const progress = Math.min(
        1,
        Math.max(0, currentTravel / travelDistance)
      );

      setScrollProgress(progress);
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  /* =======================================================
     ACTIVE CARD OBSERVER
  ======================================================= */

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);

    if (!cards.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(
                a.boundingClientRect.top - window.innerHeight * 0.48
              ) -
              Math.abs(
                b.boundingClientRect.top - window.innerHeight * 0.48
              )
          );

        if (visible.length) {
          const index = Number(visible[0].target.dataset.index);
          setActiveIndex(index);
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
     HEADER REVEAL (starts when the header enters the screen)
  ======================================================= */

  useEffect(() => {
    const header = headerRef.current;

    if (!header) {
      return undefined;
    }

    if (prefersReducedMotion()) {
      setHeaderVisible(true);
      setTypedCount(TITLE_BLUE.length);
      setIntroDone(true);
      return undefined;
    }

    /*
     * Not disconnected after the first time: when the header leaves the
     * screen everything resets, so the animation starts fresh on return.
     */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          setHeaderVisible(true);
        } else if (!entry.isIntersecting) {
          setHeaderVisible(false);
          setTypedCount(0);
          setPhase("typing");
          setIntroDone(false);
        }
      },
      { threshold: [0, 0.35] }
    );

    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  /* =======================================================
     TYPEWRITER LOOP (blue word only)
     type -> hold (cursor blinks) -> delete -> pause -> type ...
  ======================================================= */

  useEffect(() => {
    if (!headerVisible || prefersReducedMotion()) {
      return undefined;
    }

    let timer;

    if (phase === "typing") {
      if (typedCount < TITLE_BLUE.length) {
        // typing the next letter
        timer = setTimeout(
          () => setTypedCount((count) => count + 1),
          typedCount === 0 ? FIRST_DELAY : TYPE_SPEED
        );
      } else {
        // full word shown: reveal bar + subtitle once, then hold, then delete
        setIntroDone(true);
        timer = setTimeout(() => setPhase("deleting"), HOLD_TIME);
      }
    } else if (typedCount > 0) {
      // deleting one letter at a time
      timer = setTimeout(
        () => setTypedCount((count) => count - 1),
        DELETE_SPEED
      );
    } else {
      // fully deleted: short empty pause, then type again
      timer = setTimeout(() => setPhase("typing"), EMPTY_PAUSE);
    }

    return () => clearTimeout(timer);
  }, [headerVisible, typedCount, phase]);

  /* =======================================================
     CARD REVEAL (each card appears when you reach it)
  ======================================================= */

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);

    if (!cards.length) {
      return undefined;
    }

    if (prefersReducedMotion()) {
      setRevealedCards(cards.map((_, index) => index));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);

          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            // reached the card -> play the reveal
            setRevealedCards((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
          } else if (!entry.isIntersecting) {
            // card fully left the screen -> reset, so it replays on return
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
      className="our-journey-section"
      aria-labelledby="our-journey-title"
    >
      <div className="our-journey-container">
        {/* HEADER */}

        <header
          ref={headerRef}
          className={[
            "our-journey-header",
            headerVisible ? "journey-header-visible" : "",
            introDone ? "journey-header-done" : "",
          ].join(" ")}
        >
          <span className="journey-eyebrow">OUR STORY</span>

          <h2 id="our-journey-title" aria-label="Our Journey">
            {/* white word: static, always visible */}
            <span aria-hidden="true" className="journey-title-white">
              {TITLE_WHITE}
            </span>

            {/* blue word: typewriter loop. The sizer reserves the full
                width so the centered title never shifts while typing. */}
            <span className="journey-type" aria-hidden="true">
              <span className="journey-type-sizer">{TITLE_BLUE}</span>

              <span className="journey-type-live">
                <span className="journey-type-text">{typedText}</span>

                {headerVisible && (
                  <span
                    className={`journey-caret${
                      isHolding ? "" : " is-typing"
                    }`}
                  />
                )}
              </span>
            </span>
          </h2>

          <span className="journey-title-bar" aria-hidden="true" />

          <p>
            From a bold idea to a growing innovation ecosystem — every
            milestone has shaped who
            <br className="journey-desktop-break" />
            we are.
          </p>
        </header>

        {/* TIMELINE */}

        <div className="journey-timeline">
          <div className="journey-axis" aria-hidden="true" />

          <div
            className="journey-axis-progress"
            aria-hidden="true"
            style={{ height: `${scrollProgress * 100}%` }}
          />

          <div className="journey-items">
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
          </div>
        </div>
      </div>
    </section>
  );
}