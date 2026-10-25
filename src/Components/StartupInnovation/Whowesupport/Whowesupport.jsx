/**
 * StageSupport.jsx
 * CSS lives in StageSupport.css (class prefix "pjs-stage"), linked globally.
 * No inline styles, no CSS modules, no CSS imports in this file.
 */
import { memo, useCallback, useId, useState } from "react";
import "./Whowesupport.css";

/* ============ 1. STATIC DATA (outside component = created once) ============ */
const STAGES = Object.freeze([
  {
    id: "idea",
    no: "01",
    title: "Idea-Stage Innovators",
    quote: "“I have an idea but need clarity.”",
    text: "You have a spark: a problem you have noticed or a concept you keep coming back to. We help you make it concrete by understanding the problem, testing whether it holds up and outlining a practical technical direction.",
    tags: ["Problem understanding", "Research & development", "Idea evaluation", "Feasibility assessment", "Technical roadmap"],
  },
  {
    id: "student",
    no: "02",
    title: "Student & Emerging Innovators",
    quote: "“I want to turn a project or concept into something real.”",
    text: "A final-year project, a competition idea or a prototype that deserves to go further. We help you strengthen the concept, build a working demonstration and understand what a real product would need.",
    tags: ["Project-to-product guidance", "Prototype development", "Technical documentation", "Patent & IP support", "Demo preparation"],
  },
  {
    id: "founder",
    no: "03",
    title: "Early-Stage Founders",
    quote: "“I have a validated concept and need to build.”",
    text: "You know the problem and have an early direction. Now the right technology has to be built properly. We scope, design and develop the prototype or MVP, and help you prepare for what comes next.",
    tags: ["MVP planning", "Software / SaaS", "AI / ML", "IoT & hardware", "Product roadmap", "Startup registration guidance"],
  },
  {
    id: "startup",
    no: "04",
    title: "Existing Startups",
    quote: "“I need technical, product or innovation support.”",
    text: "Already operating and in need of extra technical depth or a new capability? We can support product development, innovation work and technical mentoring alongside your team.",
    tags: ["Product development", "Technology R&D", "Technical mentoring", "Product roadmap", "Pitch deck & documentation", "IP support"],
  },
]);

/* ============ 2. SAFETY HELPERS ============ */
// Allow only http(s), mailto, tel, hash and single-slash relative links (blocks javascript: / data:).
const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;
const toSafeHref = (href) =>
  typeof href === "string" && SAFE_HREF.test(href.trim()) ? href.trim() : "#contact";

/* ============ 3. PROGRESS DOTS (one map, no repeated markup) ============ */
const ProgressDots = memo(function ProgressDots({ activeIndex }) {
  return (
    <div className="pjs-stage__progress" aria-hidden="true">
      {STAGES.map((stage, i) => (
        <span
          key={stage.id}
          className={i <= activeIndex ? "pjs-stage__dot pjs-stage__dot--on" : "pjs-stage__dot"}
        />
      ))}
      <span>idea → startup</span>
    </div>
  );
});

/* ============ 4. LIST ITEM (memo: only re-renders when its state flips) ============ */
const StageTab = memo(function StageTab({ stage, isActive, baseId, onSelect }) {
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${stage.id}`}
      aria-selected={isActive}
      aria-controls={`${baseId}-panel`}
      tabIndex={isActive ? 0 : -1}
      className={isActive ? "pjs-stage__tab pjs-stage__tab--on" : "pjs-stage__tab"}
      onClick={() => onSelect(stage.id)}
    >
      <span className="pjs-stage__tab-no">{stage.no}</span>
      <span>
        <span className="pjs-stage__tab-name">{stage.title}</span>
        <span className="pjs-stage__tab-quote">{stage.quote}</span>
      </span>
      <span className="pjs-stage__tab-arrow" aria-hidden="true">→</span>
    </button>
  );
});

/* ============ 5. DETAIL PANEL (remounts per stage to replay the fade) ============ */
const StagePanel = memo(function StagePanel({ stage, activeIndex, baseId, ctaHref }) {
  return (
    <div
      className="pjs-stage__panel"
      role="tabpanel"
      id={`${baseId}-panel`}
      aria-labelledby={`${baseId}-tab-${stage.id}`}
    >
      <div className="pjs-stage__panel-body" key={stage.id}>
        <div className="pjs-stage__panel-top">
          <span className="pjs-stage__watermark" aria-hidden="true">{stage.no}</span>
          <ProgressDots activeIndex={activeIndex} />
        </div>
        <h3 className="pjs-stage__panel-title">{stage.title}</h3>
        <p className="pjs-stage__panel-text">{stage.text}</p>
        <p className="pjs-stage__label">Where we can help</p>
        <ul className="pjs-stage__tags">
          {stage.tags.map((tag) => (
            <li key={tag} className="pjs-stage__tag">{tag}</li>
          ))}
        </ul>
        <a className="pjs-stage__cta" href={ctaHref} rel="noopener noreferrer">
          Talk about this stage <span className="pjs-stage__cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
});

/* ============ 6. MAIN SECTION ============ */
function StageSupport({ ctaHref = "#contact" }) {
  const baseId = useId(); // unique ids even if the component is used twice
  const [activeId, setActiveId] = useState(STAGES[0].id);
  const activeIndex = STAGES.findIndex((s) => s.id === activeId);
  const safeHref = toSafeHref(ctaHref);

  const handleSelect = useCallback((id) => setActiveId(id), []);

  // Arrow-key navigation (roving tabindex) for keyboard + screen-reader users
  const handleKeyDown = useCallback(
    (event) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (event.key === "Home" || event.key === "End" || keys[event.key]) {
        event.preventDefault();
        const last = STAGES.length - 1;
        const next =
          event.key === "Home" ? 0 : event.key === "End" ? last
          : (activeIndex + keys[event.key] + STAGES.length) % STAGES.length;
        setActiveId(STAGES[next].id);
        document.getElementById(`${baseId}-tab-${STAGES[next].id}`)?.focus();
      }
    },
    [activeIndex, baseId]
  );

  return (
    <section className="pjs-stage" aria-labelledby={`${baseId}-title`}>
      <p className="pjs-stage__eyebrow">Who we support</p>
      <h2 className="pjs-stage__title" id={`${baseId}-title`}>Built for Ideas at Different Stages.</h2>
      <p className="pjs-stage__lead">
        Not every innovator starts from the same place. Our support adapts to where you are today.
      </p>

      <div className="pjs-stage__board">
        <div
          className="pjs-stage__list"
          role="tablist"
          aria-label="Support stages"
          aria-orientation="vertical"
          onKeyDown={handleKeyDown}
        >
          {STAGES.map((stage) => (
            <StageTab
              key={stage.id}
              stage={stage}
              isActive={stage.id === activeId}
              baseId={baseId}
              onSelect={handleSelect}
            />
          ))}
        </div>
        <StagePanel stage={STAGES[activeIndex]} activeIndex={activeIndex} baseId={baseId} ctaHref={safeHref} />
      </div>
    </section>
  );
}

export default memo(StageSupport);
