import React, { useEffect } from "react";
import "./ContactSection.css";

import ContactSection_1 from "../../../assets/Home/ContactSection/ContactSection_1.svg";
import ContactSection_2 from "../../../assets/Home/ContactSection/ContactSection_2.svg";
import ContactSection_3 from "../../../assets/Home/ContactSection/ContactSection_3.svg";

export default function ContactSection() {
    useEffect(() => {
        const elements = document.querySelectorAll(
            ".contact-cta-card, .contact-cta-item, .contact-cta-btn"
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("contact-show");
                    }
                });
            },
            {
                threshold: 0.15,
            }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const openWhatsApp = () => {
        window.open(
            "https://wa.me/918925450473?text=Hi%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20ProJenius.",
            "_blank",
            "noopener,noreferrer"
        );
    };

    const callTeam = () => {
        window.location.href = "tel:+918925450473";
    };

    return (
        <section className="contact-cta-section">
            <div className="contact-cta-container">
                <div className="contact-cta-card">

                    {/* HEADING */}
                    <h2 className="contact-cta-title">
                        Let's Build Something Great Together
                    </h2>

                    {/* TITLE LINE */}
                    <div className="contact-cta-line">
                        <span></span>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="contact-cta-description">
                        Have an idea, project, or business challenge?
                        Let's turn your vision into a powerful digital
                        experience with the right technology and strategy.
                    </p>

                    {/* FEATURES */}
                    <div className="contact-cta-features">

                        {/* FEATURE 1: FAST DELIVERY */}
                        <div className="contact-cta-item">
                            <div className="contact-feature-icon">
                                <img
                                    src={ContactSection_1}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="contact-feature-content">
                                <strong>Fast Delivery</strong>
                                <span>Efficient development</span>
                            </div>
                        </div>

                        <div className="contact-feature-divider"></div>

                        {/* FEATURE 2: RELIABLE SOLUTIONS */}
                        <div className="contact-cta-item">
                            <div className="contact-feature-icon">
                                <img
                                    src={ContactSection_2}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="contact-feature-content">
                                <strong>Reliable Solutions</strong>
                                <span>Built for real impact</span>
                            </div>
                        </div>

                        <div className="contact-feature-divider"></div>

                        {/* FEATURE 3: DEDICATED SUPPORT */}
                        <div className="contact-cta-item">
                            <div className="contact-feature-icon">
                                <img
                                    src={ContactSection_3}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="contact-feature-content">
                                <strong>Dedicated Support</strong>
                                <span>We're here to help</span>
                            </div>
                        </div>

                    </div>

                    {/* BUTTONS */}
                    <div className="contact-cta-actions">

                        {/* WHATSAPP BUTTON */}
                        <button
                            type="button"
                            className="contact-cta-btn contact-cta-primary"
                            onClick={openWhatsApp}
                        >
                            <span>Start Your Project</span>
                            <i
                                className="bi bi-arrow-right"
                                aria-hidden="true"
                            ></i>
                        </button>

                        {/* CALL BUTTON */}
                        <button
                            type="button"
                            className="contact-cta-btn contact-cta-secondary"
                            onClick={callTeam}
                        >
                            <i
                                className="bi bi-telephone-fill"
                                aria-hidden="true"
                            ></i>
                            <span>Talk to Our Team</span>
                        </button>

                    </div>
                </div>
            </div>
        </section>
    );
}
