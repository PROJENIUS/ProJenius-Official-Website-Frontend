import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./ReadyToStart.css";

const ReadyToStart = () => {
    return (
        <section
            className="pj-internship-ready"
            aria-labelledby="pj-internship-ready-title"
        >
            <div className="pj-internship-ready-container">

                {/* READY TO START */}

                <div className="pj-internship-ready-content">
                    <h2 id="pj-internship-ready-title">
                        Ready to Start Your Tech Journey?
                    </h2>

                    <div className="pj-internship-ready-actions">

                        <Link
                            to="/job-application"
                            className="pj-internship-ready-apply"
                        >
                            <span>Apply Now</span>
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

export default ReadyToStart;
