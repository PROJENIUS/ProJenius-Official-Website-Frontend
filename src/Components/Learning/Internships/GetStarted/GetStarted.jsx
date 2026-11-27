import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./GetStarted.css";

const GetStarted = () => {
    return (
        <section
            className="pj-internship-ready"
            aria-labelledby="pj-internship-ready-title"
        >
            <div className="pj-internship-ready-container">

                {/* READY TO START */}

                <div className="pj-internship-ready-content" data-reveal="scale">
                    <div className="pj-internship-ready-heading">
                        <p className="pjds-eyebrow pjds-eyebrow--on-dark">Get Started</p>
                        <h2 id="pj-internship-ready-title">
                            Ready to Start Your Tech Journey?
                        </h2>
                    </div>

                    <div className="pj-internship-ready-actions">

                        <Link
                            to="/contact?type=internship"
                            className="pj-internship-ready-apply"
                        >
                            <span>Apply for Internship</span>
                            <ArrowUpRight
                                size={20}
                                strokeWidth={2.5}
                                aria-hidden="true"
                            />
                        </Link>

                        <Link
                            to="/contact"
                            className="pj-internship-ready-contact"
                        >
                            Contact Us
                        </Link>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default GetStarted;
