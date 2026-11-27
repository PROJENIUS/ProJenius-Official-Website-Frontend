import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, CalendarCheck, Check, Clock, FileText, MessageCircle, Pause, Play,
  RotateCcw, UserRound,
} from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import usePageHero from "../../../../pageHeroes/usePageHero.js";
import { HERO_DEFAULTS } from "../../../../pageHeroes/heroDefaults.js";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { whatsappHref } from "../../../../utils/whatsapp.js";
import storyVideo from "../../../../assets/Learning/Carrer Guidance/ProJenius-Career-Guidance.mp4";
import storyPoster from "../../../../assets/Learning/Carrer Guidance/ProJenius-Career-Guidance-poster.webp";
import "./CareerGuidanceHero.css";

/* =========================================================
   CAREER GUIDANCE HERO — navy, our hero pattern (pill, heading
   with cyan typing, blue line, cyan CTA). Right: an 18-second
   story of what the mentor call does:
     01 Feeling stuck   too many questions, no clear path
     02 Book the call   pick a day and time, booked
     03 Profile review  the mentor reads your resume, finds the gap
     04 Your roadmap    Profile → Goal → Skill gap → Roadmap →
                        Resume → Placement light up in turn
     05 ProJenius       logo + the offer

   The story plays as the video in
   src/assets/Learning/Carrer Guidance/ProJenius-Career-Guidance.mp4
   (muted, looping). If the video cannot load, the same story runs
   as the CSS motion version below. Either way it plays only while
   on screen, has a pause button, and with reduced motion shows the
   closing frame at rest. Screen readers get the story as a list.
========================================================= */

