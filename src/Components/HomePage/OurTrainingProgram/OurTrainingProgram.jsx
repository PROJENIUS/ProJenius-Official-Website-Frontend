
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";

import "./OurTrainingProgram.css";

import OurTrainingProgram_1 from "../../../assets/Home/OurTrainingProgram/OurTrainingProgram_1.png";
import OurTrainingProgram_2 from "../../../assets/Home/OurTrainingProgram/OurTrainingProgram_2.webp";
import OurTrainingProgram_3 from "../../../assets/Home/OurTrainingProgram/OurTrainingProgram_3.webp";
import OurTrainingProgram_4 from "../../../assets/Home/OurTrainingProgram/OurTrainingProgram_4.png";
import OurTrainingProgram_5 from "../../../assets/Home/OurTrainingProgram/OurTrainingProgram_5.webp";
import OurTrainingProgram_6 from "../../../assets/Home/OurTrainingProgram/OurTrainingProgram_6.webp";
import OurTrainingProgram_7 from "../../../assets/Home/OurTrainingProgram/OurTrainingProgram_7.webp";
import OurTrainingProgram_8 from "../../../assets/Home/OurTrainingProgram/OurTrainingProgram_8.webp";
import OurTrainingProgram_9 from "../../../assets/Home/OurTrainingProgram/OurTrainingProgram_9.webp";
import OurTrainingProgram_10 from "../../../assets/Home/OurTrainingProgram/OurTrainingProgram_10.webp";

/* =========================================================
   TRAINING SECTION DATA
========================================================= */

const trainingTexts = [
    "Practical Learning",
    "Hands-On Training",
    "Industry Internships",
    "Technology Workshops",
    "Career Development",
];

/* Existing image paths, reused across six cards */
const cards = [
    {
        to: "/career-guidance",
        label: "Future Ready",
        title: "Career Guidance",
        shape: "tall",
        delay: 0,
        images: [
            OurTrainingProgram_1,
            OurTrainingProgram_2,
            OurTrainingProgram_3,
        ],
    },
    {
        to: "/services",
        label: "Skill Growth",
        title: "Mentoring Program",
        shape: "wide",
        delay: 1200,
        images: [
            OurTrainingProgram_4,
            OurTrainingProgram_5,
            OurTrainingProgram_6,
        ],
    },
    {
        to: "/workshop",
        label: "Smart Innovation",
        title: "IoT Workshop",
        shape: "std",
        delay: 2400,
        images: [
            OurTrainingProgram_4,
            OurTrainingProgram_7,
            OurTrainingProgram_8,
        ],
    },
    {
        to: "/internships",
        label: "Real Experience",
        title: "Industry Internships",
        shape: "std",
        delay: 3600,
        images: [
            OurTrainingProgram_1,
            OurTrainingProgram_9,
            OurTrainingProgram_10,
        ],
    },
    {
        to: "/workshop",
        label: "Coding Skills",
        title: "Programming Workshop",
        shape: "wide",
        delay: 4800,
        images: [
            OurTrainingProgram_2,
            OurTrainingProgram_5,
            OurTrainingProgram_6,
        ],
    },
    {
        to: "/placements",
        label: "Career Launch",
        title: "Placement Support",
        shape: "std",
        delay: 6000,
        images: [
            OurTrainingProgram_3,
            OurTrainingProgram_8,
            OurTrainingProgram_10,
        ],
    },
];

const ease = [0.22, 1, 0.36, 1];

const viewport = {
    once: false,
    amount: 0.2,
};

/* =========================================================
   FRAMER MOTION VARIANTS
========================================================= */

const headingVariants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease,
            staggerChildren: 0.12,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        x: -80,
        scale: 0.96,
        filter: "blur(6px)",
    },
    show: (index) => ({
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 70,
            damping: 18,
            delay: (index % 3) * 0.12,
        },
    }),
};

const labelVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.25,
            duration: 0.6,
            ease,
        },
    },
};

/* =========================================================
   CARD IMAGE SLIDESHOW
========================================================= */

