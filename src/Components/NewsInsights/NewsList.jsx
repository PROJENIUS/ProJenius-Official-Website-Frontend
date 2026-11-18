import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Mail, MessageCircle, Newspaper, Search, X } from "lucide-react";

import TypedPhrase from "../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../Common/SectionTitleLine/SectionTitleLine.jsx";
import { whatsappHref } from "../../utils/whatsapp.js";
import { PREVIEW_ARTICLES, TYPE_LABEL, articleHref, formatDate, getJson } from "./newsApi.js";
import { ArticleCard, CardSkeleton, Cover, TypeBadge } from "./NewsParts.jsx";

/* =============================================================================
   NEWS & INSIGHTS — LIST
   hero (navy: heading, search, latest story) → all articles (light: type
   tabs, topic chips, search, card grid, Load more) → enquiry card (white).
   Filters live in the URL (?type=&topic=&q=) so a filtered view can be shared.
   ============================================================================= */

const PAGE_SIZE = 9;
const TABS = [
  { id: "", label: "All", Icon: null },
  { id: "news", label: "News", Icon: Newspaper },
  { id: "blog", label: "Insights", Icon: BookOpen },
];

const scrollToList = () => {
  window.requestAnimationFrame(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("news-list")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });
};

/* Same filters on the preview articles (development only). */
function filterPreview({ type, topic, q }) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  return PREVIEW_ARTICLES.filter((a) =>
    (!type || a.contentType === type) &&
    (!topic || a.category === topic) &&
    words.every((w) => `${a.title} ${a.summary} ${(a.tags || []).join(" ")}`.toLowerCase().includes(w)));
}

