import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import useSectionProgress from "../useSectionProgress.js";
import machineImage from "../../../assets/Home/OurProducts/OurProducts_1.webp";
import kitImage from "../../../assets/Home/OurProducts/OurProducts_2.webp";
import "./B3Reality.css";

/* =============================================================================
   HOME V3 — REALITY
   After the drawings, a real ProJenius product: the groundnut machine photo
   opens from a framed card to the full screen as the visitor scrolls (driven
   by --p from useSectionProgress). Product facts come from the homepage's
   Our Products data; the IoT kit is shown as "Coming soon", as it is there.
   ============================================================================= */

export default function B3Reality() {
  const ref = useRef(null);
  useSectionProgress(ref);

  return (
    <section className="b3r" aria-labelledby="b3r-title">
      <div ref={ref} className="b3r__track">
        <div className="b3r__pin">
          <p className="b3r__teaser" aria-hidden="true">Not just drawings.</p>

          <figure className="b3r__frame">
            <img
              className="b3r__image"
              src={machineImage}
              alt="Groundnut-to-peanut processing, sorting and grading machine"
              width="1640"
              height="959"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="b3r__overlay">
              <div className="b3-wrap">
                <p className="b3-label"><b>02</b> / Reality</p>
                <h2 id="b3r-title" className="b3r__title">
                  Not just drawings. <span className="b3-lit">Real machines.</span>
                </h2>
                <div className="b3r__meta">
                  <div>
                    <span className="b3-tag">Available · Smarter Agriculture</span>
                    <p className="b3r__name">Groundnut-to-Peanut Processing, Sorting &amp; Grading Machine</p>
                    <p className="b3r__text">
                      Breaks shells, separates dust, sorts peanuts by quality, grades them by size,
                      measures weight and predicts oil potential.
                    </p>
                  </div>
                  <a className="b3-btn b3-btn--light" href="https://gnut2pnut.projenius.in" target="_blank" rel="noopener noreferrer">
                    Visit product website <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="b3-wrap b3r__next">
        <article className="b3r__kit" data-reveal="up">
          <img src={kitImage} alt="ProJenius IoT Learning Kit box" width="1672" height="941" loading="lazy" decoding="async" />
          <div className="b3r__kit-body">
            <span className="b3-tag">Coming soon · Connected Solutions</span>
            <h3 className="b3r__kit-title">ProJenius IoT Learning Kit</h3>
            <p className="b3r__text">
              Hands-on kits for learning sensors, microcontrollers, connectivity and automation through
              practical hardware and software projects.
            </p>
            <Link className="b3r__kit-link" to="/contact">
              Ask about this product <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
