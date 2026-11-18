import { PROJECTS } from "../../../Home/OurProjects/projectsData.js";
import "./HardwareProjects.css";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* =============================================================================
   HARDWARE PROJECTS — ProJenius projects in IoT and embedded systems.
   4 featured hardware projects arranged in an even 2x2 3D glass card layout.
   ============================================================================= */

// Exact 4 projects matching the hardware domain
const HARDWARE_PROJECT_IDS = ["water-quality", "road-hazard", "smart-waste", "follower-robot"];

export default function HardwareProjects() {
  // Get the 4 projects, preserving the exact order
  const projects = HARDWARE_PROJECT_IDS
    .map((pid) => PROJECTS.find((p) => p.id === pid))
    .filter(Boolean);

  if (!projects.length) return null;

  return (
    <section id="hardware-projects" className="pjhw-projects" aria-labelledby="hardware-projects-title">
      <div className="pjds-container">
        <header className="pjhw-projects__head">
          <p className="pjds-eyebrow" data-reveal="up">Project Work</p>
          <h2 id="hardware-projects-title" className="pjds-title" data-reveal="up" data-reveal-delay="1">
            Hardware We Have <TypedPhrase phrases={["Worked On", "Built", "Delivered"]} />
          </h2>
          <SectionTitleLine />
          <p className="pjds-lead" data-reveal="up" data-reveal-delay="2">
            Projects from the ProJenius portfolio where sensors, controllers and software come together.
          </p>
        </header>

        <div className="pjhw-projects__grid">
          {projects.map(({ id, title, category, description, image, alt, Icon }, index) => (
            <article
              key={id}
              className="pjhw-card"
              data-reveal="up"
              data-reveal-delay={String((index % 2) + 1)}
            >
              {/* Top Media: 3D framed image box with proper object-fit */}
              <div className="pjhw-card__media">
                {image ? (
                  <img
                    src={image}
                    alt={alt || title}
                    className="pjhw-card__img"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="pjhw-card__placeholder" aria-hidden="true">
                    <Icon size={48} strokeWidth={1.6} />
                  </div>
                )}
                <span className="pjhw-card__badge">{category}</span>
              </div>

              {/* Bottom Body: Crisp high-contrast content */}
              <div className="pjhw-card__body">
                <h3 className="pjhw-card__title">{title}</h3>
                <p className="pjhw-card__text">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
