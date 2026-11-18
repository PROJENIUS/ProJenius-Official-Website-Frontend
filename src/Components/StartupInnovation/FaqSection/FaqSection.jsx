import { Component, memo, useCallback, useState } from "react";
import "./FaqSection.css";
import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* ==========================================================================
   FaqSection.jsx
   RULES FOLLOWED : no inline style | no <style> tag | no CSS import | no CSS module
                    unique "faq-" class names | no repeated markup (data + map)
   NOTE           : load FaqSection.css ONCE outside this file
                    (e.g. <link rel="stylesheet" href="/FaqSection.css"> in index.html)
   PROP           : askHref (optional) -> where "Ask a question" goes, default "/contact"
   ========================================================================== */

/* ==========================================================================
   SESSION 1 : STATIC DATA
   Frozen so it cannot change at runtime. Every question row is rendered from
   this one array, so nothing is repeated in the markup.
   ========================================================================== */
const FAQS = Object.freeze([
  { q: "Can I approach ProJenius with only an idea?",
    a: "Yes. A rough idea is enough to start. We help you shape it into a clear problem and a plan." },
  { q: "Do I need a complete technical specification?",
    a: "No. You do not need a full specification. We work through the requirements with you in the first conversations." },
  { q: "Can ProJenius help with prototype development?",
    a: "Yes. We support the path from research and design to a working prototype or first version of the product." },
  { q: "Can you help with both software and hardware?",
    a: "Yes. We work across software and hardware, so one idea can combine both in a single build." },
  { q: "Do you support AI/ML and SaaS ideas?",
    a: "Yes. AI/ML and SaaS ideas are part of what we support, from the data and models to the product around them." },
  { q: "Can you help with PCB and 3D prototype development?",
    a: "Yes. We support PCB design and 3D design and printing to turn a concept into something you can hold and test." },
  { q: "Do you provide patent support?",
    a: "We guide you on how to start the process of protecting your idea and what to prepare." },
  { q: "Do you provide startup registration support?",
    a: "Yes. We guide you on setting up the business and the registrations and paperwork it needs." },
  { q: "Can students approach ProJenius?",
    a: "Yes. Students are welcome to approach us with project ideas and academic innovation work." },
  { q: "How do we start?",
    a: "Send us a short message about your idea. We reply to arrange an initial conversation about what you want to build." },
]);

const DEFAULT_ASK_HREF = "/contact";

/* ==========================================================================
   SESSION 2 : HELPERS (pure functions)
   ========================================================================== */
// Safety: only allow local paths, anchors, mailto or https links
const safeHref = (href) =>
  typeof href === "string" && /^(\/(?!\/)|#|mailto:|https:\/\/)/.test(href) ? href : DEFAULT_ASK_HREF;

/* ==========================================================================
   SESSION 3 : ERROR BOUNDARY (one failing part cannot blank the page)
   Classes : faq-fallback
   ========================================================================== */
class SafeBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="faq-fallback" role="alert">This section could not be loaded.</p>
      : this.props.children;
  }
}

/* ==========================================================================
   SESSION 4 : FAQ ITEM (one question row with its answer)
   Classes : faq-item, faq-item--open, faq-head, faq-question, faq-icon,
             faq-body, faq-inner, faq-answer
   ========================================================================== */
const FaqItem = memo(function FaqItem({ index, item, isOpen, onToggle }) {
  const uid = `faq-item-${index}`;
  return (
    <li className={`faq-item${isOpen ? " faq-item--open" : ""}`}>
      <button
        type="button"
        className="faq-head"
        id={`${uid}-head`}
        aria-expanded={isOpen}
        aria-controls={`${uid}-body`}
        onClick={() => onToggle(index)}
      >
        <span className="faq-question">{item.q}</span>
        <span className="faq-icon" aria-hidden="true" />
      </button>
      <div className="faq-body" id={`${uid}-body`} role="region" aria-labelledby={`${uid}-head`}>
        <div className="faq-inner">
          <p className="faq-answer">{item.a}</p>
        </div>
      </div>
    </li>
  );
});

/* ==========================================================================
   SESSION 5 : MAIN SECTION (intro on the left, questions on the right)
   Classes : faq-section, faq-layout, faq-intro, faq-eyebrow, faq-heading,
             faq-lead, faq-ask, faq-ask-arrow, faq-list
   ========================================================================== */
export default function FaqSection({ askHref = DEFAULT_ASK_HREF }) {
  const [openIndex, setOpenIndex] = useState(-1); // -1 = all closed, only one open at a time

  // Stable handler so memoised rows do not re-render needlessly
  const handleToggle = useCallback((i) => setOpenIndex((prev) => (prev === i ? -1 : i)), []);

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="faq-layout">
        <header className="faq-intro">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark faq-eyebrow" data-reveal="up">Questions</p>
          <h2 id="faq-heading" className="faq-heading" data-reveal="up" data-reveal-delay="1">Questions <TypedPhrase phrases={["Founders Ask", "Startups Ask", "Innovators Ask"]} /></h2>
          <SectionTitleLine />
          <p className="faq-lead" data-reveal="up" data-reveal-delay="2">
            Can&apos;t find what you&apos;re looking for? Ask us directly. A rough idea is enough to start.
          </p>
          <a className="faq-ask" href={safeHref(askHref)}>
            Ask a question <span className="faq-ask-arrow" aria-hidden="true">→</span>
          </a>
        </header>

        <SafeBoundary>
          <ul className="faq-list">
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} index={i} item={item} isOpen={i === openIndex} onToggle={handleToggle} />
            ))}
          </ul>
        </SafeBoundary>
      </div>
    </section>
  );
}
