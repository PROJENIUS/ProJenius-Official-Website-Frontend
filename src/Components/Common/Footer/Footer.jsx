import React, { useRef, useState } from "react";

import FooterHero_2 from "../../../assets/Footer/FooterHero/FooterHero_2.svg";
import FooterHero_3 from "../../../assets/Footer/FooterHero/FooterHero_3.svg";
import FooterHero_4 from "../../../assets/Footer/FooterHero/FooterHero_4.svg";
import FooterHero_5 from "../../../assets/Footer/FooterHero/FooterHero_5.svg";
import FooterHero_6 from "../../../assets/Footer/FooterHero/FooterHero_6.svg";
import FooterHero_7 from "../../../assets/Footer/FooterHero/FooterHero_7.svg";
import FooterHero_8 from "../../../assets/Footer/FooterHero/FooterHero_8.svg";
import FooterHero_9 from "../../../assets/Footer/FooterHero/FooterHero_9.svg";
import { normalizeApiBase, resolveApiUrl } from "../../../utils/apiUrl.js";

import "./Footer.css";

// Update this mapping if your numbered SVGs contain
// different icons from the assumed order.
const footerIcons = {
    email: FooterHero_2,
    whatsapp: FooterHero_3,
    instagram: FooterHero_4,
    linkedin: FooterHero_5,
    facebook: FooterHero_6,
    location: FooterHero_7,
    phone: FooterHero_8,
    arrow: FooterHero_9,
};

const GOOGLE_REVIEWS_URL =
    "https://g.page/r/CZjzujTb9EXCEBM/review";

const MAP_URL =
    "https://www.google.com/maps/search/?api=1&query=Velmurugan+Nagar,+Madurai,+Tamil+Nadu+625003";

