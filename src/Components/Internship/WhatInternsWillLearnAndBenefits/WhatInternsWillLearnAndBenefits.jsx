import { useEffect, useRef, useState } from "react";
import {
    Building2,
    Code2,
    Cloud,
    Database,
    Users,
    KanbanSquare,
    BadgeCheck,
    FileCheck2,
    Mail,
    BriefcaseBusiness,
    UserRoundCheck,
    FileUser,
} from "lucide-react";
import "./WhatInternsWillLearnAndBenefits.css";

/* =========================================================
   WHAT INTERNS WILL LEARN
========================================================= */

const learningItems = [
    { icon: Building2, title: "Industry-Level", subtitle: "Projects", color: "blue" },
    { icon: Code2, title: "Git & GitHub", subtitle: "", color: "purple" },
    { icon: Cloud, title: "API", subtitle: "Integration", color: "green" },
    { icon: Database, title: "Database", subtitle: "Management", color: "orange" },
    { icon: Users, title: "Team", subtitle: "Collaboration", color: "pink" },
    { icon: KanbanSquare, title: "Agile", subtitle: "Methodology", color: "peach" },
];

/* =========================================================
   BENEFITS
========================================================= */

const benefitItems = [
    { icon: BadgeCheck, title: "Internship", subtitle: "Certificate", color: "green" },
    { icon: FileCheck2, title: "Project", subtitle: "Completion Certificate", color: "blue" },
    { icon: Mail, title: "Letter of", subtitle: "Recommendation", color: "orange" },
    { icon: BriefcaseBusiness, title: "Placement", subtitle: "Assistance", color: "purple" },
    { icon: UserRoundCheck, title: "Mentorship", subtitle: "from Experts", color: "pink" },
    { icon: FileUser, title: "Resume", subtitle: "Building Support", color: "peach" },
    { icon: FileUser, title: "LinkedIn", subtitle: "Optimization", color: "light-blue" },
];

/* =========================================================
   CARD (shared by both columns)
========================================================= */

const InfoCard = ({ variant, headingId, label, heading, highlight, items }) => (
    <div className={`pj-internship-learning-card pj-internship-learning-card--${variant}`}>

        <div className="pj-internship-learning-top-line" aria-hidden="true" />

        <div className="pj-internship-learning-label">{label}</div>

        <h2 id={headingId}>
            {heading} <span>{highlight}</span>
        </h2>

        <ul className="pj-internship-learning-grid">
            {items.map(({ icon: Icon, title, subtitle, color }) => (
                <li key={title} className="pj-internship-learning-animation">
                    <div className="pj-internship-learning-item">
                        <div
                            className={`pj-internship-learning-icon pj-internship-learning-icon--${color}`}
                        >
                            <Icon size={21} strokeWidth={2} aria-hidden="true" />
                        </div>

                        <div className="pj-internship-learning-text">
                            <span>{title}</span>
                            {subtitle && <span>{subtitle}</span>}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

const WhatInternsWillLearnAndBenefits = () => {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(section);
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`pj-internship-learning ${
                isVisible ? "pj-internship-learning--visible" : ""
            }`}
            aria-labelledby="pj-internship-learning-title pj-internship-benefits-title"
        >
            <div className="pj-internship-learning-container">

                {/* WHAT INTERNS WILL LEARN */}

                <InfoCard
                    variant="learn"
                    headingId="pj-internship-learning-title"
                    label="WHAT INTERNS WILL LEARN"
                    heading="Work Like a"
                    highlight="Modern Tech Team"
                    items={learningItems}
                />

                {/* BENEFITS */}

                <InfoCard
                    variant="career"
                    headingId="pj-internship-benefits-title"
                    label="BENEFITS"
                    heading="Career Support"
                    highlight="Beyond Training"
                    items={benefitItems}
                />

            </div>
        </section>
    );
};

export default WhatInternsWillLearnAndBenefits;
