import { useEffect, useRef, useState } from "react";
import "./OurWorkshopExperiences.css";

/* Add your real workshops here. While this is empty, the sample cards and notice are shown.
   Each item: { name, year, category, city, title, description, image, href } */
const WORKSHOP_EXPERIENCES = [];

const SAMPLE = [1, 2, 3].map((n) => ({
  name: `Institution name (sample ${n})`,
  year: "Year",
  category: "Technology / category",
  city: "City, State",
  title: "Workshop title",
  description: "A short description of what students did in this workshop will appear here.",
  image: "",
  href: "#",
  sample: true,
}));

const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
  </svg>
);

export default function OurWorkshopExperiences() {
  const items = WORKSHOP_EXPERIENCES.length ? WORKSHOP_EXPERIENCES : SAMPLE;
  const isSample = !WORKSHOP_EXPERIENCES.length;

  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [active, setActive] = useState(0);

  const goTo = (i) => {
    const track = trackRef.current;
    const card = cardRefs.current[i];
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (atEnd) return setActive(items.length - 1);
      let best = 0;
      let bestDist = Infinity;
      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        const d = Math.abs(c.offsetLeft - track.scrollLeft);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setActive(best);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [items.length]);

  return (
    <section className="oe-section">
      <div className="oe-container">
        <h2 className="oe-title">Our Workshop Experiences</h2>
        <p className="oe-desc">
          ProJenius has conducted practical technology and innovation workshops
          in academic institutions, creating opportunities for students to
          learn, experiment, and build.
        </p>

        <div className="oe-bar">
          <div className="oe-tabs" role="tablist">
            {items.map((it, i) => (
              <button
                key={it.name}
                role="tab"
                aria-selected={i === active}
                className={`oe-tab ${i === active ? "is-active" : ""}`}
                onClick={() => goTo(i)}
              >
                <span>{it.name}</span>
                <small>{it.year}</small>
              </button>
            ))}
          </div>
          <div className="oe-arrows">
            <button className="oe-arrow" aria-label="Previous" disabled={active === 0} onClick={() => goTo(active - 1)}>
              <Chevron dir="left" />
            </button>
            <button className="oe-arrow" aria-label="Next" disabled={active === items.length - 1} onClick={() => goTo(active + 1)}>
              <Chevron dir="right" />
            </button>
          </div>
        </div>

        <div className="oe-track" ref={trackRef}>
          {items.map((it, i) => (
            <article key={it.name} className="oe-card" ref={(el) => (cardRefs.current[i] = el)}>
              <div className={`oe-media oe-media-${(i % 3) + 1}`}>
                {it.image && <img src={it.image} alt="" loading="lazy" />}
                {it.sample && <span className="oe-badge">Placeholder</span>}
              </div>
              <div className="oe-info">
                <div className="oe-meta">
                  <span className="oe-chip">{it.category}</span>
                  <span>{it.year}</span>
                  <span>{it.city}</span>
                </div>
                <h3>{it.name}</h3>
                <h4>{it.title}</h4>
                <p>{it.description}</p>
                <a className="oe-btn" href={it.href}>View workshop details</a>
              </div>
            </article>
          ))}
        </div>

        {isSample && (
          <div className="oe-notice">
            <span aria-hidden="true">⚠</span>
            <p>
              <strong>Sample layout.</strong> These cards use placeholder text and
              image areas. Add real workshops to <code>WORKSHOP_EXPERIENCES</code> in
              OurWorkshopExperiences.jsx and this notice disappears.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}