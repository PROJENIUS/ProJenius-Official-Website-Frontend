import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BellRing, BrainCircuit, GitBranch, Inbox } from "lucide-react";

import useOnScreen from "../../../../hooks/useOnScreen.js";
import { contactLink } from "../../Shared/serviceLinks.js";
import "./AIWorkflow.css";

/* =============================================================================
   AI & AUTOMATION — a conceptual workflow (clearly labelled as an example):
   a request comes in, AI reads it, a rule decides, an action runs.
   The highlight moves through the stages with CSS only, and only while the
   section is on screen; with reduced motion every stage is shown at rest.
   ============================================================================= */

const STAGES = [
  { id: "input", Icon: Inbox, label: "Input", title: "A new request arrives", text: "From a website form, email or message." },
  { id: "ai", Icon: BrainCircuit, label: "AI processing", title: "AI reads and classifies it", text: "Topic, urgency and the details that matter." },
  { id: "decision", Icon: GitBranch, label: "Decision", title: "Rules choose the route", text: "Which team, which priority, what happens next." },
  { id: "action", Icon: BellRing, label: "Automated action", title: "The next step runs itself", text: "A task is created and the right people are notified." },
];

const USES = [
  "Classifying and routing incoming requests",
  "Extracting information from documents and forms",
  "Automating repetitive approvals, reports and updates",
  "Connecting tools your team already uses",
];

export default function AIWorkflow() {
  const visualRef = useRef(null);
  const isOnScreen = useOnScreen(visualRef, "0px 0px -10% 0px");

  return (
    <section id="software-ai" className="pjsw-ai" aria-labelledby="software-ai-title">
      <div className="pjds-container pjsw-ai__layout">
        <div className="pjsw-ai__copy">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">AI &amp; Automation</p>
          <h2 id="software-ai-title" className="pjsw-ai__title" data-reveal="up" data-reveal-delay="1">
            Let Software Handle the Repetitive Work
          </h2>
          <p className="pjsw-ai__lead" data-reveal="up" data-reveal-delay="2">
            We use intelligent technology where it creates meaningful value, and turn repetitive
            processes into connected digital workflows.
          </p>
          <ul className="pjsw-ai__uses" data-reveal="up" data-reveal-delay="3">
            {USES.map((use) => <li key={use}>{use}</li>)}
          </ul>
          <Link className="pjds-btn pjds-btn--primary pjsw-ai__btn" to={contactLink("development", "software-ai-automation")}>
            Discuss an AI or Automation Idea
            <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </div>

        <figure
          ref={visualRef}
          className={`pjsw-ai__flow${isOnScreen ? " is-running" : ""}`}
          aria-labelledby="software-ai-flow-caption"
          data-reveal="right"
          data-reveal-delay="2"
        >
          <ol className="pjsw-ai__stages">
            {STAGES.map(({ id, Icon, label, title, text }) => (
              <li key={id} className={`pjsw-ai__stage pjsw-ai__stage--${id}`}>
                <span className="pjsw-ai__icon" aria-hidden="true"><Icon size={22} strokeWidth={2} /></span>
                <span className="pjsw-ai__stage-label">{label}</span>
                <span className="pjsw-ai__stage-title">{title}</span>
                <span className="pjsw-ai__stage-text">{text}</span>
              </li>
            ))}
          </ol>
          <figcaption id="software-ai-flow-caption" className="pjsw-ai__caption">
            Conceptual example. Every workflow is designed around your own process and systems.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
