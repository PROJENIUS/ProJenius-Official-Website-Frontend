import "./MoreThanKnowledgePracticalExperience.css";

const outcomes = [
  "Understand the technology",
  "Work with real tools and components",
  "Apply concepts practically",
  "Build a basic working prototype or activity",
  "Experiment and troubleshoot",
  "Present or demonstrate their work",
  "Understand real-world applications",
  "Identify their next learning direction",
];

export default function MoreThanKnowledgePracticalExperience() {
  return (
    <section className="mk-section">
      <div className="mk-container">
        <div className="mk-left">
          <h2 className="mk-title">
            More Than Knowledge. Practical Experience.
          </h2>
          <p className="mk-desc">
            Each workshop is designed to leave students with something they can
            apply, build on, or explore further.
          </p>
        </div>

        <ul className="mk-list">
          {outcomes.map((text) => (
            <li key={text} className="mk-item">
              <span className="mk-check" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9" /></svg>
              </span>
              <span className="mk-text">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}