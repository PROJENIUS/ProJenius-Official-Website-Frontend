
import React, { useEffect, useRef, useState } from "react";
import "./OurProducts.css";

import OurProducts_1 from "../../../assets/Home/OurProducts/OurProducts_1.webp";
import OurProducts_2 from "../../../assets/Home/OurProducts/OurProducts_2.webp";
import OurProducts_3 from "../../../assets/Home/OurProducts/OurProducts_3.webp";

const AI_PRODUCT_URL = "https://gnut2pnut.projenius.in";

const products = [
    {
        animationText: "Smarter Agriculture",
        title: "Groundnut-to-Peanut Processing, Sorting & Grading Machine",
        image: OurProducts_1,
        description:
            "A complete groundnut-to-peanut processing solution that breaks groundnut shells, separates dust, sorts peanuts by quality, grades them by size, measures weight, predicts oil potential, and supports export-quality testing.",
        icon: "AI",
        action: "redirect",
        features: [
            "Shell Breaking",
            "Dust Separation",
            "AI Sorting",
            "Size Grading",
            "Oil Prediction",
            "Export Testing",
        ],
    },
    {
        animationText: "Connected Solutions",
        title: "ProJenius IoT Learning Kit",
        image: OurProducts_2,
        description:
            "Explore hands-on IoT learning kits that help students understand sensors, microcontrollers, connectivity, and automation through practical hardware and software projects.",
        icon: "IoT",
        action: "coming-soon",
        features: [
            "Sensors",
            "ESP32",
            "IoT",
            "Automation",
            "Embedded Systems",
            "Hands-On Projects",
        ],
    },
    {
        animationText: "3D Printing & Services",
        title: "ProJenius 3D Printing & Prototyping Services",
        image: OurProducts_3,
        description:
            "Professional 3D printing and rapid prototyping services for product concepts, custom components, functional parts, models, and development-ready prototypes.",
        icon: "3D",
        action: "coming-soon",
        features: [
            "Rapid Prototyping",
            "Custom 3D Parts",
            "Product Models",
            "Functional Prototypes",
            "PLA & ABS Printing",
            "Design-to-Print Support",
        ],
    },
];

function ProductIcon({ type, size = 20 }) {
    const commonProps = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };

    if (type === "3D") {
        return (
            <svg {...commonProps}>
                <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                <path d="m3 8 9 5 9-5" />
                <path d="M3 8v8l9 5 9-5V8" />
                <path d="M12 13v8" />
            </svg>
        );
    }

    if (type === "IoT") {
        return (
            <svg {...commonProps}>
                <rect x="7" y="7" width="10" height="10" rx="2" />
                <path d="M9 2v5M15 2v5M9 17v5M15 17v5" />
                <path d="M2 9h5M2 15h5M17 9h5M17 15h5" />
            </svg>
        );
    }

    return (
        <svg {...commonProps}>
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <circle cx="9" cy="10" r="1" />
            <circle cx="15" cy="10" r="1" />
            <path d="M8 15h8M9 1v3M15 1v3M9 20v3M15 20v3" />
        </svg>
    );
}

