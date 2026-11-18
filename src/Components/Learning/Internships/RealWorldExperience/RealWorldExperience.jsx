import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, FolderKanban, UserRoundCheck } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import "./RealWorldExperience.css";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =========================================================
   INTERNSHIP OVERVIEW VIDEO
   The team explaining what interns do. Light section after
   the navy hero. On wide screens the heading sits left and the
   16:9 video right, so the whole section fits one screen;
   on smaller screens they stack.
========================================================= */

const POINTS = [
    { Icon: FolderKanban, title: "Live project work", text: "Work on real projects, not just practice exercises." },
    { Icon: UserRoundCheck, title: "Mentor support", text: "Our team guides you, reviews your work and clears doubts." },
    { Icon: Briefcase, title: "Career preparation", text: "Leave with project work, a certificate and resume help." },
];

const VIDEO_SRC =
    "https://www.youtube-nocookie.com/embed/1adzVmNh078?rel=0&modestbranding=1";

const RealWorldExperience = () => (
    <section className="pj-internship-real-world" aria-labelledby="pj-internship-real-world-title">
        <div className="pjds-container pj-internship-real-world-container">
            <header className="pj-internship-real-world-header">
                <p className="pjds-eyebrow" data-reveal="up">Watch the Overview</p>
                <h2 id="pj-internship-real-world-title" data-reveal="up" data-reveal-delay="1">
                    <span className="pj-internship-real-world-title-static">What You Do in a</span>
                    <TypedPhrase phrases={["ProJenius Internship", "Live Project", "Mentor-Led Track"]} />
                </h2>
                <SectionTitleLine />
                <p className="pj-internship-real-world-intro" data-reveal="up" data-reveal-delay="2">
                    Hear from our team about what you work on during the internship, how you learn and what you take away.
                </p>
                <ul className="pj-internship-real-world-points" data-reveal="up" data-reveal-delay="3">
                    {POINTS.map(({ Icon, title, text }) => (
                        <li key={title}>
                            <span className="pj-internship-real-world-point-icon" aria-hidden="true"><Icon size={20} /></span>
                            <span>
                                <strong>{title}</strong>
                                <small>{text}</small>
                            </span>
                        </li>
                    ))}
                </ul>
                <Link className="pj-internship-real-world-cta" to="/contact?type=internship" data-reveal="up" data-reveal-delay="3">
                    Apply for Internship <ArrowRight size={18} aria-hidden="true" />
                </Link>
            </header>

            <div className="pj-internship-real-world-video" data-reveal="scale" data-reveal-delay="2">
                <div className="pj-internship-real-world-frame">
                    <iframe
                        src={VIDEO_SRC}
                        title="ProJenius internship overview video"
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    </section>
);

export default RealWorldExperience;
