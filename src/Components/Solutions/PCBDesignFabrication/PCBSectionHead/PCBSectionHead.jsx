import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import "./PCBSectionHead.css";

/* =============================================================================
   PCB SECTION HEAD — the centred heading used by the PCB page sections:
   pill, fixed words, cyan typing words, the cyan line and a short lead.
   Colours follow the section (navy or light) through the page tokens.
   ============================================================================= */

export default function PCBSectionHead({ id, eyebrow, title, typed, lead }) {
  return (
    <header className="pjpcb-head">
      <p className="pjds-eyebrow" data-reveal="up">{eyebrow}</p>
      <h2 id={id} className="pjds-title pjpcb-head__title" data-reveal="up" data-reveal-delay="1">
        {title}
        {typed && <> <TypedPhrase phrases={typed} /></>}
      </h2>
      <SectionTitleLine />
      {lead && <p className="pjds-lead pjpcb-head__lead" data-reveal="up" data-reveal-delay="2">{lead}</p>}
    </header>
  );
}
