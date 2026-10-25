import { Component, memo, useCallback, useState } from "react";
import "./StartupSupport.css";

/* ==========================================================================
   StartupSupport.jsx
   RULES FOLLOWED : no inline style | no <style> tag | no CSS import | no CSS module
                    unique "ssj-" class names | no repeated markup (data + map)
   NOTE           : load StartupSupport.css ONCE outside this file
                    (e.g. <link rel="stylesheet" href="/StartupSupport.css"> in index.html)
   ========================================================================== */

/* ==========================================================================
   SESSION 1 : STATIC DATA
   Frozen so it cannot change at runtime. One array drives the left list and
   the right accordion, so nothing is repeated in the markup.
   ========================================================================== */
const CATEGORIES = Object.freeze([
  { id: "research", title: "Research & Validation", areas: [
    { title: "Research & Development", text: "Structured research into the problem space, existing solutions and the technologies that could solve it." },
    { title: "Idea & Problem Validation", text: "Testing whether the problem is real, who has it and whether people would use a solution." },
    { title: "Technical Feasibility", text: "Checking whether the idea can be built with available technology, budget and time." } ] },
  { id: "software", title: "Software & Intelligence", areas: [
    { title: "Software & Web Development", text: "Web platforms, apps and back-end systems built to grow from first release to many users." },
    { title: "AI & Data Intelligence", text: "Data-driven models and smart features for products that need to predict, classify or learn." },
    { title: "Cloud & Integration", text: "Hosting, APIs and connections that make software work reliably with other systems." } ] },
  { id: "hardware", title: "Hardware & Electronics", areas: [
    { title: "Electronics Design", text: "Circuit design and component selection for sensing, control and power." },
    { title: "PCB Design & Development", text: "Board design and development support for prototype and MVP electronics." },
    { title: "Embedded Systems & Firmware", text: "Firmware and control logic that make hardware behave reliably." } ] },
  { id: "prototype", title: "Prototype & MVP", areas: [
    { title: "Prototype Building", text: "Turning a validated concept into a working model that can be shown and tested." },
    { title: "MVP Development", text: "A focused first version with only the features needed to learn from real users." },
    { title: "Testing & Iteration", text: "Structured testing and improvement cycles based on real feedback." } ] },
  { id: "ip", title: "IP, Registration & Readiness", areas: [
    { title: "IP & Patent Guidance", text: "Understanding what can be protected and how to start the process." },
    { title: "Business Registration", text: "Guidance on setting up the business entity and the registrations it needs." },
    { title: "Compliance & Documentation", text: "Preparing the documents and standards a product must meet before launch." },
    { title: "Launch Readiness", text: "A final check across product, paperwork and plan before going to market." } ] },
]);

/* ==========================================================================
   SESSION 2 : ERROR BOUNDARY (one failing part cannot blank the page)
   Classes : ssj-fallback
   ========================================================================== */
class SafeBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="ssj-fallback" role="alert">This section could not be loaded.</p>
      : this.props.children;
  }
}

/* ==========================================================================
   SESSION 3 : CATEGORY ROW (one item in the left list)
   Classes : ssj-cat-item, ssj-cat, ssj-cat--active, ssj-cat-num, ssj-cat-title, ssj-cat-meta
   ========================================================================== */
const CategoryRow = memo(function CategoryRow({ index, cat, isActive, onSelect }) {
  return (
    <li className="ssj-cat-item">
      <button
        type="button"
        className={`ssj-cat${isActive ? " ssj-cat--active" : ""}`}
        aria-current={isActive ? "true" : undefined}
        aria-controls="ssj-panel"
        onClick={() => onSelect(index)}
      >
        <span className="ssj-cat-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <span className="ssj-cat-title">{cat.title}</span>
        <span className="ssj-cat-meta">{cat.areas.length} areas <span aria-hidden="true">→</span></span>
      </button>
    </li>
  );
});

/* ==========================================================================
   SESSION 4 : AREA ITEM (one accordion row on the right)
   Classes : ssj-area, ssj-area--open, ssj-area-head, ssj-area-title, ssj-area-icon,
             ssj-area-body, ssj-area-inner, ssj-area-text
   ========================================================================== */
const AreaItem = memo(function AreaItem({ uid, index, area, isOpen, onToggle }) {
  return (
    <li className={`ssj-area${isOpen ? " ssj-area--open" : ""}`}>
      <button
        type="button"
        className="ssj-area-head"
        id={`${uid}-head`}
        aria-expanded={isOpen}
        aria-controls={`${uid}-body`}
        onClick={() => onToggle(index)}
      >
        <span className="ssj-area-title">{area.title}</span>
        <span className="ssj-area-icon" aria-hidden="true" />
      </button>
      <div className="ssj-area-body" id={`${uid}-body`} role="region" aria-labelledby={`${uid}-head`}>
        <div className="ssj-area-inner">
          <p className="ssj-area-text">{area.text}</p>
        </div>
      </div>
    </li>
  );
});

/* ==========================================================================
   SESSION 5 : MAIN SECTION (header + category list + accordion)
   Classes : ssj-section, ssj-header, ssj-eyebrow, ssj-heading, ssj-lead,
             ssj-layout, ssj-cat-list, ssj-panel, ssj-area-list
   ========================================================================== */
export default function StartupSupport() {
  const [catIndex, setCatIndex] = useState(0);   // selected category (left)
  const [openIndex, setOpenIndex] = useState(0); // opened area (right), -1 = all closed

  // Stable handlers so memoised children do not re-render needlessly
  const handleSelect = useCallback((i) => { setCatIndex(i); setOpenIndex(0); }, []);
  const handleToggle = useCallback((i) => setOpenIndex((prev) => (prev === i ? -1 : i)), []);

  const cat = CATEGORIES[catIndex];

  return (
    <section className="ssj-section" aria-labelledby="ssj-heading">
      <header className="ssj-header">
        <p className="ssj-eyebrow">What We Support</p>
        <h2 id="ssj-heading" className="ssj-heading">Support Across the Startup Journey.</h2>
        <p className="ssj-lead">Choose an area on the left to see the support behind it.</p>
      </header>

      <div className="ssj-layout">
        <ul className="ssj-cat-list">
          {CATEGORIES.map((item, i) => (
            <CategoryRow key={item.id} index={i} cat={item} isActive={i === catIndex} onSelect={handleSelect} />
          ))}
        </ul>

        {/* key = re-mount on category change so the accordion starts fresh */}
        <div id="ssj-panel" className="ssj-panel" aria-live="polite">
          <SafeBoundary key={cat.id}>
            <ul className="ssj-area-list">
              {cat.areas.map((area, i) => (
                <AreaItem
                  key={area.title}
                  uid={`ssj-${cat.id}-${i}`}
                  index={i}
                  area={area}
                  isOpen={i === openIndex}
                  onToggle={handleToggle}
                />
              ))}
            </ul>
          </SafeBoundary>
        </div>
      </div>
    </section>
  );
}
