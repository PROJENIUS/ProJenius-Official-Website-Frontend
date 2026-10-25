import ServiceHero from "../../Shared/ServiceHero/ServiceHero.jsx";
import { contactLink } from "../../Shared/serviceLinks.js";
import PCBBoard from "../PCBBoard/PCBBoard.jsx";
import "./PCBDesignFabricationHero.css";

/* =============================================================================
   PCB DESIGN & FABRICATION HERO
   Visual: the illustrated board, its copper traces drawing in once.
   ============================================================================= */

function PCBHeroVisual() {
  return (
    <figure className="pjpcb-hero-visual">
      <PCBBoard stage="hero" />
      <figcaption className="pjpcb-hero-visual__caption">
        <span>Schematic</span>
        <span>Layout</span>
        <span>Fabrication</span>
        <span>Assembly</span>
      </figcaption>
    </figure>
  );
}

export default function PCBDesignFabricationHero() {
  return (
    <ServiceHero
      id="pcb-hero-title"
      eyebrow="PCB Design & Fabrication"
      title="From Schematic"
      highlight="to a Finished Board"
      description="Circuit design, PCB layout and fabrication support for electronic products, prototypes and MVPs, with a clear output at every stage."
      primary={{ label: "Discuss PCB Requirements", to: contactLink("development", "pcb-design-fabrication") }}
      secondary={{ label: "View the Workflow", to: "#pcb-workflow" }}
      visual={<PCBHeroVisual />}
      className="pjpcb-hero"
    />
  );
}
