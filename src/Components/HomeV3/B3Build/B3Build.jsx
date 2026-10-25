import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import useOnScreen from "../../../hooks/useOnScreen.js";
import useSectionProgress from "../useSectionProgress.js";
import softwareShot from "../../../assets/Home/OurProjects/OurProjects_4.webp";
import "./B3Build.css";

/* =============================================================================
   HOME V3 — THE BUILD (scroll story)
   The chapters scroll normally; the device beside them (on top, on phones)
   stays pinned (a fixed layer, driven by useSectionProgress's data-pin) and assembles as each chapter reaches the reading line:
   sketch → design → hardware → software → product. Each chapter links to the
   real service page for that stage. The device is an illustration; the app
   on its screen is a real ProJenius project.
   ============================================================================= */

const CHAPTERS = [
  {
    id: "idea",
    code: "Idea",
    title: "It starts as a rough sketch.",
    text: "A paragraph, a drawing or a voice note is enough. We ask the right questions and turn it into a clear requirement.",
    to: "/startup",
    linkLabel: "Startup & Innovation",
  },
  {
    id: "design",
    code: "Design",
    title: "We design the system.",
    text: "Architecture, schematics and PCB layout, planned on screen before anything is made.",
    to: "/services/pcb-design-fabrication",
    linkLabel: "PCB Design & Fabrication",
  },
  {
    id: "hardware",
    code: "Hardware",
    title: "The electronics come alive.",
    text: "Embedded hardware, sensors and firmware, assembled and tested on the bench.",
    to: "/services/hardware-embedded-systems",
    linkLabel: "Hardware & Embedded Systems",
  },
  {
    id: "software",
    code: "Software",
    title: "Software gives it a purpose.",
    text: "Web and mobile apps, dashboards and AI that turn the device's data into decisions.",
    to: "/services/development",
    linkLabel: "Software Development",
  },
  {
    id: "product",
    code: "Product",
    title: "And it becomes a product.",
    text: "Enclosure design and prototyping, so it looks, feels and works like the real thing.",
    to: "/services/rapid-prototyping",
    linkLabel: "Rapid Prototyping",
  },
];

const CAPTIONS = [
  "A rough idea, with open questions",
  "Board outline, footprints and traces",
  "Assembled board, powered up",
  "On screen: AI-Based Water Quality Monitoring, a ProJenius web app",
  "Enclosed, finished and ready to use",
];

const HEADER_PINS = [0, 1, 2, 3, 4, 5];
const MCU_PINS = [0, 1, 2, 3, 4];

