import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import { whatsappHref } from "../../../../utils/whatsapp.js";
import "./InternshipDomains.css";

import reactLogo from "../../../../assets/Internship/TechLogos/react.svg";
import nodeLogo from "../../../../assets/Internship/TechLogos/nodejs.svg";
import htmlLogo from "../../../../assets/Internship/TechLogos/html5.svg";
import pythonLogo from "../../../../assets/Internship/TechLogos/python.svg";
import javaLogo from "../../../../assets/Internship/TechLogos/java.svg";
import tensorflowLogo from "../../../../assets/Internship/TechLogos/tensorflow.svg";
import pandasLogo from "../../../../assets/Internship/TechLogos/pandas.svg";
import arduinoLogo from "../../../../assets/Internship/TechLogos/arduino.svg";
import solidityLogo from "../../../../assets/Internship/TechLogos/solidity.svg";
import figmaLogo from "../../../../assets/Internship/TechLogos/figma.svg";
import flutterLogo from "../../../../assets/Internship/TechLogos/flutter.svg";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =========================================================
   INTERNSHIP DOMAINS
   Each track shows the coloured logo of its main technology
   (Devicon, MIT licence; Full Stack shows React + Node.js).
   Pick a track (the whole card is the button); the navy panel
   shows it. "Apply for this track" opens a short form in the
   panel; sending it opens WhatsApp with the details typed in.
========================================================= */

const internshipDomains = [
    { id: "full-stack", title: "Full Stack Development", category: "Development", logos: [reactLogo, nodeLogo],
      description: "Build complete web applications with frontend, backend, APIs, and database workflows." },
    { id: "frontend", title: "Frontend Development", category: "Development", logos: [htmlLogo],
      description: "Create responsive, interactive, and modern user interfaces using current frontend technologies." },
    { id: "backend", title: "Backend Development", category: "Development", logos: [nodeLogo],
      description: "Learn server-side development, APIs, databases, authentication, and scalable backend systems." },
    { id: "react", title: "React JS", category: "Development", logos: [reactLogo],
      description: "Build reusable and dynamic web interfaces using React components, hooks, state, and modern patterns." },
    { id: "python", title: "Python Development", category: "Development", logos: [pythonLogo],
      description: "Develop practical applications using Python programming, automation, APIs, and backend development." },
    { id: "java", title: "Java Development", category: "Development", logos: [javaLogo],
      description: "Build robust applications with Java, object-oriented programming, Spring Boot, APIs, and databases." },
    { id: "ai-ml", title: "AI & Machine Learning", category: "AI & Data", logos: [tensorflowLogo],
      description: "Explore model building, data preparation, prediction workflows, and practical AI use cases." },
    { id: "data-science", title: "Data Science", category: "AI & Data", logos: [pandasLogo],
      description: "Work with data analysis, visualization, statistical methods, and machine learning workflows." },
    { id: "iot", title: "IoT Development", category: "Hardware", logos: [arduinoLogo],
      description: "Build connected solutions using sensors, devices, communication protocols, and cloud platforms." },
    { id: "blockchain", title: "Blockchain Development", category: "Emerging Tech", logos: [solidityLogo],
      description: "Understand decentralized applications, blockchain architecture, smart contracts, and Web3 concepts." },
    { id: "ui-ux", title: "UI/UX Design", category: "Design", logos: [figmaLogo],
      description: "Design intuitive digital experiences through wireframes, prototypes, visual systems, and usability principles." },
    { id: "mobile", title: "Mobile App Development", category: "Development", logos: [flutterLogo],
      description: "Create modern mobile applications with responsive interfaces, APIs, authentication, and deployment workflows." },
];

const filters = ["All", "Development", "AI & Data", "Hardware", "Design", "Emerging Tech"];

function TrackLogos({ logos, size }) {
    return logos.map((logo) => (
        <img key={logo} src={logo} alt="" width={size} height={size} loading="lazy" decoding="async" />
    ));
}

const DURATIONS = ["7 Days", "15 Days", "30 Days", "Other"];
const MODES = ["Online", "Offline", "Hybrid"];

const getDomainsByFilter = (filter) =>
    filter === "All" ? internshipDomains : internshipDomains.filter((domain) => domain.category === filter);

function buildMessage(track, form) {
    const duration = form.duration === "Other" ? form.otherDuration.trim() : form.duration;
    const lines = [
        "Hi ProJenius, I would like to apply for an internship.",
        "",
        `Track: ${track.title}`,
        `Duration: ${duration}`,
        `Mode: ${form.mode}`,
        `Name: ${form.name.trim()}`,
    ];
    if (form.college.trim()) lines.push(`College / Organisation: ${form.college.trim()}`);
    return lines.join("\n");
}

const EMPTY_FORM = { name: "", college: "", duration: "30 Days", otherDuration: "", mode: "Online" };

