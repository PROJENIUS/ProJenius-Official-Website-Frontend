import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { TYPE_LABEL, articleHref, assetUrl, coverAlt, coverOf, formatDate } from "./newsApi.js";

/* =============================================================================
   NEWS & INSIGHTS — shared parts: cover image, article card, body renderer.
   ============================================================================= */

/* Cover image; without one (or if it fails) a branded navy panel. */
export function Cover({ item, className = "", loading = "lazy" }) {
  const [failed, setFailed] = useState(false);
  const reference = coverOf(item);
  if (!reference || failed) {
    return (
      <div className={`pjni-cover pjni-cover--empty ${className}`} aria-hidden="true">
        <img src="/ProJenius_Logo.svg" alt="" width="44" height="44" />
        <span>{item?.category || TYPE_LABEL[item?.contentType] || "ProJenius"}</span>
      </div>
    );
  }
  return (
    <img
      className={`pjni-cover ${className}`}
      src={assetUrl(reference)}
      alt={coverAlt(item)}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export function TypeBadge({ type }) {
  return <span className={`pjni-type pjni-type--${type}`}>{TYPE_LABEL[type] || "Article"}</span>;
}

/* Grid card */
export function ArticleCard({ item, index = 0 }) {
  const href = articleHref(item);
  return (
    <article className="pjni-card" data-reveal="up" data-reveal-delay={String((index % 3) + 1)}>
      <Link to={href} className="pjni-card__media" tabIndex={-1} aria-hidden="true">
        <Cover item={item} />
        <TypeBadge type={item.contentType} />
      </Link>
      <div className="pjni-card__body">
        <p className="pjni-card__meta">
          {item.category && <span className="pjni-card__cat">{item.category}</span>}
          <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
        </p>
        <h3 className="pjni-card__title"><Link to={href}>{item.title}</Link></h3>
        <p className="pjni-card__summary">{item.summary}</p>
        <span className="pjni-card__more" aria-hidden="true">
          Read {TYPE_LABEL[item.contentType] === "News" ? "story" : "article"} <ArrowUpRight size={15} />
        </span>
      </div>
    </article>
  );
}

export function CardSkeleton() {
  return (
    <div className="pjni-card pjni-card--skeleton" aria-hidden="true">
      <div className="pjni-card__media" />
      <div className="pjni-card__body"><i /><i /><i /></div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
   Body: plain text from the admin, shown as simple blocks (no HTML):
     blank line   new paragraph        ## text   section heading
     ### text     sub-heading          - / *     bullet list
     1. text      numbered list        > text    quote
   ----------------------------------------------------------------------------- */
export function ArticleBody({ blocks }) {
  return (
    <div className="pjni-prose">
      {blocks.map((block, i) => {
        if (block.kind === "h2") return <h2 key={i} id={block.id}>{block.text}</h2>;
        if (block.kind === "h3") return <h3 key={i}>{block.text}</h3>;
        if (block.kind === "ul") return <ul key={i}>{block.items.map((t) => <li key={t}>{t}</li>)}</ul>;
        if (block.kind === "ol") return <ol key={i}>{block.items.map((t) => <li key={t}>{t}</li>)}</ol>;
        if (block.kind === "quote") return <blockquote key={i}>{block.text}</blockquote>;
        return (
          <p key={i}>
            {block.text.split("\n").map((line, j, all) => (
              <span key={j}>{line}{j < all.length - 1 && <br />}</span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
