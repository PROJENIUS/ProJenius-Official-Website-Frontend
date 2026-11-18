import "./SectionTitleLine.css";

/* =============================================================================
   SECTION TITLE LINE — the short blue bar under a section heading, the same
   as the homepage "Who We Are" section. Place it right after the <h2>.
   It follows the heading's alignment (centred or left) by itself.
   ============================================================================= */

export default function SectionTitleLine({ className = "" }) {
  return <span className={`pj-title-line${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}
