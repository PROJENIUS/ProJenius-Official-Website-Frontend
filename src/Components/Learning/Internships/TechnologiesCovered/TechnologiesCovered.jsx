import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import "./TechnologiesCovered.css";

import html from "../../../../assets/Internship/TechLogos/html5.svg";
import css from "../../../../assets/Internship/TechLogos/css3.svg";
import javascript from "../../../../assets/Internship/TechLogos/javascript.svg";
import react from "../../../../assets/Internship/TechLogos/react.svg";
import nodejs from "../../../../assets/Internship/TechLogos/nodejs.svg";
import express from "../../../../assets/Internship/TechLogos/express.svg";
import mongodb from "../../../../assets/Internship/TechLogos/mongodb.svg";
import python from "../../../../assets/Internship/TechLogos/python.svg";
import java from "../../../../assets/Internship/TechLogos/java.svg";
import git from "../../../../assets/Internship/TechLogos/git.svg";
import github from "../../../../assets/Internship/TechLogos/github.svg";
import postman from "../../../../assets/Internship/TechLogos/postman.svg";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =========================================================
   TECHNOLOGIES COVERED
   Official coloured logos (Devicon, MIT licence; the Express
   and GitHub marks recoloured white for the dark background)
   in one compact row that drifts slowly. It pauses on hover
   and stands still with reduced motion.
========================================================= */

const ROW_ONE = [
    { name: "HTML", logo: html },
    { name: "CSS", logo: css },
    { name: "JavaScript", logo: javascript },
    { name: "React JS", logo: react },
    { name: "Node.js", logo: nodejs },
    { name: "Express.js", logo: express },
];

const ROW_TWO = [
    { name: "MongoDB", logo: mongodb },
    { name: "Python", logo: python },
    { name: "Java", logo: java },
    { name: "Git", logo: git },
    { name: "GitHub", logo: github },
    { name: "Postman", logo: postman },
];

function TechRow({ items, reverse = false }) {
    // The list is repeated so the loop has no gap; only the first copy is read out.
    return (
        <div className={`pj-internship-tech__row${reverse ? " pj-internship-tech__row--reverse" : ""}`}>
            <div className="pj-internship-tech__track">
                {[0, 1, 2].map((copy) => (
                    <ul key={copy} className="pj-internship-tech__list" aria-hidden={copy > 0 ? "true" : undefined}>
                        {items.map((technology) => (
                            <li key={technology.name} className="pj-internship-tech__card">
                                <img className="pj-internship-tech__logo" src={technology.logo} alt="" width="32" height="32" loading="lazy" decoding="async" />
                                <span className="pj-internship-tech__name">{technology.name}</span>
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    );
}

const TechnologiesCovered = () => (
    <section className="pj-internship-tech" aria-labelledby="pj-internship-tech-title">
        <div className="pj-internship-tech__container">
            <header className="pj-internship-tech__heading">
                <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Technologies Covered</p>
                <h2 id="pj-internship-tech-title" className="pj-internship-tech__title" data-reveal="up" data-reveal-delay="1">
                    <span className="pj-internship-tech__title-static">Tools Used in</span>
                    <TypedPhrase tone="dark" phrases={["Real Development", "Live Projects", "Industry Teams"]} />
                </h2>
                <SectionTitleLine />
            </header>
        </div>

        <div className="pj-internship-tech__rows" data-reveal="up" data-reveal-delay="2" aria-label="Technologies covered during the internship" role="region">
            <TechRow items={[...ROW_ONE, ...ROW_TWO]} />
        </div>
    </section>
);

export default TechnologiesCovered;
