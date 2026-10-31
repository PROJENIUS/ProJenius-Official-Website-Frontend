import { useEffect, useRef, useState } from "react";
import useOnScreen from "../../../../hooks/useOnScreen.js";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import "./HowWeTurnARequirementIntoAWorkshop.css";

const steps = [
  { no: "01", title: "Discuss",
    text: "Share your objectives, student group, and the technology or topic you want students to explore.",
    tags: ["Institution", "ProJenius"] },
  { no: "02", title: "Customize",
    text: "Select the appropriate technology, difficulty level, activities, and duration.",
    tags: ["ProJenius"] },
  { no: "03", title: "Learn",
    text: "Introduce the concepts through an engaging combination of explanation and demonstration.",
    tags: ["ProJenius", "Students"] },
  { no: "04", title: "Build",
    text: "Students participate in hands-on activities, experiments, or project work.",
    tags: ["Students"] },
  { no: "05", title: "Showcase",
    text: "Students demonstrate, test, or present what they have created.",
    tags: ["Students"] },
  { no: "06", title: "Continue",
    text: "Where relevant, students can continue into deeper learning, projects, internships, or other ProJenius opportunities.",
    tags: ["Students", "ProJenius"] },
];

export default function Howweturnarequirementintoaworkshop() {
  const stepRefs = useRef([]);
  const lineRefs = useRef([]);
  const sectionRef = useRef(null);
  // Listen to scrolling only while the section is (nearly) on screen.
  const isNear = useOnScreen(sectionRef, "200px 0px");
  const [active, setActive] = useState(-1); // index of the last step the reader has reached

  useEffect(() => {
    if (!isNear) return undefined;
    let raf = 0;

    const update = () => {
      raf = 0;
      const anchor = window.innerHeight * 0.55; // the "reading line"
      let reached = -1;

      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const circle = el.querySelector(".hw-circle").getBoundingClientRect();
        if (circle.top + circle.height / 2 <= anchor) reached = i;
      });
      setActive(reached);

      // fill each connecting line from top to bottom as the reading line passes it
      lineRefs.current.forEach((line) => {
        if (!line) return;
        const r = line.getBoundingClientRect();
        const pct = Math.min(1, Math.max(0, (anchor - r.top) / r.height));
        line.style.setProperty("--fill", `${pct * 100}%`);
      });
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isNear]);

  return (
    <section id="workshop-process" ref={sectionRef} className="hw-section">
      <div className="hw-container">
        <div className="hw-left" data-reveal="left">
          <p className="pjds-eyebrow">Our Process</p>
          <h2>
            <span className="hw-title-static">How We Turn Your Requirement</span>
            <TypedPhrase phrases={["Into a Workshop", "Into Hands-On Learning", "Into Real Projects"]} />
          </h2>
          <p className="hw-lead">
            From your first conversation to what students build and take
            forward, this is how a ProJenius workshop takes shape.
          </p>
          <p className="hw-note">
            The tags on each step show who is involved: the institution,
            ProJenius, or the students.
          </p>
        </div>

        <ol className="hw-steps" data-reveal="right" data-reveal-delay="1">
          {steps.map((s, i) => (
            <li
              key={s.no}
              ref={(el) => (stepRefs.current[i] = el)}
              className={`hw-step ${i <= active ? "is-active" : ""}`}
            >
              <span className="hw-circle">{s.no}</span>
              {i < steps.length - 1 && (
                <span
                  className="hw-line"
                  aria-hidden="true"
                  ref={(el) => (lineRefs.current[i] = el)}
                />
              )}
              <div className="hw-body">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <div className="hw-tags">
                  {s.tags.map((t) => <span key={t} className="hw-tag">{t}</span>)}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}