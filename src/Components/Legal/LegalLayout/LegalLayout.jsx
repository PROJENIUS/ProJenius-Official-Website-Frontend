import "./LegalLayout.css";
import LegalSidebar from "../LegalSidebar/LegalSidebar";

export default function LegalLayout({ title, lastUpdated, children }) {
  return (
    <main className="pj-legal-layout">
      <div className="pj-legal-layout__inner">
        <LegalSidebar />
        <article
          className="pj-legal-layout__content"
          aria-labelledby="pj-legal-title"
        >
          <header className="pj-legal-layout__header">
            <h1 id="pj-legal-title">{title}</h1>
            {lastUpdated && (
              <p className="pj-legal-layout__updated">
                Last updated: {lastUpdated}
              </p>
            )}
          </header>
          {children}
        </article>
      </div>
    </main>
  );
}
