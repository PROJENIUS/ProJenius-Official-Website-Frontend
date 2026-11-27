import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { GA_ID, OPEN_EVENT, loadAnalytics, readConsent, saveConsent, trackPageView } from "./cookieConsent.js";
import "./CookieNotice.css";

/* =============================================================================
   COOKIE NOTICE — a compact card in the corner (it never blocks the page).
   Three clear choices: Accept (essential + analytics), Deny (essential only)
   and Customize (shows each cookie type with a switch). The choice is kept in
   the browser; "Cookie settings" in the footer and on the Cookie Policy page
   opens the card again in its Customize view. Analytics loads only after
   Accept, and only when an analytics ID is configured.
   ============================================================================= */

export default function CookieNotice() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() => !readConsent());
  const [view, setView] = useState("summary");
  const [analyticsOn, setAnalyticsOn] = useState(() => readConsent() === "analytics");
  const cardRef = useRef(null);
  const analyticsAvailable = Boolean(GA_ID);

  useEffect(() => {
    if (readConsent() === "analytics") loadAnalytics();
    const show = () => {
      setAnalyticsOn(readConsent() === "analytics");
      setView("customize");
      setOpen(true);
      // Opened on purpose from a "Cookie settings" button: move focus to it.
      window.requestAnimationFrame(() => cardRef.current?.focus());
    };
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  useEffect(() => { trackPageView(pathname); }, [pathname]);

  if (!open) return null;
  const choose = (value) => { saveConsent(value); setOpen(false); setView("summary"); };
  const close = () => choose(readConsent() || "essential");

  return (
    <section
      ref={cardRef}
      tabIndex={-1}
      className={`pj-cookie${view === "customize" ? " is-customizing" : ""}`}
      role="region"
      aria-labelledby="pj-cookie-title"
      onKeyDown={(event) => { if (event.key === "Escape") close(); }}
    >
      <header className="pj-cookie__head">
        <span className="pj-cookie__brand">
          <img src="/ProJenius_Logo.svg" alt="" width="34" height="34" />
          <span>
            <strong id="pj-cookie-title">ProJenius</strong>
            <small>Cookie preferences</small>
          </span>
        </span>
        <button type="button" className="pj-cookie__close" onClick={close} aria-label="Close and keep essential cookies only">
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      {view === "summary" ? (
        <>
          <p className="pj-cookie__text">
            We use essential cookies to run this website. With your consent, we also use Google Analytics to understand
            how the site is used and improve it. We never use them for advertising. You can change your choice at any
            time under <strong>Cookie settings</strong> in the footer.
          </p>
          <div className="pj-cookie__actions">
            <button type="button" className="pj-cookie__btn pj-cookie__btn--primary" onClick={() => choose("analytics")}>Accept</button>
            <button type="button" className="pj-cookie__btn" onClick={() => choose("essential")}>Deny</button>
            <button type="button" className="pj-cookie__btn" onClick={() => setView("customize")}>Customize</button>
          </div>
        </>
      ) : (
        <>
          <ul className="pj-cookie__list">
            <li>
              <div>
                <strong>Essential</strong>
                <small>Remembers your cookie choice and keeps the site working.</small>
              </div>
              <span className="pj-cookie__always">Always on</span>
            </li>
            <li>
              <div>
                <strong>Analytics</strong>
                <small>{analyticsAvailable ? "Google Analytics: which pages help visitors. No advertising." : "Not active on this website right now."}</small>
              </div>
              <label className={`pj-cookie__switch${analyticsAvailable ? "" : " is-disabled"}`}>
                <input type="checkbox" checked={analyticsAvailable && analyticsOn} disabled={!analyticsAvailable} onChange={(event) => setAnalyticsOn(event.target.checked)} />
                <span aria-hidden="true" />
                <span className="pjds-sr-only">Allow analytics cookies</span>
              </label>
            </li>
            <li>
              <div>
                <strong>Other services</strong>
                <small>Razorpay (payments) and YouTube may set their own cookies when you use them.</small>
              </div>
              <span className="pj-cookie__always">When used</span>
            </li>
          </ul>
          <div className="pj-cookie__actions">
            <button type="button" className="pj-cookie__btn pj-cookie__btn--primary" onClick={() => choose(analyticsOn && analyticsAvailable ? "analytics" : "essential")}>Save my choice</button>
            <button type="button" className="pj-cookie__btn" onClick={() => choose("analytics")}>Accept all</button>
            <button type="button" className="pj-cookie__btn pj-cookie__btn--icon" onClick={() => setView("summary")} aria-label="Back"><ArrowLeft size={18} aria-hidden="true" /></button>
          </div>
        </>
      )}

      <p className="pj-cookie__more">
        Read the <Link to="/cookie-policy">Cookie Policy</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.
      </p>
    </section>
  );
}
