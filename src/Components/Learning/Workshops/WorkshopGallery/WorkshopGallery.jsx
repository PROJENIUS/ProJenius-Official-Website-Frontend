import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Play, X } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import { GALLERY_ITEMS } from "./galleryData.js";
import "./WorkshopGallery.css";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =========================================================
   WORKSHOP GALLERY
   Navy section: photos and videos from ProJenius workshops in
   a mosaic grid. Clicking a tile opens a full-screen viewer
   (native <dialog>: Esc closes, focus stays inside) with
   previous / next and arrow-key support; videos play there.
   Filters (All / Photos / Videos) appear once both kinds exist.
   Content lives in galleryData.js.
========================================================= */

const FIRST_BATCH = 8;

/* Tile shapes repeat every six tiles: big, normal, tall, normal, wide, wide. */
const SHAPES = ["big", "normal", "tall", "normal", "wide", "wide"];

export default function WorkshopGallery() {
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const dialogRef = useRef(null);
  const lastTileRef = useRef(null);

  const photoCount = GALLERY_ITEMS.filter((item) => item.type === "photo").length;
  const videoCount = GALLERY_ITEMS.length - photoCount;
  const items = filter === "all" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.type === filter);
  const visible = showAll ? items : items.slice(0, FIRST_BATCH);
  const current = openIndex >= 0 ? items[openIndex] : null;

  // Open / close the native dialog and lock page scroll while it is open.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (openIndex < 0) {
      if (dialog.open) {
        dialog.close();
        // Back to the tile that opened the viewer (only possible once the modal is closed).
        lastTileRef.current?.focus();
      }
      return undefined;
    }
    if (!dialog.open) dialog.showModal?.();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openIndex]);

  const step = (direction) =>
    setOpenIndex((index) => (index < 0 ? index : (index + direction + items.length) % items.length));

  const onDialogKey = (event) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  const close = () => setOpenIndex(-1);

  if (!GALLERY_ITEMS.length) return null;

  const FILTERS = [
    { id: "all", label: "All", count: GALLERY_ITEMS.length },
    { id: "photo", label: "Photos", count: photoCount },
    { id: "video", label: "Videos", count: videoCount },
  ];

  return (
    <section className="wg-section" aria-labelledby="wg-title">
      <div className="pjds-container">
        <header className="wg-head">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Workshop Gallery</p>
          <h2 id="wg-title" className="wg-title" data-reveal="up" data-reveal-delay="1">
            <span className="wg-title-static">Moments From</span>
            <TypedPhrase tone="dark" phrases={["Our Workshops", "Hands-On Sessions", "Real Classrooms"]} />
          </h2>
          <SectionTitleLine />
          <p className="wg-desc" data-reveal="up" data-reveal-delay="2">
            Real sessions, real students and real projects. A look inside the workshops we run with institutions.
          </p>
        </header>

        {photoCount > 0 && videoCount > 0 && (
          <div className="wg-filters" role="group" aria-label="Show" data-reveal="up" data-reveal-delay="2">
            {FILTERS.map(({ id, label, count }) => (
              <button
                key={id}
                type="button"
                className={`wg-filter${filter === id ? " is-active" : ""}`}
                aria-pressed={filter === id}
                onClick={() => {
                  setFilter(id);
                  setShowAll(false);
                }}
              >
                {label} <span>{count}</span>
              </button>
            ))}
          </div>
        )}

        <ul className="wg-grid">
          {visible.map((item, index) => (
            <li
              key={item.id}
              className={`wg-tile wg-tile--${SHAPES[index % SHAPES.length]}${item.cropTop ? " wg-tile--crop-top" : ""}`}
              data-reveal="up"
              data-reveal-delay={String((index % 4) + 1)}
            >
              <button
                type="button"
                className="wg-tile__btn"
                onClick={(event) => {
                  lastTileRef.current = event.currentTarget;
                  setOpenIndex(index);
                }}
              >
                <img src={item.image} alt="" loading="lazy" decoding="async" />
                <span className="wg-tile__shade" aria-hidden="true" />
                {item.type === "video" ? (
                  <span className="wg-tile__play" aria-hidden="true"><Play size={26} fill="currentColor" /></span>
                ) : (
                  <span className="wg-tile__zoom" aria-hidden="true"><Maximize2 size={18} /></span>
                )}
                <span className="wg-tile__caption">
                  <strong>{item.caption}</strong>
                  {item.place && <span>{item.place}</span>}
                </span>
                <span className="pjds-sr-only">
                  {item.type === "video" ? ": play video" : ": view photo"}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {items.length > FIRST_BATCH && (
          <div className="wg-more">
            <button type="button" className="wg-more__btn" onClick={() => setShowAll((value) => !value)}>
              {showAll ? "Show fewer" : `Show all ${items.length}`}
            </button>
          </div>
        )}
      </div>

      <dialog
        ref={dialogRef}
        className="wg-viewer"
        aria-label={current ? current.caption : "Gallery viewer"}
        onClose={() => openIndex >= 0 && close()}
        onKeyDown={onDialogKey}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        {current && (
          <div className="wg-viewer__inner">
            <button type="button" className="wg-viewer__close" onClick={close} aria-label="Close">
              <X size={22} />
            </button>

            <figure className="wg-viewer__figure">
              {current.type === "video" ? (
                <div className="wg-viewer__video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}?autoplay=1&rel=0`}
                    title={current.caption}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img src={current.image} alt={current.caption} />
              )}
              <figcaption>
                <strong>{current.caption}</strong>
                {current.place && <span>{current.place}</span>}
                <span className="wg-viewer__count">{openIndex + 1} / {items.length}</span>
              </figcaption>
            </figure>

            {items.length > 1 && (
              <>
                <button type="button" className="wg-viewer__nav wg-viewer__nav--prev" onClick={() => step(-1)} aria-label="Previous">
                  <ChevronLeft size={26} />
                </button>
                <button type="button" className="wg-viewer__nav wg-viewer__nav--next" onClick={() => step(1)} aria-label="Next">
                  <ChevronRight size={26} />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
