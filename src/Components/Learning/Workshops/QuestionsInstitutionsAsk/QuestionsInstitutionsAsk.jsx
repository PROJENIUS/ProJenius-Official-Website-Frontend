import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import usePinnedColumn from "../../../../hooks/usePinnedColumn.js";
import "./QuestionsInstitutionsAsk.css";

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

const WORKSHOP_FAQS = [
  {
    question: "Can workshops be customized for our department?",
    answer:
      "Yes. Topics, activities, and depth are shaped around your department's curriculum and goals. Tell us what your students are studying and we will plan the workshop around it.",
  },
  {
    question: "What is the typical workshop duration?",
    answer:
      "Duration depends on the topic and format, from a short session to a multi-day bootcamp. Share your schedule and we will suggest what fits.",
  },
  {
    question: "Can workshops be conducted for large student groups?",
    answer:
      "Group size is planned together with your institution, since hands-on activities depend on the topic, space, and materials. Tell us how many students you expect and we will suggest a format that works.",
  },
  {
    question: "Can ProJenius provide hands-on components or equipment?",
    answer:
      "Workshops are built around hands-on activities. While planning, we confirm which components, tools, and equipment each activity needs and how they will be arranged.",
  },
  {
    question: "Can we request a specific technology or topic?",
    answer:
      "Yes. The workshop areas on this page are starting points, not fixed syllabi. If you have a specific technology in mind, including an emerging one, tell us and we will design around it.",
  },
  {
    question: "Can workshops be conducted at our college?",
    answer:
      "Yes. ProJenius conducts workshops in academic institutions. Share your location and preferred dates when you contact us.",
  },
  {
    question: "Can the workshop be customized based on student skill level?",
    answer:
      "Yes. The difficulty level, activities, and pace are chosen to suit your students\u2019 background, whether they are meeting the technology for the first time or already have some experience.",
  },
  {
    question: "How can our institution request a workshop?",
    answer:
      "Use the Plan a Workshop button or contact ProJenius with your objective, audience, department, and expected outcome. We will follow up to shape the workshop options.",
  },
];

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