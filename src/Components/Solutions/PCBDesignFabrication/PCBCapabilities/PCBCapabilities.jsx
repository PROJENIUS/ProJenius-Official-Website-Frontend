import "./PCBCapabilities.css";

/* =============================================================================
   PCB CAPABILITIES — laid out like a datasheet: what each service covers and
   what you typically bring to it. Wording follows the existing ProJenius
   service descriptions; fabrication arrangements are stated as per project.
   ============================================================================= */

const ROWS = [
  {
    code: "SCH",
    title: "Schematic & Circuit Design",
    text: "Circuit design, component selection and integration for sensing, control and power.",
    bring: "A requirement, block diagram or an existing schematic",
  },
  {
    code: "PCB",
    title: "PCB Layout & Board Design",
    text: "Turning the circuit into a board: placement, routing and the board outline your product needs.",
    bring: "Board size, connectors and mounting constraints",
  },
  {
    code: "PRO",
    title: "Prototype & MVP Electronics",
    text: "Design and development support for prototype and MVP electronics, built to be tested and improved.",
    bring: "What the first version must prove",
  },
  {
    code: "FAB",
    title: "Fabrication & Assembly",
    text: "Getting the design made as a physical board and assembled for testing. How fabrication and assembly are arranged is confirmed for each project.",
    bring: "Quantity and timeline",
  },
];

export default function PCBCapabilities() {
  return (
    <section id="pcb-capabilities" className="pjpcb-caps" aria-labelledby="pcb-capabilities-title">
      <div className="pjds-container">
        <header className="pjpcb-caps__head">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">PCB Capabilities</p>
          <h2 id="pcb-capabilities-title" className="pjds-title pjds-title--on-dark" data-reveal="up" data-reveal-delay="1">
            Circuit Boards for Electronic Products
          </h2>
          <p className="pjds-lead pjds-lead--on-dark" data-reveal="up" data-reveal-delay="2">
            PCB design and fabrication for electronic systems and product development, from the first
            schematic to a board you can test.
          </p>
        </header>

        <div className="pjpcb-caps__sheet" role="table" aria-label="PCB services" data-reveal="up" data-reveal-delay="2">
          <div className="pjpcb-caps__row pjpcb-caps__row--head" role="row">
            <span role="columnheader">Ref</span>
            <span role="columnheader">Service</span>
            <span role="columnheader">What it covers</span>
            <span role="columnheader">Useful to bring</span>
          </div>
          {ROWS.map((row) => (
            <div key={row.code} className="pjpcb-caps__row" role="row">
              <span className="pjpcb-caps__code" role="cell">{row.code}</span>
              <div role="cell"><h3 className="pjpcb-caps__title">{row.title}</h3></div>
              <p className="pjpcb-caps__text" role="cell">{row.text}</p>
              <p className="pjpcb-caps__bring" role="cell">{row.bring}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
