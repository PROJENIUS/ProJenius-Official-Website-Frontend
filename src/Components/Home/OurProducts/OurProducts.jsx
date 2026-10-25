import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Boxes, MessageCircle } from "lucide-react";

import "./OurProducts.css";

import { PRODUCTS as ALL_PRODUCTS, productWhatsAppHref } from "../../Products/productsData.js";

// The homepage shows the products marked showOnHome (see productsData.js).
const PRODUCTS = ALL_PRODUCTS.filter((product) => product.showOnHome);

const PRODUCT_PHRASES = ["Real-World Problems", "Practical Challenges", "Industry Needs"];

/* Wide screens pin the product stage beside the list. */
const PIN_QUERY = "(min-width: 1024px)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ProductsTypingLine({ active }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const reduceMotion = prefersReducedMotion();
  const phrase = PRODUCT_PHRASES[phraseIndex];

  useEffect(() => {
    if (!active || reduceMotion) return undefined;

    let delay;
    let next;
    if (!isDeleting && length < phrase.length) {
      delay = 90;
      next = () => setLength((value) => value + 1);
    } else if (!isDeleting) {
      delay = 1500;
      next = () => setIsDeleting(true);
    } else if (length > 0) {
      delay = 55;
      next = () => setLength((value) => value - 1);
    } else {
      delay = 350;
      next = () => {
        setIsDeleting(false);
        setPhraseIndex((value) => (value + 1) % PRODUCT_PHRASES.length);
      };
    }

    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [active, reduceMotion, isDeleting, length, phrase]);

  const shown = reduceMotion ? PRODUCT_PHRASES[0] : phrase.slice(0, length);
  return (
    <span className="pjh-products__typed">
      <span className="pjds-sr-only">{PRODUCT_PHRASES.join(", ")}</span>
      <span className="pjh-products__typed-text" aria-hidden="true">
        {shown}
        {!reduceMotion && <span className="pjh-products__cursor">|</span>}
      </span>
    </span>
  );
}

