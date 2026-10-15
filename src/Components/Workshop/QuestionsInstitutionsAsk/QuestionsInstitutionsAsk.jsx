import React, { useState } from "react";
import "./QuestionsInstitutionsAsk.css";

const faqs = [
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

export default function QuestionsInstitutionsAsk() {
  // Items open and close independently, like the original.
  const [openItems, setOpenItems] = useState([]);

  const toggle = (index) => {
    setOpenItems((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index]
    );
  };

  return (
    <section className="qia-section">
      <div className="qia-container">
        <div className="qia-left">
          <h2 className="qia-title">Questions Institutions Ask</h2>
          <p className="qia-help">
            Can{"\u2019"}t find your answer?{" "}
            <a href="#contact" className="qia-link">
              Contact ProJenius
            </a>{" "}
            and we will help.
          </p>
        </div>

        <div className="qia-list">
          {faqs.map((faq, index) => {
            const isOpen = openItems.includes(index);
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
                    aria-controls={`qia-panel-${index}`}
                    id={`qia-button-${index}`}
                    onClick={() => toggle(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="qia-icon" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="qia-answer"
                  id={`qia-panel-${index}`}
                  role="region"
                  aria-labelledby={`qia-button-${index}`}
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