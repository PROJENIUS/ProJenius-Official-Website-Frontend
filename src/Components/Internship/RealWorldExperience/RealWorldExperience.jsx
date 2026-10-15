import { useEffect, useRef, useState } from "react";
import "./RealWorldExperience.css";

const RealWorldExperience = () => {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.2 }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`pj-internship-real-world ${
                isVisible ? "pj-internship-real-world--visible" : ""
            }`}
            aria-labelledby="pj-internship-real-world-title"
        >
            <div className="pj-internship-real-world-container">

                {/* REAL-WORLD EXPERIENCE */}

                <header className="pj-internship-real-world-header">

                    <span className="pj-internship-real-world-label">
                        REAL-WORLD EXPERIENCE
                    </span>

                    <h2 id="pj-internship-real-world-title">
                        <span className="pj-internship-real-world-title-white">
                            How ProJenius transforms your
                        </span>

                        <span className="pj-internship-real-world-title-blue">
                            career with real-world projects
                        </span>
                    </h2>

                    <p>
                        Discover how ProJenius uses hands-on training to
                        prepare students for the tech industry.
                    </p>

                </header>

                {/* VIDEO */}

                <div className="pj-internship-real-world-video-wrapper">

                    <div className="pj-internship-real-world-video-frame">

                        <iframe
                            src="https://www.youtube.com/embed/1adzVmNh078?si=wwv9OYAYa3XXg67D&vq=hd1080&rel=0&modestbranding=1"
                            title="ProJenius - Real World Projects"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        />

                    </div>

                </div>

            </div>
        </section>
    );
};

export default RealWorldExperience;
