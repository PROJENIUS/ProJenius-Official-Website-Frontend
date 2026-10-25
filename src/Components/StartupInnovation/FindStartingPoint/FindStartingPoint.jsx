/**
 * FindStartingPoint.jsx
 * CSS lives in FindStartingPoint.css (class prefix "pjs-find"), linked globally.
 * No inline styles, no CSS modules, no CSS imports in this file.
 */
import { memo, useCallback, useId, useState } from "react";
import "./FindStartingPoint.css";

/* ============ 1. STATIC DATA (outside component = created once) ============ */
const STAGES = Object.freeze([
  {
    id: "idea",
    choice: "I only have an idea.",
    needs: ["Problem understanding", "Research", "Feasibility", "Idea validation", "Technical roadmap"],
    desc: "Start with a conversation about the problem. We will help you define the first practical step.",
  },
  {
    id: "validation",
    choice: "I understand the problem but need validation.",
    needs: ["Requirement clarification", "Technical feasibility", "Solution definition", "Technology validation", "MVP planning"],
    desc: "Before building, test whether the solution works technically and makes sense for its users.",
  },
  {
    id: "prototype",
    choice: "I need to build a prototype.",
    needs: ["Product planning", "3D design", "PCB", "Electronics", "Embedded systems", "Prototype development"],
    desc: "A working prototype turns the concept into something you can test, show and improve.",
  },
  {
    id: "mvp",
    choice: "I need an MVP.",
    needs: ["MVP scope definition", "Software / SaaS development", "AI / ML integration", "IoT and hardware integration", "Testing and refinement", "Product roadmap"],
    desc: "An MVP is the smallest version that proves the idea with real users. We help scope it and build it.",
  },
  {
    id: "startup",
    choice: "I already have a startup.",
    needs: ["Technical & product support", "Product roadmap", "Innovation support", "Pitch deck & documentation", "Startup mentoring", "IP support"],
    desc: "Bring in technical depth, product support or innovation help where your team needs it.",
  },
]);

/* ============ 2. SAFETY + FORMAT HELPERS ============ */
// Allow only http(s), mailto, tel, hash and single-slash relative links (blocks javascript: / data:).
const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;
const toSafeHref = (href) =>
  typeof href === "string" && SAFE_HREF.test(href.trim()) ? href.trim() : "#contact";
const pad = (n) => String(n + 1).padStart(2, "0");

/* ============ 3. CHOICE ROW (memo: only re-renders when its state flips) ============ */
const ChoiceRow = memo(function ChoiceRow({ stage, index, isActive, baseId, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      id={`${baseId}-choice-${stage.id}`}
      aria-checked={isActive}
      tabIndex={isActive ? 0 : -1}
      className={isActive ? "pjs-find__choice pjs-find__choice--on" : "pjs-find__choice"}
      onClick={() => onSelect(stage.id)}
    >
      <span className="pjs-find__choice-no">{pad(index)}</span>
      <span className="pjs-find__choice-text">{stage.choice}</span>
      <span className="pjs-find__radio" aria-hidden="true" />
    </button>
  );
});

/* ============ 4. RESULT CARD (remounts per stage to replay the fade) ============ */
const ResultCard = memo(function ResultCard({ stage, activeIndex, ctaHref }) {
  return (
    <div className="pjs-find__card" aria-live="polite">
      <div className="pjs-find__card-body" key={stage.id}>
        <p className="pjs-find__path">projenius / stage-{pad(activeIndex)}</p>

        <div className="pjs-find__progress" aria-hidden="true">
          {STAGES.map((s, i) => (
            <span key={s.id} className={i <= activeIndex ? "pjs-find__seg pjs-find__seg--on" : "pjs-find__seg"} />
          ))}
        </div>

        <p className="pjs-find__label">You may need</p>
        <ol className="pjs-find__needs">
          {stage.needs.map((need, i) => (
            <li key={need} className="pjs-find__need">
              <span className="pjs-find__need-no">{pad(i)}</span>
              <span className="pjs-find__need-name">{need}</span>
            </li>
          ))}
        </ol>

        <p className="pjs-find__desc">{stage.desc}</p>
        <a className="pjs-find__cta" href={ctaHref} rel="noopener noreferrer">
          Talk to ProJenius <span className="pjs-find__cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
});

/* ============ 5. MAIN SECTION ============ */
function FindStartingPoint({ ctaHref = "#contact" }) {
  const baseId = useId(); // unique ids even if used twice
  const [activeId, setActiveId] = useState(STAGES[0].id);
  const activeIndex = STAGES.findIndex((s) => s.id === activeId);
  const safeHref = toSafeHref(ctaHref);

  const handleSelect = useCallback((id) => setActiveId(id), []);

  // Arrow / Home / End keys move the selection (roving tabindex)
  const handleKeyDown = useCallback(
    (event) => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      if (!step && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();
      const last = STAGES.length - 1;
      const next =
        event.key === "Home" ? 0 : event.key === "End" ? last : (activeIndex + step + STAGES.length) % STAGES.length;
      setActiveId(STAGES[next].id);
      document.getElementById(`${baseId}-choice-${STAGES[next].id}`)?.focus();
    },
    [activeIndex, baseId]
  );

  return (
    <section className="pjs-find" aria-labelledby={`${baseId}-title`}>
      <p className="pjs-find__eyebrow">Find your starting point</p>
      <h2 className="pjs-find__title" id={`${baseId}-title`}>Where Are You Right Now?</h2>
      <p className="pjs-find__lead">You don't need to have everything figured out. Start with where you are.</p>

      <div className="pjs-find__layout">
        <div className="pjs-find__choices" role="radiogroup" aria-label="Your current stage" onKeyDown={handleKeyDown}>
          {STAGES.map((stage, i) => (
            <ChoiceRow
              key={stage.id}
              stage={stage}
              index={i}
              isActive={stage.id === activeId}
              baseId={baseId}
              onSelect={handleSelect}
            />
          ))}
        </div>
        <ResultCard stage={STAGES[activeIndex]} activeIndex={activeIndex} ctaHref={safeHref} />
      </div>
    </section>
  );
}

export default memo(FindStartingPoint);
