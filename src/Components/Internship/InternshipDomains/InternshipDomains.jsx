import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./InternshipDomains.css";

/* =========================================================
   INTERNSHIP DOMAIN DATA
========================================================= */

const internshipDomains = [
    {
        id: "full-stack",
        title: "Full Stack Development",
        category: "Development",
        icon: "🧑🏻‍💻",
        description:
            "Build complete web applications with frontend, backend, APIs, and database workflows.",
    },
    {
        id: "frontend",
        title: "Frontend Development",
        category: "Development",
        icon: "🖥️",
        description:
            "Create responsive, interactive, and modern user interfaces using current frontend technologies.",
    },
    {
        id: "backend",
        title: "Backend Development",
        category: "Development",
        icon: "🗄️",
        description:
            "Learn server-side development, APIs, databases, authentication, and scalable backend systems.",
    },
    {
        id: "react",
        title: "React JS",
        category: "Development",
        icon: "⚛️",
        description:
            "Build reusable and dynamic web interfaces using React components, hooks, state, and modern patterns.",
    },
    {
        id: "python",
        title: "Python Development",
        category: "Development",
        icon: "🐍",
        description:
            "Develop practical applications using Python programming, automation, APIs, and backend development.",
    },
    {
        id: "java",
        title: "Java Development",
        category: "Development",
        icon: "☕",
        description:
            "Build robust applications with Java, object-oriented programming, Spring Boot, APIs, and databases.",
    },
    {
        id: "ai-ml",
        title: "AI & Machine Learning",
        category: "AI & Data",
        icon: "🤖",
        description:
            "Explore model building, data preparation, prediction workflows, and practical AI use cases.",
    },
    {
        id: "data-science",
        title: "Data Science",
        category: "AI & Data",
        icon: "🔎",
        description:
            "Work with data analysis, visualization, statistical methods, and machine learning workflows.",
    },
    {
        id: "iot",
        title: "IoT Development",
        category: "Hardware",
        icon: "🌐",
        description:
            "Build connected solutions using sensors, devices, communication protocols, and cloud platforms.",
    },
    {
        id: "blockchain",
        title: "Blockchain Development",
        category: "Emerging Tech",
        icon: "🔐",
        description:
            "Understand decentralized applications, blockchain architecture, smart contracts, and Web3 concepts.",
    },
    {
        id: "ui-ux",
        title: "UI/UX Design",
        category: "Design",
        icon: "🖥️",
        description:
            "Design intuitive digital experiences through wireframes, prototypes, visual systems, and usability principles.",
    },
    {
        id: "mobile",
        title: "Mobile App Development",
        category: "Development",
        icon: "📱",
        description:
            "Create modern mobile applications with responsive interfaces, APIs, authentication, and deployment workflows.",
    },
];

/* =========================================================
   FILTERS
========================================================= */

const filters = [
    "All",
    "Development",
    "AI & Data",
    "Hardware",
    "Design",
    "Emerging Tech",
];

const getDomainsByFilter = (filter) =>
    filter === "All"
        ? internshipDomains
        : internshipDomains.filter((domain) => domain.category === filter);

/* =========================================================
   COMPONENT
========================================================= */

const InternshipDomains = () => {
    const sectionRef = useRef(null);

    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedDomain, setSelectedDomain] = useState(
        internshipDomains[0]
    );
    const [isVisible, setIsVisible] = useState(false);

    /* SECTION REVEAL */
    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.12 }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    const filteredDomains = getDomainsByFilter(activeFilter);

    /* FILTER HANDLER */
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);

        const matchingDomains = getDomainsByFilter(filter);

        if (
            matchingDomains.length > 0 &&
            !matchingDomains.some(
                (domain) => domain.id === selectedDomain.id
            )
        ) {
            setSelectedDomain(matchingDomains[0]);
        }
    };

    return (
        <section
            ref={sectionRef}
            className={`pj-internship-domains ${
                isVisible ? "pj-internship-domains--visible" : ""
            }`}
            aria-labelledby="pj-internship-domains-title"
        >
            <div className="pj-internship-domains-container">

                {/* INTERNSHIP DOMAINS - HEADER */}

                <header className="pj-internship-domains-header">

                    <span className="pj-internship-domains-label">
                        INTERNSHIP DOMAINS
                    </span>

                    <h2 id="pj-internship-domains-title">
                        Choose Your Technology Track
                    </h2>

                    <p>
                        Explore practical technology tracks designed to
                        build real-world skills and industry experience.
                    </p>

                </header>

                {/* FILTERS */}

                <div
                    className="pj-internship-domains-filters"
                    role="group"
                    aria-label="Internship domain categories"
                >
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            className={`pj-internship-domains-filter ${
                                activeFilter === filter
                                    ? "pj-internship-domains-filter--active"
                                    : ""
                            }`}
                            onClick={() => handleFilterChange(filter)}
                            aria-pressed={activeFilter === filter}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* MAIN CONTENT */}

                <div className="pj-internship-domains-layout">

                    {/* DOMAIN GRID */}

                    <div className="pj-internship-domains-grid">

                        {filteredDomains.map((domain) => (
                            <article
                                key={domain.id}
                                className={`pj-internship-domains-card ${
                                    selectedDomain.id === domain.id
                                        ? "pj-internship-domains-card--selected"
                                        : ""
                                }`}
                            >

                                <div className="pj-internship-domains-icon">
                                    <span aria-hidden="true">
                                        {domain.icon}
                                    </span>
                                </div>

                                <h3>{domain.title}</h3>

                                <button
                                    type="button"
                                    className="pj-internship-domains-view"
                                    onClick={() =>
                                        setSelectedDomain(domain)
                                    }
                                >
                                    View Track
                                    <span aria-hidden="true">→</span>
                                </button>

                            </article>
                        ))}

                    </div>

                    {/* SELECTED TRACK */}

                    <aside
                        className="pj-internship-domains-sidebar"
                        aria-live="polite"
                    >

                        <div className="pj-internship-domains-selected">

                            <span className="pj-internship-domains-selected-label">
                                SELECTED TRACK
                            </span>

                            <div
                                className="pj-internship-domains-selected-icon"
                                aria-hidden="true"
                            >
                                {selectedDomain.icon}
                            </div>

                            <h3>{selectedDomain.title}</h3>

                            <p>{selectedDomain.description}</p>

                            <Link
                                to="/job-application"
                                className="pj-internship-domains-apply"
                            >
                                Apply for this track
                                <span aria-hidden="true">→</span>
                            </Link>

                        </div>

                    </aside>

                </div>

            </div>
        </section>
    );
};

export default InternshipDomains;
