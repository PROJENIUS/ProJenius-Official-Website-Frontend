/* =============================================================================
   COURSE ART — simple flat illustrations drawn in the ProJenius colours
   (navy #071426, cyan #20c8f5, blue #0478a8, light blue #e8f8fe).
   ProjectArt: a picture for a project card (web, data, device, design, cloud).
   CareerArt:  a picture for a career-support card.
   Decorative only (aria-hidden); the card text carries the meaning.
   ============================================================================= */

const NAVY = "#071426";
const NAVY2 = "#12325a";
const CYAN = "#20c8f5";
const BLUE = "#0478a8";
const PALE = "#e8f8fe";
const LINE = "#c9e9f6";
const WHITE = "#ffffff";

function Laptop({ children }) {
  return (
    <g>
      <rect x="62" y="22" width="196" height="122" rx="10" fill={NAVY} />
      <rect x="70" y="30" width="180" height="106" rx="5" fill={WHITE} />
      {children}
      <path d="M44 146h232l-14 14H58z" fill={NAVY2} />
      <rect x="138" y="146" width="44" height="4" rx="2" fill={BLUE} />
    </g>
  );
}

export function ProjectArt({ variant = "web" }) {
  return (
    <svg viewBox="0 0 320 170" className="pjcd-art" aria-hidden="true" focusable="false">
      <rect width="320" height="170" fill={PALE} />
      <circle cx="285" cy="28" r="40" fill={LINE} opacity="0.6" />
      {variant === "web" && (
        <Laptop>
          <rect x="70" y="30" width="180" height="12" fill={PALE} />
          <circle cx="78" cy="36" r="2.5" fill={CYAN} /><circle cx="86" cy="36" r="2.5" fill={LINE} /><circle cx="94" cy="36" r="2.5" fill={LINE} />
          <rect x="78" y="50" width="70" height="8" rx="3" fill={NAVY} />
          <rect x="78" y="62" width="50" height="5" rx="2" fill={LINE} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={78 + i * 56} y="76" width="50" height="50" rx="6" fill={PALE} />
              <rect x={86 + i * 56} y="84" width="34" height="22" rx="4" fill={i === 1 ? CYAN : LINE} />
              <rect x={86 + i * 56} y="112" width="26" height="5" rx="2" fill={NAVY} />
            </g>
          ))}
        </Laptop>
      )}
      {variant === "data" && (
        <Laptop>
          <rect x="78" y="40" width="60" height="7" rx="3" fill={NAVY} />
          {[30, 48, 38, 62, 54, 76].map((h, i) => (
            <rect key={i} x={80 + i * 16} y={128 - h} width="10" height={h} rx="2" fill={i === 5 ? CYAN : LINE} />
          ))}
          <polyline points="85,100 101,86 117,92 133,70 149,76 165,56" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="184" y="44" width="58" height="34" rx="6" fill={PALE} />
          <rect x="190" y="52" width="40" height="5" rx="2" fill={NAVY} />
          <rect x="190" y="62" width="30" height="5" rx="2" fill={LINE} />
          <rect x="184" y="86" width="58" height="40" rx="6" fill={NAVY} />
          <rect x="190" y="94" width="34" height="5" rx="2" fill={CYAN} />
          <rect x="190" y="104" width="44" height="5" rx="2" fill={NAVY2} />
          <rect x="190" y="114" width="26" height="5" rx="2" fill={NAVY2} />
        </Laptop>
      )}
      {variant === "device" && (
        <g>
          <rect x="70" y="28" width="180" height="116" rx="12" fill={NAVY2} />
          <rect x="78" y="36" width="164" height="100" rx="8" fill="#0f3b66" />
          <rect x="132" y="62" width="56" height="48" rx="5" fill={NAVY} />
          <rect x="144" y="74" width="32" height="24" rx="3" fill={CYAN} opacity="0.85" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={138 + i * 10} y="54" width="4" height="8" fill="#c9a24b" />
              <rect x={138 + i * 10} y="110" width="4" height="8" fill="#c9a24b" />
            </g>
          ))}
          <path d="M96 52h30v20M96 120h30v-14M224 52h-30v20M224 120h-30v-14" fill="none" stroke={CYAN} strokeWidth="2" />
          <circle cx="96" cy="52" r="5" fill={CYAN} /><circle cx="96" cy="120" r="5" fill={CYAN} />
          <circle cx="224" cy="52" r="5" fill={CYAN} /><circle cx="224" cy="120" r="5" fill={CYAN} />
          <circle cx="232" cy="44" r="4" fill="#ef3b4f" />
        </g>
      )}
      {variant === "design" && (
        <g>
          <rect x="70" y="30" width="120" height="118" rx="10" fill={WHITE} stroke={LINE} strokeWidth="2" />
          <rect x="80" y="42" width="100" height="40" rx="6" fill={LINE} />
          <circle cx="100" cy="62" r="10" fill={CYAN} />
          <rect x="80" y="92" width="70" height="7" rx="3" fill={NAVY} />
          <rect x="80" y="104" width="90" height="5" rx="2" fill={LINE} />
          <rect x="80" y="126" width="46" height="14" rx="7" fill={BLUE} />
          <rect x="206" y="22" width="62" height="126" rx="12" fill={NAVY} />
          <rect x="212" y="32" width="50" height="106" rx="7" fill={WHITE} />
          <rect x="218" y="40" width="38" height="24" rx="4" fill={PALE} />
          <rect x="218" y="70" width="30" height="5" rx="2" fill={NAVY} />
          <rect x="218" y="80" width="38" height="4" rx="2" fill={LINE} />
          <rect x="218" y="118" width="38" height="12" rx="6" fill={CYAN} />
          <path d="M190 90 L206 80" stroke={BLUE} strokeWidth="2" strokeDasharray="4 4" />
        </g>
      )}
      {variant === "cloud" && (
        <g>
          <path d="M110 70a26 26 0 0 1 50-10 20 20 0 0 1 36 12 18 18 0 0 1-4 36H116a20 20 0 0 1-6-38z" fill={WHITE} stroke={LINE} strokeWidth="2" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={86 + i * 56} y="122" width="44" height="30" rx="6" fill={NAVY} />
              <rect x={94 + i * 56} y="130" width="28" height="4" rx="2" fill={CYAN} />
              <rect x={94 + i * 56} y="140" width="18" height="4" rx="2" fill={NAVY2} />
              <path d={`M${108 + i * 56} 122 V108`} stroke={BLUE} strokeWidth="2" strokeDasharray="3 3" />
            </g>
          ))}
          <path d="M146 86l8-8 8 8M154 78v20" fill="none" stroke={CYAN} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}