/* The device that assembles. Layers are revealed by the r1–r4 classes. */
function Device() {
  return (
    <svg className="b3d__svg" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="b3d-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d3352" />
          <stop offset="0.55" stopColor="#0f203a" />
          <stop offset="1" stopColor="#081426" />
        </linearGradient>
        <linearGradient id="b3d-board" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f3b3a" />
          <stop offset="1" stopColor="#082624" />
        </linearGradient>
        <clipPath id="b3d-screen-clip">
          <rect x="310" y="190" width="150" height="150" rx="8" />
        </clipPath>
        <radialGradient id="b3d-halo">
          <stop offset="0" stopColor="rgba(32, 200, 245, 0.32)" />
          <stop offset="1" stopColor="rgba(32, 200, 245, 0)" />
        </radialGradient>
      </defs>

      <circle className="b3d__halo" cx="300" cy="300" r="290" fill="url(#b3d-halo)" />

      {/* 0 · Idea: hand-drawn outline and open questions */}
      <g className="b3d__sketch">
        <path className="b3d__draw" pathLength="1" d="M132 158 C220 150 380 154 470 156 C492 158 502 172 500 196 C503 280 498 360 501 420 C500 442 486 452 462 450 C370 454 230 448 140 452 C116 450 100 438 102 414 C98 330 104 260 100 190 C101 170 112 158 132 158 Z" />
        <path className="b3d__draw" pathLength="1" d="M140 152 C240 158 360 148 476 162 C494 176 496 300 504 428 C470 458 300 444 132 458 C96 420 106 260 94 176" />
        <path className="b3d__draw" pathLength="1" d="M318 196 C360 193 420 197 462 195 C466 250 463 300 465 352 C420 355 360 351 318 354 C316 300 320 250 318 196 Z" />
        <path className="b3d__draw" pathLength="1" d="M150 400 C160 392 172 408 182 398 M200 400 C210 392 222 408 232 398" />
        <g className="b3d__questions">
          <path d="M470 196 L528 120" />
          <text x="490" y="110">screen?</text>
          <path d="M130 300 L56 250" />
          <text x="18" y="238">sensors?</text>
          <path d="M300 452 L300 520" />
          <text x="258" y="545">power?</text>
          <path d="M180 156 L130 88" />
          <text x="62" y="76">app + cloud?</text>
        </g>
      </g>

      {/* 2 · Hardware: solder-mask board (drawn under the design strokes) */}
      <rect className="b3d__board" x="110" y="160" width="380" height="280" rx="18" fill="url(#b3d-board)" />

      {/* 1 · Design: outline, footprints, traces, labels */}
      <g className="b3d__design">
        <rect className="b3d__draw" pathLength="1" x="110" y="160" width="380" height="280" rx="18" />
        <rect className="b3d__draw" pathLength="1" x="170" y="230" width="90" height="90" rx="6" />
        <rect className="b3d__draw" pathLength="1" x="170" y="350" width="60" height="40" rx="4" />
        <rect className="b3d__draw" pathLength="1" x="245" y="350" width="40" height="40" rx="4" />
        <rect className="b3d__draw" pathLength="1" x="310" y="190" width="150" height="150" rx="8" />
        <rect className="b3d__draw" pathLength="1" x="380" y="410" width="60" height="26" rx="4" />
        <g className="b3d__traces">
          <path className="b3d__draw" pathLength="1" d="M260 250 H290 V215 H310" />
          <path className="b3d__draw" pathLength="1" d="M260 275 H300 V265 H310" />
          <path className="b3d__draw" pathLength="1" d="M260 300 H286 V365 H340 V340" />
          <path className="b3d__draw" pathLength="1" d="M200 320 V350" />
          <path className="b3d__draw" pathLength="1" d="M240 320 V335 H265 V350" />
          <path className="b3d__draw" pathLength="1" d="M170 260 H134" />
          <path className="b3d__draw" pathLength="1" d="M170 290 H150 V310 H134" />
          <path className="b3d__draw" pathLength="1" d="M215 390 V420 H380" />
          <path className="b3d__draw" pathLength="1" d="M180 230 V196 H258 V206 H190 V216 H258" />
        </g>
      </g>

      <g className="b3d__labels">
        <text x="172" y="190">ANT</text>
        <text x="186" y="281">U1 · MCU</text>
        <text x="314" y="182">DISPLAY</text>
        <text x="122" y="342">J1</text>
        <text x="172" y="408">SENSORS</text>
        <text x="390" y="403">USB</text>
        <path d="M110 136 V146 M490 136 V146 M110 141 H490" />
        <path d="M514 160 H524 M514 440 H524 M519 160 V440" />
      </g>

      {/* 2 · Hardware: parts, copper, power */}
      <g className="b3d__parts">
        <rect className="b3d__chip" x="170" y="230" width="90" height="90" rx="6" />
        <g className="b3d__pins">
          {MCU_PINS.map((pin) => (
            <g key={pin}>
              <rect x={180 + pin * 16} y="222" width="6" height="8" />
              <rect x={180 + pin * 16} y="320" width="6" height="8" />
              <rect x="162" y={240 + pin * 16} width="8" height="6" />
              <rect x="260" y={240 + pin * 16} width="8" height="6" />
            </g>
          ))}
          {HEADER_PINS.map((pin) => (
            <rect key={pin} x="122" y={226 + pin * 18} width="12" height="12" rx="2" />
          ))}
          <circle cx="132" cy="182" r="8" />
          <circle cx="468" cy="182" r="8" />
          <circle cx="132" cy="418" r="8" />
          <circle cx="468" cy="418" r="8" />
        </g>
        <rect className="b3d__chip" x="170" y="350" width="60" height="40" rx="4" />
        <rect className="b3d__chip" x="245" y="350" width="40" height="40" rx="4" />
        <rect className="b3d__chip b3d__chip--port" x="380" y="410" width="60" height="26" rx="4" />
        <circle className="b3d__led" cx="340" cy="400" r="6" />
      </g>

      <g className="b3d__pulses">
        <path className="b3d__draw" pathLength="1" d="M260 250 H290 V215 H310" />
        <path className="b3d__draw" pathLength="1" d="M260 300 H286 V365 H340 V340" />
        <path className="b3d__draw" pathLength="1" d="M170 290 H150 V310 H134" />
        <path className="b3d__draw" pathLength="1" d="M215 390 V420 H380" />
      </g>

      {/* 4 · Product: the enclosure closes over the board */}
      <g className="b3d__shell">
        <ellipse cx="300" cy="500" rx="200" ry="18" className="b3d__shadow" />
        <rect x="90" y="140" width="420" height="320" rx="44" fill="url(#b3d-shell)" className="b3d__case" />
        <rect x="104" y="154" width="392" height="292" rx="34" className="b3d__bezel" />
        <rect x="300" y="180" width="170" height="170" rx="14" className="b3d__window" />
        <circle cx="150" cy="400" r="14" className="b3d__button" />
        <circle cx="194" cy="400" r="14" className="b3d__button" />
        <path d="M140 210 H250 M140 228 H250 M140 246 H250 M140 264 H220" className="b3d__vent" />
        <text x="140" y="324" className="b3d__brand">ProJenius</text>
        <circle cx="470" cy="410" r="5" className="b3d__status" />
      </g>

      {/* 3 · Software: the screen lights up (stays on top of the enclosure) */}
      <g className="b3d__screen">
        <rect x="310" y="190" width="150" height="150" rx="8" fill="#02070e" />
        <image
          href={softwareShot}
          x="310"
          y="190"
          width="150"
          height="150"
          preserveAspectRatio="xMidYMin slice"
          clipPath="url(#b3d-screen-clip)"
        />
        <rect className="b3d__scan" x="310" y="190" width="150" height="24" clipPath="url(#b3d-screen-clip)" />
      </g>

      <g className="b3d__stack">
        <g transform="translate(18 92)">
          <rect width="124" height="32" rx="16" />
          <text x="62" y="21">FIRMWARE</text>
        </g>
        <path d="M80 124 V150 L170 236" />
        <g transform="translate(462 96)">
          <rect width="118" height="32" rx="16" />
          <text x="59" y="21">WEB APP</text>
        </g>
        <path d="M520 128 L460 192" />
        <g transform="translate(440 492)">
          <rect width="138" height="32" rx="16" />
          <text x="69" y="21">DASHBOARD</text>
        </g>
        <path d="M508 492 L440 436" />
      </g>
    </svg>
  );
}

