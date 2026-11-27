import {
    BadgeCheck,
    Building2,
    BriefcaseBusiness,
    Lightbulb,
    Presentation,
    Wrench,
    FileCheck2,
    FileUser,
    KanbanSquare,
    Mail,
    UserRoundCheck,
    Users,
} from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import "./LearningAndBenefits.css";

import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =========================================================
   WHAT INTERNS WILL LEARN + BENEFITS
   Navy section: heading (static line + cyan typed line), then
   two white panels with light-blue item boxes, each panel with
   its own title. Both hold six items (three rows) so they match.
========================================================= */

const learningItems = [
    { Icon: Building2, text: "Industry-Level Projects" },
    { Icon: Wrench, text: "Real Tools & Workflows" },
    { Icon: Lightbulb, text: "Problem Solving" },
    { Icon: Users, text: "Team Collaboration" },
    { Icon: KanbanSquare, text: "Planning & Deadlines" },
    { Icon: Presentation, text: "Presenting Your Work" },
];

const benefitItems = [
    { Icon: BadgeCheck, text: "Internship Certificate" },
    { Icon: FileCheck2, text: "Project Completion Certificate" },
    { Icon: Mail, text: "Letter of Recommendation" },
    { Icon: BriefcaseBusiness, text: "Placement Assistance" },
    { Icon: UserRoundCheck, text: "Mentorship from Experts" },
    { Icon: FileUser, text: "Resume & LinkedIn Support" },
];

const InfoBox = ({ id, label, title, highlight, items, delay }) => (
    <article className="pj-internship-learning-box" aria-labelledby={id} data-reveal="up" data-reveal-delay={delay}>
        <span className="pj-internship-learning-box-label">{label}</span>
        <h3 id={id}>
            {title} <span>{highlight}</span>
        </h3>
        <ul className="pj-internship-learning-list">
            {items.map(({ Icon, text }) => (
                <li key={text} className="pj-internship-learning-item">
                    <span className="pj-internship-learning-icon" aria-hidden="true">
                        <Icon size={20} strokeWidth={2} />
                    </span>
                    <span className="pj-internship-learning-text">{text}</span>
                </li>
            ))}
        </ul>
    </article>
);

const LearningAndBenefits = () => (
    <section className="pj-internship-learning" aria-labelledby="pj-internship-learning-title">
        <div className="pj-internship-learning-container">
            <header className="pj-internship-learning-header">
                <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Learning &amp; Benefits</p>
                <h2 id="pj-internship-learning-title" data-reveal="up" data-reveal-delay="1">
                    <span className="pj-internship-learning-title-static">What You Gain From</span>
                    <TypedPhrase tone="dark" phrases={["Real Projects.", "Expert Mentors.", "Career Support."]} />
                </h2>
                <SectionTitleLine />
                <p className="pj-internship-learning-intro" data-reveal="up" data-reveal-delay="2">
                    Skills you build while working on live projects, and support that continues after the internship.
                </p>
            </header>

            <div className="pj-internship-learning-boxes">
                <InfoBox
                    id="pj-internship-learn-box"
                    label="What interns will learn"
                    title="Work Like a"
                    highlight="Modern Tech Team"
                    items={learningItems}
                    delay="2"
                />
                <InfoBox
                    id="pj-internship-benefits-box"
                    label="Benefits"
                    title="Career Support"
                    highlight="Beyond Training"
                    items={benefitItems}
                    delay="3"
                />
            </div>
        </div>
    </section>
);

export default LearningAndBenefits;