function CardSlides({ images, delay, alt, paused }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (paused || images.length <= 1) {
            return undefined;
        }

        let interval;

        const start = window.setTimeout(() => {
            interval = window.setInterval(() => {
                setIndex((previous) => (previous + 1) % images.length);
            }, 6000);
        }, delay);

        return () => {
            window.clearTimeout(start);

            if (interval) {
                window.clearInterval(interval);
            }
        };
    }, [images, delay, paused]);

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.img
                    key={images[index]}
                    src={images[index]}
                    alt={alt}
                    loading="lazy"
                    initial={{
                        opacity: 0,
                        scale: 1.06,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    transition={{
                        duration: 1.2,
                        ease: "easeInOut",
                    }}
                />
            </AnimatePresence>

            <div className="training-dots" aria-hidden="true">
                {images.map((image, dotIndex) => (
                    <span
                        key={`${image}-${dotIndex}`}
                        className={
                            dotIndex === index ? "dot active" : "dot"
                        }
                    />
                ))}
            </div>
        </>
    );
}

/* =========================================================
   OUR TRAINING PROGRAM
========================================================= */

export default function OurTrainingProgram() {
    const reduceMotion = useReducedMotion();

    const [textIndex, setTextIndex] = useState(0);
    const [typedText, setTypedText] = useState("");

    /* =====================================================
       LETTER-BY-LETTER HEADING ANIMATION
    ===================================================== */

    useEffect(() => {
        const currentText = trainingTexts[textIndex];

        if (reduceMotion) {
            setTypedText(currentText);
            return undefined;
        }

        let characterIndex = 0;
        let pauseTimer;

        setTypedText("");

        const typingTimer = window.setInterval(() => {
            characterIndex += 1;

            setTypedText(currentText.slice(0, characterIndex));

            if (characterIndex >= currentText.length) {
                window.clearInterval(typingTimer);

                pauseTimer = window.setTimeout(() => {
                    setTextIndex(
                        (previous) =>
                            (previous + 1) % trainingTexts.length
                    );
                }, 2200);
            }
        }, 90);

        return () => {
            window.clearInterval(typingTimer);

            if (pauseTimer) {
                window.clearTimeout(pauseTimer);
            }
        };
    }, [textIndex, reduceMotion]);

    /* =====================================================
       RETURN
    ===================================================== */

    return (
        <section
            className="training-section"
            aria-labelledby="training-title"
        >
            <div className="container">
                {/* SECTION HEADING */}

                <motion.div
                    className="training-heading"
                    variants={headingVariants}
                    initial={reduceMotion ? false : "hidden"}
                    whileInView="show"
                    viewport={viewport}
                >
                    <motion.span
                        className="training-sub-heading"
                        variants={itemVariants}
                    >
                        <span className="training-sub-dot" />
                        Our Training Program
                    </motion.span>

                    <motion.h2
                        id="training-title"
                        className="train-section-title"
                        variants={itemVariants}
                    >
                        <span className="training-title-static">
                            Build Skills Through
                        </span>

                        <span
                            className="training-animated-title-wrapper"
                            aria-label={trainingTexts[textIndex]}
                        >
                            <span className="training-title-accent">
                                {typedText}

                                {!reduceMotion && (
                                    <span
                                        className="training-typing-cursor"
                                        aria-hidden="true"
                                    />
                                )}
                            </span>
                        </span>
                    </motion.h2>

                    <motion.div
                        className="training-heading-line"
                        variants={itemVariants}
                        aria-hidden="true"
                    />

                    <motion.p
                        className="training-intro"
                        variants={itemVariants}
                    >
                        Industry-focused programs that turn classroom
                        knowledge into real, job-ready skills.
                    </motion.p>
                </motion.div>

                {/* TRAINING CARDS */}

                <div className="training-grid">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            className={`training-item item-${card.shape}`}
                            custom={index}
                            variants={cardVariants}
                            initial={reduceMotion ? false : "hidden"}
                            whileInView="show"
                            viewport={viewport}
                        >
                            <Link
                                to={card.to}
                                className="training-link"
                                aria-label={`Explore ${card.title}`}
                            >
                                <div className="training-card">
                                    <CardSlides
                                        images={card.images}
                                        delay={card.delay}
                                        alt={card.title}
                                        paused={reduceMotion}
                                    />

                                    <div
                                        className="training-image-overlay"
                                        aria-hidden="true"
                                    />

                                    <span
                                        className="training-number"
                                        aria-hidden="true"
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <motion.div
                                        className="training-content"
                                        variants={labelVariants}
                                    >
                                        <span>{card.label}</span>

                                        <h4>{card.title}</h4>

                                        <span className="training-cta">
                                            Explore

                                            <svg
                                                viewBox="0 0 24 24"
                                                width="16"
                                                height="16"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M5 12h14M13 6l6 6-6 6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                    </motion.div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