export default function B3Build() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const chapterRefs = useRef([]);
  const [stage, setStage] = useState(0);
  const isOnScreen = useOnScreen(sectionRef);
  useSectionProgress(trackRef);

  // The chapter crossing the reading line becomes the active stage.
  useEffect(() => {
    const chapters = chapterRefs.current.filter(Boolean);
    if (!chapters.length || typeof IntersectionObserver === "undefined") return undefined;
    const isPhone = window.matchMedia?.("(max-width: 900px)").matches;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setStage(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: isPhone ? "-62% 0px -37% 0px" : "-48% 0px -50% 0px" }
    );
    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  const reached = CHAPTERS.map((_, index) => (index > 0 && index <= stage ? ` r${index}` : "")).join("");

  return (
    <section ref={sectionRef} id="b3-build" className="b3b" aria-labelledby="b3b-title">
      <div className="b3-wrap b3b__intro">
        <p className="b3-label" data-reveal="up"><b>01</b> / The build</p>
        <h2 id="b3b-title" className="b3-h2" data-reveal="up" data-reveal-delay="1">
          One team takes it <span className="b3-lit">all the way.</span> <span className="b3-dim">Keep scrolling.</span>
        </h2>
      </div>

      <div ref={trackRef} className="b3b__track">
        {/* Full-width layer pinned over the chapters (see useSectionProgress). */}
        <div className="b3b__pin">
          <div className="b3-wrap b3b__pin-grid">
            <div className="b3b__stage">
              <div className={`b3d${isOnScreen ? " is-on" : ""}${reached}`} data-stage={stage}>
                <Device />
              </div>

              <div className="b3b__meter">
                <ol className="b3b__rail" aria-hidden="true">
                  {CHAPTERS.map((chapter, index) => (
                    <li key={chapter.id} className={index <= stage ? "is-done" : undefined}>
                      <span>{chapter.code}</span>
                    </li>
                  ))}
                </ol>
                <p className="b3b__caption">
                  <span>{String(stage + 1).padStart(2, "0")} / 05</span> {CAPTIONS[stage]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ol className="b3-wrap b3b__chapters">
          {CHAPTERS.map((chapter, index) => (
            <li
              key={chapter.id}
              ref={(node) => { chapterRefs.current[index] = node; }}
              data-index={index}
              className={`b3b__chapter${index === stage ? " is-active" : ""}`}
            >
              <p className="b3b__num">
                <span>{String(index + 1).padStart(2, "0")}</span> {chapter.code}
              </p>
              <h3 className="b3b__title">{chapter.title}</h3>
              <p className="b3b__text">{chapter.text}</p>
              <Link className="b3b__link" to={chapter.to}>
                {chapter.linkLabel} <ArrowUpRight size={16} strokeWidth={2.2} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <p className="b3-wrap b3b__note">The device is an illustration of a typical build. The app on its screen is a real ProJenius project.</p>
    </section>
  );
}
