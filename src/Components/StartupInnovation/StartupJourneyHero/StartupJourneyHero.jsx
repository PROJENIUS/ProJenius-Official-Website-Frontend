import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import "./StartupJourneyHero.css";

/* =============================================================================
   STARTUP & INNOVATION HERO — "one idea, one journey" (kept short).
   Left: one heading, one line, two actions (submit an idea / incubate).
   Right: a journey line that draws itself from "Your idea" to "Complete
   product" and loops back; a packet of light travels along it.
   Reduced motion: shown at rest.
   ============================================================================= */

const MAIN_PATH =
  "M270 60C270 105 250 105 250 150C250 195 290 195 290 240C290 285 250 285 250 330C250 375 290 375 290 420C290 465 250 465 250 510C250 555 280 555 280 600";
const LOOP_PATH = "M280 600C335 645 585 650 585 400C585 150 585 60 420 60L306 60";

const NODES = [
  { x: 270, y: 60, label: "Your idea", first: true },
  { x: 250, y: 150, label: "The problem" },
  { x: 290, y: 240, label: "Connections" },
  { x: 250, y: 330, label: "Field visits" },
  { x: 290, y: 420, label: "Prototype" },
  { x: 250, y: 510, label: "PCB & software" },
  { x: 280, y: 600, label: "Complete product" },
];

function scrollToHash(event, href) {
  const target = document.getElementById(href.slice(1));
  if (!target) return;
  event.preventDefault();
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export default function StartupJourneyHero() {
  return (
    <section className="pjsu-hero" aria-labelledby="pjsu-hero-title">
      <div className="pjds-container pjsu-hero__grid">
        <div className="pjsu-hero__copy">
          <span className="pjsu-hero__eyebrow">Startup &amp; Innovation</span>
          <h1 id="pjsu-hero-title" className="pjsu-hero__title">
            From an Idea to a{" "}
            <span className="pjsu-hero__title-accent">
              <TypedPhrase phrases={["Complete Product.", "Working Product."]} tone="dark" />
            </span>
          </h1>
          <p className="pjsu-hero__lead">
            Just an idea? We take it from the problem to one complete product, with a team beside you.
          </p>
          <div className="pjsu-hero__actions">
            <a className="pjsu-hero__btn pjsu-hero__btn--primary" href="#submit-idea" onClick={(e) => scrollToHash(e, "#submit-idea")}>
              Submit Your Idea
              <svg className="pjsu-hero__btn-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
            <a
              className="pjsu-hero__btn pjsu-hero__btn--ghost pjsu-hero__btn--down"
              href="#startup-incubate"
              onClick={(e) => scrollToHash(e, "#startup-incubate")}
            >
              Incubate at ProJenius
              <svg className="pjsu-hero__btn-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          </div>
        </div>

        <div className="pjsu-hero__visual">
          <svg className="pjsu-hero__svg" viewBox="0 0 620 680" role="img" aria-labelledby="pjsu-hero-svg-title">
            <title id="pjsu-hero-svg-title">
              The startup journey: your idea, the problem, connections, field visits, prototype, PCB and software, then a
              complete product
            </title>
            <defs>
              <linearGradient id="pjsu-hero-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2f6bff" />
                <stop offset="1" stopColor="#20c8f5" />
              </linearGradient>
            </defs>

            <path className="pjsu-hero__loop" pathLength="1" d={LOOP_PATH} stroke="url(#pjsu-hero-grad)" />
            <polygon className="pjsu-hero__loop-arrow" points="298,60 311,53 311,67" />
            <path id="pjsu-hero-path" className="pjsu-hero__path" pathLength="1" d={MAIN_PATH} stroke="url(#pjsu-hero-grad)" />

            {NODES.map((n, i) => (
              <g key={n.label} className={`pjsu-hero__node pjsu-hero__node--${i + 1}`}>
                {n.first ? (
                  <>
                    <circle className="pjsu-hero__pulse" cx={n.x} cy={n.y} r="14" />
                    <circle className="pjsu-hero__pulse pjsu-hero__pulse--b" cx={n.x} cy={n.y} r="14" />
                  </>
                ) : null}
                <circle className="pjsu-hero__ring" cx={n.x} cy={n.y} r={n.first ? 16 : 11} stroke="url(#pjsu-hero-grad)" />
                <circle cx={n.x} cy={n.y} r={n.first ? 8 : 4.5} fill="url(#pjsu-hero-grad)" />
                <text
                  className={`pjsu-hero__label${n.first ? " pjsu-hero__label--first" : ""}${i === NODES.length - 1 ? " pjsu-hero__label--last" : ""}`}
                  x={n.first ? n.x - 28 : n.x + 24}
                  y={n.y}
                  textAnchor={n.first ? "end" : "start"}
                  dominantBaseline="central"
                >
                  {n.label}
                </text>
              </g>
            ))}

            <circle className="pjsu-hero__packet" r="5" opacity="0">
              <set attributeName="opacity" to="1" begin="3.8s" />
              <animateMotion dur="7s" begin="3.8s" repeatCount="indefinite">
                <mpath href="#pjsu-hero-path" />
              </animateMotion>
            </circle>
          </svg>
        </div>
      </div>
    </section>
  );
}
