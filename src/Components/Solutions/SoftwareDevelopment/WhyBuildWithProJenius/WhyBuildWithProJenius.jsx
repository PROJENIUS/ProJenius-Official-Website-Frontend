import { useEffect, useRef, useState } from "react";
import "./WhyBuildWithProJenius.css";

const P = "pj-development-why";

/* =========================================================
   WHY BUILD WITH PROJENIUS — DATA
========================================================= */
const ICONS = {
  target: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>),
  route: (<><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H15a3 3 0 000-6H9a3 3 0 010-6h6.5" /></>),
  sliders: (<><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>),
  growth: (<><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>),
};

const REASONS = [
  { n: "01", icon: "target", deco: "target", title: "Requirement driven", text: "Solutions are shaped around the actual business requirement." },
  { n: "02", icon: "route", deco: "route", title: "End-to-end", text: "From understanding and design to development, integration, launch and support." },
  { n: "03", icon: "sliders", deco: null, title: "Flexible approach", text: "The implementation approach adapts to the project's needs." },
  { n: "04", icon: "growth", deco: null, title: "Product mindset", text: "We think beyond delivery, focusing on usability, functionality, scalability and long-term value." },
];

/* Decorative corner graphics */
function Deco({ type }) {
  if (type === "target") {
    return (
      <svg className={`${P}-deco ${P}-deco--target`} viewBox="0 0 150 150" fill="none" aria-hidden="true" focusable="false">
        <circle cx="75" cy="75" r="70" /><circle cx="75" cy="75" r="48" /><circle cx="75" cy="75" r="26" />
        <path d="M75 0V150" /><path d="M0 75H150" />
      </svg>
    );
  }
  if (type === "route") {
    return (
      <svg className={`${P}-deco ${P}-deco--route`} viewBox="0 0 150 150" fill="none" aria-hidden="true" focusable="false">
        <path d="M10 140C10 90 60 100 70 60S130 40 140 10" />
        <circle cx="10" cy="140" r="5" /><circle cx="70" cy="60" r="5" /><circle cx="140" cy="10" r="5" />
      </svg>
    );
  }
  return null;
}

/* =========================================================
   WHY BUILD WITH PROJENIUS — HELPERS
========================================================= */
function useInView(threshold, rootMargin = "0px 0px -4% 0px") {
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
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);
  return [ref, inView];
}

/* =========================================================
   WHY BUILD WITH PROJENIUS — COMPONENT
========================================================= */
export default function WhyBuildWithProJenius() {
  const [headRef, headIn] = useInView(0.2);
  const [gridRef, gridIn] = useInView(0.15, "0px 0px -5% 0px");

  return (
    <section id="pj-development-why" className={P} aria-labelledby="pj-development-why-title">
      <div className={`${P}-wrap`}>
        {/* ---------- HEADING ---------- */}
        <div ref={headRef} className={`${P}-head${headIn ? ` ${P}-head--in` : ""}`}>
          <h2 id="pj-development-why-title" className={`${P}-head-title`}>Why Build With ProJenius?</h2>
        </div>

        {/* ---------- CARDS ---------- */}
        <div ref={gridRef} className={`${P}-grid${gridIn ? ` ${P}-grid--in` : ""}`}>
          {REASONS.map((reason, index) => (
            <article key={reason.n} className={`${P}-card ${P}-card--${index + 1}`}>
              <Deco type={reason.deco} />
              <div className={`${P}-icon-wrap`}>
                <svg className={`${P}-icon`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">{ICONS[reason.icon]}</svg>
              </div>
              <div className={`${P}-content`}>
                <span className={`${P}-num`}>{reason.n}</span>
                <h3 className={`${P}-title`}>{reason.title}</h3>
                <p className={`${P}-text`}>{reason.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
