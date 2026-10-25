import "./PCBBoard.css";

/* =============================================================================
   PCB BOARD — an illustrative circuit board drawn in SVG (not a photo of a
   specific ProJenius board). One drawing, shown at different stages:

     hero         finished board; copper traces draw in once
     schematic    circuit symbols only
     layout       copper traces, pads and vias on a bare outline
     review       layout with design-check markers
     fabrication  bare manufactured board (solder mask + silkscreen)
     assembly     board with components placed
   ============================================================================= */

const HEADER_PINS = Array.from({ length: 8 }, (_, i) => 92 + i * 26);
const CHIP_PINS = Array.from({ length: 7 }, (_, i) => 132 + i * 16);

/* Copper routes: header pins → MCU left pins, MCU → right-side parts. */
const TRACES = [
  ...HEADER_PINS.slice(0, 7).map((y, i) => `M70 ${y} H${118 - i * 4} L150 ${CHIP_PINS[i]} H196`),
  "M324 132 H360 L384 108 H416",
  "M324 164 H372 L392 144 H416",
  "M324 196 H440",
  "M324 228 H372 L396 252 H416",
  "M324 260 H352 L376 284 H430",
  "M260 300 V318 H120 L104 302",
  "M228 100 V70 H300 L320 50",
  "M444 196 H470",
];

const VIAS = [[118, 92], [150, 300], [384, 108], [392, 144], [396, 252], [300, 70], [470, 196]];

export default function PCBBoard({ stage = "hero", className = "", label }) {
  return (
    <svg
      className={`pjpcb-board pjpcb-board--${stage}${className ? ` ${className}` : ""}`}
      viewBox="0 0 520 360"
      role="img"
      aria-label={label || "Illustration of a printed circuit board with a microcontroller, connectors and copper traces"}
    >
      {/* Board outline + mask */}
      <rect className="pjpcb-board__outline" x="16" y="16" width="488" height="328" rx="18" />
      {[[40, 40], [480, 40], [40, 320], [480, 320]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} className="pjpcb-board__hole" cx={cx} cy={cy} r="9" />
      ))}

      {/* Schematic layer */}
      <g className="pjpcb-board__schematic">
        <rect x="196" y="120" width="128" height="120" rx="4" />
        <text x="260" y="186" textAnchor="middle">MCU</text>
        {CHIP_PINS.map((y) => <path key={`sl-${y}`} d={`M168 ${y} H196`} />)}
        {CHIP_PINS.map((y) => <path key={`sr-${y}`} d={`M324 ${y} H352`} />)}
        <path d="M352 132 H372 l4 -8 l8 16 l8 -16 l8 16 l4 -8 H420" />
        <text x="396" y="116" textAnchor="middle">R1</text>
        <path d="M352 196 H396 M396 182 V210 M406 182 V210 M406 196 H440" />
        <text x="401" y="176" textAnchor="middle">C1</text>
        <path d="M352 260 H380 l10 -12 v24 z M390 248 V272 M390 260 H430" />
        <text x="398" y="290" textAnchor="middle">D1</text>
        <path d="M70 120 H168 M70 180 H168 M70 240 H168" />
        <rect x="46" y="104" width="24" height="152" rx="3" />
        <text x="58" y="96" textAnchor="middle">J1</text>
        <path d="M228 120 V84 M228 84 h-10 M228 84 h10 M222 78 h12" />
        <text x="248" y="80">VCC</text>
      </g>

      {/* Copper layer */}
      <g className="pjpcb-board__copper">
        {TRACES.map((d) => <path key={d} className="pjpcb-board__trace" d={d} pathLength="1" />)}
        {VIAS.map(([cx, cy]) => <circle key={`v-${cx}-${cy}`} className="pjpcb-board__via" cx={cx} cy={cy} r="4.5" />)}
        <path className="pjpcb-board__plane" d="M40 330 H480" />
      </g>

      {/* Pads */}
      <g className="pjpcb-board__pads">
        {HEADER_PINS.map((y) => <rect key={`h-${y}`} x="56" y={y - 7} width="14" height="14" rx="3" />)}
        {CHIP_PINS.map((y) => <rect key={`pl-${y}`} x="186" y={y - 3} width="12" height="6" rx="1.5" />)}
        {CHIP_PINS.map((y) => <rect key={`pr-${y}`} x="322" y={y - 3} width="12" height="6" rx="1.5" />)}
        {[[416, 100], [416, 136], [440, 188], [416, 244], [430, 276]].map(([x, y]) => (
          <g key={`p-${x}-${y}`}>
            <rect x={x} y={y} width="10" height="16" rx="2" />
            <rect x={x + 20} y={y} width="10" height="16" rx="2" />
          </g>
        ))}
        <rect x="470" y="168" width="22" height="56" rx="4" />
      </g>

      {/* Components */}
      <g className="pjpcb-board__parts">
        <rect className="pjpcb-board__chip" x="196" y="120" width="128" height="120" rx="8" />
        <circle className="pjpcb-board__chip-dot" cx="212" cy="136" r="4" />
        <text className="pjpcb-board__chip-label" x="260" y="186" textAnchor="middle">MCU</text>
        <rect className="pjpcb-board__part" x="412" y="102" width="38" height="12" rx="3" />
        <rect className="pjpcb-board__part" x="412" y="138" width="38" height="12" rx="3" />
        <rect className="pjpcb-board__part pjpcb-board__part--cap" x="436" y="186" width="38" height="20" rx="4" />
        <rect className="pjpcb-board__part" x="412" y="246" width="38" height="12" rx="3" />
        <rect className="pjpcb-board__part pjpcb-board__part--led" x="426" y="278" width="38" height="12" rx="3" />
        <rect className="pjpcb-board__connector" x="44" y="80" width="30" height="210" rx="5" />
        <rect className="pjpcb-board__connector" x="466" y="162" width="34" height="68" rx="5" />
      </g>

      {/* Silkscreen */}
      <g className="pjpcb-board__silk">
        <text x="58" y="72" textAnchor="middle">J1</text>
        <text x="431" y="96">R1</text>
        <text x="431" y="132">R2</text>
        <text x="410" y="182">C1</text>
        <text x="431" y="240">R3</text>
        <text x="445" y="272">D1</text>
        <text x="40" y="350" className="pjpcb-board__silk-small">REV A</text>
      </g>

      {/* Design-check markers */}
      <g className="pjpcb-board__review">
        <circle cx="150" cy="300" r="15" />
        <circle cx="392" cy="144" r="15" />
        <circle cx="300" cy="70" r="15" />
      </g>
    </svg>
  );
}
