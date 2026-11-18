import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import usePinnedColumn from "../../../../hooks/usePinnedColumn.js";
import "./QuestionsInstitutionsAsk.css";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =========================================================
   FAQ — heading on the left, questions on the right, one
   answer open at a time. Used by the Workshop page (these
   defaults) and other pages, which pass their own props:
     faqs       [{ question, answer }]
     title      static heading line
     phrases    typed lines under it
     contactTo  link for "Can't find your answer?"
     idPrefix   unique prefix for the answer ids and the section id (<idPrefix>-faq)
========================================================= */

import { WORKSHOP_FAQS } from "./workshopFaqData.js";

export default function QuestionsInstitutionsAsk({
  faqs = WORKSHOP_FAQS,
  title = "Questions",
  phrases = ["Institutions Ask", "Colleges Ask", "Departments Ask"],
  contactTo = "/contact?type=workshop",
  idPrefix = "qia",
}) {
  // One answer open at a time: opening a question closes the previous one.
  const [openIndex, setOpenIndex] = useState(-1);
  // The heading stays in view while the questions scroll past (wide screens).
  const leftRef = useRef(null);
  const pinRef = useRef(null);
  usePinnedColumn(leftRef, pinRef);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section id={`${idPrefix}-faq`} className="qia-section">
      <div className="qia-container">
        <div ref={leftRef} className="qia-left">
          <div ref={pinRef} className="qia-left-pin" data-pin="off" data-reveal="left">
            <p className="pjds-eyebrow">FAQ</p>
            <h2 className="qia-title">
              <span className="qia-title-static">{title}</span>
              <TypedPhrase phrases={phrases} />
            </h2>
            <SectionTitleLine />
            <p className="qia-help">
              Can{"\u2019"}t find your answer?{" "}
              <Link to={contactTo} className="qia-link">
                Contact ProJenius
              </Link>{" "}
              and we will help.
            </p>
          </div>
        </div>

        <div className="qia-list" data-reveal="right" data-reveal-delay="1">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                className={`qia-item${isOpen ? " is-open" : ""}`}
                key={faq.question}
              >
                <h3 className="qia-heading">
                  <button
                    type="button"
                    className="qia-question"
                    aria-expanded={isOpen}
                    aria-controls={`${idPrefix}-panel-${index}`}
                    id={`${idPrefix}-button-${index}`}
                    onClick={() => toggle(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="qia-icon" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="qia-answer"
                  id={`${idPrefix}-panel-${index}`}
                  role="region"
                  aria-labelledby={`${idPrefix}-button-${index}`}
                >
                  <div className="qia-answer-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}