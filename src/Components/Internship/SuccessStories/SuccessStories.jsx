import { useEffect, useRef, useState } from "react";
import {
    Users,
    Code2,
    MessageCircle,
    Star,
    Trophy,
    Building2,
    Smile,
} from "lucide-react";
import "./SuccessStories.css";

/* =========================================================
   HIGHLIGHTS
========================================================= */

const storyHighlights = [
    {
        id: 1,
        title: "Intern Testimonials",
        icon: MessageCircle,
        variant: "blue",
    },
    {
        id: 2,
        title: "Student Reviews",
        icon: Star,
        variant: "orange",
    },
    {
        id: 3,
        title: "Placement Achievements",
        icon: Trophy,
        variant: "purple",
    },
];

/* =========================================================
   STATISTICS
========================================================= */

const successStats = [
    {
        id: 1,
        value: 500,
        suffix: "+",
        label: "Interns Trained",
        icon: Users,
        variant: "blue",
    },
    {
        id: 2,
        value: 100,
        suffix: "+",
        label: "Projects Completed",
        icon: Code2,
        variant: "purple",
    },
    {
        id: 3,
        value: 50,
        suffix: "+",
        label: "Hiring Partners",
        icon: Building2,
        variant: "orange",
    },
    {
        id: 4,
        value: 90,
        suffix: "%",
        label: "Student Satisfaction",
        icon: Smile,
        variant: "pink",
    },
];

const COUNTER_DURATION = 5000;

/* =========================================================
   COMPONENT
========================================================= */

const SuccessStories = () => {
    const sectionRef = useRef(null);
    const animationFrameRef = useRef(null);

    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState(() => successStats.map(() => 0));

    /* SECTION OBSERVER + 5 SECOND COUNTER */
    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const stopCounters = () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };

        const startCounters = () => {
            stopCounters();

            const startTime = performance.now();

            const animate = (currentTime) => {
                const progress = Math.min(
                    (currentTime - startTime) / COUNTER_DURATION,
                    1
                );

                /* Smooth easing */
                const easedProgress = 1 - Math.pow(1 - progress, 3);

                setCounts(
                    successStats.map((stat) =>
                        Math.floor(stat.value * easedProgress)
                    )
                );

                if (progress < 1) {
                    animationFrameRef.current = requestAnimationFrame(animate);
                } else {
                    /* Always finish at exact values */
                    setCounts(successStats.map((stat) => stat.value));
                    animationFrameRef.current = null;
                }
            };

            /* Restart from zero every time */
            setCounts(successStats.map(() => 0));

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    startCounters();
                } else {
                    setIsVisible(false);
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(section);

        return () => {
            observer.disconnect();
            stopCounters();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`pj-internship-success ${
                isVisible ? "pj-internship-success--visible" : ""
            }`}
            aria-labelledby="pj-internship-success-title"
        >
            <div className="pj-internship-success-container">

                {/* SUCCESS STORIES - LEFT SIDE */}

                <div className="pj-internship-success-left">

                    <div className="pj-internship-success-heading">

                        <span className="pj-internship-success-label">
                            SUCCESS STORIES
                        </span>

                        <h2 id="pj-internship-success-title">
                            <span className="pj-internship-success-heading-black">
                                Growth You
                            </span>

                            <span className="pj-internship-success-heading-blue">
                                Can Measure
                            </span>
                        </h2>

                    </div>

                    {/* HIGHLIGHT CARDS */}

                    <div className="pj-internship-success-highlights">

                        {storyHighlights.map(({ id, title, icon: Icon, variant }) => (
                            <article
                                key={id}
                                className={`pj-internship-success-highlight pj-internship-success-highlight--${variant}`}
                            >
                                <div className="pj-internship-success-highlight-icon">
                                    <Icon
                                        size={20}
                                        strokeWidth={2.2}
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="pj-internship-success-highlight-content">
                                    {title}
                                </div>
                            </article>
                        ))}

                    </div>
                </div>

                {/* SUCCESS STORIES - STATISTICS */}

                <div className="pj-internship-success-stats">

                    {successStats.map(({ id, label, suffix, icon: Icon, variant }, index) => (
                        <article
                            key={id}
                            className={`pj-internship-success-stat pj-internship-success-stat--${variant}`}
                        >
                            <div className="pj-internship-success-stat-icon">
                                <Icon
                                    size={21}
                                    strokeWidth={2.2}
                                    aria-hidden="true"
                                />
                            </div>

                            <div className="pj-internship-success-stat-content">

                                <strong>
                                    {counts[index]}
                                    {suffix}
                                </strong>

                                <span>{label}</span>

                            </div>
                        </article>
                    ))}

                </div>

            </div>
        </section>
    );
};

export default SuccessStories;
