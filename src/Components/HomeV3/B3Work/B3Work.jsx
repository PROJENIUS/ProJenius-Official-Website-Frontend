import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import useSectionProgress from "../useSectionProgress.js";
import { PROJECTS } from "../../Home/OurProjects/projectsData.js";
import "./B3Work.css";

/* =============================================================================
   HOME V3 — SELECTED WORK (horizontal gallery)
   On desktop the section pins and vertical scrolling slides the real
   projects (homepage project data) sideways. The travel distance is measured
   and written to --dist; --p comes from useSectionProgress. On phones, with
   reduced motion, or without JS, it is a normal swipeable row.
   ============================================================================= */

const PIN_QUERY = "(min-width: 901px) and (prefers-reduced-motion: no-preference)";

export default function B3Work() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const measure = useCallback(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const pinned = window.matchMedia?.(PIN_QUERY).matches;
    const distance = pinned ? Math.max(0, track.scrollWidth - track.clientWidth) : 0;
    section.style.setProperty("--dist", `${distance}px`);
    section.dataset.pinned = pinned && distance > 0 ? "true" : "false";
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useSectionProgress(sectionRef);

  return (
    <section ref={sectionRef} className="b3w" aria-labelledby="b3w-title">
      <div className="b3w__pin">
        <div className="b3-wrap b3w__head">
          <div>
            <p className="b3-label" data-reveal="up"><b>03</b> / Selected work</p>
            <h2 id="b3w-title" className="b3-h2" data-reveal="up" data-reveal-delay="1">
              Ideas we've turned into <span className="b3-lit">working systems.</span>
            </h2>
          </div>
          <div className="b3w__progress" aria-hidden="true"><span /></div>
        </div>

        <ul ref={trackRef} className="b3w__track">
          {PROJECTS.map(({ id, title, category, description, image, alt, Icon }, index) => (
            <li key={id} className={`b3w__card${image ? " b3w__card--shot" : ""}`}>
              <div className="b3w__media">
                {image ? (
                  <img src={image} alt={alt} width="560" height="575" loading="lazy" decoding="async" />
                ) : (
                  <span className="b3w__icon b3-grid" aria-hidden="true"><Icon size={56} strokeWidth={1.4} /></span>
                )}
                <span className="b3w__index" aria-hidden="true">P/{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="b3w__body">
                <span className="b3-tag">{category}</span>
                <h3 className="b3w__title">{title}</h3>
                <p className="b3w__text">{description}</p>
              </div>
            </li>
          ))}
          <li className="b3w__card b3w__card--next">
            <p className="b3w__next-kicker">P/{String(PROJECTS.length + 1).padStart(2, "0")}</p>
            <h3 className="b3w__next-title">Your idea could be next.</h3>
            <Link className="b3-btn b3-btn--light" to="/contact">
              Start your project <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
