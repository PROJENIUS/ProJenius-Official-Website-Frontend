import { Link } from "react-router-dom";
import {
  ArrowRight, BarChart3, BookOpen, ChevronLeft, ChevronRight, Clock, Code2, Cpu, Layers, Monitor, Palette, Search, Star, X, CircuitBoard, Bot,
} from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";
import { inr, mediaUrl } from "../courseApi.js";
import { DELIVERY_HINT, DELIVERY_SHORT, LEVEL_LABEL, PAGE_SIZE, PRICE_RANGES, SORTS, contentItemCount } from "./catalogData.js";
import "./ProjeniusCourses.css";
import { suggestSearch } from "./searchSuggest.js";

/* =============================================================================
   COURSE CATALOGUE
   Search, track, level and price filters with sorting, then a 4 × 2 grid
   (8 courses per page) with numbered pages. Filters live in the URL
   (?q=&track=&level=&price=&sort=&page=) so a filtered view can be shared
   and the hero search can drive it.

   Every card shows only saved course data. The star rating appears only
   when the course has published reviews.
   ============================================================================= */

function trackIcon(category = "", props = {}) {
  const c = category.toLowerCase();
  if (c.includes("pcb") || c.includes("electronic")) return <CircuitBoard {...props} />;
  if (c.includes("robot")) return <Bot {...props} />;
  if (c.includes("hard") || c.includes("iot") || c.includes("embed")) return <Cpu {...props} />;
  if (c.includes("design") || c.includes("ux")) return <Palette {...props} />;
  if (c.includes("data") || c.includes("intelligence") || c.includes("ai") || c.includes("machine")) return <BarChart3 {...props} />;
  return <Code2 {...props} />;
}

