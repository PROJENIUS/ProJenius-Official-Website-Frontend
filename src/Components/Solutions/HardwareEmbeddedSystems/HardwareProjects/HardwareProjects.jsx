import { PROJECTS } from "../../../Home/OurProjects/projectsData.js";
import "./HardwareProjects.css";

/* =============================================================================
   HARDWARE PROJECTS — ProJenius projects in IoT and embedded systems.
   Read from the homepage project data, so the list stays in one place.
   ============================================================================= */

const HARDWARE_CATEGORIES = /IoT|Hardware|Embedded/i;

export default function HardwareProjects() {
  const projects = PROJECTS.filter((project) => HARDWARE_CATEGORIES.test(project.category));
  if (!projects.length) return null;

  return (
    <section id="hardware-projects" className="pjhw-projects" aria-labelledby="hardware-projects-title">
      <div className="pjds-container">
        <header className="pjhw-projects__head">
          <p className="pjds-eyebrow" data-reveal="up">Project Work</p>
          <h2 id="hardware-projects-title" className="pjds-title" data-reveal="up" data-reveal-delay="1">
            Hardware We Have Worked On
          </h2>
          <p className="pjds-lead" data-reveal="up" data-reveal-delay="2">
            Projects from the ProJenius portfolio where sensors, controllers and software come together.
          </p>
        </header>

        <ul className="pjhw-projects__grid">
          {projects.map(({ id, title, category, description, image, alt, Icon }, index) => (
            <li key={id} className="pjhw-projects__item" data-reveal="up" data-reveal-delay={String((index % 2) + 1)}>
              <div className="pjhw-projects__media">
                {image ? (
                  <img src={image} alt={alt} width="560" height="575" loading="lazy" decoding="async" />
                ) : (
                  <span className="pjhw-projects__placeholder" aria-hidden="true">
                    <Icon size={40} strokeWidth={1.6} />
                  </span>
                )}
              </div>
              <div className="pjhw-projects__body">
                <p className="pjhw-projects__category">{category}</p>
                <h3 className="pjhw-projects__title">{title}</h3>
                <p className="pjhw-projects__text">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
