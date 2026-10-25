/* ==========================================================================
   WorkingProcess.jsx
   Section : "Our Working Process" (6-step selector + detail panel)
   Styles  : working-process.css  -> link it globally (index.html / global
             stylesheet). It is NOT imported here, and there is no inline
             style and no CSS module.
   Classes : every class starts with the unique prefix "pjwp-"
   ========================================================================== */
import { memo, useCallback, useId, useRef, useState } from "react";
import "./WorkingProcess.css";

/* ---------- SECTION 1 : STATIC CONTENT (frozen, created only once) ---------- */
const PJWP_DEFAULT_INDEX = 0;

const PJWP_STEPS = Object.freeze([
  {
    id: "discuss",
    no: "01",
    label: "Discuss",
    short: "Tell us about your idea.",
    title: "Tell us about your idea.",
    text: "Share your idea, problem, project or current stage with us.",
    tags: ["Idea intake", "Project review", "Stage check"],
  },
  {
    id: "understand",
    no: "02",
    label: "Understand",
    short: "Understand the problem.",
    title: "Understand the problem.",
    text: "We explore the requirement, users, technology and constraints.",
    tags: ["Requirement analysis", "User & problem research", "Technology research", "Constraints"],
  },
  {
    id: "plan",
    no: "03",
    label: "Plan",
    short: "Define the right path.",
    title: "Define the right path.",
    text: "We identify the appropriate scope, technology and next milestone.",
    tags: ["Scope definition", "Technology selection", "Milestone planning"],
  },
  {
    id: "build",
    no: "04",
    label: "Build",
    short: "Develop the solution.",
    title: "Develop the solution.",
    text: "Prototype, MVP, software, hardware or other required technology is developed.",
    tags: ["Software / SaaS", "AI / ML", "IoT", "Embedded", "PCB", "3D design & printing"],
  },
  {
    id: "validate",
    no: "05",
    label: "Validate",
    short: "Test and refine.",
    title: "Test and refine.",
    text: "We test the solution, identify gaps and improve the outcome.",
    tags: ["Testing", "Gap analysis", "Iteration"],
  },
  {
    id: "support",
    no: "06",
    label: "Support",
    short: "Prepare for the next stage.",
    title: "Prepare for the next stage.",
    text: "Depending on the venture, we can support IP, registration, documentation, startup readiness and further development.",
    tags: [
      "Patent & IP support",
      "Registration guidance",
      "Documentation",
      "Startup readiness",
      "Further development",
    ],
  },
]);

const PJWP_LAST_INDEX = PJWP_STEPS.length - 1;

/* ---------- SECTION 2 : HELPERS ---------- */
/* Safety: keep the index always inside the valid range */
const pjwpClamp = (value) =>
  Number.isInteger(value) ? Math.min(Math.max(value, 0), PJWP_LAST_INDEX) : PJWP_DEFAULT_INDEX;

/* Returns the modifier class that decides how a step looks */
const pjwpStepState = (index, active) =>
  index < active ? "pjwp-step--done" : index === active ? "pjwp-step--active" : "pjwp-step--upcoming";

/* ---------- SECTION 3 : STEP BUTTON (re-renders only when its own state changes) ---------- */
const PjwpStep = memo(function PjwpStep({ step, index, active, uid, onSelect, setRef }) {
  const isActive = index === active;
  return (
    <button
      type="button"
      role="tab"
      ref={(node) => setRef(index, node)}
      id={`${uid}-tab-${step.id}`}
      aria-selected={isActive}
      aria-controls={`${uid}-panel`}
      tabIndex={isActive ? 0 : -1}
      className={`pjwp-step ${pjwpStepState(index, active)}`}
      onClick={() => onSelect(index)}
    >
      <span className="pjwp-step-node">
        <span className="pjwp-step-no">{step.no}</span>
      </span>
      <span className="pjwp-step-label">{step.label}</span>
      <span className="pjwp-step-text">{step.short}</span>
    </button>
  );
});

/* ---------- SECTION 4 : DETAIL PANEL ---------- */
const PjwpDetail = memo(function PjwpDetail({ step, uid }) {
  return (
    <div
      className="pjwp-detail"
      role="tabpanel"
      id={`${uid}-panel`}
      aria-labelledby={`${uid}-tab-${step.id}`}
      tabIndex={0}
    >
      {/* key restarts the fade animation whenever the step changes */}
      <div className="pjwp-detail-inner" key={step.id}>
        <div className="pjwp-detail-index" aria-hidden="true">
          <span className="pjwp-detail-num">{step.no}</span>
          <span className="pjwp-detail-tag">{step.label}</span>
        </div>

        <div className="pjwp-detail-body">
          <h3 className="pjwp-detail-title">{step.title}</h3>
          <p className="pjwp-detail-text">{step.text}</p>
        </div>

        {step.tags.length > 0 && (
          <div className="pjwp-caps">
            <p className="pjwp-caps-title">Capabilities involved</p>
            <ul className="pjwp-caps-list">
              {step.tags.map((tag) => (
                <li className="pjwp-caps-item" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
});

/* ---------- SECTION 5 : MAIN SECTION ---------- */
function WorkingProcess() {
  const [active, setActive] = useState(PJWP_DEFAULT_INDEX);
  const uid = useId(); /* unique ids, safe even if the section is used twice */
  const tabRefs = useRef([]);

  const handleSelect = useCallback((index) => setActive(pjwpClamp(index)), []);

  /* Stable ref setter, so memoized steps are not re-rendered for nothing */
  const setTabRef = useCallback((index, node) => {
    tabRefs.current[index] = node;
  }, []);

  /* Keyboard support: arrows, Home and End move between steps */
  const handleKeyDown = useCallback(
    (event) => {
      const moves = {
        ArrowRight: active + 1,
        ArrowDown: active + 1,
        ArrowLeft: active - 1,
        ArrowUp: active - 1,
        Home: 0,
        End: PJWP_LAST_INDEX,
      };
      if (!(event.key in moves)) return;
      event.preventDefault();
      const next = pjwpClamp(moves[event.key]);
      setActive(next);
      tabRefs.current[next]?.focus();
    },
    [active]
  );

  return (
    <section className="pjwp-section" aria-labelledby={`${uid}-heading`}>
      <div className="pjwp-container">
        {/* ----- Header ----- */}
        <header className="pjwp-header">
          <p className="pjwp-eyebrow">Our Working Process</p>
          <h2 className="pjwp-heading" id={`${uid}-heading`}>
            From Conversation to Execution.
          </h2>
          <p className="pjwp-intro">
            We begin by understanding what you are trying to solve before deciding what needs to be built.
          </p>
        </header>

        {/* ----- Stepper ----- */}
        <div
          className={`pjwp-stepper pjwp-stepper--at-${active}`}
          role="tablist"
          aria-label="Our working process stages"
          onKeyDown={handleKeyDown}
        >
          {/* sliding marker dot (position comes from the pjwp-stepper--at-N class) */}
          <span className="pjwp-marker" aria-hidden="true" />
          {PJWP_STEPS.map((step, index) => (
            <PjwpStep
              key={step.id}
              step={step}
              index={index}
              active={active}
              uid={uid}
              onSelect={handleSelect}
              setRef={setTabRef}
            />
          ))}
        </div>

        {/* ----- Detail panel ----- */}
        <PjwpDetail step={PJWP_STEPS[active]} uid={uid} />
      </div>
    </section>
  );
}

export default memo(WorkingProcess);