const QUESTIONS = [
  "Which skill should I learn first?",
  "Is my resume good enough?",
  "Web, data or embedded?",
  "Where do I even start?",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const SLOTS = ["10:00 AM", "4:30 PM", "7:00 PM"];


/* Milestones on the winding road (SVG units, viewBox 0 0 400 150) */
const MILES = [
  { x: 24, y: 128, label: "Profile", up: true },
  { x: 92, y: 96, label: "Goal", up: true },
  { x: 160, y: 114, label: "Skill gap", up: false },
  { x: 228, y: 70, label: "Roadmap", up: true },
  { x: 296, y: 84, label: "Resume", up: false },
  { x: 370, y: 32, label: "Placement", up: false },
];

const NEXT = ["Learn", "Build", "Apply"];

const STORY = [
  "Feeling stuck: which skill to learn, whether your resume is good enough, which field to choose, and where to start.",
  "Book a 30-minute one-to-one mentor call online at a time that suits you.",
  "Your mentor reviews your resume or profile and shows you your biggest gap.",
  "You leave with a first-draft roadmap: profile, goal, skill gap, roadmap, resume, placement, and clear next steps.",
  "ProJenius: build your tech career with a clear roadmap.",
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scrollToBooking = (event) => {
  const target = document.getElementById("book-call");
  if (!target) return;
  event.preventDefault();
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};

/* ProJenius mark (white circle, navy P, sky-blue J) as SVG so its strokes can draw. */
function ProJeniusMark({ className = "" }) {
  return (
    <svg className={`pjcgh__mark ${className}`} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="46" fill="#ffffff" />
      <g fill="none" strokeWidth="9" strokeLinejoin="miter" strokeLinecap="butt">
        <path className="pjcgh__mark-p" d="M24 80 V31 L34 21 H58 L64 27 V42 L50 56" stroke="#012A79" pathLength="1" />
        <path className="pjcgh__mark-j" d="M40 52 V76 L48 84 H56 L76 72 V30" stroke="#00AEEF" pathLength="1" />
      </g>
    </svg>
  );
}

/* Plays once seen; pauses (does not reset) when scrolled away. */
function useOnScreenOnce() {
  const ref = useRef(null);
  const [state, setState] = useState({ seen: false, visible: false });
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver !== "function") {
      setState({ seen: true, visible: true });
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => setState((s) => ({ seen: s.seen || entry.isIntersecting, visible: entry.isIntersecting })),
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, state];
}

/* The CSS version of the story (used only if the video cannot load). */
function MotionStory() {
  return (
    <div className="pjcgh__screen" aria-hidden="true">
      <div className="pjcgh__topbar">
        <ProJeniusMark className="pjcgh__mark--small" />
        <span className="pjcgh__word pjcgh__word--small">Pro<span>Jenius</span></span>
        <span className="pjcgh__sep" />
        <span>Career guidance</span>
      </div>

      <div className="pjcgh__body">
        {/* 01 — Feeling stuck */}
        <div className="pjcgh__scene pjcgh__scene--1">
          <p className="pjcgh__kicker pjcgh__kicker--warn">01 · Feeling stuck?</p>
          <p className="pjcgh__headline">Too many paths, no clear one</p>
          <div className="pjcgh__qs">
            {QUESTIONS.map((q, i) => (
              <span key={q} className={`pjcgh__q pjcgh__q--${i % 2 ? "r" : "l"} pjcgh__in`} style={{ "--o": `${0.2 + i * 0.4}s` }}>
                {q}
              </span>
            ))}
          </div>
          <p className="pjcgh__line pjcgh__in" style={{ "--o": "1.9s" }}>Every video says something different.</p>
        </div>

        {/* 02 — Book the call */}
        <div className="pjcgh__scene pjcgh__scene--2">
          <p className="pjcgh__kicker">02 · Talk to a mentor</p>
          <p className="pjcgh__headline">Book a 30-minute 1:1 call</p>
          <div className="pjcgh__book">
            <div className="pjcgh__book-head">
              <span className="pjcgh__avatar"><UserRound size={18} /></span>
              <span><b>1:1 Mentor Call</b><small>30 minutes · Online</small></span>
              <span className="pjcgh__price"><span className="pjcgh__price-tag"><i aria-hidden="true" />Live call</span></span>
            </div>
            <div className="pjcgh__chips">
              {DAYS.map((d) => (
                <span key={d} className={`pjcgh__chip${d === "Thu" ? " pjcgh__chip--pick" : ""}`} style={d === "Thu" ? { "--o": "0.5s" } : undefined}>{d}</span>
              ))}
            </div>
            <div className="pjcgh__chips">
              {SLOTS.map((t) => (
                <span key={t} className={`pjcgh__chip${t === "7:00 PM" ? " pjcgh__chip--pick" : ""}`} style={t === "7:00 PM" ? { "--o": "1.0s" } : undefined}>{t}</span>
              ))}
            </div>
            <span className="pjcgh__book-btn">Book my call</span>
          </div>
          <span className="pjcgh__toast pjcgh__in" style={{ "--o": "1.9s" }}>
            <CalendarCheck size={15} strokeWidth={2.2} /> Booked · Thu, 7:00 PM
          </span>
        </div>

        {/* 03 — Profile review */}
        <div className="pjcgh__scene pjcgh__scene--3">
          <p className="pjcgh__kicker">03 · Your profile, reviewed</p>
          <p className="pjcgh__headline">Find your biggest gap</p>
          <div className="pjcgh__review">
            <div className="pjcgh__doc">
              <span className="pjcgh__scan" />
              <span className="pjcgh__doc-title"><FileText size={14} strokeWidth={2} /> resume.pdf</span>
              <i style={{ width: "60%" }} /><i style={{ width: "85%" }} /><i style={{ width: "72%" }} />
              <i style={{ width: "40%" }} /><i style={{ width: "78%" }} /><i style={{ width: "55%" }} />
            </div>
            <div className="pjcgh__notes">
              <span className="pjcgh__note pjcgh__in" style={{ "--o": "1.0s" }}><b>Strong</b> Your projects</span>
              <span className="pjcgh__note pjcgh__note--gap pjcgh__in" style={{ "--o": "1.5s" }}><b>Gap</b> Interview practice</span>
              <span className="pjcgh__note pjcgh__in" style={{ "--o": "2.0s" }}><b>Fix</b> Add GitHub links</span>
            </div>
          </div>
          <p className="pjcgh__line pjcgh__in" style={{ "--o": "2.4s" }}>Your mentor shows you what to fix first.</p>
        </div>

        {/* 04 — Roadmap */}
        <div className="pjcgh__scene pjcgh__scene--4">
          <p className="pjcgh__kicker">04 · Your roadmap</p>
          <p className="pjcgh__headline">Your road to placement</p>
          <svg className="pjcgh__map" viewBox="0 0 400 150">
            <path className="pjcgh__map-road" d="M24 128 C35.3 122.7 69.3 98.3 92 96 C114.7 93.7 137.3 118.3 160 114 C182.7 109.7 205.3 75.0 228 70 C250.7 65.0 272.3 90.3 296 84 C319.7 77.7 357.7 40.7 370 32" />
            <path className="pjcgh__map-lane" d="M24 128 C35.3 122.7 69.3 98.3 92 96 C114.7 93.7 137.3 118.3 160 114 C182.7 109.7 205.3 75.0 228 70 C250.7 65.0 272.3 90.3 296 84 C319.7 77.7 357.7 40.7 370 32" />
            <path className="pjcgh__map-glow" d="M24 128 C35.3 122.7 69.3 98.3 92 96 C114.7 93.7 137.3 118.3 160 114 C182.7 109.7 205.3 75.0 228 70 C250.7 65.0 272.3 90.3 296 84 C319.7 77.7 357.7 40.7 370 32" pathLength="1" />
            {MILES.map(({ x, y, label, up }, i) => {
              const last = i === MILES.length - 1;
              return (
                <g key={label} className={`pjcgh__mile${last ? " pjcgh__mile--goal" : ""}`} style={{ "--o": `${0.2 + i * 0.32}s` }}>
                  {last && <circle className="pjcgh__mile-halo" cx={x} cy={y} r="16" />}
                  <circle className="pjcgh__mile-dot" cx={x} cy={y} r={last ? 8 : 6.5} />
                  {last && <path className="pjcgh__flag" d={`M${x} ${y - 8} V${y - 34} L${x + 20} ${y - 27} L${x} ${y - 20}`} />}
                  <text x={last ? x - 14 : x} y={up ? y - 16 : y + 24} textAnchor={last ? "end" : "middle"} className="pjcgh__mile-label">{label}</text>
                </g>
              );
            })}
          </svg>
          <div className="pjcgh__nextline pjcgh__in" style={{ "--o": "2.3s" }}>
            <span className="pjcgh__nextline-label">Next</span>
            {NEXT.map((n, i) => (
              <span key={n} className="pjcgh__nextchip">
                {i > 0 && <i aria-hidden="true">→</i>}
                <span className="pjcgh__tick"><Check size={11} strokeWidth={3} /></span>{n}
              </span>
            ))}
          </div>
        </div>

        {/* 05 — ProJenius */}
        <div className="pjcgh__scene pjcgh__scene--5">
          <div className="pjcgh__brand">
            <ProJeniusMark className="pjcgh__mark--big pjcgh__in pjcgh__in--zoom" />
            <span className="pjcgh__word pjcgh__word--big pjcgh__in">Pro<span>Jenius</span></span>
          </div>
          <p className="pjcgh__end pjcgh__in" style={{ "--o": "1.0s" }}>
            Build your tech career <span>with a clear roadmap.</span>
          </p>
          <div className="pjcgh__offer pjcgh__in" style={{ "--o": "1.4s" }}>
            <span>30-min 1:1</span><i>·</i><span>Online</span><i>·</i><span>Personal roadmap</span>
          </div>
        </div>
      </div>

      <div className="pjcgh__progress">
        <div className="pjcgh__track"><span className="pjcgh__fill" /></div>
        <ol className="pjcgh__chapters">
          {["Stuck", "Book", "Review", "Roadmap", "ProJenius"].map((c) => <li key={c}>{c}</li>)}
        </ol>
      </div>
    </div>
  );
}

export default function CareerGuidanceHero() {
  const [filmRef, { seen, visible }] = useOnScreenOnce();
  const [paused, setPaused] = useState(false);
  const [videoOk, setVideoOk] = useState(true);
  const videoRef = useRef(null);
  const reduce = prefersReducedMotion();

  /* The video plays only while the hero is on screen and not paused. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoOk) return;
    if (visible && !paused && !reduce) {
      const playing = video.play();
      if (playing && typeof playing.catch === "function") playing.catch(() => {});
    } else {
      video.pause();
    }
  }, [visible, paused, reduce, videoOk]);

  const filmClass = [
    "pjcgh__film",
    videoOk && "has-video",
    seen && "is-live",
    (paused || !visible) && "is-paused",
  ].filter(Boolean).join(" ");

  const hero = usePageHero("career-guidance", HERO_DEFAULTS["career-guidance"]);
  const FACT_ICONS = [Clock, RotateCcw, UserRound];

  return (
    <section className="pjcgh" aria-labelledby="cghero-title">
      <div className="pjds-container pjcgh__grid">
        <div className="pjcgh__copy">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">{hero.eyebrow}</p>
          <h1 id="cghero-title" className="pjcgh__title" data-reveal="up" data-reveal-delay="1">
            {hero.title}{" "}
            <TypedPhrase tone="dark" phrases={hero.phrases} />
          </h1>
          <SectionTitleLine />
          <p className="pjcgh__lead" data-reveal="up" data-reveal-delay="2">
            {hero.lead}
          </p>
          <div className="pjcgh__actions" data-reveal="up" data-reveal-delay="3">
            <a className="pjcgh__btn pjcgh__btn--primary" href="#book-call" onClick={scrollToBooking}>
              {hero.primaryLabel} <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              className="pjcgh__btn pjcgh__btn--ghost"
              href={whatsappHref("Hi ProJenius, I have a question about career guidance.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" /> Ask on WhatsApp
              <span className="pjds-sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <ul className="pjcgh__facts" data-reveal="up" data-reveal-delay="3">
            {hero.facts.map((fact, index) => {
              const Icon = FACT_ICONS[index] || Clock;
              return <li key={index}><Icon size={16} aria-hidden="true" /> {fact}</li>;
            })}
          </ul>
        </div>

        {/* ---------- Story: video, or the CSS motion version ---------- */}
        <figure ref={filmRef} className={filmClass} aria-labelledby="cghero-film-caption" data-reveal="up" data-reveal-delay="2">
          <div className="pjcgh__stage">
            {videoOk ? (
              <video
                ref={videoRef}
                className="pjcgh__video"
                src={storyVideo}
                poster={storyPoster}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
                tabIndex={-1}
                onError={() => setVideoOk(false)}
              />
            ) : (
              <MotionStory />
            )}

            {!reduce && (
              <button
                type="button"
                className="pjcgh__toggle"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Play the animation" : "Pause the animation"}
              >
                {paused ? <Play size={16} strokeWidth={2.2} aria-hidden="true" /> : <Pause size={16} strokeWidth={2.2} aria-hidden="true" />}
              </button>
            )}
          </div>

          <ol className="pjds-sr-only">
            {STORY.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <figcaption id="cghero-film-caption" className="pjcgh__caption">
            One call. A clear roadmap. <span>Your next step starts here.</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
