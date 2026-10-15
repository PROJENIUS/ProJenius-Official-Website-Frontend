import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    CalendarDays,
    Monitor,
    GraduationCap,
    UsersRound,
    ArrowRight,
    Download,
} from "lucide-react";
import "./InternshipHero.css";

/* =========================================================
   INTERNSHIP INFORMATION
========================================================= */

const internshipDetails = [
    {
        id: "duration",
        title: "Duration",
        value: "1 Month, 3 Months, 6 Months",
        icon: CalendarDays,
    },
    {
        id: "mode",
        title: "Mode",
        value: "Online, Offline, Hybrid",
        icon: Monitor,
    },
    {
        id: "type",
        title: "Type",
        value: "Guided Internship Program",
        icon: GraduationCap,
    },
    {
        id: "eligibility",
        title: "Eligibility",
        value: "Students, freshers, and career switchers",
        icon: UsersRound,
    },
];

/* =========================================================
   COMPONENT
========================================================= */

const InternshipHero = () => {
    const sectionRef = useRef(null);
    const [animationKey, setAnimationKey] = useState(0);

    /* REPLAY CARD ANIMATION WHEN SECTION ENTERS VIEW */
    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAnimationKey((previous) => previous + 1);
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="pj-internship-hero"
            aria-labelledby="pj-internship-hero-title"
        >
            <div className="pj-internship-hero-container">

                {/* CONTENT */}

                <div className="pj-internship-hero-content">

                    <span className="pj-internship-hero-label">
                        ABOUT THE INTERNSHIP
                    </span>

                    <h1
                        id="pj-internship-hero-title"
                        className="pj-internship-hero-title"
                    >
                        Practical
                        <br />
                        Training
                        <br />
                        <span>Built Around</span>
                        <br />
                        <span>Real Work</span>
                    </h1>

                    <p className="pj-internship-hero-description">
                        Gain hands-on experience through structured
                        training, mentor support, live projects, and
                        career preparation designed for students and
                        freshers entering the tech industry.
                    </p>

                    {/* CTA BUTTONS */}

                    <div className="pj-internship-hero-actions">

                        <Link
                            to="/contact"
                            className="pj-internship-hero-primary-btn"
                        >
                            <span>Start Your Journey</span>

                            <ArrowRight
                                size={18}
                                strokeWidth={2.3}
                                aria-hidden="true"
                            />
                        </Link>

                        <a
                            href="/files/internship-syllabus.pdf"
                            className="pj-internship-hero-secondary-btn"
                            download
                        >
                            <span>Download Syllabus</span>

                            <Download
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        </a>

                    </div>
                </div>

                {/* INFORMATION CARDS */}

                <div
                    key={animationKey}
                    className="pj-internship-hero-cards"
                >
                    {internshipDetails.map(
                        ({ id, title, value, icon: Icon }) => (
                            <article
                                key={id}
                                className="pj-internship-hero-card"
                            >

                                <div className="pj-internship-hero-icon">
                                    <Icon
                                        size={25}
                                        strokeWidth={2.1}
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="pj-internship-hero-card-content">
                                    <h2>{title}</h2>
                                    <p>{value}</p>
                                </div>

                            </article>
                        )
                    )}
                </div>

            </div>
        </section>
    );
};

export default InternshipHero;
