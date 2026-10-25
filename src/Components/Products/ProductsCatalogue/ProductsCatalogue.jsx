import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Boxes, MessageCircle } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import { PRODUCTS, productWhatsAppHref } from "../productsData.js";
import "./ProductsCatalogue.css";

/* =============================================================================
   PRODUCTS PAGE — CATALOGUE
   A quick index of every product, then one card per product (alternating
   sides on wide screens), each with its own accent colour. Each picture fades and lifts into
   view (data-reveal="circle" → the frame's own transform/opacity reveal,
   driven by the page's useScrollReveal). Every product has its main action plus a
   WhatsApp chat that names the product.
   ============================================================================= */

const pad = (value) => String(value).padStart(2, "0");

function MainAction({ link }) {
  const content = (
    <>
      {link.label}
      {link.external ? <ArrowUpRight size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
    </>
  );

  return link.external ? (
    <a className="pjpr-btn pjpr-btn--primary" href={link.href} target="_blank" rel="noopener noreferrer">
      {content}
      <span className="pjds-sr-only">(opens in a new tab)</span>
    </a>
  ) : (
    <Link className="pjpr-btn pjpr-btn--primary" to={link.href}>{content}</Link>
  );
}

function ProductPicture({ product }) {
  if (product.image) {
    return <img src={product.image} alt={product.alt} loading="lazy" decoding="async" />;
  }

  return (
    <div className="pjpr-placeholder" role="img" aria-label="Product picture coming soon">
      <span className="pjpr-placeholder__layers" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </span>
      <span className="pjpr-placeholder__mark" aria-hidden="true"><Boxes size={34} strokeWidth={1.35} /></span>
      <span className="pjpr-placeholder__caption" aria-hidden="true">Product preview</span>
    </div>
  );
}

export default function ProductsCatalogue() {
  return (
    <section id="product-list" className="pjpr-catalogue" aria-labelledby="pjpr-catalogue-title">
      <div className="pjds-container">
        <div className="pjpr-index">
          <header className="pjpr-index__head">
            <p className="pjds-eyebrow" data-reveal="up">Our Products</p>
            <h2 id="pjpr-catalogue-title" className="pjpr-index__title" data-reveal="up" data-reveal-delay="1">
              <span className="pjpr-index__title-static">Explore Products</span>
              <TypedPhrase phrases={["Built by ProJenius", "Made for Real Use", "Ready to Deliver"]} />
            </h2>
            <p className="pjpr-index__intro" data-reveal="up" data-reveal-delay="2">
              Pick a product to jump to its details, or chat with us on WhatsApp about any of them.
            </p>
          </header>
          <nav aria-label="Jump to a product" data-reveal="up" data-reveal-delay="3">
            <ul className="pjpr-index__list">
              {PRODUCTS.map((product, index) => (
                <li key={product.id}>
                  <a href={`#${product.id}`}>
                    <span aria-hidden="true">{pad(index + 1)}</span> {product.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="pjpr-list">
          {PRODUCTS.map((product, index) => (
            <article
              key={product.id}
              id={product.id}
              className={`pjpr-item pjpr-item--accent-${(index % 5) + 1}${index % 2 ? " pjpr-item--flip" : ""}`}
              aria-labelledby={`${product.id}-title`}
            >
              {/* The circle clips the inner frame, not the observed wrapper:
                  a fully clipped element never reports as on screen. */}
              <div className="pjpr-item__media" data-reveal="circle">
                <div className="pjpr-item__frame">
                  <ProductPicture product={product} />
                  <span className="pjpr-item__number" aria-hidden="true">{pad(index + 1)}</span>
                </div>
              </div>

              <div className="pjpr-item__copy">
                <p className="pjpr-item__count" data-reveal="up">
                  {pad(index + 1)} / {pad(PRODUCTS.length)}
                </p>
                <p className="pjpr-item__category" data-reveal="up">{product.category}</p>
                <h3 id={`${product.id}-title`} className="pjpr-item__title" data-reveal="up" data-reveal-delay="1">
                  {product.title}
                </h3>
                <p className="pjpr-item__text" data-reveal="up" data-reveal-delay="2">{product.description}</p>
                <div className="pjpr-item__actions" data-reveal="up" data-reveal-delay="3">
                  <MainAction link={product.link} />
                  <a className="pjpr-btn pjpr-btn--whatsapp" href={productWhatsAppHref(product)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} aria-hidden="true" />
                    Chat on WhatsApp
                    <span className="pjds-sr-only">about {product.title} (opens WhatsApp in a new tab)</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
