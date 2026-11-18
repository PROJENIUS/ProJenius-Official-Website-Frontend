import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { GOOGLE_REVIEWS_URL, VERIFIED_SNAPSHOT, fetchGoogleReviews } from "../../../About/Testimonials/googleReviews.js";
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from "../../../../utils/googleRating.js";
import "./CourseReviews.css";

/* =============================================================================
   REVIEWS — last section of the courses page.
   1. Published student reviews saved on the courses (admin → course → reviews).
   2. Until there are any, ProJenius's Google reviews (the same source as the
      About page), clearly labelled as Google reviews.
   ============================================================================= */

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

function Stars({ rating }) {
  return (
    <span className="pjcr__stars" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={15} className={i < Math.round(rating) ? "is-on" : undefined} aria-hidden="true" />
      ))}
    </span>
  );
}

export default function CourseReviews({ courses = [] }) {
  const courseReviews = useMemo(() => courses.flatMap((course) =>
    (course.reviews || [])
      .filter((r) => r.published === true && r.testimonial)
      .map((r, i) => ({
        id: r._id || `${course._id}-${i}`,
        name: r.studentName,
        rating: r.rating,
        text: r.testimonial,
        date: formatDate(r.reviewDate),
        role: course.title,
        photo: r.photoUrl,
      }))), [courses]);

  const useCourse = courseReviews.length > 0;
  const [google, setGoogle] = useState(VERIFIED_SNAPSHOT);
  useEffect(() => {
    if (useCourse) return undefined;
    const controller = new AbortController();
    fetchGoogleReviews(controller.signal).then(setGoogle).catch(() => {});
    return () => controller.abort();
  }, [useCourse]);

  const reviews = useCourse ? courseReviews : google.reviews.map((r) => ({ ...r, source: "google" }));
  const average = useCourse
    ? Math.round((courseReviews.reduce((n, r) => n + r.rating, 0) / courseReviews.length) * 10) / 10
    : Number(GOOGLE_RATING);
  const total = useCourse ? courseReviews.length : Number(GOOGLE_REVIEW_COUNT);

  const trackRef = useRef(null);
  const scroll = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    track.scrollBy({ left: dir * ((card?.offsetWidth || 320) + 20), behavior: "smooth" });
  };

  if (!reviews.length) return null;

  return (
    <section id="course-reviews" className="pjcr" aria-labelledby="pjcr-title">
      <div className="pjds-container">
        <div className="pjcr__top">
          <header className="pjcr__head">
            <p className="pjds-eyebrow" data-reveal="up">{useCourse ? "Student Reviews" : "Reviews"}</p>
            <h2 id="pjcr-title" className="pjcr__title" data-reveal="up" data-reveal-delay="1">
              {useCourse ? "What Our " : "What People Say "}
              <TypedPhrase phrases={useCourse ? ["Students Say.", "Learners Say."] : ["About ProJenius.", "About Our Team."]} />
            </h2>
            <SectionTitleLine />
          </header>

          <div className="pjcr__summary" data-reveal="up" data-reveal-delay="2">
            <strong>{average}</strong>
            <span>
              <Stars rating={average} />
              <small>{useCourse ? `${total} published ${total === 1 ? "review" : "reviews"}` : `${total} Google reviews`}</small>
            </span>
            {!useCourse && (
              <a href={google.url || GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                Read on Google <ArrowUpRight size={16} aria-hidden="true" />
                <span className="pjcr__sr"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        <ul ref={trackRef} className="pjcr__track" aria-label="Reviews">
          {reviews.map((review) => (
            <li key={review.id} className="pjcr__card">
              <div className="pjcr__card-top">
                <Stars rating={review.rating} />
                {review.source === "google" && <span className="pjcr__source">Google review</span>}
              </div>
              <blockquote>“{review.text}”</blockquote>
              <footer>
                {review.photo
                  ? <img src={review.photo} alt="" loading="lazy" />
                  : <span className="pjcr__avatar" aria-hidden="true">{review.name.trim().charAt(0).toUpperCase()}</span>}
                <span>
                  <strong>{review.name}</strong>
                  <small>{[review.role, review.date].filter(Boolean).join(" · ")}</small>
                </span>
              </footer>
            </li>
          ))}
        </ul>

        {reviews.length > 3 && (
          <div className="pjcr__nav">
            <button type="button" onClick={() => scroll(-1)} aria-label="Previous reviews"><ChevronLeft size={20} /></button>
            <button type="button" onClick={() => scroll(1)} aria-label="Next reviews"><ChevronRight size={20} /></button>
          </div>
        )}
      </div>
    </section>
  );
}
