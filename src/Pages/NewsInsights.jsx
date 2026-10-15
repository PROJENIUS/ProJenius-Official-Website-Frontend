import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./NewsInsights.css";
import { normalizeApiBase, resolveApiUrl } from "../utils/apiUrl.js";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API = normalizeApiBase(configuredApiBaseUrl, import.meta.env.DEV);
const apiUrl = (path) => resolveApiUrl(path, API, window.location.origin);
const assetUrl = (reference) => apiUrl(/^https?:\/\//i.test(reference || "") || String(reference || "").startsWith("/")
  ? reference
  : `/api/news/assets/${encodeURIComponent(reference)}`);
function PublicArticleImage({ filename, alt = "", className = "", loading }) {
  const [failed, setFailed] = useState(false);
  const url = assetUrl(filename);
  if (failed) return <div className={`pj-publishing__image-error ${className}`} role="img" aria-label={alt || "Article image unavailable"}>{import.meta.env.DEV ? `Unable to load article image: ${url}` : "This article image is currently unavailable."}</div>;
  return <img className={className} src={url} alt={alt} loading={loading} onError={() => { if (import.meta.env.DEV) console.error("News & Insights image failed to load", { url }); setFailed(true); }} />;
}
const videoEmbed = (video) => video.provider === "youtube"
  ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.videoId)}`
  : video.provider === "vimeo" ? `https://player.vimeo.com/video/${encodeURIComponent(video.videoId)}` : null;

