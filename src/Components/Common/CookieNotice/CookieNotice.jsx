import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { GA_ID, OPEN_EVENT, loadAnalytics, readConsent, saveConsent, trackPageView } from "./cookieConsent.js";
import "./CookieNotice.css";

/* Cookie popup: a centred dialog shown until the visitor chooses. It lists
   exactly what the site uses. Analytics can only be switched on when an
   analytics ID is configured; otherwise only essential storage is used. */
export default function CookieNotice() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(() => !readConsent());
  const [analyticsOn, setAnalyticsOn] = useState(() => readConsent() === "analytics");
  const firstButton = useRef(null);
  const analyticsAvailable = Boolean(GA_ID);

  useEffect(() => {
    if (readConsent() === "analytics") loadAnalytics();
    const show = () => { setAnalyticsOn(readConsent() === "analytics"); setOpen(true); };
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  useEffect(() => { trackPageView(pathname); }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    firstButton.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") choose(readConsent() || "essential"); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;
  function choose(value) { saveConsent(value); setOpen(false); }

  return (
    <div className="pj-cookie-overlay" role="presentation">
      <section className="pj-cookie" role="dialog" aria-modal="true" aria-labelledby="pj-cookie-title" aria-describedby="pj-cookie-intro">
        <button type="button" className="pj-cookie__close" onClick={() => choose(readConsent() || "essential")} aria-label="Close and keep essential cookies only">
          <X size={18} aria-hidden="true" />
        </button>

        <span className="pj-cookie__icon" aria-hidden="true"><Cookie size={26} /></span>
        <h2 id="pj-cookie-title" className="pj-cookie__title">We use cookies</h2>
        <p id="pj-cookie-intro" className="pj-cookie__intro">
          Cookies are small files saved in your browser. Here is exactly what this website uses, so you can choose.
        </p>

        <ul className="pj-cookie__list">
          <li>
            <div>
              <strong>Essential</strong>
              <small>Remembers your cookie choice. Needed for the site to work.</small>
            </div>
            <span className="pj-cookie__always">Always on</span>
          </li>
          <li>
            <div>
              <strong>Analytics</strong>
              <small>{analyticsAvailable ? "Google Analytics shows us which pages help visitors. No advertising." : "Not used on this website right now."}</small>
            </div>
            <label className={`pj-cookie__switch${analyticsAvailable ? "" : " is-disabled"}`}>
              <input type="checkbox" checked={analyticsAvailable && analyticsOn} disabled={!analyticsAvailable} onChange={(e) => setAnalyticsOn(e.target.checked)} />
              <span aria-hidden="true" />
              <span className="pjds-sr-only">Allow analytics cookies</span>
            </label>
          </li>
          <li>
            <div>
              <strong>Other services</strong>
              <small>Razorpay (payments), Google Maps and YouTube may set their own cookies when you use them.</small>
            </div>
            <span className="pj-cookie__always">When used</span>
          </li>
        </ul>

        <div className="pj-cookie__actions">
          {analyticsAvailable ? (
            <>
              <button type="button" className="pj-cookie__btn" onClick={() => choose(analyticsOn ? "analytics" : "essential")}>Save my choice</button>
              <button ref={firstButton} type="button" className="pj-cookie__btn pj-cookie__btn--primary" onClick={() => choose("analytics")}>Accept all</button>
            </>
          ) : (
            <button ref={firstButton} type="button" className="pj-cookie__btn pj-cookie__btn--primary" onClick={() => choose("essential")}>Got it</button>
          )}
        </div>
        <p className="pj-cookie__more">
          Read more in our <Link to="/cookie-policy" onClick={() => choose(readConsent() || "essential")}>Cookie Policy</Link>. You can change your choice any time from the footer.
        </p>
      </section>
    </div>
  );
}
