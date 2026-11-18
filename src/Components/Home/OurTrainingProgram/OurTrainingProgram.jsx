import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import "./OurTrainingProgram.css";

import coursesImage from "../../../assets/Home/Optimized/training-courses-737.webp";
import internshipsImage from "../../../assets/Home/Optimized/training-internships-739.webp";
import workshopsImage from "../../../assets/Home/Optimized/training-workshops-800.webp";
import careerImage from "../../../assets/career-guidance/everything-you-need/everything-you-need2.jpg";

const PROGRAMS = [
  {
    title: "Career Guidance",
    label: "Future Ready",
    to: "/services/career-guidance",
    shape: "tall",
    image: careerImage,
    alt: "Learners receiving guidance for their technology careers",
  },
  {
    title: "Mentoring Program",
    label: "Skill Growth",
    to: "/services/courses",
    shape: "wide",
    image: coursesImage,
    alt: "Learners building practical skills at shared workstations",
  },
  {
    title: "IoT Workshop",
    label: "Smart Innovation",
    to: "/workshop",
    shape: "standard",
    image: workshopsImage,
    alt: "ProJenius IoT workshop introducing connected technologies",
  },
  {
    title: "Industry Internships",
    label: "Real Experience",
    to: "/services/internship",
    shape: "standard",
    image: internshipsImage,
    alt: "Interns and mentors working with robotics and electronics",
  },
  {
    title: "Programming Workshop",
    label: "Coding Skills",
    to: "/workshop",
    shape: "wide",
    image: coursesImage,
    alt: "Students learning programming through a practical project",
  },
  {
    title: "Placement Support",
    label: "Career Launch",
    to: "/services/career-guidance",
    shape: "standard",
    image: careerImage,
    alt: "A mentor helping a learner plan their next career step",
  },
];

const TRAINING_CATEGORIES = [
  { name: "Career Development", folder: "CareerDevelopment" },
  { name: "Practical Learning", folder: "PracticalLearning" },
  { name: "Hands-On Training", folder: "HandsOnTraining" },
  { name: "Industry Internships", folder: "IndustryInternships" },
  { name: "Technology Workshops", folder: "TechnologyWorkshops" },
];
const IMAGES_PER_CATEGORY = 5;
const TYPE_SPEED = 72;
const DELETE_SPEED = 36;
const HOLD_AFTER_TYPING = 1500;
const PAUSE_AFTER_DELETING = 350;

// Category images live in src/assets/Home/TrainingProgram/<Folder>/<Folder>_<1-5>.webp.
// Vite includes only files that exist, so a missing image falls back to the card's
// own existing image instead of producing a broken import.
const TRAINING_IMAGES = import.meta.glob(
  "../../../assets/Home/TrainingProgram/*/*.webp",
  { eager: true, import: "default", query: "?url" },
);

function getCategoryImage(category, imageNumber) {
  const path = `../../../assets/Home/TrainingProgram/${category.folder}/${category.folder}_${imageNumber}.webp`;
  return TRAINING_IMAGES[path];
}

/* Cards 1-5 show the active category's images 1-5; any further card keeps its own image. */
function getCardImage(category, program, index) {
  if (index >= IMAGES_PER_CATEGORY) return program.image;
  return getCategoryImage(category, index + 1) ?? program.image;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function OurTrainingProgram() {
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(() => typeof IntersectionObserver === "undefined");
  const category = TRAINING_CATEGORIES[activeCategory];
  const [reduceMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting));
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Type and erase one character per timeout while visible; each timeout is cleaned up.
  useEffect(() => {
    if (!isOnScreen || reduceMotion) return undefined;

    let delay;
    let advance;
    if (!isDeleting && typedLength < category.name.length) {
      delay = TYPE_SPEED;
      advance = () => setTypedLength((length) => length + 1);
    } else if (!isDeleting) {
      delay = HOLD_AFTER_TYPING;
      advance = () => setIsDeleting(true);
    } else if (typedLength > 0) {
      delay = DELETE_SPEED;
      advance = () => setTypedLength((length) => length - 1);
    } else {
      delay = PAUSE_AFTER_DELETING;
      advance = () => {
        setIsDeleting(false);
        setActiveCategory((current) => (current + 1) % TRAINING_CATEGORIES.length);
      };
    }

    const timer = window.setTimeout(advance, delay);
    return () => window.clearTimeout(timer);
  }, [isOnScreen, reduceMotion, activeCategory, category.name, isDeleting, typedLength]);

  const visiblePhrase = reduceMotion ? TRAINING_CATEGORIES[0].name : category.name.slice(0, typedLength);

  return (
    <section
      ref={sectionRef}
      id="home-training"
      className="pjh-training"
      aria-labelledby="pjh-training-title"
    >
      <div className="pjds-container">
        <header className="pjh-training__header">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark pjh-training__eyebrow" data-reveal="up">
            Our Training Program
          </p>
          <h2 id="pjh-training-title" className="pjh-training__title" data-reveal="up" data-reveal-delay="1">
            <span className="pjh-training__title-static">Build Skills Through</span>
            <span className="pjds-sr-only">
              {TRAINING_CATEGORIES.map((item) => item.name).join(", ")}
            </span>
            <span className="pjh-training__title-rotator" aria-hidden="true">
              <span className="pjh-training__title-measure">Technology Workshops</span>
              <span className="pjh-training__title-typed">
                {visiblePhrase}
                {!reduceMotion && <span className="pjh-training__cursor">|</span>}
              </span>
            </span>
          </h2>
          <span className="pjh-title-line" aria-hidden="true" data-reveal="line" data-reveal-delay="2" />
          <p className="pjh-training__intro" data-reveal="up" data-reveal-delay="2">
            Industry-focused programs that turn classroom knowledge into
            practical, job-ready skills.
          </p>
        </header>

        <div className="pjh-training__grid">
          {PROGRAMS.map((program, index) => (
            <Link
              key={`${program.title}-${index}`}
              to={program.to}
              className={`pjh-training__item pjh-training__item--${program.shape}`}
              data-reveal="up"
              data-reveal-delay={String(Math.min(index + 1, 6))}
              aria-label={`Explore ${program.title}`}
            >
              <span className="pjh-training__card">
                <img
                  className="pjh-training__image"
                  key={getCardImage(category, program, index)}
                  src={getCardImage(category, program, index)}
                  alt={program.alt}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
                <span className="pjh-training__shade" aria-hidden="true" />
                <span className="pjh-training__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="pjh-training__content">
                  <span className="pjh-training__label">{program.label}</span>
                  <span className="pjh-training__card-title">{program.title}</span>
                  <span className="pjh-training__cta">
                    Explore <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
