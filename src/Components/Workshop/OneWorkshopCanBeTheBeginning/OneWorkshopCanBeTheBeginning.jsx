import React, { useEffect, useRef, useState } from "react";
import "./OneWorkshopCanBeTheBeginning.css";

const steps = [
  { title: "Workshop", sub: "You are here" },
  { title: "Explore", sub: "Try new technologies" },
  { title: "Learn", sub: "Courses" },
  { title: "Build a project", sub: "Development" },
  { title: "Internship", sub: "Internship programs" },
];

const branches = [
  { title: "Career", sub: "Career guidance", href: "/career" },
  { title: "Startup", sub: "Startup support", href: "/startup-support" },
];

const NODE_COUNT = steps.length + branches.length; // 5 main + 2 branch nodes
const BEAT_MS = 450;
const LOOP_WHILE_VISIBLE = false; // set true to keep blinking while the section is on screen

const OneWorkshopCanBeTheBeginning = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(-1);
  const [hovered, setHovered] = useState(null);

  // detect when the section is scrolled into view (and out again)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // every time it comes into view, blink through the nodes from the start
  useEffect(() => {
    if (!inView) {
      setActive(-1);
      return undefined;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;

    setActive(0);
    const id = setInterval(() => {
      setActive((p) => {
        const next = p + 1;
        if (next < NODE_COUNT) return next;
        if (LOOP_WHILE_VISIBLE) return next === NODE_COUNT ? -1 : 0;
        clearInterval(id);
        return -1;
      });
    }, BEAT_MS);
    return () => clearInterval(id);
  }, [inView]);

  const isLit = (i) => hovered === i || (hovered === null && active === i);
  const hoverProps = (i) => ({
    onMouseEnter: () => setHovered(i),
    onMouseLeave: () => setHovered(null),
  });

  return (
    <section className="owb-section" ref={sectionRef}>
      <div className="owb-container">
        <h2 className="owb-title">
          One Workshop Can Be the <br className="owb-br" />
          Beginning.
        </h2>
        <p className="owb-subtitle">
          A workshop can be the first step toward deeper learning, project
          development, internships, career exploration, or innovation.
        </p>

        <div className="owb-scroll">
          <div className="owb-timeline">
            {/* main path */}
            <ol className="owb-steps">
              {steps.map((s, i) => (
                <li key={s.title} className="owb-step" {...hoverProps(i)}>
                  <span className={`owb-node ${isLit(i) ? "is-lit" : ""}`} />
                  <span className="owb-label">{s.title}</span>
                  <span className="owb-sublabel">{s.sub}</span>
                </li>
              ))}
            </ol>

            {/* branch */}
            <div className="owb-branch">
              {branches.map((b, k) => {
                const i = steps.length + k;
                return (
                  <a
                    key={b.title}
                    href={b.href}
                    className={`owb-end ${k === 0 ? "owb-end--top" : "owb-end--bottom"}`}
                    {...hoverProps(i)}
                  >
                    <span className={`owb-node ${isLit(i) ? "is-lit" : ""}`} />
                    <span className="owb-end-text">
                      <span className="owb-end-title">{b.title}</span>
                      <span className="owb-end-sub">{b.sub}</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <blockquote className="owb-quote">
          Every learner has a different next step. ProJenius provides multiple
          pathways to continue learning, building, and growing.
        </blockquote>
      </div>
    </section>
  );
};

export default OneWorkshopCanBeTheBeginning;