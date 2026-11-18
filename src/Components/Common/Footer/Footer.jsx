import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowUpRight, Check, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";

import { normalizeApiBase, resolveApiUrl } from "../../../utils/apiUrl.js";

import "./Footer.css";
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from "../../../utils/googleRating.js";

/* =============================================================================
   FOOTER
   -----------------------------------------------------------------------------
   Every class is prefixed pjh-footer and scoped beneath the .pjh-footer root.
   Layout: newsletter band │ brand + reviews │ Solutions │ Learning &
   Development │ Company + contact │ Find Us map │ wordmark │ legal bar.
   Links mirror the approved Navbar structure; the newsletter posts to the
   real /api/newsletter/subscribe endpoint.
   ============================================================================= */

/* ---------- Company details ---------- */
const PHONE_DISPLAY = "+91 89254 50473";
const PHONE_HREF = "tel:+918925450473";
const EMAIL = "teamprojenius@gmail.com";
const WHATSAPP_HREF = "https://wa.me/918925450473";
const GOOGLE_REVIEWS_HREF = "https://g.page/r/CZjzujTb9EXCEBM/review";
/* Google rating and review count: src/utils/googleRating.js (shared). */
/* Both map links target the ProJenius Google Business listing itself (place
   0x3b00cfb5c8f13bb3:0xc245f4db34baf398, the same place the review link opens;
   pin 9.9136785, 78.0901833), so they always show the real office. */
const MAPS_VIEW_HREF =
  "https://www.google.com/maps/place/data=!4m2!3m1!1s0x3b00cfb5c8f13bb3:0xc245f4db34baf398";
const MAPS_DIRECTIONS_HREF =
  "https://www.google.com/maps/dir//ProJenius+Innovation+Technology+Private+Limited,+PLOT+NO+3,+Erikarai+St,+Velmurugan+Nagar,+Namachivaya+Nagar,+Madurai,+Tamil+Nadu+625003/@9.9136785,78.0901833,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3b00cfb5c8f13bb3:0xc245f4db34baf398!2m2!1d78.0901833!2d9.9136785";

/* Same order as the navbar Solutions menu. */
const SOLUTIONS = [
  { label: "Software Development", to: "/services/development" },
  { label: "PCB Design & Fabrication", to: "/services/pcb-design-fabrication" },
  { label: "Hardware & Embedded Systems", to: "/services/hardware-embedded-systems" },
  { label: "Rapid Prototyping", to: "/services/rapid-prototyping" },
];

const LEARNING = [
  { label: "Courses", to: "/services/courses" },
  { label: "Internships", to: "/services/internship" },
  { label: "Workshops", to: "/workshop" },
  { label: "Career Guidance", to: "/services/career-guidance" },
];

