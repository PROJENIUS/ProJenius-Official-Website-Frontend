import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Check, Clock, Link2, MessageCircle, Tag, UserRound } from "lucide-react";

import { PREVIEW_ARTICLES, TYPE_LABEL, articleHref, assetUrl, coverOf, formatDate, getJson, readMinutes } from "./newsApi.js";
import { ArticleBody, ArticleCard, Cover, TypeBadge } from "./NewsParts.jsx";
import { parseBody } from "./newsBody.js";
import { NewsEnquiry } from "./NewsList.jsx";
import ArticleMetadata from "./ArticleMetadata.jsx";

/* =============================================================================
   NEWS & INSIGHTS — ARTICLE
   header (navy: breadcrumb, type, title, summary, author, date, read time)
   → article (light: cover, body, gallery, videos, tags; side column with
   share buttons and contents) → related articles (navy) → enquiry (white).
   A thin cyan bar at the top shows reading progress.
   ============================================================================= */

function videoEmbed(video) {
  if (video.provider === "youtube") return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.videoId)}`;
  if (video.provider === "vimeo") return `https://player.vimeo.com/video/${encodeURIComponent(video.videoId)}`;
  return null;
}

function ReadingProgress({ targetRef }) {
  const barRef = useRef(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = targetRef.current;
      const bar = barRef.current;
      if (!el || !bar) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [targetRef]);
  return <div className="pjni-progress" aria-hidden="true"><span ref={barRef} /></div>;
}

function ShareButtons({ item }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}${articleHref(item)}` : "";
  const text = encodeURIComponent(item.title);
  const link = encodeURIComponent(url);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked: nothing to do */ }
  };
  return (
    <div className="pjni-share">
      <p className="pjni-share__label">Share</p>
      <div className="pjni-share__row">
        <button type="button" onClick={copy} aria-label={copied ? "Link copied" : "Copy link"}>
          {copied ? <Check size={17} /> : <Link2 size={17} />}
        </button>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${link}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn (opens in a new tab)">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.6 8.65 22 11.3 22 14.5V21h-4v-5.8c0-1.38-.03-3.16-1.93-3.16-1.93 0-2.22 1.5-2.22 3.06V21H10V9Z" /></svg>
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${link}&text=${text}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X (opens in a new tab)">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M17.75 3h3.07l-6.71 7.67L22 21h-6.18l-4.84-6.33L5.44 21H2.37l7.18-8.2L2 3h6.34l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" /></svg>
        </a>
        <a href={`https://wa.me/?text=${text}%20${link}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp (opens in a new tab)">
          <MessageCircle size={17} />
        </a>
      </div>
      {copied && <p className="pjni-share__done" role="status">Link copied</p>}
    </div>
  );
}