export default function NewsInsights() {
  const { slug, contentType: routeType } = useParams();
  const contentType = routeType || "news";
  const [data, setData] = useState({ loading: true, items: [], item: null, pagination: null, error: "" });
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    let active = true;
    fetch(apiUrl("/api/news/categories")).then((response) => response.ok ? response.json() : { items: [] }).then((body) => { if (active) setCategories(body.items || []); }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const query = new URLSearchParams({ page: String(page), limit: "9", ...(search ? { search } : {}), ...(category ? { category } : {}) });
    const url = slug ? apiUrl(`/api/news/${contentType}/${encodeURIComponent(slug)}`) : `${apiUrl("/api/news")}?${query}`;
    fetch(url).then(async (response) => { const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.error || "Articles are unavailable."); return body; })
      .then((body) => { if (active) setData({ loading: false, items: body.items || [], item: body.item || null, pagination: body.pagination || null, error: "" }); })
      .catch((error) => { if (active) setData({ loading: false, items: [], item: null, pagination: null, error: error.message }); });
    return () => { active = false; };
  }, [slug, contentType, page, search, category]);

  useEffect(() => {
    const item = data.item;
    const previousTitle = document.title;
    const description = item?.seo?.description || item?.summary || "Company news, technology insights and innovation updates from ProJenius.";
    document.title = item ? `${item.seo?.title || item.title} | ProJenius` : "News & Insights | ProJenius";
    let meta = document.querySelector('meta[name="description"]');
    const createdMeta = !meta;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.append(meta); }
    const priorMeta = meta.content; meta.content = description;
    let canonical = document.querySelector('link[rel="canonical"]');
    const createdCanonical = !canonical;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    const priorCanonical = canonical.href;
    canonical.href = `${window.location.origin}${item ? `/news-insights/${item.contentType}/${encodeURIComponent(item.slug)}` : "/news-insights"}`;
    let imageMeta = document.querySelector('meta[property="og:image"]');
    const createdImage = !imageMeta;
    if (!imageMeta) { imageMeta = document.createElement("meta"); imageMeta.setAttribute("property", "og:image"); document.head.append(imageMeta); }
    const priorImage = imageMeta.content;
    imageMeta.content = item?.thumbnailUrl ? assetUrl(item.thumbnailUrl) : item?.thumbnailFilename ? assetUrl(item.thumbnailFilename) : "";
    const setPropertyMeta = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      const created = !element;
      if (!element) { element = document.createElement("meta"); element.setAttribute("property", property); document.head.append(element); }
      const previous = element.content;
      element.content = content;
      return () => { if (created) element.remove(); else element.content = previous; };
    };
    const restoreOgTitle = setPropertyMeta("og:title", item?.seo?.title || item?.title || "News & Insights | ProJenius");
    const restoreOgDescription = setPropertyMeta("og:description", description);
    return () => { document.title = previousTitle; if (createdMeta) meta.remove(); else meta.content = priorMeta; if (createdCanonical) canonical.remove(); else canonical.href = priorCanonical; if (createdImage) imageMeta.remove(); else imageMeta.content = priorImage; restoreOgTitle(); restoreOgDescription(); };
  }, [data.item]);

  return <main className="pj-publishing"><div className="pj-publishing__wrap">
    <header><p className="pj-publishing__eyebrow">ProJenius updates</p><h1>{slug ? data.item?.title || "News & Insights" : "News & Insights"}</h1><p>Company milestones, technology perspectives, project stories and innovation updates.</p>
      {!slug && <form className="pj-publishing__search" onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); }}><label htmlFor="pj-publishing-search">Search articles</label><div><input id="pj-publishing-search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} maxLength={100} /><button type="submit">Search</button></div><label htmlFor="pj-publishing-category">Category</label><select id="pj-publishing-category" value={category} onChange={(event) => { setPage(1); setCategory(event.target.value); }}><option value="">All categories</option>{categories.map((value) => <option key={value} value={value}>{value}</option>)}</select></form>}
    </header>
    {data.loading ? <p role="status">Loading articles…</p> : data.error ? <p role="alert">{data.error}</p> : slug ? data.item && <article className="pj-publishing__article">
      {(data.item.thumbnailUrl || data.item.thumbnailFilename) && <div className="pj-publishing__hero-box"><PublicArticleImage className="pj-publishing__hero" filename={data.item.thumbnailUrl || data.item.thumbnailFilename} alt={data.item.images?.find((image) => image.filename === data.item.thumbnailFilename)?.alt || ""} /></div>}
      <p className="pj-publishing__eyebrow">{data.item.category || "News & Insights"}</p><h2>{data.item.title}</h2><p className="pj-publishing__summary">{data.item.summary}</p><p className="pj-publishing__byline">{data.item.author?.name}{data.item.publishedAt ? ` · ${new Date(data.item.publishedAt).toLocaleDateString()}` : ""}</p>
      <div className="pj-publishing__body">{data.item.body}</div>
      {(data.item.images || []).filter((image) => image.filename !== data.item.thumbnailFilename).length > 0 && <section className="pj-publishing__gallery" aria-label="Article image gallery">{data.item.images.filter((image) => image.filename !== data.item.thumbnailFilename).map((image) => <div className="pj-publishing__gallery-box" key={image.filename}><PublicArticleImage className="pj-publishing__gallery-image" filename={image.url || image.filename} alt={image.alt || ""} loading="lazy" /></div>)}</section>}
      {(data.item.videos || []).length > 0 && <section className="pj-publishing__videos" aria-label="Article videos"><h3>Videos</h3>{data.item.videos.map((video) => <figure key={`${video.provider}-${video.videoId}`}><iframe src={videoEmbed(video)} title={video.title || "ProJenius article video"} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /><figcaption>{video.title}</figcaption></figure>)}</section>}
      <Link to="/news-insights">← All News &amp; Insights</Link>
    </article> : <>
      {data.items.length ? <section className="pj-publishing__grid">{data.items.map((item) => <article className="pj-publishing__card" key={`${item.contentType}-${item._id}`}>
        {(item.thumbnailUrl || item.thumbnailFilename) && <div className="pj-publishing__card-image-box"><PublicArticleImage className="pj-publishing__card-image" filename={item.thumbnailUrl || item.thumbnailFilename} alt={item.images?.find((image) => image.filename === item.thumbnailFilename)?.alt || ""} loading="lazy" /></div>}
        <div className="pj-publishing__card-content"><p className="pj-publishing__eyebrow">{item.category || "News & Insights"}</p><h2>{item.title}</h2><p className="pj-publishing__card-summary">{item.summary}</p><p className="pj-publishing__byline">{item.author?.name}{item.publishedAt ? ` · ${new Date(item.publishedAt).toLocaleDateString()}` : ""}</p><Link to={`/news-insights/${item.contentType}/${encodeURIComponent(item.slug)}`}>Read More →</Link></div>
      </article>)}</section> : <p>No articles have been published yet. Please check back soon.</p>}
      {data.pagination?.pages > 1 && <nav className="pj-publishing__pagination" aria-label="Article pages"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button><span>Page {page} of {data.pagination.pages}</span><button type="button" disabled={page >= data.pagination.pages} onClick={() => setPage((value) => Math.min(data.pagination.pages, value + 1))}>Next</button></nav>}
    </>}
  </div></main>;
}