function Person({ x, y, shirt, flip = false }) {
  return (
    <g transform={`translate(${x} ${y})${flip ? " scale(-1 1)" : ""}`}>
      <circle cx="0" cy="0" r="13" fill="#f2c9a5" />
      <path d="M-13 -2a13 13 0 0 1 26 0c0-10-6-14-13-14s-13 4-13 14z" fill={NAVY} />
      <path d="M-24 50c0-22 10-34 24-34s24 12 24 34z" fill={shirt} />
    </g>
  );
}

export function CareerArt({ kind }) {
  return (
    <svg viewBox="0 0 300 170" className="pjcd-art" aria-hidden="true" focusable="false">
      {kind === "interview" && (
        <g>
          <rect x="40" y="118" width="220" height="10" rx="4" fill={NAVY2} />
          <Person x={92} y={74} shirt={BLUE} />
          <Person x={208} y={74} shirt={CYAN} flip />
          <rect x="66" y="20" width="76" height="30" rx="10" fill={WHITE} stroke={LINE} strokeWidth="2" />
          <rect x="76" y="30" width="44" height="5" rx="2" fill={NAVY} /><rect x="76" y="39" width="30" height="4" rx="2" fill={LINE} />
          <rect x="160" y="12" width="76" height="30" rx="10" fill={NAVY} />
          <rect x="170" y="22" width="50" height="5" rx="2" fill={CYAN} /><rect x="170" y="31" width="34" height="4" rx="2" fill={NAVY2} />
          <rect x="132" y="104" width="36" height="14" rx="3" fill={WHITE} stroke={LINE} />
        </g>
      )}
      {kind === "resume" && (
        <g>
          <rect x="92" y="14" width="116" height="146" rx="8" fill={WHITE} stroke={LINE} strokeWidth="2" transform="rotate(-4 150 87)" />
          <g transform="rotate(-4 150 87)">
            <rect x="104" y="28" width="34" height="38" rx="5" fill={PALE} />
            <circle cx="121" cy="42" r="8" fill={BLUE} />
            <path d="M109 64c2-9 8-12 12-12s10 3 12 12z" fill={BLUE} />
            <rect x="146" y="32" width="50" height="7" rx="3" fill={NAVY} />
            <rect x="146" y="44" width="36" height="5" rx="2" fill={LINE} />
            {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="104" y={80 + i * 13} width={i % 2 ? 70 : 92} height="5" rx="2" fill={i === 0 ? CYAN : LINE} />)}
          </g>
          <circle cx="212" cy="132" r="20" fill={CYAN} />
          <path d="M202 132l7 7 13-14" fill="none" stroke={NAVY} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {kind === "linkedin" && (
        <g>
          <rect x="60" y="24" width="180" height="122" rx="12" fill={WHITE} stroke={LINE} strokeWidth="2" />
          <rect x="60" y="24" width="180" height="38" rx="12" fill={BLUE} />
          <rect x="60" y="50" width="180" height="12" fill={BLUE} />
          <circle cx="98" cy="66" r="20" fill={WHITE} />
          <circle cx="98" cy="62" r="8" fill={NAVY} />
          <path d="M84 80c2-9 8-11 14-11s12 2 14 11z" fill={NAVY} />
          <rect x="126" y="70" width="70" height="7" rx="3" fill={NAVY} />
          <rect x="126" y="82" width="50" height="5" rx="2" fill={LINE} />
          {[0, 1, 2].map((i) => <rect key={i} x={78 + i * 50} y="110" width="42" height="16" rx="8" fill={i === 0 ? CYAN : PALE} />)}
        </g>
      )}
      {kind === "placement" && (
        <g>
          {[0, 1, 2, 3].map((i) => <rect key={i} x={70 + i * 40} y={130 - i * 26} width="40" height={20 + i * 26} fill={i === 3 ? CYAN : i % 2 ? LINE : PALE} />)}
          <Person x={210} y={42} shirt={BLUE} />
          <rect x="88" y="60" width="44" height="32" rx="5" fill={NAVY} />
          <rect x="102" y="54" width="16" height="8" rx="3" fill="none" stroke={NAVY} strokeWidth="3" />
          <rect x="88" y="72" width="44" height="4" fill={CYAN} />
          <path d="M60 40l40-18" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
          <path d="M92 18l8 4-4 8" fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {kind === "activities" && (
        <g>
          <rect x="94" y="22" width="112" height="134" rx="10" fill={WHITE} stroke={LINE} strokeWidth="2" />
          <rect x="126" y="14" width="48" height="18" rx="6" fill={NAVY} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x="108" y={46 + i * 26} width="16" height="16" rx="4" fill={i < 3 ? CYAN : PALE} stroke={i < 3 ? "none" : LINE} />
              {i < 3 && <path d={`M111 ${54 + i * 26}l4 4 7-8`} fill="none" stroke={NAVY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
              <rect x="132" y={50 + i * 26} width={i % 2 ? 44 : 60} height="6" rx="3" fill={i < 3 ? NAVY : LINE} />
            </g>
          ))}
          <circle cx="222" cy="44" r="16" fill={PALE} />
          <path d="M215 44l5 5 9-10" fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}
