import React, { useEffect, useRef, useState } from 'react';
import './LeadershipTeam.css';

/* IMAGES */
import karthickImg from '../../../assets/About/LeadershipTeam/LeadershipTeam_1.webp';
import harshiniImg from '../../../assets/About/LeadershipTeam/LeadershipTeam_2.webp';
import karthikaImg from '../../../assets/About/LeadershipTeam/LeadershipTeam_3.webp';

const founders = [
  {
    name: 'Karthick Ganesh M',
    role: 'Founder & CEO',
    image: karthickImg,
    bio: 'Leads the vision and strategy of the incubator, helping student entrepreneurs turn ideas into launch-ready startups.',
    socials: {
      facebook: '#',
      x: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
  {
    name: 'Harshini M',
    role: 'Co-Founder & CTO',
    image: harshiniImg,
    bio: 'Oversees technology and product development, guiding student teams to build scalable, real-world solutions and products.',
    socials: {
      facebook: '#',
      x: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
];

const leaders = [
  {
    name: 'Dr. M. Karthika',
    role: 'Strategic Advisor & Mentor',
    image: karthikaImg,
    bio: 'Provides strategic guidance and mentorship to student startups, supporting business planning, innovation, and sustainable growth.',
    socials: {
      facebook: '#',
      x: '#',
      linkedin: '#',
      instagram: '#',
    },
  },
];

/* =========================================================
   SOCIAL ICONS
========================================================= */

const icons = {
  facebook: (
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3z" />
  ),

  x: (
    <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.2 4.7H5.4l11.3 14.5z" />
  ),

  linkedin: (
    <path d="M4.5 9h3.7v11.5H4.5V9zm1.9-5.5a2.1 2.1 0 110 4.2 2.1 2.1 0 010-4.2zM10.5 9h3.5v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3.7 0 4.4 2.4 4.4 5.6v6.2h-3.7v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6h-3.7V9z" />
  ),

  instagram: (
    <path d="M8 3h8a5 5 0 015 5v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5zm0 2a3 3 0 00-3 3v8a3 3 0 003 3h8a3 3 0 003-3V8a3 3 0 00-3-3H8zm4 3.2a3.8 3.8 0 110 7.6 3.8 3.8 0 010-7.6zm0 2a1.8 1.8 0 100 3.6 1.8 1.8 0 000-3.6zm4.2-3.5a.9.9 0 110 1.8.9.9 0 010-1.8z" />
  ),
};

/* =========================================================
   SOCIAL LINKS
========================================================= */

function SocialLinks({ socials, name }) {
  if (!socials) return null;

  return (
    <div className="person-socials">
      {Object.entries(socials).map(([key, href]) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${name} on ${key}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {icons[key]}
          </svg>
        </a>
      ))}
    </div>
  );
}

/* =========================================================
   SCROLL REVEAL
========================================================= */

function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* =========================================================
   TYPEWRITER TEXT (blue words in the headings)

   - types letter by letter with a blinking cursor
   - holds, deletes, then types again (loops while on screen)
   - add more words to the `words` array to rotate between them,
     e.g. words={['Founders', 'Leaders']}
   - an invisible copy reserves the space, so the white text next
     to it never shifts while typing
========================================================= */

const TYPE_START_MS = 350; // wait before the first letter
const TYPE_MS = 90; // speed of typing each letter
const DELETE_MS = 45; // speed of deleting each letter
const HOLD_MS = 1800; // pause when the word is fully typed
const GAP_MS = 300; // pause when the word is fully deleted

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function TypedText({ words }) {
  const [ref, inView] = useInView(0.4);
  const [wordIndex, setWordIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const reduce = prefersReducedMotion();
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), '');
  const current = words[wordIndex];

  useEffect(() => {
    if (reduce) return undefined;

    /* off screen -> reset, so it types again when you come back */
    if (!inView) {
      setWordIndex(0);
      setCount(0);
      setDeleting(false);
      return undefined;
    }

    let delay;
    let next;

    if (!deleting) {
      if (count < current.length) {
        delay = count === 0 ? TYPE_START_MS : TYPE_MS;
        next = () => setCount((c) => c + 1);
      } else {
        delay = HOLD_MS;
        next = () => setDeleting(true);
      }
    } else if (count > 0) {
      delay = DELETE_MS;
      next = () => setCount((c) => c - 1);
    } else {
      delay = GAP_MS;
      next = () => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      };
    }

    const timer = setTimeout(next, delay);

    return () => clearTimeout(timer);
  }, [inView, count, deleting, current, words.length, reduce]);

  const shown = reduce ? current : current.slice(0, count);

  return (
    <span ref={ref} className="title-highlight typed-wrap">
      {/* real text for screen readers */}
      <span className="typed-sr">{words[0]}</span>

      {/* invisible full-size copy keeps the layout steady */}
      <span className="typed-sizer" aria-hidden="true">
        {longest}
      </span>

      {/* the visible typed text */}
      <span className="typed-live" aria-hidden="true">
        {shown}
        {!reduce && inView && <span className="typed-caret" />}
      </span>
    </span>
  );
}

/* =========================================================
   PERSON CARD
========================================================= */

function PersonCard({
  name,
  role,
  bio,
  image,
  socials,
  index = 0,
}) {
  const [ref, inView] = useInView();

  return (
    <article
      ref={ref}
      className={`person-card${inView ? ' is-visible' : ''}`}
      style={{ '--d': `${index * 0.15}s` }}
    >
      <div className="person-photo" onContextMenu={(event) => event.preventDefault()}>

        {image && (
          <img
            src={image}
            alt={`${name}, ${role}`}
            loading="lazy"
            draggable={false}
          />
        )}

        <SocialLinks
          socials={socials}
          name={name}
        />

      </div>

      <div className="person-text">
        <h3 className="person-name">
          {name}
        </h3>

        <p className="person-role">
          {role}
        </p>

        <p className="person-bio">
          {bio}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   LEADERSHIP TEAM
   One <section> holds both blocks: the site colours sections
   light/dark by their position on the page, so a second
   <section> here would flip every section below it.
========================================================= */

function LeadershipTeam() {
  return (
    <section id="about-leadership" className="leadership-team">
      {/* FOUNDERS */}
      <div className="founders-section">
        <div className="section-inner">

          <p className="pjds-eyebrow section-tag" data-reveal="up">
            Leadership Team
          </p>

          <h2 className="section-title" data-reveal="up" data-reveal-delay="1">
            <span className="section-title-static">Meet Our</span>
            <TypedText words={['Founders']} />
          </h2>

          <span
            className="title-underline"
            aria-hidden="true"
            data-reveal="line"
            data-reveal-delay="2"
          />

          <p className="section-description" data-reveal="up" data-reveal-delay="2">
            Leading our mission to nurture student innovators and turn ideas into real-world ventures.
          </p>

          <div className="founders-cards-container">
            {founders.map((person, index) => (
              <PersonCard
                key={person.name}
                index={index}
                {...person}
              />
            ))}
          </div>

        </div>
      </div>

      {/* STRATEGIC ADVISOR */}
      <div className="founders-section leadership-section">
        <div className="section-inner">
          {/* No "Leadership Team" pill here: the Founders heading above already has it. */}
          <h2 className="section-title" data-reveal="up" data-reveal-delay="1">
            <span className="section-title-static">Meet Our</span>
            <TypedText words={['Strategic Advisor']} />
          </h2>

          <span
            className="title-underline"
            aria-hidden="true"
            data-reveal="line"
            data-reveal-delay="2"
          />

          <p className="section-description" data-reveal="up" data-reveal-delay="2">
            Guiding our student startups with strategic advice and mentorship.
          </p>

          <div className="leader-cards-container">
            {leaders.map((person) => (
              <PersonCard
                key={person.name}
                {...person}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default LeadershipTeam;
