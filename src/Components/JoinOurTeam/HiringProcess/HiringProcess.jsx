import { FileText, Handshake, MessagesSquare, SearchCheck } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import "./HiringProcess.css";

/* =============================================================================
   JOIN OUR TEAM — HIRING PROCESS
   Navy section: four numbered steps joined by a line (a column on phones).
   ============================================================================= */

const STEPS = [
  { title: "Apply Online", text: "Fill in the form below and upload your resume.", Icon: FileText },
  { title: "Profile Review", text: "Our team reads your application and checks it against the role.", Icon: SearchCheck },
  { title: "Conversation", text: "A call or interview to know you better, with a short practical task for technical roles.", Icon: MessagesSquare },
  { title: "Offer & Onboarding", text: "If it is a fit, we share the offer and help you get started.", Icon: Handshake },
];

export default function HiringProcess() {
  return (
    <section className="pjj-process" aria-labelledby="pjj-process-title">
      <div className="pjds-container">
        <header className="pjj-process__head">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Hiring Process</p>
          <h2 id="pjj-process-title" className="pjj-process__title" data-reveal="up" data-reveal-delay="1">
            <span className="pjj-process__title-static">From Application</span>
            <TypedPhrase tone="dark" phrases={["to Your First Day", "to Offer", "in Four Steps"]} />
          </h2>
        </header>

        <ol className="pjj-process__steps">
          {STEPS.map(({ title, text, Icon }, index) => (
            <li key={title} className="pjj-process__step" data-reveal="up" data-reveal-delay={String(index + 1)}>
              <span className="pjj-process__badge" aria-hidden="true">
                <Icon size={24} strokeWidth={1.9} />
                <span className="pjj-process__num">{index + 1}</span>
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
