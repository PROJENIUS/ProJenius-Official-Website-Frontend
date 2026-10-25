import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LegalLayout from "../LegalLayout/LegalLayout.jsx";
import {
  fetchLegalDocument,
  formatLegalDate,
} from "../../../utils/legalDocuments.js";
import "./LegalDocumentView.css";
const DOCUMENT_TITLES = {
  terms: "Terms & Conditions",
  "privacy-policy": "Privacy Policy",
};

function renderParagraph(text, key) {
  const pieces = String(text || "").split(
    /(teamprojenius@gmail\.com|Privacy Policy|live-training terms page|Contact page)/g,
  );

  return (
    <p key={key}>
      {pieces.map((part, index) => {
        if (part === "teamprojenius@gmail.com") {
          return (
            <a key={index} href="mailto:teamprojenius@gmail.com">
              {part}
            </a>
          );
        }

        if (part === "Privacy Policy") {
          return (
            <Link key={index} to="/privacy-policy">
              {part}
            </Link>
          );
        }

        if (part === "live-training terms page") {
          return (
            <Link key={index} to="/services/courses/terms">
              {part}
            </Link>
          );
        }

        if (part === "Contact page") {
          return (
            <Link key={index} to="/contact">
              {part}
            </Link>
          );
        }

        return part;
      })}
    </p>
  );
}

function LegalMessage({ title, message, onRetry }) {
  return (
    <LegalLayout title={title}>
      <div className="pj-legal-document__message" role="alert">
        <p>{message}</p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    </LegalLayout>
  );
}

export default function LegalDocumentView({ documentKey }) {
  const [loaded, setLoaded] = useState(null);
  const [requestError, setRequestError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchLegalDocument(documentKey, controller.signal)
      .then((document) => {
        setLoaded({ documentKey, attempt, document });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setRequestError({ documentKey, attempt, message: error.message });
        }
      });

    return () => controller.abort();
  }, [documentKey, attempt]);

  const isCurrentLoad = loaded?.documentKey === documentKey
    && loaded?.attempt === attempt;
  const document = isCurrentLoad ? loaded.document : null;
  const matchingError = requestError?.documentKey === documentKey
    && requestError?.attempt === attempt;
  const error = matchingError ? requestError.message : "";
  const title = DOCUMENT_TITLES[documentKey] || "Legal document";

  if (error) {
    return (
      <LegalMessage
        title={title}
        message={error}
        onRetry={() => setAttempt((value) => value + 1)}
      />
    );
  }

  if (!document) {
    return (
      <LegalLayout title={title}>
        <p
          className="pj-legal-document__loading"
          role="status"
          aria-live="polite"
        >
          Loading current legal content…
        </p>
      </LegalLayout>
    );
  }

  const orderedSections = document.sections
    .slice()
    .sort((first, second) => first.order - second.order);

  return (
    <LegalLayout
      title={document.title}
      lastUpdated={formatLegalDate(document.lastUpdated)}
    >
      <div className="pj-legal-document">
        {document.isProvisional && (
          <p className="pj-legal-document__provisional" role="note">
            This is the initial legal document copy. Its saved update date will
            appear after an authorized ProJenius editor reviews and saves it.
          </p>
        )}
        {renderParagraph(document.introduction, "intro")}
        {orderedSections.map((section, index) => (
          <section key={`${section.order}-${section.heading}`}>
            <h2>{index + 1}. {section.heading}</h2>
            {String(section.body)
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((paragraph, paragraphIndex) => renderParagraph(
                paragraph,
                `${section.order}-${paragraphIndex}`,
              ))}
          </section>
        ))}
      </div>
    </LegalLayout>
  );
}
