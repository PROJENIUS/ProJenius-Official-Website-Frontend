import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import "./WhatWeBuild.css";
import { whatsappHref } from "../../../../utils/whatsapp.js";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

const P = "pj-development-build";
const contactHref = (slug) => `/contact?type=development&from=services-${slug}`;
const VISIBLE_TAGS = 3;

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

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

/* Pointer-follow spotlight + subtle 3D tilt (fine pointers only) */
function usePointerFx(disabled) {
  const ref = useRef(null);
  const frame = useRef(0);
  const onPointerMove = (e) => {
    if (disabled || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--rx", `${((0.5 - y) * 4).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((x - 0.5) * 5).toFixed(2)}deg`);
    });
  };
  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  return { ref, onPointerMove, onPointerLeave };
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

function Arrow({ className = `${P}-arrow` }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* =========================================================
   WHAT CAN WE BUILD — ILLUSTRATIONS
   Small live product scenes. CSS motion starts when the card
   is in view; SMIL motion is skipped for reduced motion.
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

function Cursor({ x, y, className }) {
  return (
    <g className={className}>
      <g transform={`translate(${x} ${y})`}>
        <path className={`${P}-vcur`} d="M0 0l0 16 4.5-4 3.2 7 2.6-1.2-3.1-6.8 6-.4z" />
      </g>
    </g>
  );
}

function VisWeb() {
  return (
    <svg viewBox="0 0 300 170" className={`${P}-illustration`} aria-hidden="true" focusable="false">
      <Grad id="pj-development-build-web-grad" />
      <g className={`${P}-up`}>
        <rect className={`${P}-vf`} x="1" y="1" width="298" height="210" rx="14" />
        <path className={`${P}-vl`} d="M1 28h298" />
        <circle className={`${P}-vd`} cx="15" cy="14.5" r="3.5" />
        <circle className={`${P}-vd`} cx="27" cy="14.5" r="3.5" />
        <circle className={`${P}-vd`} cx="39" cy="14.5" r="3.5" />
        <rect className={`${P}-vurl`} x="64" y="7" width="150" height="15" rx="7.5" />
        <text className={`${P}-vtx ${P}-vtx--sm`} x="76" y="17.5">yourbusiness.com</text>
        <g className={`${P}-vtx ${P}-vtx--nav`}>
          <text x="20" y="44">Home</text><text x="52" y="44">Services</text><text x="94" y="44">Work</text><text x="122" y="44">Contact</text>
        </g>
        <rect className={`${P}-vb ${P}-a-build`} x="20" y="58" width="134" height="12" rx="4" />
        <rect className={`${P}-vb ${P}-a-build ${P}-a-d1`} x="20" y="76" width="100" height="12" rx="4" />
        <rect className={`${P}-vb2 ${P}-a-build ${P}-a-d1`} x="20" y="96" width="120" height="6" rx="3" />
        <rect className={`${P}-va ${P}-a-build ${P}-a-d2 ${P}-a-click`} x="20" y="112" width="64" height="20" rx="10" />
        <rect className={`${P}-a-build ${P}-a-d1`} x="176" y="50" width="106" height="82" rx="10" fill="url(#pj-development-build-web-grad)" />
        <circle cx="206" cy="78" r="9" fill="#ffffff" opacity=".35" />
        <path d="M184 124l26-24 18 16 14-10 32 18z" fill="#ffffff" opacity=".28" />
        <rect className={`${P}-vf ${P}-a-build ${P}-a-d2`} x="20" y="146" width="78" height="44" rx="8" />
        <rect className={`${P}-vf ${P}-a-build ${P}-a-d3`} x="108" y="146" width="78" height="44" rx="8" />
        <rect className={`${P}-vf ${P}-a-build ${P}-a-d4`} x="196" y="146" width="86" height="44" rx="8" />
        <Cursor x={120} y={150} className={`${P}-a-cursor-web`} />
      </g>
    </svg>
  );
}

function VisMobile() {
  return (
    <svg viewBox="0 0 300 160" className={`${P}-illustration`} aria-hidden="true" focusable="false">
      <Grad id="pj-development-build-mobile-grad" />
      <g className={`${P}-up`}>
        <rect className={`${P}-vf`} x="40" y="14" width="104" height="210" rx="22" />
        <rect className={`${P}-vd`} x="79" y="22" width="26" height="5" rx="2.5" />
        <rect x="53" y="38" width="78" height="48" rx="11" fill="url(#pj-development-build-mobile-grad)" />
        <text className={`${P}-vtx ${P}-vtx--light`} x="61" y="56">Welcome back</text>
        <rect x="61" y="66" width="34" height="9" rx="4.5" fill="#ffffff" opacity=".85" />
        <g className={`${P}-a-list`}>
          <rect className={`${P}-vrow`} x="53" y="96" width="78" height="22" rx="7" />
          <circle className={`${P}-vnf`} cx="64" cy="107" r="5" />
          <rect className={`${P}-vb`} x="74" y="104" width="44" height="6" rx="3" />
          <rect className={`${P}-vrow`} x="53" y="124" width="78" height="22" rx="7" />
          <circle className={`${P}-vd`} cx="64" cy="135" r="5" />
          <rect className={`${P}-vb`} x="74" y="132" width="34" height="6" rx="3" />
          <rect className={`${P}-vrow`} x="53" y="152" width="78" height="22" rx="7" />
        </g>
      </g>
      <g className={`${P}-shift`}>
        <rect className={`${P}-vf`} x="162" y="32" width="104" height="210" rx="22" />
        <rect className={`${P}-vd`} x="201" y="40" width="26" height="5" rx="2.5" />
        <rect className={`${P}-vb`} x="175" y="58" width="56" height="9" rx="4.5" />
        <rect className={`${P}-vf`} x="175" y="76" width="78" height="56" rx="11" />
        <path className={`${P}-vt ${P}-a-draw`} pathLength="100" d="M182 122l12-10 10 6 12-14 12 8 14-12" />
        <rect className={`${P}-va`} x="175" y="142" width="78" height="22" rx="11" />
      </g>
      <g className={`${P}-a-notify`}>
        <rect className={`${P}-vnote`} x="150" y="8" width="132" height="34" rx="12" />
        <circle cx="168" cy="25" r="8" fill="url(#pj-development-build-mobile-grad)" />
        <path d="M164 25l3 3 5-6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text className={`${P}-vtx`} x="182" y="22">Request received</text>
        <rect className={`${P}-vb`} x="182" y="28" width="62" height="5" rx="2.5" />
      </g>
    </svg>
  );
}

function VisUiux() {
  return (
    <svg viewBox="0 0 300 142" className={`${P}-illustration`} aria-hidden="true" focusable="false">
      <Grad id="pj-development-build-uiux-grad" />
      <g className={`${P}-shift`}>
        <rect className={`${P}-vdash`} x="10" y="8" width="112" height="104" rx="10" />
        <rect className={`${P}-vdash`} x="22" y="22" width="88" height="14" rx="4" />
        <rect className={`${P}-vdash`} x="22" y="46" width="40" height="40" rx="6" />
        <path className={`${P}-vdash`} d="M22 46l40 40M62 46l-40 40" />
        <rect className={`${P}-vdash`} x="70" y="46" width="40" height="18" rx="4" />
        <rect className={`${P}-vdash`} x="70" y="68" width="40" height="18" rx="4" />
        <rect className={`${P}-vdash`} x="22" y="94" width="88" height="10" rx="4" />
      </g>
      <path className={`${P}-vt ${P}-a-flow`} d="M134 60h30" />
      <path className={`${P}-vt`} d="M156 52l8 8-8 8" />
      <rect className={`${P}-vf ${P}-vf--lift`} x="178" y="8" width="112" height="104" rx="10" />
      <rect className={`${P}-va ${P}-a-build`} x="190" y="22" width="88" height="14" rx="4" />
      <rect className={`${P}-a-build ${P}-a-d1`} x="190" y="46" width="40" height="40" rx="6" fill="url(#pj-development-build-uiux-grad)" />
      <circle className={`${P}-a-build ${P}-a-d1`} cx="203" cy="60" r="5" fill="#ffffff" opacity=".5" />
      <rect className={`${P}-vb ${P}-a-build ${P}-a-d2`} x="238" y="46" width="40" height="18" rx="4" />
      <rect className={`${P}-vb ${P}-a-build ${P}-a-d3`} x="238" y="68" width="40" height="18" rx="4" />
      <rect className={`${P}-vpill ${P}-a-build ${P}-a-d4`} x="190" y="94" width="50" height="10" rx="5" />
      <g className={`${P}-a-swatch`}>
        <circle cx="252" cy="99" r="5" fill="#071426" />
        <circle cx="265" cy="99" r="5" fill="#0478a8" />
        <circle cx="278" cy="99" r="5" fill="#20c8f5" />
      </g>
      <Cursor x={196} y={56} className={`${P}-a-cursor-ux`} />
      <text className={`${P}-vtx`} x="10" y="132">Wireframe</text>
      <text className={`${P}-vtx`} x="178" y="132">Design</text>
    </svg>
  );
}

const AI_PATH = "M60 45L170 75L300 40";
function VisAi({ motion }) {
  return (
    <svg viewBox="0 0 400 128" className={`${P}-illustration`} aria-hidden="true" focusable="false">
      <g className={`${P}-vl`}>
        <path d="M60 20L170 15M60 20L170 45M60 45L170 45M60 45L170 75M60 70L170 75M60 70L170 105M60 95L170 105M60 95L170 45" />
        <path d="M170 15L300 40M170 45L300 40M170 45L300 80M170 75L300 40M170 75L300 80M170 105L300 80" />
      </g>
      <path className={`${P}-vt ${P}-vt--glow`} d={AI_PATH} />
      {motion && [0, 0.8, 1.6].map((begin) => (
        <circle key={begin} r="4" className={`${P}-vpulse`}>
          <animateMotion dur="2.4s" begin={`${begin}s`} repeatCount="indefinite" path={AI_PATH} />
        </circle>
      ))}
      <g className={`${P}-vn`}>
        <circle cx="60" cy="20" r="6" />
        <circle className={`${P}-vnf`} cx="60" cy="45" r="6" />
        <circle cx="60" cy="70" r="6" />
        <circle cx="60" cy="95" r="6" />
        <circle cx="170" cy="15" r="6" />
        <circle cx="170" cy="45" r="6" />
        <circle className={`${P}-vnf`} cx="170" cy="75" r="6" />
        <circle cx="170" cy="105" r="6" />
        <circle className={`${P}-vnf ${P}-a-ping-soft`} cx="300" cy="40" r="7" />
        <circle cx="300" cy="80" r="7" />
      </g>
      <g className={`${P}-a-insight`}>
        <rect className={`${P}-vchip`} x="316" y="22" width="78" height="40" rx="12" />
        <text className={`${P}-vtx ${P}-vtx--chip`} x="327" y="38">Insight</text>
        <rect x="327" y="46" width="56" height="5" rx="2.5" fill="rgba(255,255,255,.18)" />
        <rect className={`${P}-a-meter`} x="327" y="46" width="56" height="5" rx="2.5" fill="#20c8f5" />
      </g>
      <text className={`${P}-vtx`} x="44" y="122">Data</text>
      <text className={`${P}-vtx`} x="150" y="122">Model</text>
      <text className={`${P}-vtx`} x="282" y="122">Output</text>
    </svg>
  );
}

const AUTO_PATH = "M40 50H260";
function VisAuto({ motion }) {
  return (
    <svg viewBox="0 0 300 112" className={`${P}-illustration`} aria-hidden="true" focusable="false">
      <Grad id="pj-development-build-auto-grad" />
      <g className={`${P}-shift`}>
        <path className={`${P}-vt ${P}-a-flow`} d="M76 50h38M186 50h38" />
        <rect className={`${P}-vf`} x="4" y="30" width="72" height="40" rx="10" />
        <path className={`${P}-vic`} d="M26 43h20v14H26zM26 43l10 7 10-7" />
        <rect className={`${P}-vf`} x="114" y="30" width="72" height="40" rx="10" />
        <path className={`${P}-vic`} d="M150 40l10 10-10 10-10-10z" />
        <rect className={`${P}-a-pulse ${P}-a-d3`} x="224" y="30" width="72" height="40" rx="10" fill="url(#pj-development-build-auto-grad)" />
        <path d="M250 50l6 6 12-12" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        {motion && (
          <circle r="5" className={`${P}-vpulse`}>
            <animateMotion dur="3s" repeatCount="indefinite" path={AUTO_PATH} keyPoints="0;0.5;0.5;1" keyTimes="0;0.4;0.6;1" calcMode="linear" />
            <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.5;0.9;1" dur="3s" repeatCount="indefinite" />
          </circle>
        )}
        <text className={`${P}-vtx`} x="40" y="92" textAnchor="middle">Input</text>
        <text className={`${P}-vtx`} x="150" y="92" textAnchor="middle">Decision</text>
        <text className={`${P}-vtx`} x="260" y="92" textAnchor="middle">Action</text>
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
        <g className={`${P}-a-live`}>
          <rect x="360" y="14" width="56" height="20" rx="10" fill="rgba(61,220,151,.14)" stroke="rgba(61,220,151,.6)" />
          <circle cx="373" cy="24" r="3.5" fill="#3ddc97" />
          <text className={`${P}-vtx ${P}-vtx--live`} x="381" y="28">Live</text>
        </g>
        <circle className={`${P}-vd`} cx="436" cy="24" r="10" />
        <rect className={`${P}-vf ${P}-a-build`} x="112" y="46" width="108" height="54" rx="10" />
        <rect className={`${P}-vf ${P}-a-build ${P}-a-d1`} x="230" y="46" width="108" height="54" rx="10" />
        <rect className={`${P}-vf ${P}-a-build ${P}-a-d2`} x="348" y="46" width="98" height="54" rx="10" />
        <text className={`${P}-vtx ${P}-vtx--kpi`} x="124" y="64">Users</text>
        <rect className={`${P}-a-grow`} x="124" y="74" width="64" height="12" rx="6" fill="url(#pj-development-build-saas-grad)" />
        <text className={`${P}-vtx ${P}-vtx--kpi`} x="242" y="64">Orders</text>
        <rect className={`${P}-a-grow ${P}-a-d1`} x="242" y="74" width="52" height="12" rx="6" fill="url(#pj-development-build-saas-grad)" />
        <text className={`${P}-vtx ${P}-vtx--kpi`} x="360" y="64">Uptime</text>
        <rect className={`${P}-a-grow ${P}-a-d2`} x="360" y="74" width="58" height="12" rx="6" fill="url(#pj-development-build-saas-grad)" />
        <rect className={`${P}-vf`} x="112" y="112" width="226" height="130" rx="10" />
        <path className={`${P}-vl`} d="M124 150h202M124 180h202M124 210h202" />
        <path className={`${P}-a-fade`} d="M124 214L160 194L196 200L232 168L268 176L304 144L326 128V232H124Z" fill="rgba(32,200,245,.16)" />
        <path className={`${P}-vt ${P}-vt--glow ${P}-a-draw`} pathLength="100" d="M124 214L160 194L196 200L232 168L268 176L304 144L326 128" />
        <circle className={`${P}-a-ping-soft`} cx="326" cy="128" r="5" fill="#20c8f5" />
        <rect className={`${P}-vf`} x="348" y="112" width="98" height="130" rx="10" />
        <rect className={`${P}-va ${P}-a-bar`} x="360" y="196" width="14" height="32" rx="3" />
        <rect className={`${P}-a-bar ${P}-a-d1`} x="380" y="170" width="14" height="58" rx="3" fill="url(#pj-development-build-saas-grad)" />
        <rect className={`${P}-va ${P}-a-bar ${P}-a-d2`} x="400" y="184" width="14" height="44" rx="3" />
        <rect className={`${P}-a-bar ${P}-a-d3`} x="420" y="148" width="14" height="80" rx="3" fill="url(#pj-development-build-saas-grad)" />
      </g>
    </svg>
  );
}

/* =========================================================
   WHAT CAN WE BUILD — DATA
========================================================= */
const CAPS = [
  {
    key: "web", slug: "web", icon: "web", title: "Websites & Web Applications",
    desc: "Digital experiences designed around your users, business goals and growth requirements.",
    items: ["Business Websites", "Corporate Websites", "Landing Pages", "Portals", "E-commerce", "Web Applications", "Custom Web Solutions", "Website Revamps"],
    Vis: VisWeb,
  },
  {
    key: "mobile", slug: "mobile", icon: "mobile", title: "Mobile Applications",
    desc: "Mobile experiences designed to solve real user and business needs.",
    items: ["Customer Applications", "Business Applications", "Service Applications", "Connected Applications", "Dashboard Applications", "App Enhancements"],
    Vis: VisMobile,
  },
  {
    key: "uiux", slug: "uiux", icon: "design", title: "UI/UX & Product Design",
    desc: "Design the experience before building the product.",
    items: ["User Research", "User Flows", "Wireframes", "Interactive Prototypes", "Interface Design", "Design Systems", "Experience Improvement"],
    Vis: VisUiux,
  },
  {
    key: "ai", slug: "ai-ml", icon: "ai", title: "AI / ML & Intelligent Solutions",
    desc: "Use intelligent technology where it creates meaningful value.",
    items: ["AI-powered Applications", "Machine Learning Solutions", "Computer Vision", "Intelligent Features", "Predictive Solutions", "AI Integration"],
    Vis: VisAi,
  },
  {
    key: "auto", slug: "automation", icon: "auto", title: "Automation & Business Solutions",
    desc: "Turn repetitive processes into connected digital workflows.",
    items: ["Workflow Automation", "Business Process Automation", "Data Automation", "Custom Dashboards", "Reporting Systems", "Digital Process Optimization"],
    Vis: VisAuto,
  },
  {
    key: "saas", slug: "saas", icon: "saas", title: "SaaS & Digital Platforms",
    desc: "Build scalable digital products that can evolve with your business.",
    items: ["Custom SaaS Platforms", "Subscription-based Products", "Business Platforms", "Internal Tools", "Admin Systems", "Customer Portals", "Multi-user Platforms"],
    Vis: VisSaas,
  },
];

const ALL_ITEMS = CAPS.flatMap((cap) => cap.items);
const MARQUEE_A = ALL_ITEMS.filter((_, i) => i % 2 === 0);
const MARQUEE_B = ALL_ITEMS.filter((_, i) => i % 2 === 1);

/* =========================================================
   WHAT CAN WE BUILD — MARQUEE
========================================================= */
function Marquee({ items, reverse }) {
  const row = [...items, ...items];
  return (
    <div className={`${P}-marquee-row${reverse ? ` ${P}-marquee-row--rev` : ""}`}>
      <ul className={`${P}-marquee-track`}>
        {row.map((item, i) => (
          <li key={`${item}-${i}`} aria-hidden={i >= items.length ? "true" : undefined}>
            <span className={`${P}-marquee-dot`} />{item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =========================================================
   WHAT CAN WE BUILD — CARD
========================================================= */
function CapabilityCard({ cap, index, motion }) {
  const [open, setOpen] = useState(false);
  const [viewRef, inView] = useInView(0.12);
  const fx = usePointerFx(!motion);
  const panelId = `${P}-panel-${cap.key}`;
  const shown = cap.items.slice(0, VISIBLE_TAGS);
  const rest = cap.items.slice(VISIBLE_TAGS);
  /* WhatsApp chat that already names the service on this card. */
  const chatHref = whatsappHref(`Hi ProJenius, I would like to discuss a project in ${cap.title}.`);

  const setRefs = (el) => {
    viewRef.current = el;
    fx.ref.current = el;
  };

  const classes = [
    `${P}-card`,
    `${P}-card--${cap.key}`,
    `${P}-card--d${index % 3}`,
    inView ? `${P}-card--in` : "",
    open ? `${P}-card--open` : "",
  ].filter(Boolean).join(" ");

  return (
    <article
      ref={setRefs}
      className={classes}
      aria-labelledby={`${P}-title-${cap.key}`}
      onPointerMove={fx.onPointerMove}
      onPointerLeave={fx.onPointerLeave}
    >
      <span className={`${P}-ring`} aria-hidden="true" />
      <span className={`${P}-spot`} aria-hidden="true" />
      <div className={`${P}-body`}>
        <div className={`${P}-top`}>
          <span className={`${P}-icon`}><Icon name={cap.icon} /></span>
          <a className={`${P}-wa`} href={chatHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} aria-hidden="true" />
            Discuss Project
            <span className="pjds-sr-only"> about {cap.title} on WhatsApp (opens in a new tab)</span>
          </a>
        </div>

        <h3 id={`${P}-title-${cap.key}`} className={`${P}-title`}>{cap.title}</h3>
        <p className={`${P}-desc`}>{cap.desc}</p>

        <ul className={`${P}-tags`} aria-label={`${cap.title} examples`}>
          {shown.map((item) => <li key={item}>{item}</li>)}
          {rest.length > 0 && (
            <li className={`${P}-tags-more-wrap`}>
              <button
                type="button"
                className={`${P}-tags-more`}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((value) => !value)}
              >
                {open ? "Show less" : `+${rest.length} more`}
              </button>
            </li>
          )}
        </ul>
        {rest.length > 0 && (
          <div className={`${P}-more`} id={panelId}>
            <div className={`${P}-more-inner`}>
              <ul className={`${P}-tags ${P}-tags--rest`}>
                {rest.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        )}

        <Link className={`${P}-cta`} to={contactHref(cap.slug)}>
          <span>Discuss this requirement</span>
          <Arrow />
        </Link>
      </div>

      <div className={`${P}-vis`} aria-hidden="true"><cap.Vis motion={motion && inView} /></div>
    </article>
  );
}

/* =========================================================
   WHAT CAN WE BUILD — COMPONENT
========================================================= */
export default function WhatWeBuild() {
  const [headRef, headIn] = useInView(0.2);
  const [ctaRef, ctaIn] = useInView(0.2);
  const reduced = useReducedMotion();

  return (
    <section id="pj-development-build" className={P} aria-labelledby="pj-development-build-heading">
      <div className={`${P}-wrap`}>
        {/* ---------- HEADING ---------- */}
        <div ref={headRef} className={`${P}-head${headIn ? ` ${P}-head--in` : ""}`}>
          <div className={`${P}-head-main`}>
            <p className="pjds-eyebrow pjds-eyebrow--on-dark">What We Build</p>
            <h2 id="pj-development-build-heading" className={`${P}-head-title`}>What Can We <TypedPhrase phrases={["Build?", "Create?", "Develop?"]} /></h2>
            <SectionTitleLine />
          </div>
          <p className={`${P}-head-text`}>
            From digital presence to intelligent applications and scalable platforms, our development capabilities adapt to your requirement.
          </p>
        </div>
      </div>

      {/* ---------- EVERYTHING WE BUILD (scrolling strip) ---------- */}
      <div className={`${P}-marquee${headIn ? ` ${P}-marquee--in` : ""}`} aria-label="Examples of what we build">
        <Marquee items={MARQUEE_A} />
        <Marquee items={MARQUEE_B} reverse />
      </div>

      <div className={`${P}-wrap`}>
        {/* ---------- BENTO GRID ---------- */}
        <div className={`${P}-bento`}>
          {CAPS.map((cap, index) => (
            <CapabilityCard key={cap.key} cap={cap} index={index} motion={!reduced} />
          ))}

          {/* ---------- CLOSING CTA CARD ---------- */}
          <div ref={ctaRef} className={`${P}-close${ctaIn ? ` ${P}-close--in` : ""}`}>
            <div className={`${P}-close-text`}>
              <p className={`${P}-close-title`}>Your requirement doesn't fit one box?</p>
              <p className={`${P}-close-sub`}>Most products combine several of these. Tell us what you want to build and we will shape the right mix.</p>
            </div>
            <Link className={`${P}-close-btn`} to={contactHref("not-sure")}>
              <span>Discuss Your Project</span>
              <Arrow className={`${P}-close-arrow`} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
