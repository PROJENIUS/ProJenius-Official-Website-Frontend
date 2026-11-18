import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Boxes, Check, MessageCircle } from "lucide-react";

import TypedPhrase from "../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { PRODUCTS, productWhatsAppHref } from "../productsData.js";
import "./ProductsCatalogue.css";

/* =============================================================================
   PRODUCTS PAGE — OUR PRODUCTS
   A quick-jump index of every product, then one feature row per product
   (photo and text swap sides on wide screens): category, the problem it
   solves, what it does, feature ticks, tags, the main action and a
   WhatsApp chat that names the product. Slots not filled yet show an
   animated "product preview" and a "Coming soon" badge.
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
      <span className="pjds-sr-only"> (opens in a new tab)</span>
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
      <span className="pjpr-placeholder__layers" aria-hidden="true"><i /><i /><i /><i /><i /></span>
      <span className="pjpr-placeholder__mark" aria-hidden="true"><Boxes size={34} strokeWidth={1.35} /></span>
      <span className="pjpr-placeholder__caption" aria-hidden="true">Product preview</span>
    </div>
  );
}

const jump = (id) => (event) => {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};

export default function ProductsCatalogue() {
  return (
    <section id="product-list" className="pjpr-catalogue" aria-labelledby="pjpr-catalogue-title">
      <div className="pjds-container">
        <header className="pjpr-head">
          <p className="pjds-eyebrow" data-reveal="up">Our Products</p>
          <h2 id="pjpr-catalogue-title" className="pjpr-head__title" data-reveal="up" data-reveal-delay="1">
            Built by ProJenius, <TypedPhrase phrases={["Used in the Real World.", "Made to Solve Problems."]} />
          </h2>
          <SectionTitleLine />
          <p className="pjpr-head__lead" data-reveal="up" data-reveal-delay="2">
            Each product started as a real problem. Here is what we built, what it does and how to get it.
          </p>
        </header>

        <nav className="pjpr-index" aria-label="Products on this page" data-reveal="up" data-reveal-delay="2">
          {PRODUCTS.map((product, index) => (
            <a key={product.id} href={`#${product.id}`} onClick={jump(product.id)} className={product.placeholder ? "is-soon" : undefined}>
              <span className="pjpr-index__num">{pad(index + 1)}</span>
              <span className="pjpr-index__name">{product.placeholder ? "Coming soon" : product.category}</span>
            </a>
          ))}
        </nav>

        <ol className="pjpr-list">
          {PRODUCTS.map((product, index) => (
            <li
              key={product.id}
              id={product.id}
              className={`pjpr-item${index % 2 ? " pjpr-item--flip" : ""}${product.placeholder ? " pjpr-item--soon" : ""}`}
            >
              <div className="pjpr-item__media" data-reveal={index % 2 ? "right" : "left"}>
                <ProductPicture product={product} />
                <span className="pjpr-item__num" aria-hidden="true">{pad(index + 1)}</span>
                {product.placeholder && <span className="pjpr-item__soon">Coming soon</span>}
              </div>

              <div className="pjpr-item__body" data-reveal="up" data-reveal-delay="1">
                <p className="pjpr-item__cat">{product.category}</p>
                <h3 className="pjpr-item__title">{product.title}</h3>
                {product.problem && (
                  <p className="pjpr-item__problem"><b>The problem</b>{product.problem}</p>
                )}
                <p className="pjpr-item__desc">{product.description}</p>

                {product.features?.length > 0 && (
                  <ul className="pjpr-item__features">
                    {product.features.map((feature) => (
                      <li key={feature}>
                        <span className="pjpr-item__tick" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {product.tags?.length > 0 && (
                  <ul className="pjpr-item__tags" aria-label="Tags">
                    {product.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                )}

                <div className="pjpr-item__actions">
                  <MainAction link={product.link} />
                  <a className="pjpr-btn pjpr-btn--ghost" href={productWhatsAppHref(product)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} aria-hidden="true" /> Chat on WhatsApp
                    <span className="pjds-sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