export default function OurProducts() {
    const sectionRef = useRef(null);
    const typingTimerRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [visible, setVisible] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);

    const activeProduct = products[activeIndex];

    // Reveal the section once when it enters the viewport.
    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return undefined;

        // Fallback for browsers without IntersectionObserver.
        if (!("IntersectionObserver" in window)) {
            setVisible(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px",
            }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    // Type the blue heading letter by letter.
    useEffect(() => {
        if (typingTimerRef.current) {
            window.clearInterval(typingTimerRef.current);
        }

        const text = activeProduct.animationText;
        let index = 0;

        setTypedText("");

        typingTimerRef.current = window.setInterval(() => {
            index += 1;
            setTypedText(text.slice(0, index));

            if (index >= text.length) {
                window.clearInterval(typingTimerRef.current);
                typingTimerRef.current = null;
            }
        }, 75);

        return () => {
            if (typingTimerRef.current) {
                window.clearInterval(typingTimerRef.current);
                typingTimerRef.current = null;
            }
        };
    }, [activeIndex, activeProduct.animationText]);

    // Close the popup using Escape.
    useEffect(() => {
        if (!showComingSoon) return undefined;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowComingSoon(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showComingSoon]);

    const changeProduct = (index) => {
        if (index === activeIndex) return;
        setActiveIndex(index);
    };

    const handleExplore = () => {
        if (activeProduct.action === "redirect") {
            window.open(
                AI_PRODUCT_URL,
                "_blank",
                "noopener,noreferrer"
            );
        } else {
            setShowComingSoon(true);
        }
    };

    return (
        <>
            <section
                ref={sectionRef}
                className={`pj-section ${visible ? "pj-visible" : ""}`}
            >
                <div className="pj-container">
                    {/* Heading */}
                    <div className="pj-heading">
                        <span className="pj-badge">Our Products</span>

                        <h2 className="pj-title">
                            <span className="pj-title-main">
                                Technology Products Built for
                            </span>

                            <span
                                className="pj-title-accent"
                                aria-label={activeProduct.animationText}
                            >
                                {typedText}
                                <span
                                    className="pj-cursor"
                                    aria-hidden="true"
                                />
                            </span>
                        </h2>

                        <div className="pj-line" aria-hidden="true" />

                        <p className="pj-desc">
                            Explore our technology products designed to
                            solve real-world problems, connect people,
                            and create smarter ways to learn and work.
                        </p>
                    </div>

                    {/* Product tabs */}
                    <div
                        className="pj-tabs"
                        role="tablist"
                        aria-label="Our products"
                    >
                        {products.map((product, index) => (
                            <button
                                key={product.title}
                                id={`product-tab-${index}`}
                                type="button"
                                role="tab"
                                aria-selected={activeIndex === index}
                                aria-controls={`product-panel-${index}`}
                                className={`pj-tab ${
                                    activeIndex === index
                                        ? "pj-tab-active"
                                        : ""
                                }`}
                                onClick={() => changeProduct(index)}
                            >
                                <span className="pj-tab-icon">
                                    <ProductIcon type={product.icon} />
                                </span>

                                <span>{product.animationText}</span>
                            </button>
                        ))}
                    </div>

                    {/* Product details */}
                    <div
                        id={`product-panel-${activeIndex}`}
                        role="tabpanel"
                        aria-labelledby={`product-tab-${activeIndex}`}
                        className="pj-card"
                        key={activeProduct.title}
                    >
                        <div className="pj-image">
                            <img
                                src={activeProduct.image}
                                alt={activeProduct.title}
                                loading={activeIndex === 0 ? "eager" : "lazy"}
                            />

                            <div className="pj-shine" aria-hidden="true" />
                        </div>

                        <div className="pj-text">
                            <h3 className="pj-content-title">
                                {activeProduct.title}
                            </h3>

                            <p className="pj-content-desc">
                                {activeProduct.description}
                            </p>

                            <div className="pj-features">
                                <h4>Key Features</h4>

                                <ul className="pj-feature-list">
                                    {activeProduct.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="pj-feature"
                                        >
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                type="button"
                                className="pj-btn"
                                onClick={handleExplore}
                            >
                                Explore More
                            </button>
                        </div>
                    </div>

                    {/* Active product indicators */}
                    <div className="pj-dots" aria-hidden="true">
                        {products.map((product, index) => (
                            <span
                                key={product.title}
                                className={`pj-dot ${
                                    activeIndex === index
                                        ? "pj-dot-active"
                                        : ""
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Coming Soon popup */}
            {showComingSoon && (
                <div
                    className="pj-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="pj-coming-soon-title"
                    onClick={() => setShowComingSoon(false)}
                >
                    <div
                        className="pj-popup"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="pj-popup-close"
                            onClick={() => setShowComingSoon(false)}
                            aria-label="Close popup"
                        >
                            ×
                        </button>

                        <div className="pj-popup-icon">
                            <ProductIcon
                                type={activeProduct.icon}
                                size={28}
                            />
                        </div>

                        <h3
                            id="pj-coming-soon-title"
                            className="pj-popup-title"
                        >
                            Coming Soon
                        </h3>

                        <p className="pj-popup-text">
                            We will launch this product soon.
                        </p>

                        <button
                            type="button"
                            className="pj-popup-btn"
                            onClick={() => setShowComingSoon(false)}
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
