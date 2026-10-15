import { Component, memo, useCallback, useLayoutEffect, useRef, useState } from "react";
import "./CapabilityMap.css";

/* ==========================================================================
   CapabilityMap.jsx
   RULES FOLLOWED : no inline style | no <style> tag | no CSS import | no CSS module
                    unique "cmap-" class names | no repeated markup (data + map)
   NOTE           : load CapabilityMap.css ONCE outside this file
                    (e.g. <link rel="stylesheet" href="/CapabilityMap.css"> in index.html)
   PROP           : logoSrc (optional) -> centre logo, e.g. "/logo.png"
   ========================================================================== */

/* ==========================================================================
   SESSION 1 : STATIC DATA
   Frozen so it cannot change at runtime. "links" hold ids, which are turned
   into names through NODE_BY_ID (one source of truth, no repeated text).
   Node ORDER matters: the CSS places node 1..10 around the hub with :nth-child.
   ========================================================================== */
const NODES = Object.freeze([
  { id: "saas", title: "Software & SaaS", links: ["ai", "web", "auto"],
    desc: "Web platforms and software products built to scale from first release to many users." },
  { id: "ai", title: "AI / ML", links: ["saas", "iot", "auto"],
    desc: "Data-driven models and intelligent features for products that need to predict, classify or learn." },
  { id: "web", title: "Mobile / Web", links: ["saas", "ai", "iot"],
    desc: "Responsive web and mobile apps that put the product in front of real users." },
  { id: "cad", title: "3D Design & Printing", links: ["pcb", "prod"],
    desc: "CAD modelling and 3D-printed parts or enclosures that make a concept tangible quickly." },
  { id: "prod", title: "Product Development", links: ["saas", "auto", "cad", "elec"],
    desc: "Turning a validated concept into a usable, testable product, from planning to MVP." },
  { id: "pcb", title: "PCB", links: ["elec", "emb", "cad"],
    desc: "Design and development support for prototype and MVP electronics." },
  { id: "auto", title: "Automation", links: ["iot", "saas", "ai"],
    desc: "Workflows, control and integration that replace repeated manual work." },
  { id: "elec", title: "Electronics", links: ["pcb", "emb", "iot"],
    desc: "Circuit design, component selection and integration for sensing, control and power." },
  { id: "iot", title: "IoT", links: ["emb", "elec", "saas"],
    desc: "Connected devices and sensors that turn physical signals into data people can use." },
  { id: "emb", title: "Embedded Systems", links: ["elec", "pcb", "iot"],
    desc: "Firmware and control logic that make hardware behave reliably." },
]);

const NODE_BY_ID = Object.freeze(Object.fromEntries(NODES.map((n) => [n.id, n])));

/* ==========================================================================
   SESSION 2 : HELPERS (pure functions)
   ========================================================================== */
// Safety: only allow local paths, https links or embedded images as the logo
const safeSrc = (src) =>
  typeof src === "string" && /^(\/(?!\/)|https:\/\/|data:image\/(png|jpe?g|webp|svg\+xml);)/.test(src) ? src : "";

const LINE_GAP = 4; // px gap between a line end and the hub / node edge

// One connector: starts on the hub's edge, ends on the node's nearest edge
// (so every line touches its button neatly instead of hiding under it)
const edgeLine = (hubEl, nodeEl, stageRect) => {
  const h = hubEl.getBoundingClientRect();
  const n = nodeEl.getBoundingClientRect();
  const hx = h.left - stageRect.left + h.width / 2;
  const hy = h.top - stageRect.top + h.height / 2;
  const nx = n.left - stageRect.left + n.width / 2;
  const ny = n.top - stageRect.top + n.height / 2;
  const dx = nx - hx;
  const dy = ny - hy;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  // how far from the node centre the ray (towards the hub) leaves the button box
  const exit = Math.min(
    ux ? n.width / 2 / Math.abs(ux) : Infinity,
    uy ? n.height / 2 / Math.abs(uy) : Infinity
  );
  const startLen = h.width / 2 + LINE_GAP;
  const endLen = Math.max(dist - exit - LINE_GAP, startLen);
  return { x1: hx + ux * startLen, y1: hy + uy * startLen, x2: hx + ux * endLen, y2: hy + uy * endLen };
};

/* ==========================================================================
   SESSION 3 : ERROR BOUNDARY (one failing part cannot blank the page)
   Classes : cmap-fallback
   ========================================================================== */
class SafeBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p className="cmap-fallback" role="alert">This section could not be loaded.</p>
      : this.props.children;
  }
}

/* ==========================================================================
   SESSION 4 : MAP NODE (one capability button around the hub)
   Classes : cmap-node-item, cmap-node, cmap-node--active, cmap-node-dot, cmap-node-label
   ========================================================================== */
