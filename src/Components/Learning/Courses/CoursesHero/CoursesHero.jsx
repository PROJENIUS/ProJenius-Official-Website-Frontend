import { Search, Star, Wrench } from "lucide-react";

import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import { GOOGLE_PROFILE_URL } from "../../../About/Testimonials/googleReviews.js";
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from "../../../../utils/googleRating.js";
import photoHandsOn from "../../../../assets/About/Achievements/Achievements_4.webp";
import photoLab from "../../../../assets/About/Achievements/Achievements_3.webp";
import photoStudents from "../../../../assets/About/Achievements/Achievements_6.webp";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import "./CoursesHero.css";

/* =============================================================================
   COURSES HERO
   Left: heading, introduction and a course search (like any course catalogue).
   Right: a collage of real ProJenius student photos. To change them, drop
   photos into src/assets/Heroes/courses/ (the first three are used; see the
   README there); until then the photos below are used.
   Bottom: how learning at ProJenius works, in four plain steps.

   Props
     query        current search text (from the URL)
     onQueryChange(q)  update the search (the catalogue filters as you type)
     onSearch()   move to the catalogue
   ============================================================================= */

const DEFAULT_PHOTOS = [
  { image: photoHandsOn, alt: "Students working on a hands-on build with the ProJenius team" },
  { image: photoStudents, alt: "Students presenting during a ProJenius session" },
  { image: photoLab, alt: "Students in a ProJenius lab session" },
];
const UPLOADED = heroPhotos("courses").cards || [];
const PHOTOS = UPLOADED.length >= 3
  ? UPLOADED.slice(0, 3).map((p) => ({ image: p.image, alt: p.title || "ProJenius students", caption: p.title }))
  : DEFAULT_PHOTOS;

const STEPS = [
  { title: "Choose a course", text: "Pick the track that matches your goal." },
  { title: "Learn in live classes", text: "Sessions with the ProJenius team." },
  { title: "Build real projects", text: "Practical work in every module." },
  { title: "Show what you built", text: "Projects you can present." },
];

export default function CoursesHero({ query = "", onQueryChange, onSearch }) {
  const submit = (event) => {
    event.preventDefault();
    onSearch?.();
  };

  return (
    <section className="pjch" aria-labelledby="pjch-title">
      <div className="pjds-container">
        <div className="pjch__grid">
          <div className="pjch__copy">
            <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Courses &amp; Learning</p>
            <h1 id="pjch-title" className="pjch__title" data-reveal="up" data-reveal-delay="1">
              Learn. Build. Grow With{" "}
              <TypedPhrase tone="dark" phrases={["Real-World Skills.", "Live Classes.", "Practical Projects."]} />
            </h1>
            <SectionTitleLine />
            <p className="pjch__lead" data-reveal="up" data-reveal-delay="2">
              Practical courses designed by ProJenius to help students and professionals learn modern
              technologies, build real projects and become career ready.
            </p>

            <form className="pjch__search" role="search" onSubmit={submit} data-reveal="up" data-reveal-delay="3">
              <label htmlFor="pjch-search" className="pjch__sr">Search courses</label>
              <Search className="pjch__search-icon" size={20} aria-hidden="true" />
              <input
                id="pjch-search"
                type="search"
                value={query}
                onChange={(e) => onQueryChange?.(e.target.value)}
                placeholder="What do you want to learn?"
                autoComplete="off"
                maxLength={80}
              />
              <button type="submit">Search</button>
            </form>

          </div>

          <div className="pjch__photos" data-reveal="up" data-reveal-delay="2">
            {PHOTOS.map((photo, index) => (
              <figure key={photo.image} className={`pjch__photo pjch__photo--${index + 1}`}>
                <img src={photo.image} alt={photo.alt} loading={index ? "lazy" : "eager"} />
                {photo.caption && <figcaption>{photo.caption}</figcaption>}
              </figure>
            ))}

            {/* Floating cards: live classes, Google rating, hands-on projects */}
            <p className="pjch__float pjch__float--live">
              <span className="pjch__live-dot" aria-hidden="true" />
              <span><strong>Live classes</strong><small>With the ProJenius team</small></span>
            </p>
            <a className="pjch__float pjch__float--rating" href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">
              <strong className="pjch__rating-num">{GOOGLE_RATING}</strong>
              <span>
                <span className="pjch__rating-stars" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} />)}
                </span>
                <small>{GOOGLE_REVIEW_COUNT} Google reviews</small>
              </span>
              <span className="pjch__sr"> (opens Google reviews in a new tab)</span>
            </a>
            <p className="pjch__float pjch__float--build">
              <span className="pjch__float-icon" aria-hidden="true"><Wrench size={17} /></span>
              <span><strong>Hands-on projects</strong><small>Build in every module</small></span>
            </p>
          </div>
        </div>

        <ol className="pjch__steps" aria-label="How learning works">
          {STEPS.map((step, index) => (
            <li key={step.title} data-reveal="up" data-reveal-delay={String(Math.min(index + 1, 3))}>
              <span className="pjch__step-num" aria-hidden="true">{index + 1}</span>
              <span>
                <strong>{step.title}</strong>
                <small>{step.text}</small>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
