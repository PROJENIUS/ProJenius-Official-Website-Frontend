import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Pause, Play } from "lucide-react";

import { contactLink } from "../../Shared/serviceLinks.js";
import aiVideo from "../../../../assets/Software_Solution/AI & Automation/ProJenius-AI-Automation.mp4";
import "./AiAndAutomation.css";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =============================================================================
   AI & AUTOMATION — copy on the left, an 18-second automation video on the
   right:
     01 The problem   requests pile up and are sorted by hand
     02 AI reads      a message is scanned; topic, urgency, deadline are tagged
     03 Rules decide  it is routed to the right team with a priority
     04 It acts       task created, team notified, customer replied
     05 ProJenius     "Repetitive work? Let's automate it."
   The video has no sound; it plays only while on screen, has a pause button
   (WCAG 2.2.2) and does not autoplay for visitors who prefer reduced motion.
   Screen readers get the same story as a plain list.
   Previous version: backup-before-cleanup/AIWorkflow-before-video/
   ============================================================================= */

const USES = [
  "Classifying and routing incoming requests",
  "Extracting information from documents and forms",
  "Automating repetitive approvals, reports and updates",
  "Connecting tools your team already uses",
];

const STORY = [
  "The problem: requests pile up across email, WhatsApp and website forms, and someone sorts each one by hand.",
  "AI reads each message and picks out the topic, the urgency and details such as a deadline.",
  "Rules decide where it goes: for example, an urgent delivery issue goes to Support with priority 1.",
  "The next step runs itself: a task is created, the team is notified and the customer gets a reply.",
  "ProJenius designs and builds this automation around your own process and tools.",
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function AiAndAutomation() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  /* Set when the visitor presses pause, so scrolling never restarts it. */
  const userPausedRef = useRef(prefersReducedMotion());

  /* Play while on screen, pause (not reset) when scrolled away. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPausedRef.current) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      video.play().catch(() => {});
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  };

  return (
    <section id="software-ai" className="pjsw-ai" aria-labelledby="software-ai-title">
      <div className="pjds-container pjsw-ai__layout">
        <div className="pjsw-ai__copy">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">AI &amp; Automation</p>
          <h2 id="software-ai-title" className="pjsw-ai__title" data-reveal="up" data-reveal-delay="1">
            Let Software Handle <TypedPhrase phrases={["the Repetitive Work", "the Routine Tasks", "the Manual Steps"]} />
          </h2>
          <SectionTitleLine />
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
          className="pjsw-ai__film"
          aria-labelledby="software-ai-film-caption"
          data-reveal="right"
          data-reveal-delay="2"
        >
          <div className="pjsw-ai__stage">
            <video
              ref={videoRef}
              className="pjsw-ai__video"
              src={aiVideo}
              width="1122"
              height="892"
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          </div>

          <ol className="pjsw-ai__sr">
            {STORY.map((s) => <li key={s}>{s}</li>)}
          </ol>

          {/* Caption and pause button sit below the video so they never cover it */}
          <figcaption className="pjsw-ai__foot">
            <span id="software-ai-film-caption" className="pjsw-ai__caption">
              Conceptual example. Every workflow is designed around your own process and systems.
            </span>
            <button
              type="button"
              className="pjsw-ai__toggle"
              onClick={toggle}
              aria-label={playing ? "Pause the automation animation" : "Play the automation animation"}
            >
              {playing ? <Pause size={16} strokeWidth={2.2} aria-hidden="true" /> : <Play size={16} strokeWidth={2.2} aria-hidden="true" />}
            </button>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
