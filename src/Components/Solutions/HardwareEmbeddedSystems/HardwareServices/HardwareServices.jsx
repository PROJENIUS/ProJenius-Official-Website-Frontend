import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { whatsappHref } from "../../../../utils/whatsapp.js";
import "./HardwareServices.css";

/* =============================================================================
   OUR ENGINEERING SERVICES — "What We Engineer.": six numbered rows.
   Motion:
     - rows rise in one by one with the page's scroll reveal (both ways);
     - while scrolling (down or up) the row nearest the middle of the screen
       is lit: cyan side bar, glowing number, filled arrow. Written to
       data-active directly, so scrolling never re-renders React;
     - hover lights a row too.
   Each row's arrow opens WhatsApp with a message naming that service.
   Reduced motion: no highlight follows the scroll.
   ============================================================================= */

const SERVICES = [
  {
    title: "Hardware Design & Engineering",
    text: "Electronic architecture, circuit design, component selection, power management and hardware integration.",
  },
  {
    title: "Embedded Systems & Firmware",
    text: "Microcontroller programming, embedded C/C++, firmware development, peripheral interfacing and device-level logic.",
  },
  {
    title: "IoT & Connected Devices",
    text: "Smart devices, wireless connectivity, sensor monitoring, cloud communication and connected applications.",
  },
  {
    title: "Automation & Control Systems",
    text: "Control electronics, actuator integration, automation logic, equipment monitoring and intelligent control.",
  },
  {
    title: "Robotics & Smart Machines",
    text: "Motor control, sensor systems, embedded controllers and integration of mechanical, electronic and software components.",
  },
  {
    title: "Prototype & Product Development",
    text: "Proof-of-concept development, functional prototypes, design iterations and engineering support from concept to validation.",
  },
];

/* Lights the row nearest the middle of the screen while the list is on
   screen; clears it when the list is off screen. */
function useActiveRow() {
  const ref = useRef(null);
  useEffect(() => {
    const list = ref.current;
    if (!list) return undefined;
    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const rows = Array.from(list.querySelectorAll("[data-row]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight || 1;
      const box = list.getBoundingClientRect();
      const onScreen = box.bottom > vh * 0.2 && box.top < vh * 0.8;
      let best = -1;
      let bestDistance = Infinity;
      if (onScreen) {
        rows.forEach((row, index) => {
          const r = row.getBoundingClientRect();
          const distance = Math.abs(r.top + r.height / 2 - vh * 0.5);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = index;
          }
        });
      }
      rows.forEach((row, index) => {
        if (index === best) row.dataset.active = "true";
        else delete row.dataset.active;
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);
  return ref;
}

export default function HardwareServices() {
  const listRef = useActiveRow();

  return (
    <section id="hardware-services" className="pjhw-svc" aria-labelledby="hardware-services-title">
      <div className="pjds-container">
        <header className="pjhw-svc__head">
          <p className="pjds-eyebrow" data-reveal="up">Our Engineering Services</p>
          <h2 id="hardware-services-title" className="pjds-title pjhw-svc__title" data-reveal="up" data-reveal-delay="1">
            What We <TypedPhrase phrases={["Engineer.", "Build."]} />
          </h2>
          <SectionTitleLine />
          <p className="pjds-lead pjhw-svc__lead" data-reveal="up" data-reveal-delay="2">
            From individual electronic subsystems to complete product prototypes, our services cover the essential
            stages of hardware and embedded product development.
          </p>
        </header>

        <ol ref={listRef} className="pjhw-svc__list">
          {SERVICES.map(({ title, text }, index) => (
            <li key={title} className="pjhw-svc__row" data-row data-reveal="up" data-reveal-delay={String((index % 3) + 1)}>
              <span className="pjhw-svc__num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div className="pjhw-svc__body">
                <h3 className="pjhw-svc__name">{title}</h3>
                <p className="pjhw-svc__text">{text}</p>
              </div>
              <a
                className="pjhw-svc__go"
                href={whatsappHref(`Hi ProJenius, I would like to discuss ${title} (Hardware & Embedded Systems).`)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Discuss ${title} on WhatsApp (opens in a new tab)`}
              >
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