function ProductLink({ link, variant = "primary" }) {
  const className = `pjh-products__link pjh-products__link--${variant}`;
  const content = (
    <>
      {link.label}
      {link.external ? <ArrowUpRight size={17} aria-hidden="true" /> : <ArrowRight size={17} aria-hidden="true" />}
    </>
  );

  if (link.external) {
    return (
      <a className={className} href={link.href} target="_blank" rel="noopener noreferrer">
        {content}
        <span className="pjds-sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return <Link className={className} to={link.href}>{content}</Link>;
}

function WhatsAppLink({ product }) {
  return (
    <a className="pjh-products__link pjh-products__link--whatsapp" href={productWhatsAppHref(product)} target="_blank" rel="noopener noreferrer">
      <MessageCircle size={17} aria-hidden="true" />
      Chat on WhatsApp
      <span className="pjds-sr-only">about {product.title} (opens WhatsApp in a new tab)</span>
    </a>
  );
}

/* The product photo, or an animated "printing" placeholder until a real photo
   exists. The stage copy is decorative; the list copy carries the alt text. */
function ProductVisual({ product, decorative = false }) {
  if (product.image) {
    return <img src={product.image} alt={decorative ? "" : product.alt} loading="lazy" decoding="async" />;
  }

  return (
    <div
      className="pjh-products__placeholder"
      {...(decorative ? { "aria-hidden": "true" } : { role: "img", "aria-label": "Product render not available yet" })}
    >
      <span className="pjh-products__layers" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </span>
      <span className="pjh-products__placeholder-mark" aria-hidden="true"><Boxes size={34} strokeWidth={1.35} /></span>
      <span className="pjh-products__placeholder-caption">Product preview</span>
    </div>
  );
}

/* Keeps the stage in view beside the product list on wide screens.
   position: sticky cannot work on this site (the global html/body overflow
   rule makes <body> the sticky container), so the stage switches between
   absolute (before / after the list) and fixed (while the list scrolls). */
function usePinnedStage(columnRef, stageRef) {
  useEffect(() => {
    const column = columnRef.current;
    const stage = stageRef.current;
    if (!column || !stage || typeof window.matchMedia !== "function") return undefined;

    const media = window.matchMedia(PIN_QUERY);
    let frame = 0;
    let visible = typeof IntersectionObserver === "undefined";

    const setPin = (state, rect, offset) => {
      stage.dataset.pin = state;
      if (state === "pinned") {
        stage.style.setProperty("--pjh-pin-left", `${rect.left}px`);
        stage.style.setProperty("--pjh-pin-width", `${rect.width}px`);
        stage.style.setProperty("--pjh-pin-top", `${offset}px`);
      }
    };

    const measure = () => {
      frame = 0;
      if (!media.matches) {
        stage.dataset.pin = "off";
        return;
      }
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--pjds-nav-offset")) || 112;
      const rect = column.getBoundingClientRect();
      if (rect.top > offset) setPin("before");
      else if (rect.bottom < offset + stage.offsetHeight) setPin("after");
      else setPin("pinned", rect, offset);
    };

    const schedule = () => {
      if (visible && !frame) frame = window.requestAnimationFrame(measure);
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            measure();
          });
    observer?.observe(column);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener?.("change", measure);
    measure();

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener?.("change", measure);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [columnRef, stageRef]);
}

export default function OurProducts() {
  const sectionRef = useRef(null);
  const columnRef = useRef(null);
  const stageRef = useRef(null);
  const itemRefs = useRef([]);
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === "undefined");
  const [active, setActive] = useState(0);

  usePinnedStage(columnRef, stageRef);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // The product crossing the middle of the screen is the one on stage.
  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);
    if (!items.length || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="home-products" className="pjh-products" aria-labelledby="pjh-products-title">
      <div className="pjds-container">
        <header className="pjh-products__header">
          <div>
            <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Products &amp; Innovations</p>
            <h2 id="pjh-products-title" className="pjds-title pjds-title--on-dark pjh-products__title" data-reveal="up" data-reveal-delay="1">
              <span className="pjh-products__title-static">Technology That Solves</span>
              <ProductsTypingLine active={isVisible} />
            </h2>
          </div>
          <p className="pjds-lead pjds-lead--on-dark pjh-products__intro" data-reveal="up" data-reveal-delay="2">
            Discover innovative products and engineering solutions developed by ProJenius to address practical challenges across industries.
          </p>
        </header>

        <div className="pjh-products__showcase">
          {/* Stage: every product sits here; the active one opens in a circle. */}
          <div ref={columnRef} className="pjh-products__stage-column" aria-hidden="true">
            <div ref={stageRef} className="pjh-products__stage" data-pin="off">
              {PRODUCTS.map((product, index) => (
                <figure key={product.id} className={`pjh-products__frame${index === active ? " is-active" : ""}`}>
                  <ProductVisual product={product} decorative />
                </figure>
              ))}
              <div className="pjh-products__hud">
                <span className="pjh-products__count">
                  {String(active + 1).padStart(2, "0")} / {String(PRODUCTS.length).padStart(2, "0")}
                </span>
                <span className="pjh-products__rail">
                  {PRODUCTS.map((product, index) => (
                    <i key={product.id} className={index === active ? "is-active" : undefined} />
                  ))}
                </span>
              </div>
            </div>
          </div>

          <div className="pjh-products__list">
            {PRODUCTS.map((product, index) => (
              <article
                key={product.id}
                ref={(node) => { itemRefs.current[index] = node; }}
                data-index={index}
                className={`pjh-products__item${index === active ? " is-active" : ""}`}
              >
                <div className="pjh-products__item-media">
                  <ProductVisual product={product} />
                </div>
                <span className="pjh-products__category">{product.category}</span>
                <h3 className="pjh-products__name">{product.title}</h3>
                <p className="pjh-products__description">{product.description}</p>
                <div className="pjh-products__actions">
                  <ProductLink link={product.link} variant={index === 0 ? "primary" : "ghost"} />
                  <WhatsAppLink product={product} />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="pjh-products__more" data-reveal="up">
          <Link to="/products" className="pjh-products__more-link">
            View More Products <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