export default function NewsList() {
  const [params, setParams] = useSearchParams();
  const type = params.get("type") || "";
  const topic = params.get("topic") || "";
  const q = params.get("q") || "";
  const filterKey = `${type}|${topic}|${q}`;

  const [searchText, setSearchText] = useState(q);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState(undefined);
  const [state, setState] = useState({ key: "", items: [], page: 1, pages: 1, total: 0, status: "loading" });
  const [page, setPage] = useState(1);

  const setFilter = (patch) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
      return next;
    }, { replace: true, preventScrollReset: true });
    setPage(1);
  };

  /* Topics */
  useEffect(() => {
    let active = true;
    getJson("/api/news/categories")
      .then((body) => { if (active) setCategories(body.items || []); })
      .catch(() => { if (active) setCategories([...new Set(PREVIEW_ARTICLES.map((a) => a.category).filter(Boolean))]); });
    return () => { active = false; };
  }, []);

  /* Latest story for the hero */
  useEffect(() => {
    let active = true;
    getJson("/api/news?limit=1")
      .then((body) => { if (active) setFeatured(body.items?.[0] || null); })
      .catch(() => { if (active) setFeatured(PREVIEW_ARTICLES[0] || null); });
    return () => { active = false; };
  }, []);

  /* Article list (page 1 replaces, later pages append) */
  useEffect(() => {
    let active = true;
    const query = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE), ...(topic ? { category: topic } : {}), ...(q ? { search: q } : {}) });
    getJson(`/api/news${type ? `/${type}` : ""}?${query}`)
      .then((body) => {
        if (!active) return;
        setState((prev) => ({
          key: filterKey,
          items: page > 1 && prev.key === filterKey ? [...prev.items, ...(body.items || [])] : body.items || [],
          page,
          pages: body.pagination?.pages || 1,
          total: body.pagination?.total || 0,
          status: "ready",
        }));
      })
      .catch(() => {
        if (!active) return;
        const items = filterPreview({ type, topic, q });
        setState({ key: filterKey, items, page: 1, pages: 1, total: items.length, status: PREVIEW_ARTICLES.length ? "ready" : "error" });
      });
    return () => { active = false; };
  }, [type, topic, q, page, filterKey]);

  const loading = state.key !== filterKey || (state.status === "loading");
  const filtered = Boolean(type || topic || q);
  /* The hero shows the latest story; leave it out of the unfiltered grid. */
  const items = useMemo(
    () => (!filtered && featured ? state.items.filter((a) => a.slug !== featured.slug || a.contentType !== featured.contentType) : state.items),
    [state.items, featured, filtered],
  );

  const submitSearch = (event) => {
    event.preventDefault();
    setFilter({ q: searchText.trim() });
    scrollToList();
  };
  const clearAll = () => { setSearchText(""); setFilter({ type: "", topic: "", q: "" }); };

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="pjni-hero" aria-labelledby="pjni-title">
        <div className="pjds-container pjni-hero__grid">
          <div className="pjni-hero__copy">
            <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">News &amp; Insights</p>
            <h1 id="pjni-title" className="pjni-hero__title" data-reveal="up" data-reveal-delay="1">
              Stories and Ideas{" "}
              <TypedPhrase tone="dark" phrases={["From the ProJenius Lab.", "From Our Team.", "Worth Reading."]} />
            </h1>
            <SectionTitleLine />
            <p className="pjni-hero__lead" data-reveal="up" data-reveal-delay="2">
              Company news, project updates and practical insights on technology, products and building
              ideas into reality.
            </p>
            <form className="pjni-search pjni-search--hero" role="search" onSubmit={submitSearch} data-reveal="up" data-reveal-delay="3">
              <Search size={19} aria-hidden="true" />
              <label htmlFor="pjni-hero-q" className="pjds-sr-only">Search articles</label>
              <input id="pjni-hero-q" type="search" placeholder="Search news and insights" value={searchText} onChange={(e) => setSearchText(e.target.value)} maxLength={100} />
              <button type="submit">Search</button>
            </form>
          </div>

          <div className="pjni-hero__feature" data-reveal="up" data-reveal-delay="2">
            {featured === undefined ? (
              <div className="pjni-feature pjni-feature--skeleton" aria-hidden="true"><div /><i /><i /></div>
            ) : featured ? (
              <Link to={articleHref(featured)} className="pjni-feature">
                <div className="pjni-feature__media">
                  <Cover item={featured} loading="eager" />
                  <span className="pjni-feature__flag">Latest</span>
                </div>
                <div className="pjni-feature__body">
                  <p className="pjni-feature__meta">
                    <TypeBadge type={featured.contentType} />
                    <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
                  </p>
                  <h2 className="pjni-feature__title">{featured.title}</h2>
                  <p className="pjni-feature__summary">{featured.summary}</p>
                  <span className="pjni-feature__more">Read the {featured.contentType === "news" ? "story" : "article"} <ArrowRight size={16} aria-hidden="true" /></span>
                </div>
              </Link>
            ) : (
              <div className="pjni-feature pjni-feature--empty">
                <img src="/ProJenius_Logo.svg" alt="" width="56" height="56" />
                <p>Our first stories are on the way.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= ALL ARTICLES ================= */}
      <section id="news-list" className="pjni-list" aria-labelledby="pjni-list-title">
        <div className="pjds-container">
          <header className="pjni-list__head">
            <div>
              <p className="pjds-eyebrow" data-reveal="up">Latest</p>
              <h2 id="pjni-list-title" className="pjni-list__title" data-reveal="up" data-reveal-delay="1">
                Browse All <TypedPhrase phrases={["Articles.", "Updates.", "Stories."]} />
              </h2>
              <SectionTitleLine />
            </div>
          </header>

          <div className="pjni-toolbar" data-reveal="up" data-reveal-delay="2">
            <div className="pjni-tabs" role="group" aria-label="Article type">
              {TABS.map(({ id, label, Icon }) => (
                <button key={label} type="button" className={type === id ? "is-on" : undefined} aria-pressed={type === id} onClick={() => setFilter({ type: id })}>
                  {Icon && <Icon size={15} aria-hidden="true" />} {label}
                </button>
              ))}
            </div>
            <form className="pjni-search" role="search" onSubmit={submitSearch}>
              <Search size={17} aria-hidden="true" />
              <label htmlFor="pjni-q" className="pjds-sr-only">Search articles</label>
              <input id="pjni-q" type="search" placeholder="Search by title, topic or tag" value={searchText} onChange={(e) => setSearchText(e.target.value)} maxLength={100} />
              {searchText && (
                <button type="button" className="pjni-search__clear" aria-label="Clear search" onClick={() => { setSearchText(""); setFilter({ q: "" }); }}>
                  <X size={15} />
                </button>
              )}
            </form>
          </div>

          {categories.length > 0 && (
            <div className="pjni-topics" role="group" aria-label="Topics">
              <button type="button" className={!topic ? "is-on" : undefined} aria-pressed={!topic} onClick={() => setFilter({ topic: "" })}>All topics</button>
              {categories.map((cat) => (
                <button key={cat} type="button" className={topic === cat ? "is-on" : undefined} aria-pressed={topic === cat} onClick={() => setFilter({ topic: topic === cat ? "" : cat })}>
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="pjni-summary" aria-live="polite">
            {!loading && state.status === "ready" && filtered && (
              <p>
                {state.total} {state.total === 1 ? "article" : "articles"}
                {type && <> in <strong>{TYPE_LABEL[type]}</strong></>}
                {topic && <> on <strong>{topic}</strong></>}
                {q && <> for “<strong>{q}</strong>”</>}
              </p>
            )}
            {filtered && <button type="button" className="pjni-clear" onClick={clearAll}><X size={14} aria-hidden="true" /> Clear filters</button>}
          </div>

          {loading ? (
            <div className="pjni-grid">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div>
          ) : state.status === "error" ? (
            <div className="pjni-empty">
              <Newspaper size={40} strokeWidth={1.5} aria-hidden="true" />
              <h3>Articles are not available right now</h3>
              <p>Please check back shortly.</p>
            </div>
          ) : items.length ? (
            <div className="pjni-grid">{items.map((item, i) => <ArticleCard key={item._id || item.slug} item={item} index={i} />)}</div>
          ) : (
            <div className="pjni-empty">
              <Search size={40} strokeWidth={1.5} aria-hidden="true" />
              <h3>{filtered ? "No articles match this filter" : "More stories are coming soon"}</h3>
              <p>{filtered ? "Try another topic or clear the filters." : "Follow us to hear when we publish next."}</p>
              {filtered && <button type="button" className="pjni-btn pjni-btn--primary" onClick={clearAll}>Clear filters</button>}
            </div>
          )}

          {!loading && state.page < state.pages && (
            <div className="pjni-more">
              <button type="button" className="pjni-btn pjni-btn--ghost" onClick={() => setPage((p) => p + 1)}>
                Load more articles
              </button>
            </div>
          )}
        </div>
      </section>

      <NewsEnquiry />
    </>
  );
}

/* ================= ENQUIRY CARD (also used on article pages) ================= */
export function NewsEnquiry() {
  return (
    <section className="pjni-enquiry" aria-labelledby="pjni-enquiry-title">
      <div className="pjds-container">
        <div className="pjni-enquiry__card" data-reveal="up">
          <div>
            <p className="pjni-enquiry__eyebrow">Media &amp; partnerships</p>
            <h2 id="pjni-enquiry-title" className="pjni-enquiry__title">Have a story, event or partnership idea?</h2>
            <p className="pjni-enquiry__meta">Talk to the ProJenius team about media, collaborations or featuring your work.</p>
          </div>
          <div className="pjni-enquiry__actions">
            <Link className="pjni-btn pjni-btn--primary" to="/contact?type=general&from=news-insights">
              <Mail size={17} aria-hidden="true" /> Contact Us
            </Link>
            <a className="pjni-btn pjni-btn--ghost-dark" href={whatsappHref("Hi ProJenius, I'd like to talk about a story or partnership.")} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={17} aria-hidden="true" /> WhatsApp
              <span className="pjds-sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
