import { useEffect, useRef } from "react";
import { ArrowRight, Phone } from "lucide-react";

import "./ContactSection.css";

import ContactSection_1 from "../../../assets/About/ContactSection/ContactSection_1.svg";
import ContactSection_2 from "../../../assets/About/ContactSection/ContactSection_2.svg";
import ContactSection_3 from "../../../assets/About/ContactSection/ContactSection_3.svg";

/* =============================================================================
   CLOSING CALL TO ACTION — the blue card at the end of the Home and About
   pages, also used by other pages so every page ends with the same card.
   -----------------------------------------------------------------------------
   Every prop is optional; without props it shows the Home/About content.
     id            heading id (unique per page)
     title         heading text
     description   paragraph under the heading
     features      three points: [{ title, text, icon }] where icon is an
                   image URL (black artwork, shown white) or a lucide
                   component passed as Icon
     primary       { label, href } main button (opens in a new tab)
     secondary     { label, href } second button (same tab, e.g. tel:)
   ============================================================================= */

const DEFAULT_FEATURES = [
    { title: "Fast Delivery", text: "Efficient development", icon: ContactSection_1 },
    { title: "Reliable Solutions", text: "Built for real impact", icon: ContactSection_2 },
    { title: "Dedicated Support", text: "We're here to help", icon: ContactSection_3 },
];

const DEFAULT_PRIMARY = {
    label: "Start Your Project",
    href: "https://wa.me/918925450473?text=Hi%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20ProJenius.",
};

const DEFAULT_SECONDARY = { label: "Talk to Our Team", href: "tel:+918925450473" };

export default function ContactSection({
    id = "contact-cta-title",
    title = "Let's Build Something Great Together",
    description = "Have an idea, project, or business challenge? Let's turn your vision into a powerful digital experience with the right technology and strategy.",
    features = DEFAULT_FEATURES,
    primary = DEFAULT_PRIMARY,
    secondary = DEFAULT_SECONDARY,
}) {
    const sectionRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return undefined;
        const elements = section.querySelectorAll(
            ".contact-cta-card, .contact-cta-item, .contact-cta-btn"
        );

        if (typeof IntersectionObserver === "undefined") {
            elements.forEach((element) => element.classList.add("contact-show"));
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle("contact-show", entry.isIntersecting);
                });
            },
            {
                threshold: 0.15,
            }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const openPrimary = () => {
        window.open(primary.href, "_blank", "noopener,noreferrer");
    };

    const openSecondary = () => {
        window.location.href = secondary.href;
    };

    return (
            <section ref={sectionRef} className="contact-cta-section" aria-labelledby={id}>
            <div className="contact-cta-container">
                <div className="contact-cta-card">

                    {/* HEADING */}
                    <h2 className="contact-cta-title" id={id}>
                        {title}
                    </h2>

                    {/* TITLE LINE */}
                    <div className="contact-cta-line">
                        <span></span>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="contact-cta-description">
                        {description}
                    </p>

                    {/* FEATURES */}
                    <div className="contact-cta-features">
                        {features.map((feature, index) => {
                            const { Icon } = feature;
                            return (
                                <div key={feature.title} className="contact-cta-feature-group">
                                    {index > 0 && <div className="contact-feature-divider"></div>}
                                    <div className="contact-cta-item">
                                        <div className="contact-feature-icon">
                                            {Icon ? (
                                                <Icon size={28} strokeWidth={1.9} color="#ffffff" aria-hidden="true" />
                                            ) : (
                                                <img src={feature.icon} alt="" aria-hidden="true" />
                                            )}
                                        </div>

                                        <div className="contact-feature-content">
                                            <strong>{feature.title}</strong>
                                            <span>{feature.text}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* BUTTONS */}
                    <div className="contact-cta-actions">

                        {/* PRIMARY (WhatsApp) BUTTON */}
                        <button
                            type="button"
                            className="contact-cta-btn contact-cta-primary"
                            onClick={openPrimary}
                        >
                            <span>{primary.label}</span>
                            <ArrowRight size={18} aria-hidden="true" />
                        </button>

                        {/* SECONDARY (call) BUTTON */}
                        <button
                            type="button"
                            className="contact-cta-btn contact-cta-secondary"
                            onClick={openSecondary}
                        >
                            <Phone size={17} aria-hidden="true" />
                            <span>{secondary.label}</span>
                        </button>

                    </div>
                </div>
            </div>
        </section>
    );
}
