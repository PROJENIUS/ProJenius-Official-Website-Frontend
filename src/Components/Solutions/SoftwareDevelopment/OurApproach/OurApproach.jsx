import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import approachVideo from "../../../../assets/Software_Solution/Our Approach/projenius-approach.mp4";
import "./OurApproach.css";

/* =============================================================================
   OUR APPROACH — heading row, the approach video, then the four things we
   understand first.
   The video is decorative motion (no sound, no essential information: the
   same steps are written below it). It plays only while on screen, loops,
   and does not autoplay for visitors who prefer reduced motion; a button
   lets anyone pause or play it.
   Previous version: backup-before-cleanup/OurApproach-before-video/
   ============================================================================= */

const BLOCKS = [
  { num: "01", title: "Business goal", question: "What are you trying to achieve?" },
  { num: "02", title: "User need", question: "Who will use the solution and what should their experience be?" },
  { num: "03", title: "Business constraints", question: "Budget, timeline, resources and existing systems." },
  { num: "04", title: "Future growth", question: "How should the solution evolve as the business grows?" },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function OurApproach() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  /* Set when the visitor presses pause, so scrolling never restarts it. */
  const userPausedRef = useRef(prefersReducedMotion());

  /* Play while on screen, pause when scrolled away. */
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
      { threshold: 0.35 }
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
    <section id="pj-development-approach" className="pjsw-appr" aria-labelledby="pj-development-approach-title">
      <div className="pjds-container">
        {/* ---------- HEADING ROW ---------- */}
        <div className="pjsw-appr__top">
          <div>
            <p className="pjds-eyebrow pjsw-appr__eyebrow" data-reveal="up">Our Approach</p>
            <h2 id="pj-development-approach-title" className="pjsw-appr__title" data-reveal="up" data-reveal-delay="1">
              We Don&apos;t Start With <TypedPhrase phrases={["Technology.", "Code.", "Tools."]} />
            </h2>
            <SectionTitleLine />
          </div>
          <div className="pjsw-appr__intro" data-reveal="up" data-reveal-delay="2">
            {/* A div, not a <p>: the site-wide light-section rule turns every <p> grey. */}
            <div className="pjsw-appr__claim">
              We Start With <span>the Problem.</span>
            </div>
            <p className="pjsw-appr__lead">
              Before choosing a platform, architecture or development approach, we understand what you are
              trying to achieve, who you are building for and what constraints matter.
            </p>
          </div>
        </div>

        {/* ---------- VIDEO ---------- */}
        <figure className="pjsw-appr__media" data-reveal="up" data-reveal-delay="2">
          <div className="pjsw-appr__frame">
            <video
              ref={videoRef}
              className="pjsw-appr__video"
              src={approachVideo}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
            <button
              type="button"
              className="pjsw-appr__toggle"
              onClick={toggle}
              aria-label={playing ? "Pause the approach animation" : "Play the approach animation"}
            >
              {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            </button>
          </div>
          <figcaption className="pjsw-appr__caption">
            Every project moves along the same path, from <strong>what you asked for</strong> to{" "}
            <strong>what you actually need</strong>.
          </figcaption>
        </figure>

        {/* ---------- WHAT WE UNDERSTAND FIRST ---------- */}
        <p className="pjsw-appr__label" data-reveal="up">What we understand first</p>
        <ol className="pjsw-appr__blocks">
          {BLOCKS.map((block, index) => (
            <li key={block.num} className="pjsw-appr__block" data-reveal="up" data-reveal-delay={String(index + 1)}>
              <span className="pjsw-appr__num">{block.num}</span>
              <span className="pjsw-appr__block-title">{block.title}</span>
              <span className="pjsw-appr__block-q">{block.question}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
