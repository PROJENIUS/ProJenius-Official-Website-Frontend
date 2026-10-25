import { useEffect, useMemo, useState } from "react";
import "./WhatParticipantsExperienced.css";

/* Add real testimonials here. While this is empty, the sample cards and notice are shown.
   Each item: { id, role: "Students" | "Faculty", topics: ["AI / ML", "IoT", "Robotics", "Other"],
                quote, name, meta, image, videoSrc }  */
const WORKSHOP_TESTIMONIALS = [];

const SAMPLE = [
  { id: "s1", role: "Students", topics: ["AI / ML"], tone: 1,
    label: "Student experience",
    quote: "A short piece of real student feedback will appear here.",
    name: "Participant name", meta: "Student, Institution name. Workshop title" },
  { id: "f1", role: "Faculty", topics: ["IoT"], tone: 4,
    label: "Faculty / institution experience",
    quote: "Faculty or institution feedback will appear here.",
    name: "Faculty name", meta: "Faculty, Institution name. Workshop title" },
  { id: "s2", role: "Students", topics: ["Robotics"], tone: 2,
    label: "Student experience",
    quote: "Another student experience will appear here.",
    name: "Participant name", meta: "Student, Institution name. Workshop title" },
  { id: "s3", role: "Students", topics: ["Other"], tone: 3,
    label: "Student experience",
    quote: "Another student experience will appear here.",
    name: "Participant name", meta: "Student, Institution name. Workshop title" },
].map((s) => ({ ...s, sample: true }));

const FILTERS = ["All", "Students", "Faculty", "AI / ML", "IoT", "Robotics", "Other"];

const label = (t) => t.label || (t.role === "Faculty" ? "Faculty experience" : "Student experience");

const Play = () => (
  <span className="wp-play" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
  </span>
);

function WhatParticipantsExperiencedSection() {
  const all = WORKSHOP_TESTIMONIALS.length ? WORKSHOP_TESTIMONIALS : SAMPLE;
  const isSample = !WORKSHOP_TESTIMONIALS.length;

  const [filter, setFilter] = useState("All");
  const [featuredId, setFeaturedId] = useState(all[0].id);
  const [playing, setPlaying] = useState(false);

  const shown = useMemo(
    () =>
      all.filter(
        (t) => filter === "All" || t.role === filter || (t.topics || []).includes(filter)
      ),
    [all, filter]
  );

  // keep the featured card valid when the filter changes
  useEffect(() => {
    if (shown.length && !shown.some((t) => t.id === featuredId)) setFeaturedId(shown[0].id);
    setPlaying(false);
  }, [shown, featuredId]);

  const featured = shown.find((t) => t.id === featuredId) || shown[0];
  const others = shown.filter((t) => t !== featured);

  const pick = (id) => { setFeaturedId(id); setPlaying(false); };

  return (
    <section className="wp-section">
      <div className="wp-container">
        <h2 className="wp-title">What Participants Experienced</h2>
        <p className="wp-desc">
          Feedback from students and faculty who took part in ProJenius
          workshops, in their own words.
        </p>

        <div className="wp-filters" role="tablist" aria-label="Filter experiences">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={`wp-chip ${filter === f ? "is-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {featured ? (
          <div className={`wp-layout ${others.length ? "has-list" : ""}`}>
            <article className="wp-featured">
              <div className={`wp-media wp-tone-${featured.tone || 1}`}>
                {featured.image && <img src={featured.image} alt="" />}
                {playing && featured.videoSrc ? (
                  <video src={featured.videoSrc} controls autoPlay />
                ) : (
                  <button
                    type="button"
                    className="wp-play-btn"
                    aria-label="Play video"
                    onClick={() => setPlaying(true)}
                  >
                    <Play />
                  </button>
                )}
                {featured.sample && <span className="wp-badge">Placeholder</span>}
              </div>
              <div className="wp-text">
                <span className="wp-label">{label(featured)}</span>
                <blockquote>“{featured.quote}”</blockquote>
                <strong>{featured.name}</strong>
                <span className="wp-meta">{featured.meta}</span>
              </div>
            </article>

            {others.length > 0 && (
              <div className="wp-list">
                {others.map((t) => (
                  <button key={t.id} type="button" className="wp-item" onClick={() => pick(t.id)}>
                    <span className={`wp-thumb wp-tone-${t.tone || 1}`}>
                      {t.image && <img src={t.image} alt="" />}
                      <Play />
                    </span>
                    <span className="wp-item-text">
                      <span className="wp-label">{label(t)}</span>
                      <span className="wp-item-quote">“{t.quote}”</span>
                      <span className="wp-item-meta">{t.name}, Institution name</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="wp-empty">No experiences to show for this filter yet.</p>
        )}

        {isSample && (
          <div className="wp-notice">
            <span aria-hidden="true">⚠</span>
            <p>
              <strong>Sample layout.</strong> Placeholder cards. Add real
              testimonials to <code>WORKSHOP_TESTIMONIALS</code> in
              WhatParticipantsExperienced.jsx. Use only real feedback and names
              you have permission to show.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* Hidden on the live site until real testimonials are added to WORKSHOP_TESTIMONIALS above
   (the sample layout and its notice are never shown to visitors). */
export default function WhatParticipantsExperienced() {
  return WORKSHOP_TESTIMONIALS.length ? <WhatParticipantsExperiencedSection /> : null;
}