export function CourseCard({ item }) {
  const cover = item.coverImage?.url ? mediaUrl(item.coverImage.url) : "";
  const badge = item.badgeLabel || item.badges?.[0];
  const activities = contentItemCount(item.curriculum);
  const discount = item.listPriceMinor > item.priceMinor ? Math.round((1 - item.priceMinor / item.listPriceMinor) * 100) : 0;
  const href = `/services/courses/${encodeURIComponent(item.slug)}`;
  const facts = [
    { Icon: Clock, label: "Duration", value: item.duration || "—" },
    { Icon: Layers, label: "Modules", value: item.curriculum?.length ? String(item.curriculum.length) : "—" },
    { Icon: BookOpen, label: "Activities", value: activities ? String(activities) : "—" },
    { Icon: Monitor, label: "Format", value: DELIVERY_SHORT[item.deliveryMode || "hybrid"], hint: DELIVERY_HINT[item.deliveryMode || "hybrid"] },
  ];

  return (
    <article className="pjcc-card">
      <Link to={href} className="pjcc-card__media" tabIndex={-1} aria-hidden="true">
        {cover ? (
          <img src={cover} alt="" loading="lazy" onError={(e) => { e.currentTarget.hidden = true; }} />
        ) : (
          <span className="pjcc-card__art">{trackIcon(item.category, { size: 40, strokeWidth: 1.6 })}</span>
        )}
        {badge && <span className="pjcc-card__badge">{badge}</span>}
        {item.rating != null && item.reviewCount > 0 && (
          <span className="pjcc-card__rating"><Star size={13} aria-hidden="true" /> {item.rating}</span>
        )}
      </Link>

      <div className="pjcc-card__body">
        <p className="pjcc-card__cat">{item.category}</p>
        <h3 className="pjcc-card__title"><Link to={href}>{item.title}</Link></h3>
        <p className="pjcc-card__desc">{item.shortDescription}</p>

        <dl className="pjcc-card__facts">
          {facts.map(({ Icon: FactIcon, label, value, hint }) => (
            <div key={label} title={hint}>
              <dt><FactIcon size={14} aria-hidden="true" /> {label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="pjcc-card__foot">
          <div className="pjcc-card__price">
            <strong>{inr(item.priceMinor)}</strong>
            {discount > 0 && (
              <span>
                <del>{inr(item.listPriceMinor)}</del>
                <em>{discount}% off</em>
              </span>
            )}
          </div>
          <Link className="pjcc-card__go" to={href} aria-label={`View course: ${item.title}`}>
            View course <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ProjeniusCourses({ loading, courses, results, filters, categories, levels, onChange, onClear }) {
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const suggestion = !loading && results.length === 0 ? suggestSearch(filters.q, courses) : "";
  const page = Math.min(Math.max(1, Number(filters.page) || 1), pages);
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const active = Boolean(filters.q || filters.track || filters.level || filters.price);

  const goTo = (next) => {
    onChange({ page: next > 1 ? String(next) : "" });
    document.getElementById("course-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="course-catalog" className="pjcc" aria-labelledby="pjcc-title">
      <div className="pjds-container">
        <header className="pjcc__head">
          <p className="pjds-eyebrow" data-reveal="up">ProJenius Courses</p>
          <h2 id="pjcc-title" className="pjcc__title" data-reveal="up" data-reveal-delay="1">
            Explore Our <TypedPhrase phrases={["Courses.", "Learning Tracks.", "Live Programmes."]} />
          </h2>
          <SectionTitleLine />
          <p className="pjcc__lead" data-reveal="up" data-reveal-delay="2">Learn, build and create with practical technology.</p>
        </header>

        <div className="pjcc__toolbar" role="search" aria-label="Find a course">
          <div className="pjcc__search">
            <Search size={18} aria-hidden="true" />
            <label htmlFor="pjcc-q" className="pjcc__sr">Search courses</label>
            <input
              id="pjcc-q"
              type="search"
              placeholder="Search by course, skill or tool"
              value={filters.q}
              maxLength={80}
              onChange={(e) => onChange({ q: e.target.value, page: "" })}
            />
          </div>
          <label className="pjcc__select">
            <span className="pjcc__sr">Track</span>
            <select value={filters.track} onChange={(e) => onChange({ track: e.target.value, page: "" })}>
              <option value="">All tracks</option>
              {categories.map(({ name }) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          {levels.length > 0 && (
            <label className="pjcc__select">
              <span className="pjcc__sr">Level</span>
              <select value={filters.level} onChange={(e) => onChange({ level: e.target.value, page: "" })}>
                <option value="">All levels</option>
                {levels.map((level) => <option key={level} value={level}>{LEVEL_LABEL[level] || level}</option>)}
              </select>
            </label>
          )}
          <label className="pjcc__select">
            <span className="pjcc__sr">Price</span>
            <select value={filters.price} onChange={(e) => onChange({ price: e.target.value, page: "" })}>
              {PRICE_RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </label>
          <label className="pjcc__select">
            <span className="pjcc__sr">Sort by</span>
            <select value={filters.sort} onChange={(e) => onChange({ sort: e.target.value, page: "" })}>
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.id ? s.label : "Sort: Recommended"}</option>)}
            </select>
          </label>
        </div>

        <div className="pjcc__tracks" role="group" aria-label="Filter by track">
          <button type="button" className={!filters.track ? "is-on" : undefined} aria-pressed={!filters.track} onClick={() => onChange({ track: "", page: "" })}>
            All <span>{courses.length}</span>
          </button>
          {categories.map(({ name, count }) => (
            <button key={name} type="button" className={filters.track === name ? "is-on" : undefined} aria-pressed={filters.track === name} onClick={() => onChange({ track: name, page: "" })}>
              {name} <span>{count}</span>
            </button>
          ))}
        </div>

        <div className="pjcc__summary" aria-live="polite">
          <p>
            {loading
              ? "Loading courses…"
              : <>Showing <strong>{results.length}</strong> {results.length === 1 ? "course" : "courses"}{filters.q && <> for “{filters.q}”</>}</>}
          </p>
          {active && (
            <button type="button" className="pjcc__clear" onClick={onClear}>
              <X size={15} aria-hidden="true" /> Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="pjcc__grid" aria-hidden="true">
            {Array.from({ length: 4 }, (_, i) => <div key={i} className="pjcc-skeleton" />)}
          </div>
        ) : visible.length ? (
          <div className="pjcc__grid">
            {visible.map((item) => <CourseCard key={item._id} item={item} />)}
          </div>
        ) : (
          <div className="pjcc__empty">
            <p className="pjcc__empty-title">No courses match {filters.q ? <>&ldquo;{filters.q}&rdquo;</> : "these filters"}.</p>
            {suggestion ? (
              <p>Did you mean <button type="button" className="pjcc__suggest" onClick={() => onChange({ q: suggestion, page: "" })}>{suggestion}</button>?</p>
            ) : (
              <p>Try a shorter word, a different level or price, or browse a track below.</p>
            )}
            {categories.length > 0 && (
              <div className="pjcc__empty-tracks" aria-label="Popular tracks">
                {categories.slice(0, 4).map(({ name }) => (
                  <button key={name} type="button" onClick={() => onChange({ q: "", level: "", price: "", track: name, page: "" })}>{name}</button>
                ))}
              </div>
            )}
            <div className="pjcc__empty-actions">
              <button type="button" className="pjcc__clear pjcc__clear--solid" onClick={onClear}>Clear all filters</button>
              <Link className="pjcc__request" to={`/contact?type=course${filters.q ? `&topic=${encodeURIComponent(filters.q)}` : ""}#pj-contact-help`}>Can&rsquo;t find it? Request this course</Link>
            </div>
          </div>
        )}

        {pages > 1 && (
          <nav className="pjcc__pages" aria-label="Course pages">
            <button type="button" onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Previous page"><ChevronLeft size={18} /></button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" className={n === page ? "is-on" : undefined} aria-current={n === page ? "page" : undefined} onClick={() => goTo(n)}>{n}</button>
            ))}
            <button type="button" onClick={() => goTo(page + 1)} disabled={page === pages} aria-label="Next page"><ChevronRight size={18} /></button>
          </nav>
        )}
      </div>
    </section>
  );
}
