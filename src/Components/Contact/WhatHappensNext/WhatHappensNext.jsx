import { useEffect, useState } from "react";

/* =============================================================================
   WHAT HAPPENS NEXT?
   -----------------------------------------------------------------------------
   A trust-building section describing the 4-step process after someone submits
   an enquiry, plus a quick reference of what the "next step" means for each
   enquiry type.

   It stays in sync with the "What Can We Help You With?" section: when a
   visitor picks an enquiry type there, the matching item below lights up and a
   one-line summary explains it. No inline styles: all styling comes from
   WhatHappensNext.css.
   ============================================================================= */


/* ===========================================================================
   CONFIG — selection sync
   ---------------------------------------------------------------------------
   EVENT: announced by WhatCanWeHelpYouWith.jsx on every selection change.
          The name must match the one in that file.
   SOURCE_ID / data-enquiry-type: lets this section read the current choice
          on first render, in case the event fired before it was listening.
   =========================================================================== */
const ENQUIRY_CHANGE_EVENT = "pj-contact-enquiry-change";
const HELP_SECTION_ID = "pj-contact-help";


/* ===========================================================================
   CONFIG — the 4 process steps
   =========================================================================== */
const PROCESS_STEPS = [
  { number: "01", title: "You Tell Us", text: "Share your requirement, idea, question or goal." },
  { number: "02", title: "We Understand", text: "We review the enquiry and understand what you actually need." },
  { number: "03", title: "We Discuss", text: "We connect with you to clarify the requirement and possible approach." },
  { number: "04", title: "We Plan the Next Step", text: "Depending on the enquiry, we identify the appropriate next step." },
];


/* ===========================================================================
   CONFIG — next step per enquiry type
   ---------------------------------------------------------------------------
   "key" matches the enquiry type keys used by WhatCanWeHelpYouWith.jsx, and
   the order matches the cards in that section.
   =========================================================================== */
const NEXT_STEP_EXAMPLES = [
  { key: "startup", label: "Startup", result: "Idea / R&D discussion" },
  { key: "development", label: "Development", result: "Requirement discussion" },
  { key: "workshop", label: "Workshop", result: "Institution requirement discussion" },
  { key: "course", label: "Courses", result: "Learning path discussion" },
  { key: "internship", label: "Internship", result: "Candidate discussion" },
  { key: "career", label: "Career Guidance", result: "Guidance discussion" },
  { key: "general", label: "General", result: "Conversation about working together" },
];

/* Lookup built once, so checking a key never loops through the list. */
const NEXT_STEP_BY_KEY = Object.fromEntries(NEXT_STEP_EXAMPLES.map((example) => [example.key, example]));

const ITEM_CLASS = "pj-contact-next__examples-item";
const ITEM_ACTIVE_CLASS = `${ITEM_CLASS} ${ITEM_CLASS}--active`;


/* ===========================================================================
   SAFETY — only accept a known enquiry key; anything else means "no choice"
   =========================================================================== */
const toKnownKey = (value) => (typeof value === "string" && NEXT_STEP_BY_KEY[value] ? value : "");

const readCurrentKey = () => {
  if (typeof document === "undefined") return "";
  const helpSection = document.getElementById(HELP_SECTION_ID);
  return toKnownKey(helpSection ? helpSection.dataset.enquiryType : "");
};


/* =============================================================================
   MAIN COMPONENT
   ============================================================================= */
const WhatHappensNext = () => {
  const [activeKey, setActiveKey] = useState(readCurrentKey);

  /* Listen for selection changes from the enquiry section. */
  useEffect(() => {
    const handleChange = (event) => setActiveKey(toKnownKey(event.detail && event.detail.type));

    window.addEventListener(ENQUIRY_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(ENQUIRY_CHANGE_EVENT, handleChange);
  }, []);

  const activeExample = NEXT_STEP_BY_KEY[activeKey] || null;

  return (
    <section className="pj-contact-next" id="pj-contact-next" aria-labelledby="pj-contact-next-title">
      <div className="pj-contact-next__content">
        {/* ===================================================================
            HEADER
            =================================================================== */}
        <header className="pj-contact-next__header">
          <h2 className="pj-contact-next__title" id="pj-contact-next-title">
            What Happens Next?
          </h2>
          <p className="pj-contact-next__description">
            From your first message to the next step &mdash; here&rsquo;s how it works.
          </p>
        </header>

        {/* ===================================================================
            4-STEP PROCESS
            =================================================================== */}
        <ol className="pj-contact-next__steps">
          {PROCESS_STEPS.map((step) => (
            <li className="pj-contact-next__step" key={step.number}>
              <span className="pj-contact-next__number" aria-hidden="true">
                {step.number}
              </span>
              <h3 className="pj-contact-next__step-title">{step.title}</h3>
              <p className="pj-contact-next__step-text">{step.text}</p>
            </li>
          ))}
        </ol>

        {/* ===================================================================
            NEXT-STEP EXAMPLES BY ENQUIRY TYPE
            The item matching the selected enquiry type is highlighted.
            =================================================================== */}
        <div className="pj-contact-next__examples">
          <h3 className="pj-contact-next__examples-title">What the next step looks like for each enquiry</h3>

          <p className="pj-contact-next__selected" role="status" aria-live="polite">
            {activeExample ? (
              <>
                Your selection: <strong>{activeExample.label}</strong> &rarr; {activeExample.result}
              </>
            ) : (
              "Choose an option above to see what happens next for your enquiry."
            )}
          </p>

          <ul className="pj-contact-next__examples-list">
            {NEXT_STEP_EXAMPLES.map((example) => {
              const isActive = example.key === activeKey;
              return (
                <li
                  className={isActive ? ITEM_ACTIVE_CLASS : ITEM_CLASS}
                  key={example.key}
                  aria-current={isActive ? "true" : undefined}
                >
                  <strong>{example.label}</strong> &rarr; {example.result}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhatHappensNext;