export default function Footer() {
    const [newsletterState, setNewsletterState] = useState({ busy: false, message: "", error: false });
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
            setNewsletterState({ busy: false, message: body.message, error: false });
            form.reset();
        } catch (error) {
            setNewsletterState({ busy: false, message: error instanceof TypeError ? "We could not connect right now. Please try again." : error.message, error: true });
        } finally {
            newsletterSubmitting.current = false;
        }
    };

    return (
        <footer className="pro-footer">

            {/* ================= TOP BAR ================= */}
            <div className="footer-top">
                <div className="footer-top-inner">

                    {/* COMPANY LOGO */}
                    <div className="footer-call-content">
                        <div className="footer-logo">
                            <img
                                src="/ProJenius_Logo.svg"
                                alt="ProJenius Innovation Technology"
                                className="footer-logo-image"
                            />

                            <div className="footer-logo-text">
                                Pro<span>Jenius</span>
                            </div>
                        </div>

                        <h3>
                            ProJenius Innovation Technology Private Limited
                        </h3>
                    </div>

                    {/* NEWSLETTER */}
                    <div className="footer-newsletter">
                        <div className="newsletter-title">
                            Join <strong>Newsletter</strong>
                        </div>

                        <form id="footer-newsletter-form" onSubmit={handleNewsletter}>
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
                                {newsletterState.busy ? "Sending…" : "Subscribe"}
                            </button>
                        </form>
                        <label className="footer-newsletter-consent"><input form="footer-newsletter-form" name="consent" type="checkbox" required disabled={newsletterState.busy} onInvalid={() => setNewsletterState({ busy: false, message: "Please agree to receive email updates before subscribing.", error: true })} /> I agree to receive ProJenius email updates. I can unsubscribe anytime.</label>
                        <p className={newsletterState.error ? "footer-newsletter-message is-error" : "footer-newsletter-message"} role={newsletterState.error ? "alert" : "status"} aria-live="polite">{newsletterState.message}</p>
                    </div>

                </div>
            </div>

            {/* ================= MAIN FOOTER ================= */}
            <div className="footer-main">
                <div className="footer-grid">

                    {/* COMPANY INFORMATION */}
                    <div className="footer-company">

                        {/* GOOGLE REVIEWS */}
                        <a
                            href={GOOGLE_REVIEWS_URL}
                            className="footer-google-review"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View ProJenius Google Reviews"
                        >
                            <span className="google-review-icon">
                                G
                            </span>

                            <span className="google-review-content">
                                <span className="google-review-title">
                                    Google Reviews
                                </span>

                                <span className="google-review-meta">
                                    <strong>4.8</strong>

                                    <span className="google-stars">
                                        ★★★★★
                                    </span>

                                    <span className="google-review-count">
                                        100+ Reviews
                                    </span>
                                </span>
                            </span>

                            <span
                                className="google-review-arrow"
                                aria-hidden="true"
                            >
                                ↗
                            </span>
                        </a>

                        {/* DESCRIPTION */}
                        <p className="footer-company-description">
                            Improve efficiency and provide a better
                            customer experience with modern technology
                            services tailored for your success.
                        </p>

                        {/* SOCIAL MEDIA */}
                        <div className="footer-socials">

                            <a
                                href="mailto:teamprojenius@gmail.com"
                                aria-label="Email ProJenius"
                            >
                                <img
                                    src={footerIcons.email}
                                    alt=""
                                />
                            </a>

                            <a
                                href="https://wa.me/918925450473"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                            >
                                <img
                                    src={footerIcons.whatsapp}
                                    alt=""
                                />
                            </a>

                            <a
                                href="https://www.instagram.com/projenius_?stkn=OXEwaXF4Z3g4d3Zw"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                            >
                                <img
                                    src={footerIcons.instagram}
                                    alt=""
                                />
                            </a>

                            <a
                                href="https://www.linkedin.com/company/projenius/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                            >
                                <img
                                    src={footerIcons.linkedin}
                                    alt=""
                                />
                            </a>

                            <a
                                href="https://www.facebook.com/share/1DMJDDqupb/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                            >
                                <img
                                    src={footerIcons.facebook}
                                    alt=""
                                />
                            </a>

                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div className="footer-column">
                        <h3 className="footer-heading">
                            Quick Links
                        </h3>

                        <div className="footer-heading-line" />

                        <ul className="footer-links">
                            <li>
                                <a href="/">
                                    <span>›</span> Home
                                </a>
                            </li>

                            <li>
                                <a href="/about">
                                    <span>›</span> About
                                </a>
                            </li>

                            <li>
                                <a href="/services/courses">
                                    <span>›</span> Courses
                                </a>
                            </li>
                            <li><a href="/news-insights"><span>›</span> News &amp; Insights</a></li>

                            <li>
                                <a href="/services/internship">
                                    <span>›</span> Internship
                                </a>
                            </li>

                            <li>
                                <a href="/workshop">
                                    <span>›</span> Workshop
                                </a>
                            </li>

                            <li>
                                <a href="/startup">
                                    <span>›</span> Startup Supporter
                                </a>
                            </li>

                            <li>
                                <a href="/contact">
                                    <span>›</span> Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* CONTACT INFORMATION */}
                    <div className="footer-column">
                        <h3 className="footer-heading">
                            Contact
                        </h3>

                        <div className="footer-heading-line" />

                        {/* ADDRESS */}
                        <div className="footer-contact-item">
                            <div className="footer-contact-icon">
                                <img
                                    src={footerIcons.location}
                                    alt=""
                                />
                            </div>

                            <p>
                                Plot No 3, Erikarai Street,
                                <br />
                                Velmurugan Nagar,
                                <br />
                                Namachivaya Nagar,
                                <br />
                                Madurai - 16,
                                <br />
                                Tamil Nadu 625016.
                            </p>
                        </div>

                        {/* EMAIL */}
                        <div className="footer-contact-item">
                            <div className="footer-contact-icon">
                                <img
                                    src={footerIcons.email}
                                    alt=""
                                />
                            </div>

                            <a href="mailto:teamprojenius@gmail.com">
                                teamprojenius@gmail.com
                            </a>
                        </div>

                        {/* PHONE */}
                        <div className="footer-contact-item">
                            <div className="footer-contact-icon">
                                <img
                                    src={footerIcons.phone}
                                    alt=""
                                />
                            </div>

                            <a href="tel:+918925450473">
                                +91 89254 50473
                            </a>
                        </div>
                    </div>

                    {/* FIND US */}
                    <div className="footer-column footer-find">
                        <h3 className="footer-heading">
                            Find Us
                        </h3>

                        <div className="footer-heading-line" />

                        {/* GOOGLE MAP */}
                        <div className="footer-map">
                            <iframe
                                title="ProJenius location in Madurai"
                                src="https://www.google.com/maps?q=Velmurugan+Nagar,+Madurai,+Tamil+Nadu+625003&output=embed"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />

                            <a
                                className="map-label"
                                href={MAP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Maps ↗
                            </a>
                        </div>

                        <p className="footer-location">
                            Madurai, Tamil Nadu, India.
                        </p>

                        <a
                            className="direction-btn"
                            href={MAP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Get Directions

                            <img
                                src={footerIcons.arrow}
                                alt=""
                            />
                        </a>
                    </div>

                </div>

                {/* ================= BOTTOM BAR ================= */}
                <div className="footer-bottom">
                    <p>
                        © Copyright 2026 ProJenius Innovation Technology
                        Private Limited. All rights reserved.
                    </p>

                    <div className="footer-bottom-links">
                        <a href="/privacy-policy">
                            Privacy Policy
                        </a>

                        <a href="/terms">
                            Terms &amp; Conditions
                        </a>
                        <a href="/services/courses/terms">
                            Live Training Refund Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