export default function NewsArticle({ contentType, slug }) {
  const [state, setState] = useState({ key: "", item: null, status: "loading" });
  const [related, setRelated] = useState([]);
  const articleRef = useRef(null);
  const key = `${contentType}/${slug}`;

  useEffect(() => {
    let active = true;
    getJson(`/api/news/${contentType}/${encodeURIComponent(slug)}`)
      .then((body) => { if (active) setState({ key, item: body.item || null, status: body.item ? "ready" : "missing" }); })
      .catch((error) => {
        if (!active) return;
        const preview = PREVIEW_ARTICLES.find((a) => a.slug === slug);
        setState({ key, item: preview || null, status: preview ? "ready" : /not found/i.test(error.message) ? "missing" : "error" });
      });
    return () => { active = false; };
  }, [contentType, slug, key]);

  const item = state.key === key ? state.item : null;

  /* Related: same topic first, then the latest */
  useEffect(() => {
    if (!item) return undefined;
    let active = true;
    const notThis = (a) => !(a.slug === item.slug && a.contentType === item.contentType);
    const sameTopic = item.category ? getJson(`/api/news?limit=4&category=${encodeURIComponent(item.category)}`) : Promise.resolve({ items: [] });
    Promise.all([sameTopic.catch(() => ({ items: [] })), getJson("/api/news?limit=4").catch(() => ({ items: PREVIEW_ARTICLES }))])
      .then(([a, b]) => {
        if (!active) return;
        const seen = new Set();
        const list = [...(a.items || []), ...(b.items || [])].filter(notThis).filter((x) => {
          const k = `${x.contentType}/${x.slug}`;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        setRelated(list.slice(0, 3));
      });
    return () => { active = false; };
  }, [item]);

  const blocks = useMemo(() => parseBody(item?.body || item?.summary || ""), [item]);
  const headings = blocks.filter((b) => b.kind === "h2");
  const gallery = (item?.images || []).filter((img) => img.filename !== item?.thumbnailFilename);

  if (state.key !== key || state.status === "loading") {
    return (
      <section className="pjni-ahead" aria-busy="true">
        <div className="pjds-container pjni-ahead__inner"><div className="pjni-ahead__skeleton"><i /><i /><i /></div></div>
      </section>
    );
  }

  if (!item) {
    return (
      <>
        <section className="pjni-ahead" aria-labelledby="pjni-missing">
          <div className="pjds-container pjni-ahead__inner">
            <Link to="/news-insights" className="pjni-crumb-back"><ArrowLeft size={16} aria-hidden="true" /> All News &amp; Insights</Link>
            <h1 id="pjni-missing" className="pjni-ahead__title">
              {state.status === "missing" ? "This article could not be found" : "This article is not available right now"}
            </h1>
            <p className="pjni-ahead__summary">It may have been moved or unpublished. Browse our latest stories instead.</p>
            <Link to="/news-insights" className="pjni-btn pjni-btn--primary">Browse News &amp; Insights</Link>
          </div>
        </section>
        <NewsEnquiry />
      </>
    );
  }

  return (
    <>
      <ArticleMetadata item={item} />
      <ReadingProgress targetRef={articleRef} />

      {/* ================= HEADER ================= */}
      <section className="pjni-ahead" aria-labelledby="pjni-article-title">
        <div className="pjds-container pjni-ahead__inner">
          <nav className="pjni-crumbs" aria-label="Breadcrumb">
            <Link to="/news-insights" className="pjni-crumb-back"><ArrowLeft size={16} aria-hidden="true" /> News &amp; Insights</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/news-insights?type=${item.contentType}`}>{TYPE_LABEL[item.contentType]}</Link>
            {item.category && (
              <>
                <span aria-hidden="true">/</span>
                <Link to={`/news-insights?topic=${encodeURIComponent(item.category)}`}>{item.category}</Link>
              </>
            )}
          </nav>
          <p className="pjni-ahead__type" data-reveal="up"><TypeBadge type={item.contentType} />{item.category && <span>{item.category}</span>}</p>
          <h1 id="pjni-article-title" className="pjni-ahead__title" data-reveal="up" data-reveal-delay="1">{item.title}</h1>
          <p className="pjni-ahead__summary" data-reveal="up" data-reveal-delay="2">{item.summary}</p>
          <div className="pjni-byline" data-reveal="up" data-reveal-delay="3">
            <span className="pjni-byline__avatar" aria-hidden="true"><UserRound size={20} /></span>
            <span className="pjni-byline__who">
              <strong>{item.author?.name || "ProJenius Team"}</strong>
              {item.author?.role && <small>{item.author.role}</small>}
            </span>
            <span className="pjni-byline__facts">
              <span><Calendar size={15} aria-hidden="true" /> <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time></span>
              <span><Clock size={15} aria-hidden="true" /> {readMinutes(item)} min read</span>
            </span>
          </div>
        </div>
      </section>

      {/* ================= ARTICLE ================= */}
      <section className="pjni-article" aria-label="Article">
        <div className="pjds-container pjni-article__grid" ref={articleRef}>
          <div className="pjni-article__main">
            {coverOf(item) && (
              <figure className="pjni-article__cover" data-reveal="up"><Cover item={item} loading="eager" /></figure>
            )}

            <ArticleBody blocks={blocks} />

            {gallery.length > 0 && (
              <section className="pjni-gallery" aria-label="Gallery">
                <h2>Gallery</h2>
                <div className="pjni-gallery__grid">
                  {gallery.map((img) => (
                    <a key={img.filename} href={assetUrl(img.url || img.filename)} target="_blank" rel="noopener noreferrer">
                      <img src={assetUrl(img.url || img.filename)} alt={img.alt || ""} loading="lazy" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {item.videos?.length > 0 && (
              <section className="pjni-videos" aria-label="Videos">
                <h2>Watch</h2>
                {item.videos.map((video) => (
                  <figure key={`${video.provider}-${video.videoId}`} className="pjni-video">
                    <iframe src={videoEmbed(video)} title={video.title || item.title} loading="lazy" allowFullScreen />
                    {video.title && <figcaption>{video.title}</figcaption>}
                  </figure>
                ))}
              </section>
            )}

            {item.tags?.length > 0 && (
              <div className="pjni-tags">
                <Tag size={16} aria-hidden="true" />
                {item.tags.map((tag) => (
                  <Link key={tag} to={`/news-insights?q=${encodeURIComponent(tag)}`}>{tag}</Link>
                ))}
              </div>
            )}

            <div className="pjni-article__end">
              <ShareButtons item={item} />
              <Link to="/news-insights" className="pjni-btn pjni-btn--ghost"><ArrowLeft size={17} aria-hidden="true" /> All articles</Link>
            </div>
          </div>

          <aside className="pjni-article__side">
            <div className="pjni-side">
              <ShareButtons item={item} />
              {headings.length > 1 && (
                <nav className="pjni-toc" aria-label="On this page">
                  <p className="pjni-share__label">On this page</p>
                  <ol>
                    {headings.map((h) => <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>)}
                  </ol>
                </nav>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* ================= RELATED ================= */}
      {related.length > 0 && (
        <section className="pjni-related" aria-labelledby="pjni-related-title">
          <div className="pjds-container">
            <header className="pjni-related__head">
              <div>
                <p className="pjds-eyebrow pjds-eyebrow--on-dark">More to Read</p>
                <h2 id="pjni-related-title" className="pjni-related__title">Keep Reading</h2>
              </div>
              <Link to="/news-insights" className="pjni-related__all">View all</Link>
            </header>
            <div className="pjni-grid">{related.map((a, i) => <ArticleCard key={a._id || a.slug} item={a} index={i} />)}</div>
          </div>
        </section>
      )}

      <NewsEnquiry />
    </>
  );
}
