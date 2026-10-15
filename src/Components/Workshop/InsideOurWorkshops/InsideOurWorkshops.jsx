import { useCallback, useEffect, useState } from "react";
import "./InsideOurWorkshops.css";

/* Add your real photos / videos here. While this is empty, the sample tiles and notice are shown.
   Each item: { image, caption, video, videoSrc, ratio }  (ratio = height / width, e.g. 1.25) */
const WORKSHOP_GALLERY = [];

/* Sample tiles in reading order (left → right, row by row) */
const SAMPLE = [
  { ratio: 1.25, tone: 1 },
  { ratio: 1.34, tone: 2 },
  { ratio: 1.25, tone: 3, caption: "Team interaction" },
  { ratio: 0.75, tone: 4 },
  { ratio: 0.63, tone: 5, video: true },
  { ratio: 1.0, tone: 6 },
  { ratio: 1.0, tone: 7 },
  { ratio: 0.63, tone: 8 },
  { ratio: 0.75, tone: 9, caption: "Prototype testing" },
];

const COLUMNS = 3;

export default function InsideOurWorkshops() {
  const items = WORKSHOP_GALLERY.length ? WORKSHOP_GALLERY : SAMPLE;
  const isSample = !WORKSHOP_GALLERY.length;
  const [open, setOpen] = useState(-1); // index of the tile shown in the lightbox

  // split into 3 masonry columns, keeping reading order across rows
  const cols = Array.from({ length: COLUMNS }, () => []);
  items.forEach((it, i) => cols[i % COLUMNS].push({ ...it, i }));

  const close = useCallback(() => setOpen(-1), []);
  const step = useCallback(
    (d) => setOpen((o) => (o < 0 ? o : (o + d + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const current = open >= 0 ? items[open] : null;

  return (
    <section className="iw-section">
      <div className="iw-container">
        <h2 className="iw-title">Inside Our Workshops</h2>
        <p className="iw-desc">
          A glimpse into the people, projects, tools, and hands-on activities
          behind our workshops.
        </p>

        <div className="iw-grid">
          {cols.map((col, c) => (
            <div className="iw-col" key={c}>
              {col.map((it) => (
                <button
                  key={it.i}
                  type="button"
                  className={`iw-tile iw-tone-${it.tone || (it.i % 9) + 1}`}
                  style={{ aspectRatio: `1 / ${it.ratio || 1}` }}
                  onClick={() => setOpen(it.i)}
                  aria-label={it.caption ? `Open ${it.caption}` : "Open photo"}
                >
                  {it.image && <img src={it.image} alt={it.caption || ""} loading="lazy" />}
                  {it.video && (
                    <span className="iw-play" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  )}
                  {it.caption && <span className="iw-caption">{it.caption}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>

        {isSample && (
          <div className="iw-notice">
            <span aria-hidden="true">⚠</span>
            <p>
              <strong>Sample layout.</strong> Placeholder tiles. Add real photos
              and videos to <code>WORKSHOP_GALLERY</code> in InsideOurWorkshops.jsx
              and they replace these automatically.
            </p>
          </div>
        )}
      </div>

      {current && (
        <div className="iw-lightbox" role="dialog" aria-modal="true" onClick={close}>
          <button className="iw-lb-btn iw-lb-close" aria-label="Close" onClick={close}>×</button>
          <button className="iw-lb-btn iw-lb-prev" aria-label="Previous" onClick={(e) => { e.stopPropagation(); step(-1); }}>‹</button>
          <button className="iw-lb-btn iw-lb-next" aria-label="Next" onClick={(e) => { e.stopPropagation(); step(1); }}>›</button>
          <figure onClick={(e) => e.stopPropagation()}>
            {current.videoSrc ? (
              <video src={current.videoSrc} controls autoPlay />
            ) : current.image ? (
              <img src={current.image} alt={current.caption || ""} />
            ) : (
              <div className={`iw-lb-sample iw-tone-${current.tone || (open % 9) + 1}`} />
            )}
            {current.caption && <figcaption>{current.caption}</figcaption>}
          </figure>
        </div>
      )}
    </section>
  );
}