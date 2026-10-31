import { ArrowRight } from "lucide-react";

import CinematicHero, { HeroTerminal } from "../../../Common/CinematicHero/CinematicHero.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import machinePhoto from "../../../../assets/Home/OurProducts/OurProducts_1.webp";
import "./RapidPrototypingHero.css";

/* Hero photo: src/assets/Heroes/prototyping/backdrop.* (see its README);
   the real photo below is used until one is added there. */
const HERO = heroPhotos("prototyping", { backdrop: machinePhoto });

/* Hero terminal: a part going from CAD model to a tested print. */
const TERMINAL = [
  { kind: "cmd", text: "projenius print --part \"enclosure v1\"" },
  { kind: "info", text: "preparing the CAD model..." },
  { kind: "ok", text: "design checked for printing" },
  { kind: "ok", text: "printed layer by layer" },
  { kind: "ok", text: "fit and function tested" },
  { kind: "ok", text: "refined to v2" },
  { kind: "done", text: "something you can hold" },
];

/* =============================================================================
   RAPID PROTOTYPING HERO — the shared cinematic hero.
   PrototypeVisual (an illustrated enclosure as CAD wireframe, then printed
   layer by layer) is kept for the Home V2 preview.
   ============================================================================= */

/* Isometric enclosure: top face, two side faces and a lid opening. */
const TOP = "M110 70 L190 30 L270 70 L190 110 Z";
const LEFT = "M110 70 L110 150 L190 190 L190 110 Z";
const RIGHT = "M190 110 L190 190 L270 150 L270 70 Z";
const SLOT = "M150 70 L190 50 L230 70 L190 90 Z";
/* Print layer lines across both side faces (faces span y 70–150 at their outer edge). */
const LAYERS = Array.from({ length: 9 }, (_, i) => 78 + i * 9);

function Enclosure({ variant }) {
  return (
    <svg className={`pjrp-part pjrp-part--${variant}`} viewBox="80 20 220 190" aria-hidden="true">
      {variant === "printed" && (
        <defs>
          <clipPath id="pjrp-print-clip">
            <rect className="pjrp-part__build" x="80" y="20" width="220" height="190" />
          </clipPath>
        </defs>
      )}
      <g clipPath={variant === "printed" ? "url(#pjrp-print-clip)" : undefined}>
        <path className="pjrp-part__left" d={LEFT} />
        <path className="pjrp-part__right" d={RIGHT} />
        <path className="pjrp-part__top" d={TOP} />
        <path className="pjrp-part__slot" d={SLOT} />
        {variant === "printed" && LAYERS.map((y) => (
          <path key={y} className="pjrp-part__layer" d={`M110 ${y} L190 ${y + 40} L270 ${y}`} />
        ))}
      </g>
      {variant === "cad" && (
        <g className="pjrp-part__dims">
          <path d="M104 160 L184 200" />
          <path d="M196 200 L276 160" />
          <text x="132" y="196">80</text>
          <text x="236" y="196">80</text>
        </g>
      )}
    </svg>
  );
}

export function PrototypeVisual() {
  return (
    <figure className="pjrp-hero-visual">
      <div className="pjrp-hero-visual__stages">
        <div className="pjrp-hero-visual__stage">
          <span className="pjrp-hero-visual__label">CAD model</span>
          <Enclosure variant="cad" />
        </div>
        <span className="pjrp-hero-visual__arrow" aria-hidden="true">
          <ArrowRight size={22} strokeWidth={2.2} />
        </span>
        <div className="pjrp-hero-visual__stage pjrp-hero-visual__stage--printed">
          <span className="pjrp-hero-visual__label">Printed prototype</span>
          <Enclosure variant="printed" />
        </div>
      </div>
      <figcaption className="pjrp-hero-visual__caption">
        Illustration: an enclosure going from a digital design to a physical part.
      </figcaption>
    </figure>
  );
}

export default function RapidPrototypingHero() {
  return (
    <CinematicHero
      id="prototype-hero-title"
      eyebrow="Rapid Prototyping"
      title="Turn Your Concept Into"
      accent="Something You Can Hold"
      description="Rapid prototyping and 3D printing for product concepts, custom components, functional parts and development-ready prototypes."
      primary={{ label: "Discuss Your Prototype", to: contactLink("development", "rapid-prototyping") }}
      secondary={{ label: "How Prototyping Works", to: "#prototyping-process" }}
      photo={HERO.backdrop}
      aside={<HeroTerminal file="print.sh" label="How a prototype gets made" lines={TERMINAL} />}
      band={["Concept Models", "Product Enclosures", "Custom Components", "Functional Parts", "3D Printing", "Development-Ready Prototypes"]}
      className="pjrp-hero"
    />
  );
}
