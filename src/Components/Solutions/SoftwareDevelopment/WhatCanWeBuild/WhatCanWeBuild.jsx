import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./WhatCanWeBuild.css";

const CONTACT_HREF = "/contact?type=development&from=software-development";
const P = "pj-development-build";

/* =========================================================
   WHAT CAN WE BUILD — HELPERS
========================================================= */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -4% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* =========================================================
   WHAT CAN WE BUILD — ICONS (inline, 24x24)
========================================================= */
const ICONS = {
  web: (<><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18M8 14h5" /></>),
  mobile: (<><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></>),
  design: (<><path d="M4 20l4-1 11-11a2.1 2.1 0 00-3-3L5 16l-1 4z" /><path d="M14 7l3 3" /></>),
  ai: (<><rect x="6" y="6" width="12" height="12" rx="3" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4M10 12h4" /></>),
  auto: (<><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="12" r="2.5" /><circle cx="6" cy="18" r="2.5" /><path d="M8.5 6h4a3 3 0 013 3v.5M8.5 18h4a3 3 0 003-3v-.5" /></>),
  saas: (<><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 12.5l9 5 9-5M3 17l9 5 9-5" /></>),
};

function Icon({ name }) {
  return (
    <svg className={`${P}-icon-svg`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {ICONS[name]}
    </svg>
  );
}

/* =========================================================
   WHAT CAN WE BUILD — ILLUSTRATIONS
========================================================= */
function Grad({ id }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0478a8" />
        <stop offset="100%" stopColor="#20c8f5" />
      </linearGradient>
    </defs>
  );
}

function VisWeb() {
  return (
    <svg viewBox="0 0 300 150" className={`${P}-illustration`} aria-hidden="true" focusable="false">
      <Grad id="pj-development-build-web-grad" />
      <g className={`${P}-up`}>
        <rect className={`${P}-vf`} x="1" y="1" width="298" height="190" rx="14" />
        <path className={`${P}-vl`} d="M1 28h298" />
        <circle className={`${P}-vd`} cx="15" cy="14.5" r="3.5" />
        <circle className={`${P}-vd`} cx="27" cy="14.5" r="3.5" />
        <circle className={`${P}-vd`} cx="39" cy="14.5" r="3.5" />
        <rect className={`${P}-vb`} x="64" y="9" width="130" height="11" rx="5.5" />
        <rect className={`${P}-vb`} x="20" y="46" width="130" height="12" rx="4" />
        <rect className={`${P}-vb`} x="20" y="66" width="98" height="12" rx="4" />
        <rect className={`${P}-va`} x="20" y="92" width="64" height="20" rx="10" />
        <rect x="180" y="42" width="102" height="72" rx="10" fill="url(#pj-development-build-web-grad)" />
        <rect className={`${P}-vf`} x="20" y="128" width="78" height="40" rx="8" />
        <rect className={`${P}-vf`} x="108" y="128" width="78" height="40" rx="8" />
        <rect className={`${P}-vf`} x="196" y="128" width="86" height="40" rx="8" />
      </g>
    </svg>
  );
}

function VisMobile() {
  return (
    <svg viewBox="0 0 300 150" className={`${P}-illustration`} aria-hidden="true" focusable="false">
      <Grad id="pj-development-build-mobile-grad" />
      <g className={`${P}-up`}>
        <rect className={`${P}-vf`} x="46" y="14" width="100" height="200" rx="20" />
        <rect className={`${P}-vd`} x="83" y="22" width="26" height="5" rx="2.5" />
        <rect x="59" y="40" width="74" height="44" rx="10" fill="url(#pj-development-build-mobile-grad)" />
        <rect className={`${P}-vb`} x="59" y="94" width="50" height="8" rx="4" />
        <rect className={`${P}-vb`} x="59" y="108" width="74" height="8" rx="4" />
        <rect className={`${P}-vf`} x="59" y="126" width="34" height="34" rx="9" />
        <rect className={`${P}-vf`} x="99" y="126" width="34" height="34" rx="9" />
      </g>
      <g className={`${P}-shift`}>
        <rect className={`${P}-vf`} x="164" y="34" width="100" height="200" rx="20" />
        <rect className={`${P}-vd`} x="201" y="42" width="26" height="5" rx="2.5" />
        <rect className={`${P}-vb`} x="177" y="62" width="74" height="10" rx="5" />
        <rect x="177" y="82" width="74" height="30" rx="10" fill="url(#pj-development-build-mobile-grad)" />
        <rect className={`${P}-vb`} x="177" y="124" width="50" height="8" rx="4" />
      </g>
    </svg>
  );
}

function VisUiux() {
  return (
    <svg viewBox="0 0 300 120" className={`${P}-illustration`} aria-hidden="true" focusable="false">
      <Grad id="pj-development-build-uiux-grad" />
      <g className={`${P}-shift`}>
        <rect className={`${P}-vdash`} x="10" y="8" width="112" height="104" rx="10" />
        <rect className={`${P}-vdash`} x="22" y="22" width="88" height="14" rx="4" />
        <rect className={`${P}-vdash`} x="22" y="46" width="40" height="40" rx="6" />
        <rect className={`${P}-vdash`} x="70" y="46" width="40" height="18" rx="4" />
        <rect className={`${P}-vdash`} x="70" y="68" width="40" height="18" rx="4" />
      </g>
      <path className={`${P}-vt`} d="M138 60h26M156 52l8 8-8 8" />
      <rect className={`${P}-vf`} x="178" y="8" width="112" height="104" rx="10" />
      <rect className={`${P}-va`} x="190" y="22" width="88" height="14" rx="4" />
      <rect x="190" y="46" width="40" height="40" rx="6" fill="url(#pj-development-build-uiux-grad)" />
      <rect className={`${P}-vb`} x="238" y="46" width="40" height="18" rx="4" />
      <rect className={`${P}-vb`} x="238" y="68" width="40" height="18" rx="4" />
      <circle className={`${P}-vnf`} cx="190" cy="22" r="3.5" />
      <circle className={`${P}-vnf`} cx="278" cy="22" r="3.5" />
      <circle className={`${P}-vnf`} cx="278" cy="86" r="3.5" />
    </svg>
  );
}

function VisAi() {
  return (
    <svg viewBox="0 0 400 120" className={`${P}-illustration`} aria-hidden="true" focusable="false">
      <g className={`${P}-vl`}>
        <path d="M60 20L170 15M60 20L170 45M60 45L170 45M60 45L170 75M60 70L170 75M60 70L170 105M60 95L170 105M60 95L170 45" />
        <path d="M170 15L300 40M170 45L300 40M170 45L300 80M170 75L300 40M170 75L300 80M170 105L300 80" />
      </g>
      <path className={`${P}-vt`} d="M60 45L170 75L300 40" />
      <g className={`${P}-vn`}>
        <circle cx="60" cy="20" r="6" />
        <circle className={`${P}-vnf`} cx="60" cy="45" r="6" />
        <circle cx="60" cy="70" r="6" />
        <circle cx="60" cy="95" r="6" />
        <circle cx="170" cy="15" r="6" />
        <circle cx="170" cy="45" r="6" />
        <circle className={`${P}-vnf`} cx="170" cy="75" r="6" />
        <circle cx="170" cy="105" r="6" />
        <circle className={`${P}-vnf`} cx="300" cy="40" r="7" />
        <circle cx="300" cy="80" r="7" />
      </g>
      <text className={`${P}-vtx`} x="325" y="44">Insight</text>
    </svg>
  );
}

function VisAuto() {
  return (
    <svg viewBox="0 0 300 100" className={`${P}-illustration`} aria-hidden="true" focusable="false">
      <Grad id="pj-development-build-auto-grad" />
      <g className={`${P}-shift`}>
        <rect className={`${P}-vf`} x="4" y="30" width="72" height="40" rx="10" />
        <rect className={`${P}-va`} x="16" y="46" width="30" height="8" rx="4" />
        <path className={`${P}-vt`} d="M80 50h32M104 44l8 6-8 6" />
        <rect className={`${P}-vf`} x="114" y="30" width="72" height="40" rx="10" />
        <rect className={`${P}-vb`} x="126" y="46" width="42" height="8" rx="4" />
        <path className={`${P}-vt`} d="M190 50h32M214 44l8 6-8 6" />
        <rect x="224" y="30" width="72" height="40" rx="10" fill="url(#pj-development-build-auto-grad)" />
        <rect x="236" y="46" width="30" height="8" rx="4" fill="#ffffff" opacity="0.86" />
      </g>
    </svg>
  );
}

function VisSaas() {
  return (
    <svg viewBox="0 0 460 230" className={`${P}-illustration`} aria-hidden="true" focusable="false">
      <Grad id="pj-development-build-saas-grad" />
      <g className={`${P}-up`}>
        <rect className={`${P}-vf`} x="1" y="1" width="458" height="260" rx="16" />
        <path className={`${P}-vl`} d="M96 1v260" />
        <rect x="16" y="16" width="22" height="22" rx="7" fill="url(#pj-development-build-saas-grad)" />
        <rect className={`${P}-va`} x="12" y="52" width="72" height="22" rx="7" opacity="0.28" />
        <rect className={`${P}-vb`} x="22" y="59" width="50" height="8" rx="4" />
        <rect className={`${P}-vb`} x="22" y="88" width="42" height="8" rx="4" />
        <rect className={`${P}-vb`} x="22" y="110" width="56" height="8" rx="4" />
        <rect className={`${P}-vb`} x="22" y="132" width="38" height="8" rx="4" />
        <rect className={`${P}-vb`} x="112" y="18" width="120" height="12" rx="6" />
        <circle className={`${P}-vd`} cx="432" cy="24" r="10" />
        <rect className={`${P}-vf`} x="112" y="46" width="108" height="54" rx="10" />
        <rect className={`${P}-vf`} x="230" y="46" width="108" height="54" rx="10" />
        <rect className={`${P}-vf`} x="348" y="46" width="98" height="54" rx="10" />
        <rect className={`${P}-vb`} x="124" y="58" width="42" height="7" rx="3.5" />
        <rect x="124" y="74" width="64" height="12" rx="6" fill="url(#pj-development-build-saas-grad)" />
        <rect className={`${P}-vb`} x="242" y="58" width="42" height="7" rx="3.5" />
        <rect x="242" y="74" width="52" height="12" rx="6" fill="url(#pj-development-build-saas-grad)" />
        <rect className={`${P}-vb`} x="360" y="58" width="42" height="7" rx="3.5" />
        <rect x="360" y="74" width="58" height="12" rx="6" fill="url(#pj-development-build-saas-grad)" />
        <rect className={`${P}-vf`} x="112" y="112" width="226" height="130" rx="10" />
        <path d="M124 214L160 194L196 200L232 168L268 176L304 144L326 128V232H124Z" fill="rgba(61,217,238,.12)" />
        <path className={`${P}-vt`} d="M124 214L160 194L196 200L232 168L268 176L304 144L326 128" />
        <circle cx="326" cy="128" r="4" fill="#20c8f5" />
        <rect className={`${P}-vf`} x="348" y="112" width="98" height="130" rx="10" />
        <rect className={`${P}-va`} x="360" y="196" width="14" height="32" rx="3" />
        <rect x="380" y="170" width="14" height="58" rx="3" fill="url(#pj-development-build-saas-grad)" />
        <rect className={`${P}-va`} x="400" y="184" width="14" height="44" rx="3" />
        <rect x="420" y="148" width="14" height="80" rx="3" fill="url(#pj-development-build-saas-grad)" />
      </g>
    </svg>
  );
}

/* =========================================================
   WHAT CAN WE BUILD — DATA
========================================================= */
const CAPS = [
  {
    key: "web", icon: "web", title: "Websites & Web Applications",
    desc: "Digital experiences designed around your users, business goals and growth requirements.",
    items: ["Business Websites", "Corporate Websites", "Landing Pages", "Portals", "E-commerce", "Web Applications", "Custom Web Solutions", "Website Revamps"],
    Vis: VisWeb,
  },
  {
    key: "mobile", icon: "mobile", title: "Mobile Applications",
    desc: "Mobile experiences designed to solve real user and business needs.",
    items: ["Customer Applications", "Business Applications", "Service Applications", "Connected Applications", "Dashboard Applications", "App Enhancements"],
    Vis: VisMobile,
  },
  {
    key: "uiux", icon: "design", title: "UI/UX & Product Design",
    desc: "Design the experience before building the product.",
    items: ["User Research", "User Flows", "Wireframes", "Interactive Prototypes", "Interface Design", "Design Systems", "Experience Improvement"],
    Vis: VisUiux,
  },
  {
    key: "ai", icon: "ai", title: "AI / ML & Intelligent Solutions",
    desc: "Use intelligent technology where it creates meaningful value.",
    items: ["AI-powered Applications", "Machine Learning Solutions", "Computer Vision", "Intelligent Features", "Predictive Solutions", "AI Integration"],
    Vis: VisAi,
  },
  {
    key: "auto", icon: "auto", title: "Automation & Business Solutions",
    desc: "Turn repetitive processes into connected digital workflows.",
    items: ["Workflow Automation", "Business Process Automation", "Data Automation", "Custom Dashboards", "Reporting Systems", "Digital Process Optimization"],
    Vis: VisAuto,
  },
  {
    key: "saas", icon: "saas", title: "SaaS & Digital Platforms",
    desc: "Build scalable digital products that can evolve with your business.",
    items: ["Custom SaaS Platforms", "Subscription-based Products", "Business Platforms", "Internal Tools", "Admin Systems", "Customer Portals", "Multi-user Platforms"],
    Vis: VisSaas,
  },
];

/* =========================================================
   WHAT CAN WE BUILD — CARD
========================================================= */
function CapabilityCard({ cap, delayed }) {
  const [open, setOpen] = useState(false);
  const [ref, inView] = useInView(0.12);
  const panelId = `${P}-panel-${cap.key}`;

  const classes = [
    `${P}-card`,
    `${P}-card--${cap.key}`,
    delayed ? `${P}-card--d1` : "",
    inView ? `${P}-card--in` : "",
    open ? `${P}-card--open` : "",
  ].filter(Boolean).join(" ");

  return (
    <article ref={ref} className={classes}>
      <div className={`${P}-body`}>
        <span className={`${P}-icon`}><Icon name={cap.icon} /></span>
        <h3 className={`${P}-title`}>{cap.title}</h3>
        <p className={`${P}-desc`}>{cap.desc}</p>

        {/* Expandable content (hidden from keyboard until opened) */}
        <div className={`${P}-more`} id={panelId}>
          <div className={`${P}-more-inner`}>
            <ul className={`${P}-tags`}>
              {cap.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <Link className={`${P}-link`} to={CONTACT_HREF}>Discuss this requirement</Link>
          </div>
        </div>

        <button type="button" className={`${P}-btn`} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
          <span>Explore</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </div>

      <div className={`${P}-vis`} aria-hidden="true"><cap.Vis /></div>
    </article>
  );
}

/* =========================================================
   WHAT CAN WE BUILD — COMPONENT
========================================================= */
export default function WhatCanWeBuild() {
  const [headRef, headIn] = useInView(0.2);

  return (
    <section id="pj-development-build" className={P} aria-labelledby="pj-development-build-heading">
      <div className={`${P}-wrap`}>
        {/* ---------- HEADING ---------- */}
        <div ref={headRef} className={`${P}-head${headIn ? ` ${P}-head--in` : ""}`}>
          <h2 id="pj-development-build-heading" className={`${P}-head-title`}>What Can We Build?</h2>
          <p className={`${P}-head-text`}>
            From digital presence to intelligent applications and scalable platforms, our development capabilities adapt to your requirement.
          </p>
        </div>

        {/* ---------- BENTO GRID ---------- */}
        <div className={`${P}-bento`}>
          {CAPS.map((cap, index) => (
            <CapabilityCard key={cap.key} cap={cap} delayed={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
