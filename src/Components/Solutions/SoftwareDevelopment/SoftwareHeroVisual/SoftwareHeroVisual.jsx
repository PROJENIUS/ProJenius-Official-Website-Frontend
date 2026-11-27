import { LayoutDashboard, MonitorSmartphone } from "lucide-react";

import waterMonitoringImage from "../../../../assets/Home/OurProjects/OurProjects_4.webp";
import roadSafetyImage from "../../../../assets/Home/OurProjects/OurProjects_5.webp";
import "./SoftwareHeroVisual.css";

/* =============================================================================
   SOFTWARE HERO VISUAL — two real ProJenius web applications in browser
   frames (the same project screenshots listed in the homepage Projects
   section: AI-Based Water Quality Monitoring and IRADERS road safety).
   ============================================================================= */

const DEFAULT_SCREENS = [
  { image: waterMonitoringImage, alt: "Screenshot of the AI-Powered Water Health Monitoring web application built by ProJenius" },
  { image: roadSafetyImage, alt: "Screenshot of the IRADERS emergency response web application built by ProJenius" },
];

export default function SoftwareHeroVisual({ screens = DEFAULT_SCREENS }) {
  return (
    <figure className="pjsw-hero-visual">
      <div className="pjsw-hero-visual__window pjsw-hero-visual__window--main">
        <div className="pjsw-hero-visual__bar" aria-hidden="true">
          <span /><span /><span />
          <i>water-health-monitoring</i>
        </div>
        <img
          src={screens[0].image}
          width="560"
          height="575"
          alt={screens[0].alt}
          decoding="async"
        />
      </div>

      <div className="pjsw-hero-visual__window pjsw-hero-visual__window--side">
        <div className="pjsw-hero-visual__bar" aria-hidden="true">
          <span /><span /><span />
          <i>iraders</i>
        </div>
        <img
          src={screens[1].image}
          width="560"
          height="575"
          alt={screens[1].alt}
          decoding="async"
        />
      </div>

      <span className="pjsw-hero-visual__chip pjsw-hero-visual__chip--one" aria-hidden="true">
        <LayoutDashboard size={16} strokeWidth={2.2} /> Web applications
      </span>
      <span className="pjsw-hero-visual__chip pjsw-hero-visual__chip--two" aria-hidden="true">
        <MonitorSmartphone size={16} strokeWidth={2.2} /> Responsive by design
      </span>

      <figcaption className="pjsw-hero-visual__caption">
        From ProJenius projects: AI-Based Water Quality Monitoring and the IRADERS road-safety platform.
      </figcaption>
    </figure>
  );
}
