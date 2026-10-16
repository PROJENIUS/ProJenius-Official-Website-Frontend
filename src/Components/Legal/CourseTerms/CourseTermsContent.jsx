import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchLegalDocument,
  formatLegalDate,
} from "../../../utils/legalDocuments";
import "./CourseTermsContent.css";

export default function CourseTermsContent() {
  const [loaded, setLoaded] = useState(null);
  const [requestError, setRequestError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchLegalDocument("course-terms", controller.signal)
      .then((document) => setLoaded({ attempt, document }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setRequestError({ attempt, message: error.message });
        }
      });

    return () => controller.abort();
  }, [attempt]);

  const document = loaded?.attempt === attempt ? loaded.document : null;
  const error = requestError?.attempt === attempt
    ? requestError.message
    : "";
  const orderedSections = document?.sections
    .slice()
    .sort((first, second) => first.order - second.order);

  return (
    <main className="pj-course-terms">
      <article className="pj-course-terms__content">
        <Link to="/services/courses" className="pj-course-terms__back">
          Back to live training
        </Link>
        <p className="pj-course-terms__eyebrow">
          PROJENIUS · LIVE TRAINING
        </p>
        <h1>{document?.title || "Terms & Conditions and Refund Policy"}</h1>

        {document?.version && (
          <p className="pj-course-terms__version">
            Version {document.version}
          </p>
        )}
        {document && (
          <p className="pj-course-terms__version">
            Last updated: {formatLegalDate(document.lastUpdated)}
          </p>
        )}

        {error && (
          <div className="pj-course-terms__error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Retry
            </button>
          </div>
        )}
        {!document && !error && (
          <p role="status">Loading current course terms…</p>
        )}

        {document && (
          <>
            {document.isProvisional && (
              <p className="pj-course-terms__provisional" role="note">
                This is the initial course-terms copy. Its saved update date will
                appear after an authorized ProJenius editor reviews and saves
                it.
              </p>
            )}
            <p className="pj-course-terms__intro">
              {document.introduction}
            </p>
            <div className="pj-course-terms__sections">
              {orderedSections.map((section, index) => (
                <section key={`${section.order}-${section.heading}`}>
                  <h2>{index + 1}. {section.heading}</h2>
                  {String(section.body)
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>{paragraph}</p>
                    ))}
                </section>
              ))}
            </div>
            <p className="pj-course-terms__legal">
              These terms are provided for customer information and are not
              legal advice. Applicable non-waivable consumer rights continue to
              apply.
            </p>
          </>
        )}
      </article>
    </main>
  );
}