const InternshipDomains = () => {
    const sectionRef = useRef(null);
    const panelRef = useRef(null);
    const nameRef = useRef(null);

    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedDomain, setSelectedDomain] = useState(internshipDomains[0]);
    const [isApplying, setIsApplying] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState("");

    // Arriving at /services/internship#internship-domains lands on this section.
    useEffect(() => {
        if (window.location.hash !== "#internship-domains") return undefined;
        const frame = window.requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ block: "start" }));
        return () => window.cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (isApplying) nameRef.current?.focus();
    }, [isApplying]);

    const filteredDomains = getDomainsByFilter(activeFilter);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        const matching = getDomainsByFilter(filter);
        if (matching.length && !matching.some((domain) => domain.id === selectedDomain.id)) {
            setSelectedDomain(matching[0]);
            setIsApplying(false);
        }
    };

    const selectDomain = (domain) => {
        setSelectedDomain(domain);
        setIsApplying(false);
        setError("");
        // On stacked (phone/tablet) layouts the panel is below the cards.
        if (window.matchMedia?.("(max-width: 1023px)").matches) {
            panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    };

    const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!form.name.trim()) {
            setError("Enter your name.");
            nameRef.current?.focus();
            return;
        }
        if (form.duration === "Other" && !form.otherDuration.trim()) {
            setError("Enter the duration you need.");
            return;
        }
        setError("");
        const href = whatsappHref(buildMessage(selectedDomain, form));
        const opened = window.open(href, "_blank", "noopener,noreferrer");
        if (!opened) window.location.href = href;
    };

    return (
        <section ref={sectionRef} id="internship-domains" className="pj-internship-domains" aria-labelledby="pj-internship-domains-title">
            <div className="pj-internship-domains-container">
                <header className="pj-internship-domains-header">
                    <p className="pjds-eyebrow" data-reveal="up">Internship Domains</p>
                    <h2 id="pj-internship-domains-title" data-reveal="up" data-reveal-delay="1">
                        <span className="pj-internship-domains-title-static">Choose Your</span>
                        <TypedPhrase phrases={["Technology Track", "Career Path", "Learning Domain"]} />
                    </h2>
                    <SectionTitleLine />
                    <p className="pj-internship-domains-intro" data-reveal="up" data-reveal-delay="2">
                        Explore practical technology tracks designed to build real-world skills and industry experience.
                    </p>
                </header>

                <div className="pj-internship-domains-filters" role="group" aria-label="Internship domain categories" data-reveal="up" data-reveal-delay="2">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            className={`pj-internship-domains-filter${activeFilter === filter ? " is-active" : ""}`}
                            onClick={() => handleFilterChange(filter)}
                            aria-pressed={activeFilter === filter}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="pj-internship-domains-layout">
                    <ul className="pj-internship-domains-grid" data-reveal="up" data-reveal-delay="3">
                        {filteredDomains.map((domain) => {
                            const isSelected = selectedDomain.id === domain.id;
                            return (
                                <li key={domain.id}>
                                    <button
                                        type="button"
                                        className={`pj-internship-domains-card${isSelected ? " is-selected" : ""}`}
                                        onClick={() => selectDomain(domain)}
                                        aria-pressed={isSelected}
                                    >
                                        <span className={`pj-internship-domains-icon${domain.logos.length > 1 ? " is-pair" : ""}`} aria-hidden="true">
                                            <TrackLogos logos={domain.logos} size={28} />
                                        </span>
                                        <span className="pj-internship-domains-card-title">{domain.title}</span>
                                        <span className="pj-internship-domains-view">
                                            View Track
                                            <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <aside ref={panelRef} className="pj-internship-domains-panel" aria-live="polite">
                        {!isApplying ? (
                            <div key={selectedDomain.id} className="pj-internship-domains-track">
                                <span className="pj-internship-domains-panel-label">Selected Track</span>
                                <span className={`pj-internship-domains-panel-icon${selectedDomain.logos.length > 1 ? " is-pair" : ""}`} aria-hidden="true">
                                    <TrackLogos logos={selectedDomain.logos} size={34} />
                                </span>
                                <h3>{selectedDomain.title}</h3>
                                <p>{selectedDomain.description}</p>
                                <span className="pj-internship-domains-panel-category">{selectedDomain.category}</span>
                                <button type="button" className="pj-internship-domains-apply" onClick={() => setIsApplying(true)}>
                                    Apply for this track
                                    <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
                                </button>
                            </div>
                        ) : (
                            <form className="pj-internship-domains-form" onSubmit={handleSubmit} noValidate>
                                <button type="button" className="pj-internship-domains-back" onClick={() => setIsApplying(false)}>
                                    <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
                                    Back to track
                                </button>
                                <span className="pj-internship-domains-panel-label">Apply for</span>
                                <h3>{selectedDomain.title}</h3>

                                <label className="pj-internship-domains-field">
                                    <span>Your name</span>
                                    <input ref={nameRef} type="text" value={form.name} onChange={update("name")} autoComplete="name" required />
                                </label>

                                <fieldset className="pj-internship-domains-choice">
                                    <legend>Duration</legend>
                                    <div>
                                        {DURATIONS.map((option) => (
                                            <label key={option} className={form.duration === option ? "is-checked" : undefined}>
                                                <input type="radio" name="duration" value={option} checked={form.duration === option} onChange={update("duration")} />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>

                                {form.duration === "Other" && (
                                    <label className="pj-internship-domains-field">
                                        <span>Duration you need</span>
                                        <input type="text" value={form.otherDuration} onChange={update("otherDuration")} placeholder="For example, 3 months" />
                                    </label>
                                )}

                                <fieldset className="pj-internship-domains-choice">
                                    <legend>Mode</legend>
                                    <div>
                                        {MODES.map((option) => (
                                            <label key={option} className={form.mode === option ? "is-checked" : undefined}>
                                                <input type="radio" name="mode" value={option} checked={form.mode === option} onChange={update("mode")} />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>

                                <label className="pj-internship-domains-field">
                                    <span>College / organisation <small>(optional)</small></span>
                                    <input type="text" value={form.college} onChange={update("college")} autoComplete="organization" />
                                </label>

                                {error && <p className="pj-internship-domains-error" role="alert">{error}</p>}

                                <button type="submit" className="pj-internship-domains-send">
                                    <MessageCircle size={18} strokeWidth={2.2} aria-hidden="true" />
                                    Send on WhatsApp
                                </button>
                                <p className="pj-internship-domains-note">Opens WhatsApp with your details filled in. Review and send.</p>
                            </form>
                        )}
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default InternshipDomains;
