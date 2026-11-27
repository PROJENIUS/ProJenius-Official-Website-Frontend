import { ArrowDown, ArrowRight, Cpu, Lightbulb, PackageCheck, Plus } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { PRODUCTS } from "../productsData.js";
import usePageHero from "../../../pageHeroes/usePageHero.js";
import { HERO_DEFAULTS } from "../../../pageHeroes/heroDefaults.js";
import "./ProductsHero.css";

/* =============================================================================
   PRODUCTS HERO — navy, our hero pattern (pill, heading + cyan typing, blue
   line, cyan CTA). Right: the real product photos as a collage, with a
   "your product next" tile that leads to building your own product.
   Text: Admin → Page Heroes → Products. The photos come from the products
   themselves (productsData.js).
   ============================================================================= */

const PHOTOS = PRODUCTS.filter((p) => p.image && !p.placeholder).slice(0, 2);

const scrollTo = (id) => (event) => {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};

const FACT_ICONS = [Lightbulb, Cpu, PackageCheck];

export default function ProductsHero() {
  const hero = usePageHero("products", HERO_DEFAULTS.products);
  return (
    <section className="pjph" aria-labelledby="products-title">
      <div className="pjds-container pjph__grid">
        <div className="pjph__copy">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">{hero.eyebrow}</p>
          <h1 id="products-title" className="pjph__title" data-reveal="up" data-reveal-delay="1">
            {hero.title}{" "}
            <TypedPhrase tone="dark" phrases={hero.phrases} />
          </h1>
          <SectionTitleLine />
          <p className="pjph__lead" data-reveal="up" data-reveal-delay="2">
            {hero.lead}
          </p>
          <div className="pjph__actions" data-reveal="up" data-reveal-delay="3">
            <a className="pjph__btn pjph__btn--primary" href="#product-list" onClick={scrollTo("product-list")}>
              {hero.primaryLabel} <ArrowDown size={18} aria-hidden="true" />
            </a>
            <a className="pjph__btn pjph__btn--ghost" href="#product-idea" onClick={scrollTo("product-idea")}>
              {hero.secondaryLabel} <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <ul className="pjph__facts" data-reveal="up" data-reveal-delay="3">
            {hero.facts.map((fact, index) => {
              const Icon = FACT_ICONS[index] || Lightbulb;
              return <li key={index}><Icon size={16} aria-hidden="true" /> {fact}</li>;
            })}
          </ul>
        </div>

        <div className="pjph__collage" data-reveal="up" data-reveal-delay="2">
          {PHOTOS.map((product, index) => (
            <a
              key={product.id}
              href={`#${product.id}`}
              onClick={scrollTo(product.id)}
              className={`pjph__tile pjph__tile--${index + 1}`}
            >
              <img src={product.image} alt={product.alt || product.title} loading={index ? "lazy" : "eager"} />
              <span className="pjph__tile-label">
                <small>{product.category}</small>
                {product.title.length > 34 ? `${product.title.slice(0, 32)}…` : product.title}
              </span>
            </a>
          ))}
          <a href="#product-idea" onClick={scrollTo("product-idea")} className="pjph__tile pjph__tile--next">
            <span className="pjph__next-icon" aria-hidden="true"><Plus size={26} /></span>
            <strong>Your product next</strong>
            <small>Tell us your idea</small>
          </a>
        </div>
      </div>
    </section>
  );
}
