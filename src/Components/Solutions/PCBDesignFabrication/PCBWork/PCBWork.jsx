import PCBSectionHead from "../PCBSectionHead/PCBSectionHead.jsx";
import "./PCBWork.css";

/* =============================================================================
   OUR WORK & ENGINEERING — six photo tiles in a bento layout
   (wide · small · small / small · small · wide). Text sits on the photo; on
   hover the photo zooms, a cyan frame glows and the description slides up.
   Tiles rise in one by one on scroll, in both directions.

   PHOTOS: src/assets/PCB/Work/<tile-id>/cover.webp (or .jpg / .png).
   The current photos are existing ProJenius photos; replace them with real
   board and project photos. No code change is needed.
   ============================================================================= */

const PHOTOS = import.meta.glob("../../../../assets/PCB/Work/*/*.{webp,jpg,jpeg,png}", {
  eager: true,
  import: "default",
});

const photoFor = (id) => {
  const entry = Object.entries(PHOTOS)
    .sort(([a], [b]) => a.localeCompare(b))
    .find(([path]) => path.includes(`/Work/${id}/`));
  return entry ? entry[1] : null;
};

const TILES = [
  {
    id: "custom-electronics",
    tag: "Electronics",
    title: "Custom Electronics Development",
    text: "Circuit design and hardware integration, built and tested with the team in our lab.",
    alt: "Students and the ProJenius team working on a hardware build in the lab",
  },
  {
    id: "hardware-engineering",
    tag: "Hardware",
    title: "Hardware Engineering",
    text: "Prototype and development work, from the first model to a working machine.",
    alt: "A machine built by ProJenius",
  },
  {
    id: "pcb-electronics",
    tag: "PCB",
    title: "PCB & Electronics",
    text: "Electronic design and implementation for real products.",
    alt: "The ProJenius IoT learning kit",
  },
  {
    id: "embedded-prototyping",
    tag: "Embedded",
    title: "Embedded Prototyping",
    text: "Controllers, sensors and firmware wired up and running on the bench.",
    alt: "A circuit board wired to sensors and a display on the bench, with a laptop",
  },
  {
    id: "testing-validation",
    tag: "Validation",
    title: "Testing & Validation",
    text: "Boards are tested and shown working before they are handed over.",
    alt: "The ProJenius team in the lab",
  },
  {
    id: "engineering-lab",
    tag: "Our Lab",
    title: "Hands-On Engineering Lab",
    text: "A lab where ideas are built, tested and improved together.",
    alt: "Students in the ProJenius lab",
  },
].map((tile) => ({ ...tile, image: photoFor(tile.id) }));

export default function PCBWork() {
  return (
    <section id="pcb-work" className="pjpcb-work" aria-labelledby="pcb-work-title">
      <div className="pjds-container">
        <PCBSectionHead
          id="pcb-work-title"
          eyebrow="Our Work & Engineering"
          title="Ideas That Take"
          typed={["Physical Form.", "Shape in Our Lab."]}
          lead="Hardware development is best shown through real boards, prototypes and engineering work."
        />

        <ul className="pjpcb-work__grid">
          {TILES.map(({ id, tag, title, text, alt, image }, index) => (
            <li
              key={id}
              className={`pjpcb-work__tile pjpcb-work__tile--${index + 1}`}
              data-reveal="up"
              data-reveal-delay={String((index % 3) + 1)}
            >
              {image && <img className="pjpcb-work__img" src={image} alt={alt} loading="lazy" decoding="async" />}
              <span className="pjpcb-work__tag">{tag}</span>
              <div className="pjpcb-work__copy">
                <h3 className="pjpcb-work__name">{title}</h3>
                <p className="pjpcb-work__text">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
