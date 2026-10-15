/* ==========================================================================
   GettingStarted.jsx
   Section : "Getting Started" (heading + call-to-action + 5-step timeline)
   Styles  : getting-started.css -> link it globally (index.html / global
             stylesheet). It is NOT imported here, and there is no inline
             style and no CSS module.
   Classes : every class starts with the unique prefix "pjgs-"
   Props   : ctaHref (optional) -> where the "Start a Conversation" button goes
   ========================================================================== */
import { memo, useId } from "react";
import "./GettingStarted.css";

/* ---------- SECTION 1 : STATIC CONTENT (frozen, created only once) ---------- */
const PJGS_DEFAULT_HREF = "#contact";

const PJGS_STEPS = Object.freeze([
  { no: "01", title: "Initial Conversation", text: "Tell us where you are and what you want to build." },
  { no: "02", title: "Requirement Understanding", text: "We clarify the problem, the users and the constraints." },
  { no: "03", title: "Scope & Direction", text: "We agree on the right first milestone and the technology behind it." },
  { no: "04", title: "Execution Plan", text: "The approach, timeline and deliverables are laid out." },
  { no: "05", title: "Development / Support", text: "We build, test and support the next step with you." },
]);

/* ---------- SECTION 2 : HELPERS ---------- */
/* Safety: only relative links, #anchors, http(s), mailto and tel are allowed.
   Anything else (for example "javascript:...") falls back to the default. */
const pjgsSafeHref = (href) => {
  if (typeof href !== "string") return PJGS_DEFAULT_HREF;
  const value = href.trim();
  const allowed = /^(\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i.test(value);
  return allowed ? value : PJGS_DEFAULT_HREF;
};

const pjgsIsExternal = (href) => /^https?:\/\//i.test(href);

/* ---------- SECTION 3 : ONE TIMELINE STEP (memoized, never re-renders) ---------- */
const PjgsStep = memo(function PjgsStep({ step }) {
  return (
    <li className="pjgs-step">
      <span className="pjgs-step-node" aria-hidden="true">
        <span className="pjgs-step-no">{step.no}</span>
      </span>
      <div className="pjgs-step-body">
        <h3 className="pjgs-step-title">{step.title}</h3>
        <p className="pjgs-step-text">{step.text}</p>
      </div>
    </li>
  );
});

/* ---------- SECTION 4 : MAIN SECTION ---------- */
function GettingStarted({ ctaHref = PJGS_DEFAULT_HREF }) {
  const uid = useId(); /* unique id, safe even if the section is used twice */
  const href = pjgsSafeHref(ctaHref);
  const external = pjgsIsExternal(href);

  return (
    <section className="pjgs-section" aria-labelledby={`${uid}-heading`}>
      <div className="pjgs-container">
        {/* ----- Left side : heading, text, button ----- */}
        <div className="pjgs-intro">
          <p className="pjgs-eyebrow">Getting Started</p>
          <h2 className="pjgs-heading" id={`${uid}-heading`}>
            What Happens After You Reach Out?
          </h2>
          <p className="pjgs-lead">
            You don&apos;t need a complete business plan or technical specification to start a conversation.
          </p>
          <a
            className="pjgs-cta"
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <span className="pjgs-cta-label">Start a Conversation</span>
            <span className="pjgs-cta-arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
        </div>

        {/* ----- Right side : timeline ----- */}
        <ol className="pjgs-steps" role="list">
          {PJGS_STEPS.map((step) => (
            <PjgsStep key={step.no} step={step} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export default memo(GettingStarted);