const SOCIALS = [
  { label: "Email ProJenius", href: `mailto:${EMAIL}`, icon: "mail", external: false },
  { label: "WhatsApp", href: WHATSAPP_HREF, icon: "whatsapp", external: true },
  { label: "Instagram", href: "https://www.instagram.com/projenius_?stkn=OXEwaXF4Z3g4d3Zw", icon: "instagram", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/projenius/", icon: "linkedin", external: true },
  { label: "Facebook", href: "https://www.facebook.com/share/1DMJDDqupb/", icon: "facebook", external: true },
];

/* ---------- Inline brand icons (lucide no longer ships brand logos) ---------- */
const svgProps = {
  width: 19,
  height: 19,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

function SocialIcon({ name }) {
  switch (name) {
    case "mail":
      return <Mail size={19} strokeWidth={2.2} aria-hidden="true" />;
    case "whatsapp":
      return <MessageCircle size={19} strokeWidth={2.2} aria-hidden="true" />;
    case "instagram":
      return (
        <svg {...svgProps}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...svgProps}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...svgProps}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    default:
      return null;
  }
}

function GoogleG() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/* Stylised map drawing (decorative); the link opens the real Google Maps location. */
function MapArt() {
  return (
    <svg viewBox="0 0 400 275" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g className="pjh-footer__road" strokeWidth="2.5">
        <path d="M0 40H400M0 100H400M0 160H400M0 220H400" />
        <path d="M40 0V275M110 0V275M180 0V275M250 0V275M330 0V275" />
      </g>
      <g className="pjh-footer__road" strokeWidth="1.5">
        <path d="M0 70H400M0 130H400M0 190H400M0 250H400M75 0V275M145 0V275M215 0V275M290 0V275M365 0V275" />
      </g>
      <path className="pjh-footer__road pjh-footer__road--main" strokeWidth="7" d="M-10 245 L130 215 L420 262" />
      <path className="pjh-footer__road pjh-footer__road--main" strokeWidth="10" d="M318 -10 L296 120 L268 285" />
      <path className="pjh-footer__road-center" d="M318 -10 L296 120 L268 285" />
      <polygon className="pjh-footer__area" points="62,78 262,78 262,206 118,206 118,150 62,150" />
      <circle className="pjh-footer__pin-pulse" cx="196" cy="150" r="30" />
      <g transform="translate(196 150)">
        <path d="M0 0C-12-14-14-20-14-27a14 14 0 0 1 28 0C14-20 12-14 0 0z" className="pjh-footer__pin" />
        <circle cx="0" cy="-27" r="5.5" className="pjh-footer__pin-dot" />
      </g>
      <text className="pjh-footer__map-label" x="80" y="112" fontSize="17">Velmurugan Nagar</text>
      <text className="pjh-footer__map-sub" x="80" y="132" fontSize="14">Madurai</text>
    </svg>
  );
}

function LinkList({ items }) {
  return (
    <ul className="pjh-footer__links">
      {items.map(({ label, to }) => (
        <li key={label}>
          <Link to={to}>{label}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const [newsletterState, setNewsletterState] = useState({ busy: false, message: "", error: false, warning: false });
  const newsletterSubmitting = useRef(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (newsletterSubmitting.current) return;
    const form = e.currentTarget;
    const email = form.elements.email.value;
    const consent = form.elements.namedItem("consent");
    if (!consent?.checked) {
      setNewsletterState({ busy: false, message: "Please agree to receive email updates before subscribing.", error: true });
      return;
    }
    newsletterSubmitting.current = true;
    setNewsletterState({ busy: true, message: "Submitting your subscription…", error: false });
    try {
      const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
      const apiBase = normalizeApiBase(configuredApiBaseUrl, import.meta.env.DEV);
      if (!apiBase) throw new Error("Newsletter signup is temporarily unavailable.");
      const response = await fetch(resolveApiUrl("/api/newsletter/subscribe", apiBase, window.location.origin), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, consent: consent.checked }) });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || "We could not process your request. Please try again.");
      if (!body || !["subscribed", "already_subscribed"].includes(body.status) || typeof body.message !== "string" || !body.message.trim()) throw new Error("We could not confirm your subscription. Please try again.");
      setNewsletterState({ busy: false, message: body.message, error: false, warning: ["queued", "failed"].includes(body.emailStatus) });
      form.reset();
    } catch (error) {
      setNewsletterState({ busy: false, message: error instanceof TypeError ? "We could not connect right now. Please try again." : error.message, error: true });
    } finally {
      newsletterSubmitting.current = false;
    }
  };

  const messageState = newsletterState.message ? (newsletterState.error ? " is-error" : newsletterState.warning ? " is-warning" : " is-success") : "";

  return (
    <footer className="pjh-footer" aria-label="ProJenius site footer">
      <div className="pjh-footer__inner">
        {/* NEWSLETTER */}
        <section className="pjh-footer__news" aria-labelledby="pjh-footer-news-title">
          <h2 className="pjh-footer__news-title" id="pjh-footer-news-title">
            Join <b>Newsletter</b>
          </h2>

          <div className="pjh-footer__news-form">
            <form id="footer-newsletter-form" onSubmit={handleNewsletter}>
              <div className="pjh-footer__news-row">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  aria-label="Your email address"
                  autoComplete="email"
                  required
                  disabled={newsletterState.busy}
                  onInvalid={() => setNewsletterState({ busy: false, message: "Enter a valid email address to subscribe.", error: true })}
                />
                <button type="submit" disabled={newsletterState.busy}>
                  {newsletterState.busy ? "Please wait" : "Subscribe"}
                </button>
              </div>
            </form>

            <label className="pjh-footer__consent">
              <input form="footer-newsletter-form" name="consent" type="checkbox" required disabled={newsletterState.busy} onInvalid={() => setNewsletterState({ busy: false, message: "Please agree to receive email updates before subscribing.", error: true })} />
              <span className="pjh-footer__box" aria-hidden="true">
                <Check size={13} strokeWidth={4} />
              </span>
              <span>
                I agree to receive ProJenius email updates. I can unsubscribe anytime.{" "}
                <Link to="/privacy-policy">Privacy Policy</Link>
              </span>
            </label>

            <p
              className={`pjh-footer__news-msg${messageState}`}
              role={newsletterState.error ? "alert" : "status"}
              aria-live="polite"
            >
              {newsletterState.message}
            </p>
          </div>
        </section>

        {/* MAIN GRID: brand | Solutions | Learning | Company | Get in touch */}
        <div className="pjh-footer__grid">
          {/* BRAND */}
          <div className="pjh-footer__brand-col">
            <Link className="pjh-footer__brand" to="/" aria-label="ProJenius home">
              <span className="pjh-footer__brand-mark">
                <img src="/ProJenius_Logo.svg" alt="ProJenius Innovation Technology" width="38" height="38" />
              </span>
              <span className="pjh-footer__brand-name">
                Pro<span>Jenius</span>
              </span>
            </Link>
            <p className="pjh-footer__company">
              <span>ProJenius Innovation Technology</span>
              <span>Private Limited</span>
            </p>

            <p className="pjh-footer__tagline">
              Improve efficiency and provide a better customer experience with modern technology
              services tailored for your success.
            </p>

            <div className="pjh-footer__socials">
              {SOCIALS.map(({ label, href, icon, external }) => (
                <a
                  key={icon}
                  className="pjh-footer__social"
                  href={href}
                  aria-label={external ? `${label} (opens in a new tab)` : label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <SocialIcon name={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* COMPANY */}
          <nav aria-label="Footer: Company">
            <h3 className="pjh-footer__col-title">Company</h3>
            <ul className="pjh-footer__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/startup">Startup &amp; Innovation</Link></li>
              <li><Link to="/startup#startup-incubate">Incubate at ProJenius</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/join-our-team">Join Our Team</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </nav>

          {/* SOLUTIONS */}
          <nav aria-label="Footer: Solutions">
            <h3 className="pjh-footer__col-title">Solutions</h3>
            <LinkList items={SOLUTIONS} />
          </nav>

          {/* LEARNING & DEVELOPMENT */}
          <nav aria-label="Footer: Learning and Development">
            <h3 className="pjh-footer__col-title">Learning &amp; Development</h3>
            <LinkList items={LEARNING} />
          </nav>

          {/* GET IN TOUCH */}
          <div>
            <h3 className="pjh-footer__col-title">Get in Touch</h3>
            <ul className="pjh-footer__contact">
              <li>
                <a className="pjh-footer__contact-item" href={PHONE_HREF}>
                  <span className="pjh-footer__contact-icon" aria-hidden="true">
                    <Phone size={17} strokeWidth={2.2} />
                  </span>
                  <span>
                    <small>Call us</small>
                    <span>{PHONE_DISPLAY}</span>
                  </span>
                </a>
              </li>
              <li>
                <a className="pjh-footer__contact-item" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                  <span className="pjh-footer__contact-icon" aria-hidden="true">
                    <MessageCircle size={17} strokeWidth={2.2} />
                  </span>
                  <span>
                    <small>WhatsApp</small>
                    <span>Chat with our team</span>
                  </span>
                  <span className="pjds-sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a className="pjh-footer__contact-item" href={`mailto:${EMAIL}`}>
                  <span className="pjh-footer__contact-icon" aria-hidden="true">
                    <Mail size={17} strokeWidth={2.2} />
                  </span>
                  <span>
                    <small>Email</small>
                    <span>{EMAIL}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* INFO STRIP: Google reviews | office location */}
        <div className="pjh-footer__strip">
          <a
            className="pjh-footer__card pjh-footer__review"
            href={GOOGLE_REVIEWS_HREF}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="pjh-footer__g-badge">
              <GoogleG />
            </span>
            <span className="pjh-footer__review-body">
              <span className="pjh-footer__card-title">Google Reviews</span>
              <span
                className="pjh-footer__rating"
                role="img"
                aria-label={`Rated ${GOOGLE_RATING} out of 5 from ${GOOGLE_REVIEW_COUNT} Google reviews`}
              >
                <b aria-hidden="true">{GOOGLE_RATING}</b>
                <span className="pjh-footer__stars" aria-hidden="true">★★★★★</span>
                <span aria-hidden="true">{GOOGLE_REVIEW_COUNT} Reviews</span>
              </span>
              <span className="pjh-footer__card-text">See what our clients and learners say about ProJenius.</span>
            </span>
            <span className="pjh-footer__card-cta">
              Read reviews <ArrowUpRight size={15} strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span className="pjds-sr-only">(opens in a new tab)</span>
          </a>

          <div className="pjh-footer__card pjh-footer__location">
            <a
              className="pjh-footer__map"
              href={MAPS_VIEW_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the ProJenius location in Google Maps (opens in a new tab)"
            >
              <MapArt />
            </a>
            <div className="pjh-footer__location-body">
              <span className="pjh-footer__card-title">Visit Our Office</span>
              <address className="pjh-footer__address">
                <MapPin size={16} strokeWidth={2.2} aria-hidden="true" />
                <span>
                  Plot No 3, Erikarai Street, Velmurugan Nagar, Namachivaya Nagar,
                  Madurai, Tamil Nadu 625003.
                </span>
              </address>
              <div className="pjh-footer__location-actions">
                <a
                  className="pjh-footer__directions"
                  href={MAPS_DIRECTIONS_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                  <Navigation size={16} strokeWidth={2.4} aria-hidden="true" />
                  <span className="pjds-sr-only">(opens Google Maps in a new tab)</span>
                </a>
                <a
                  className="pjh-footer__text-link"
                  href={MAPS_VIEW_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Maps
                  <ArrowUpRight size={15} strokeWidth={2.4} aria-hidden="true" />
                  <span className="pjds-sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pjh-footer__wordmark" aria-hidden="true">
          ProJenius
        </div>

        {/* LEGAL */}
        <div className="pjh-footer__legal">
          <span>© Copyright 2026 ProJenius Innovation Technology Private Limited. All rights reserved.</span>
          <nav className="pjh-footer__legal-links" aria-label="Legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
            <Link to="/services/courses/terms">Live Training Refund Policy</Link>
          </nav>
          <button
            type="button"
            className="pjh-footer__top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top
            <ArrowUp size={14} strokeWidth={2.6} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