const MapNode = memo(function MapNode({ index, node, isActive, registerNode, onActivate }) {
  return (
    <li className="cmap-node-item">
      <button
        ref={(el) => registerNode(index, el)}
        type="button"
        className={`cmap-node${isActive ? " cmap-node--active" : ""}`}
        aria-pressed={isActive}
        aria-controls="cmap-detail-card"
        onMouseEnter={() => onActivate(index)}
        onFocus={() => onActivate(index)}
        onClick={() => onActivate(index)}
      >
        <span className="cmap-node-dot" aria-hidden="true" />
        <span className="cmap-node-label">{node.title}</span>
      </button>
    </li>
  );
});

/* ==========================================================================
   SESSION 5 : CONNECTOR LINES (SVG from hub to every node)
   Classes : cmap-lines, cmap-line, cmap-line--active
   ========================================================================== */
const MapLines = memo(function MapLines({ geom, activeIndex }) {
  if (!geom) return null;
  const { width, height, lines } = geom;
  return (
    <svg className="cmap-lines" viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
      {lines.map((ln, i) => (
        <line
          key={NODES[i].id}
          className={`cmap-line${i === activeIndex ? " cmap-line--active" : ""}`}
          x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
        />
      ))}
    </svg>
  );
});

/* ==========================================================================
   SESSION 6 : DETAIL CARD (title, text, "often combined with")
   Classes : cmap-detail, cmap-detail-title, cmap-detail-text, cmap-detail-links
   ========================================================================== */
const DetailCard = memo(function DetailCard({ node }) {
  const names = node.links.map((id) => NODE_BY_ID[id]?.title).filter(Boolean).join(", ");
  return (
    <article id="cmap-detail-card" className="cmap-detail" aria-live="polite">
      <h3 className="cmap-detail-title">{node.title}</h3>
      <p className="cmap-detail-text">{node.desc}</p>
      <p className="cmap-detail-links">Often combined with: {names}</p>
    </article>
  );
});

/* ==========================================================================
   SESSION 7 : MAIN SECTION (header + map + detail card)
   Classes : cmap-section, cmap-header, cmap-eyebrow, cmap-heading, cmap-lead,
             cmap-stage, cmap-ring, cmap-ring--outer, cmap-hub, cmap-hub-logo,
             cmap-hub-text, cmap-list
   ========================================================================== */
export default function CapabilityMap({ logoSrc }) {
  const [activeIndex, setActiveIndex] = useState(0); // hover / focus / click -> card stays on last choice
  const [geom, setGeom] = useState(null);            // measured line coordinates

  const stageRef = useRef(null);
  const hubRef = useRef(null);
  const nodeRefs = useRef([]);

  // Stable handlers so memoised children do not re-render needlessly
  const handleActivate = useCallback((i) => setActiveIndex(i), []);
  const registerNode = useCallback((i, el) => { nodeRefs.current[i] = el; }, []);

  // Measure real positions so lines stay correct on every screen size
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const hub = hubRef.current;
    if (!stage || !hub) return undefined;

    const measure = () => {
      if (window.getComputedStyle(stage).getPropertyValue("--cmap-radial").trim() !== "1") { setGeom(null); return; } // mobile: no lines
      const s = stage.getBoundingClientRect();
      setGeom({
        width: s.width, height: s.height,
        lines: nodeRefs.current.filter(Boolean).map((el) => edgeLine(hub, el, s)),
      });
    };

    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const logo = safeSrc(logoSrc);
  const active = NODES[activeIndex];

  return (
    <section className="cmap-section" aria-labelledby="cmap-heading">
      <header className="cmap-header">
        <p className="cmap-eyebrow">Capability Map</p>
        <h2 id="cmap-heading" className="cmap-heading">One Idea. Multiple Capabilities.</h2>
        <p className="cmap-lead">The technology you need depends on the problem you&apos;re solving.</p>
      </header>

      <div ref={stageRef} className="cmap-stage">
        <span className="cmap-ring" aria-hidden="true" />
        <span className="cmap-ring cmap-ring--outer" aria-hidden="true" />
        <MapLines geom={geom} activeIndex={activeIndex} />
        <div ref={hubRef} className="cmap-hub">
          {logo
            ? <img className="cmap-hub-logo" src={logo} alt="Projenius logo" decoding="async" referrerPolicy="no-referrer" />
            : <span className="cmap-hub-text" aria-label="Projenius">PJ</span>}
        </div>
        <ul className="cmap-list">
          {NODES.map((node, i) => (
            <MapNode
              key={node.id}
              index={i}
              node={node}
              isActive={i === activeIndex}
              registerNode={registerNode}
              onActivate={handleActivate}
            />
          ))}
        </ul>
      </div>

      {/* key = re-mount on change so the card fades in again */}
      <SafeBoundary key={active.id}>
        <DetailCard node={active} />
      </SafeBoundary>
    </section>
  );
}
