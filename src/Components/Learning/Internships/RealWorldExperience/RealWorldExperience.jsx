import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import "./RealWorldExperience.css";

/* =========================================================
   INTERNSHIP OVERVIEW VIDEO
   The team explaining what interns do. Light section after
   the navy hero (like the homepage's Who We Are video). The
   video keeps a true 16:9 frame, sized so the heading and the
   whole frame fit on one screen.
========================================================= */

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
                <p className="pj-internship-real-world-intro" data-reveal="up" data-reveal-delay="2">
                    Hear from our team about what you work on during the internship, how you learn and what you take away.
                </p>
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
