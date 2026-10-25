import { useEffect, useRef, useState } from "react";
import {
    ArrowUpRight,
    Building2,
    Code2,
    MessageCircle,
    PlayCircle,
    Smile,
    Star,
    Trophy,
    Users,
} from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import "./SuccessStories.css";

/* =========================================================
   SUCCESS STORIES
   Heading (static + typed blue line), four highlights and
   four counted statistics. Counters restart each time the
   section comes into view (same duration as the homepage).
========================================================= */

const GOOGLE_REVIEWS_URL =
    "https://www.google.com/maps/place/data=!4m2!3m1!1s0x3b00cfb5c8f13bb3:0xc245f4db34baf398";

const storyHighlights = [
    { title: "Intern Testimonials", Icon: MessageCircle, href: "#student-stories" },
    { title: "Student Reviews", Icon: Star, href: GOOGLE_REVIEWS_URL, external: true },
    { title: "Placement Achievements", Icon: Trophy },
    { title: "Student Videos", Icon: PlayCircle, href: "#student-stories" },
];

const successStats = [
    { value: 500, suffix: "+", label: "Interns Trained", Icon: Users },
    { value: 100, suffix: "+", label: "Projects Completed", Icon: Code2 },
    { value: 50, suffix: "+", label: "Hiring Partners", Icon: Building2 },
    { value: 90, suffix: "%", label: "Student Satisfaction", Icon: Smile },
];

const COUNTER_DURATION = 1400;

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Highlight({ title, Icon, href, external }) {
    const content = (
        <>
            <span className="pj-internship-success-highlight-icon" aria-hidden="true">
                <Icon size={20} strokeWidth={2.1} />
            </span>
            <span className="pj-internship-success-highlight-title">{title}</span>
            {href && <ArrowUpRight className="pj-internship-success-highlight-arrow" size={18} aria-hidden="true" />}
        </>
    );

    if (!href) return <div className="pj-internship-success-highlight">{content}</div>;
    return external ? (
        <a className="pj-internship-success-highlight" href={href} target="_blank" rel="noopener noreferrer">
            {content}
            <span className="pjds-sr-only">(opens Google reviews in a new tab)</span>
        </a>
    ) : (
        <a className="pj-internship-success-highlight" href={href}>{content}</a>
    );
}

const SuccessStories = () => {
    const statsRef = useRef(null);
    const frameRef = useRef(0);
    // Final values straight away when counting cannot or should not run.
    const [counts, setCounts] = useState(() =>
        prefersReducedMotion() || typeof IntersectionObserver === "undefined"
            ? successStats.map((stat) => stat.value)
            : successStats.map(() => 0)
    );

    useEffect(() => {
        const node = statsRef.current;
        if (!node || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return undefined;

        const stop = () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            frameRef.current = 0;
        };

        const start = () => {
            stop();
            const startTime = performance.now();
            const tick = (now) => {
                const progress = Math.min((now - startTime) / COUNTER_DURATION, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                setCounts(successStats.map((stat) => Math.floor(stat.value * eased)));
                if (progress < 1) frameRef.current = requestAnimationFrame(tick);
                else {
                    setCounts(successStats.map((stat) => stat.value));
                    frameRef.current = 0;
                }
            };
            frameRef.current = requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) start();
            else stop();
        }, { threshold: 0.3 });
        observer.observe(node);

        return () => {
            observer.disconnect();
            stop();
        };
    }, []);

    return (
        <section className="pj-internship-success" aria-labelledby="pj-internship-success-title">
            <div className="pj-internship-success-container">
                <div className="pj-internship-success-left">
                    <p className="pjds-eyebrow" data-reveal="up">Success Stories</p>
                    <h2 id="pj-internship-success-title" data-reveal="up" data-reveal-delay="1">
                        <span className="pj-internship-success-title-static">Growth You</span>
                        <TypedPhrase phrases={["Can Measure", "Can See", "Can Trust"]} />
                    </h2>
                    <p className="pj-internship-success-intro" data-reveal="up" data-reveal-delay="2">
                        Hear from interns, read what students say and watch their stories.
                    </p>

                    <div className="pj-internship-success-highlights" data-reveal="up" data-reveal-delay="3">
                        {storyHighlights.map((item) => <Highlight key={item.title} {...item} />)}
                    </div>
                </div>

                <dl ref={statsRef} className="pj-internship-success-stats" data-reveal="right" data-reveal-delay="1">
                    {successStats.map(({ label, suffix, value, Icon }, index) => (
                        <div key={label} className="pj-internship-success-stat">
                            <span className="pj-internship-success-stat-icon" aria-hidden="true">
                                <Icon size={21} strokeWidth={2.1} />
                            </span>
                            <dt>{label}</dt>
                            <dd>
                                <span aria-hidden="true">{counts[index]}{suffix}</span>
                                <span className="pjds-sr-only">{value}{suffix}</span>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
};

export default SuccessStories;
