import React, { useEffect, useRef, useState } from "react";
import "./OurServices.css";

// =========================================================
// OUR SERVICES IMAGES
// =========================================================

import OurServices_1 from "../../../assets/Home/OurServices/OurServices_1.webp";
import OurServices_2 from "../../../assets/Home/OurServices/OurServices_2.webp";
import OurServices_3 from "../../../assets/Home/OurServices/OurServices_3.webp";
import OurServices_4 from "../../../assets/Home/OurServices/OurServices_4.webp";
import OurServices_5 from "../../../assets/Home/OurServices/OurServices_5.webp";

// =========================================================
// OUR SERVICES SECTION
// =========================================================

export default function OurServices() {
    const [activeIndex, setActiveIndex] = useState(0);

    // =========================================================
    // SERVICES DATA
    //
    // ORDER (top to bottom):
    // 1. Software Development
    // 2. Hardware Development
    // 3. EduTech            <-- moved to third position
    // 4. Workshops & Training
    // 5. Startup Support
    //
    // Each service keeps its own image.
    // =========================================================

    const services = [
        {
            title: "SOFTWARE DEVELOPMENT",

            description:
                "Websites, mobile apps, and custom software built for businesses and organizations.",

            image: OurServices_1,

            link: "/services",

            txt: "Software Development",
        },

        {
            title: "HARDWARE DEVELOPMENT",

            description:
                "IoT, embedded systems, automation, and electronic solutions built for real-world applications.",

            image: OurServices_2,

            link: "/services",

            txt: "Hardware Development",
        },

        {
            title: "EDUTECH",

            description:
                "Courses, internships, learning programs, and academic technology support.",

            image: OurServices_5,

            link: "/services",

            txt: "EduTech",
        },

        {
            title: "WORKSHOPS & TRAINING",

            description:
                "Practical workshops and technology training for students, teams, and institutions.",

            image: OurServices_3,

            link: "/services",

            txt: "Workshops & Training",
        },

        {
            title: "STARTUP SUPPORT",

            description:
                "Technology, product development, and guidance to help startups build and grow.",

            image: OurServices_4,

            link: "/services",

            txt: "Startup Support",
        },
    ];

    // =========================================================
    // CARD REFS
    // =========================================================

    const cardRefs = useRef([]);

    // =========================================================
    // TYPING STATES
    // =========================================================

    const [typedTitle, setTypedTitle] = useState("");
    const [typedDescription, setTypedDescription] = useState("");

    // =========================================================
    // ACTIVE SERVICE
    // =========================================================

    const activeService = services[activeIndex];

    // =========================================================
    // SLOW TYPING EFFECT
    //
    // Title:
    // 120ms per character
    //
    // Description:
    // 45ms per character
    // =========================================================

    useEffect(() => {
        let titleTimeout;
        let descriptionTimeout;

        const titleText = activeService.txt;
        const descriptionText = activeService.description;

        // RESET PREVIOUS TEXT

        setTypedTitle("");
        setTypedDescription("");

        // TITLE TYPING

        let titleIndex = 0;

        const typeTitle = () => {
            if (titleIndex < titleText.length) {
                titleIndex += 1;

                setTypedTitle(titleText.substring(0, titleIndex));

                titleTimeout = setTimeout(typeTitle, 120);
            } else {
                // START DESCRIPTION ONLY AFTER TITLE IS COMPLETE

                let descriptionIndex = 0;

                const typeDescription = () => {
                    if (descriptionIndex < descriptionText.length) {
                        descriptionIndex += 1;

                        setTypedDescription(
                            descriptionText.substring(0, descriptionIndex)
                        );

                        descriptionTimeout = setTimeout(typeDescription, 45);
                    }
                };

                descriptionTimeout = setTimeout(typeDescription, 250);
            }
        };

        // SMALL DELAY BEFORE STARTING TITLE

        titleTimeout = setTimeout(typeTitle, 250);

        // CLEANUP

        return () => {
            clearTimeout(titleTimeout);
            clearTimeout(descriptionTimeout);
        };
    }, [activeIndex, activeService.txt, activeService.description]);

    // =========================================================
    // CARD VISIBILITY + ACTIVE SERVICE ON SCROLL
    // =========================================================

    useEffect(() => {
        // KEEP EXISTING CARD VISIBILITY BEHAVIOR

        let el = cardRefs.current[0];

        while (el && el !== document.body) {
            el = el.parentElement;

            if (!el) break;

            const style = window.getComputedStyle(el);

            if (
                style.overflow === "hidden" ||
                style.overflow === "auto" ||
                style.overflowY === "hidden" ||
                style.overflowY === "auto" ||
                style.overflowX === "hidden"
            ) {
                el.style.overflow = "visible";
            }
        }

        // CARD REVEAL OBSERVER

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show-card");
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        cardRefs.current.forEach((card) => {
            if (card) {
                observer.observe(card);
            }
        });

        // ACTIVE SERVICE ON SCROLL

        const handleScroll = () => {
            const scrollPos = window.scrollY + window.innerHeight * 0.45;

            let currentActive = 0;

            cardRefs.current.forEach((card, index) => {
                if (!card) return;

                const rect = card.getBoundingClientRect();

                const absoluteTop = window.scrollY + rect.top;

                if (scrollPos >= absoluteTop) {
                    currentActive = index;
                }
            });

            setActiveIndex((previousIndex) =>
                previousIndex === currentActive ? previousIndex : currentActive
            );
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        handleScroll();

        // CLEANUP

        return () => {
            observer.disconnect();

            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <>
            {/* TOP SPACER */}

            <div className="svc-spacer-top" />

            {/* MAIN SECTION */}

            <section className="svc-section">

                {/* LEFT CONTENT */}

                <div className="svc-left">

                    {/* SUB HEADING */}

                    <span className="svc-sub" id="sub-heading">
                        Our Services
                    </span>

                    {/* MAIN TITLE */}

                    <h2 className="svc-title" id="title">
                        Technology Solutions for

                        <br />

                        <span
                            className="svc-title-accent"
                            key={`title-${activeIndex}`}
                        >
                            {typedTitle}

                            {/* Typing cursor */}

                            <span className="svc-typing-cursor">|</span>
                        </span>
                    </h2>

                    {/* TITLE LINE */}

                    <div className="svc-title-line" aria-hidden="true" />

                    {/* TYPING DESCRIPTION */}

                    <p
                        className="svc-para svc-dynamic-para"
                        key={`para-${activeIndex}`}
                    >
                        {typedDescription}

                        {/* Cursor */}

                        <span className="svc-description-cursor">|</span>
                    </p>

                    {/* BUTTON */}

                    <a href={activeService.link} className="btn svc-main-btn">
                        <span
                            className="svc-btn-content"
                            key={`button-${activeIndex}`}
                        >
                            Explore {activeService.txt}
                        </span>
                    </a>

                </div>

                {/* RIGHT SERVICE CARDS */}

                <div className="svc-right">

                    {services.map((service, index) => (
                        <div
                            key={service.title}
                            className={`svc-card svc-card-${index + 1}`}
                            ref={(el) => {
                                cardRefs.current[index] = el;
                            }}
                            data-index={index}
                        >

                            {/* IMAGE */}

                            <img
                                src={service.image}
                                alt={service.title}
                                className="svc-img"
                            />

                            {/* OVERLAY */}

                            <div className="svc-overlay" aria-hidden="true" />

                            {/* CONTENT */}

                            <div className="svc-content">

                                <h3 className="svc-card-title">
                                    {service.title}
                                </h3>

                                <a
                                    href={service.link}
                                    className="svc-read-more"
                                >
                                    Read More →
                                </a>

                            </div>

                        </div>
                    ))}

                </div>

            </section>
        </>
    );
}