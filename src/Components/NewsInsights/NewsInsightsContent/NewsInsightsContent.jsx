import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { normalizeApiBase, resolveApiUrl } from "../../../utils/apiUrl.js";
import "./NewsInsightsContent.css";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API = normalizeApiBase(configuredApiBaseUrl, import.meta.env.DEV);

function apiUrl(path) {
  return resolveApiUrl(path, API, window.location.origin);
}

function assetUrl(reference) {
  const imageReference = String(reference || "");
  const isAbsoluteUrl = /^https?:\/\//i.test(imageReference);
  const isApiPath = imageReference.startsWith("/");
  const path = isAbsoluteUrl || isApiPath
    ? imageReference
    : `/api/news/assets/${encodeURIComponent(imageReference)}`;

  return apiUrl(path);
}

function PublicArticleImage({ filename, alt = "", className = "", loading }) {
  const [failed, setFailed] = useState(false);
  const url = assetUrl(filename);

  if (failed) {
    const message = import.meta.env.DEV
      ? `Unable to load article image: ${url}`
      : "This article image is currently unavailable.";

    return (
      <div
        className={`pj-publishing__image-error ${className}`}
        role="img"
        aria-label={alt || "Article image unavailable"}
      >
        {message}
      </div>
    );
  }

  function handleImageError() {
    if (import.meta.env.DEV) {
      console.error("News & Insights image failed to load", { url });
    }
    setFailed(true);
  }

  return (
    <img
      className={className}
      src={url}
      alt={alt}
      loading={loading}
      onError={handleImageError}
    />
  );
}

function videoEmbed(video) {
  if (video.provider === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.videoId)}`;
  }

  if (video.provider === "vimeo") {
    return `https://player.vimeo.com/video/${encodeURIComponent(video.videoId)}`;
  }

  return null;
}

function setPropertyMeta(property, content) {
  let element = document.querySelector(`meta[property="${property}"]`);
  const created = !element;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.append(element);
  }

  const previous = element.content;
  element.content = content;

  return () => {
    if (created) {
      element.remove();
    } else {
      element.content = previous;
    }
  };
}

function ArticleMetadata({ item }) {
  useEffect(() => {
    const previousTitle = document.title;
    const description = item?.seo?.description
      || item?.summary
      || "Company news, technology insights and innovation updates from ProJenius.";
    const pageTitle = item
      ? `${item.seo?.title || item.title} | ProJenius Innovation Technology`
      : "News & Insights | ProJenius Innovation Technology";

    document.title = pageTitle;

    let descriptionMeta = document.querySelector('meta[name="description"]');
    const createdDescriptionMeta = !descriptionMeta;
    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.name = "description";
      document.head.append(descriptionMeta);
    }
    const previousDescription = descriptionMeta.content;
    descriptionMeta.content = description;

    let canonical = document.querySelector('link[rel="canonical"]');
    const createdCanonical = !canonical;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    const previousCanonical = canonical.href;
    const canonicalPath = item
      ? `/news-insights/${item.contentType}/${encodeURIComponent(item.slug)}`
      : "/news-insights";
    canonical.href = `${window.location.origin}${canonicalPath}`;

    let imageMeta = document.querySelector('meta[property="og:image"]');
    const createdImageMeta = !imageMeta;
    if (!imageMeta) {
      imageMeta = document.createElement("meta");
      imageMeta.setAttribute("property", "og:image");
      document.head.append(imageMeta);
    }
    const previousImage = imageMeta.content;
    const imageReference = item?.thumbnailUrl || item?.thumbnailFilename;
    imageMeta.content = imageReference ? assetUrl(imageReference) : "";

    const restoreOgTitle = setPropertyMeta("og:title", pageTitle);
    const restoreOgDescription = setPropertyMeta("og:description", description);

    return () => {
      document.title = previousTitle;

      if (createdDescriptionMeta) {
        descriptionMeta.remove();
      } else {
        descriptionMeta.content = previousDescription;
      }

      if (createdCanonical) {
        canonical.remove();
      } else {
        canonical.href = previousCanonical;
      }

      if (createdImageMeta) {
        imageMeta.remove();
      } else {
        imageMeta.content = previousImage;
      }

      restoreOgTitle();
      restoreOgDescription();
    };
  }, [item]);

  return null;
}

function SearchForm({
  categories,
  category,
  onCategoryChange,
  onSearch,
  searchInput,
  onSearchInputChange,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch(searchInput.trim());
  }

  return (
    <form className="pj-publishing__search" onSubmit={handleSubmit}>
      <label htmlFor="pj-publishing-search">Search articles</label>
      <div className="pj-publishing__search-inputs">
        <input
          id="pj-publishing-search"
          value={searchInput}
          maxLength={100}
          onChange={(event) => onSearchInputChange(event.target.value)}
        />
        <button type="submit">Search</button>
      </div>

      <label htmlFor="pj-publishing-category">Category</label>
      <select
        id="pj-publishing-category"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </form>
  );
}

function ArticleByline({ item }) {
  const publishedDate = item.publishedAt
    ? ` · ${new Date(item.publishedAt).toLocaleDateString()}`
    : "";

  return (
    <p className="pj-publishing__byline">
      {item.author?.name}
      {publishedDate}
    </p>
  );
}

function ArticleHero({ item }) {
  const imageReference = item.thumbnailUrl || item.thumbnailFilename;
  if (!imageReference) return null;

  const alt = item.images?.find(
    (image) => image.filename === item.thumbnailFilename,
  )?.alt || "";

  return (
    <div className="pj-publishing__hero-box">
      <PublicArticleImage
        className="pj-publishing__hero"
        filename={imageReference}
        alt={alt}
      />
    </div>
  );
}

function ArticleGallery({ item }) {
  const images = (item.images || []).filter(
    (image) => image.filename !== item.thumbnailFilename,
  );

  if (!images.length) return null;

  return (
    <section
      className="pj-publishing__gallery"
      aria-label="Article image gallery"
    >
      {images.map((image) => (
        <div className="pj-publishing__gallery-box" key={image.filename}>
          <PublicArticleImage
            className="pj-publishing__gallery-image"
            filename={image.url || image.filename}
            alt={image.alt || ""}
            loading="lazy"
          />
        </div>
      ))}
    </section>
  );
}

function ArticleVideos({ videos }) {
  if (!videos.length) return null;

  return (
    <section className="pj-publishing__videos" aria-label="Article videos">
      <h3>Videos</h3>
      {videos.map((video) => (
        <figure key={`${video.provider}-${video.videoId}`}>
          <iframe
            src={videoEmbed(video)}
            title={video.title || "ProJenius article video"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <figcaption>{video.title}</figcaption>
        </figure>
      ))}
    </section>
  );
}

function ArticleDetail({ item }) {
  return (
    <article className="pj-publishing__article">
      <ArticleHero item={item} />
      <p className="pj-publishing__eyebrow">
        {item.category || "News & Insights"}
      </p>
      <h2>{item.title}</h2>
      <p className="pj-publishing__summary">{item.summary}</p>
      <ArticleByline item={item} />
      <div className="pj-publishing__body">{item.body}</div>
      <ArticleGallery item={item} />
      <ArticleVideos videos={item.videos || []} />
      <Link to="/news-insights">← All News &amp; Insights</Link>
    </article>
  );
}

function ArticleCard({ item }) {
  const imageReference = item.thumbnailUrl || item.thumbnailFilename;
  const alt = item.images?.find(
    (image) => image.filename === item.thumbnailFilename,
  )?.alt || "";

  return (
    <article className="pj-publishing__card" key={`${item.contentType}-${item._id}`}>
      {imageReference && (
        <div className="pj-publishing__card-image-box">
          <PublicArticleImage
            className="pj-publishing__card-image"
            filename={imageReference}
            alt={alt}
            loading="lazy"
          />
        </div>
      )}
      <div className="pj-publishing__card-content">
        <p className="pj-publishing__eyebrow">
          {item.category || "News & Insights"}
        </p>
        <h2>{item.title}</h2>
        <p className="pj-publishing__card-summary">{item.summary}</p>
        <ArticleByline item={item} />
        <Link
          to={`/news-insights/${item.contentType}/${encodeURIComponent(item.slug)}`}
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}

function ArticleList({ items }) {
  if (!items.length) {
    return <p>No articles have been published yet. Please check back soon.</p>;
  }

  return (
    <section className="pj-publishing__grid">
      {items.map((item) => (
        <ArticleCard key={`${item.contentType}-${item._id}`} item={item} />
      ))}
    </section>
  );
}

function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  return (
    <nav className="pj-publishing__pagination" aria-label="Article pages">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange((value) => Math.max(1, value - 1))}
      >
        Previous
      </button>
      <span>Page {page} of {pages}</span>
      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onPageChange((value) => Math.min(pages, value + 1))}
      >
        Next
      </button>
    </nav>
  );
}

export default function NewsInsightsContent() {
  const { slug, contentType: routeType } = useParams();
  const contentType = routeType || "news";
  const [data, setData] = useState({
    loading: true,
    items: [],
    item: null,
    pagination: null,
    error: "",
  });
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    let active = true;

    fetch(apiUrl("/api/news/categories"))
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .then((body) => {
        if (active) setCategories(body.items || []);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const query = new URLSearchParams({
      page: String(page),
      limit: "9",
      ...(search ? { search } : {}),
      ...(category ? { category } : {}),
    });
    const url = slug
      ? apiUrl(`/api/news/${contentType}/${encodeURIComponent(slug)}`)
      : `${apiUrl("/api/news")}?${query}`;

    fetch(url)
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(body.error || "Articles are unavailable.");
        }
        return body;
      })
      .then((body) => {
        if (!active) return;
        setData({
          loading: false,
          items: body.items || [],
          item: body.item || null,
          pagination: body.pagination || null,
          error: "",
        });
      })
      .catch((error) => {
        if (!active) return;
        setData({
          loading: false,
          items: [],
          item: null,
          pagination: null,
          error: error.message,
        });
      });

    return () => {
      active = false;
    };
  }, [slug, contentType, page, search, category]);

  const item = data.item;

  return (
    <main className="pj-publishing">
      <ArticleMetadata item={item} />
      <div className="pj-publishing__wrap">
        <header>
          <p className="pj-publishing__eyebrow">ProJenius updates</p>
          <h1>{slug ? item?.title || "News & Insights" : "News & Insights"}</h1>
          <p>
            Company milestones, technology perspectives, project stories and
            innovation updates.
          </p>
          {!slug && (
            <SearchForm
              categories={categories}
              category={category}
              onCategoryChange={(value) => {
                setPage(1);
                setCategory(value);
              }}
              onSearch={(value) => {
                setPage(1);
                setSearch(value);
              }}
              searchInput={searchInput}
              onSearchInputChange={setSearchInput}
            />
          )}
        </header>

        {data.loading ? (
          <p role="status">Loading articles…</p>
        ) : data.error ? (
          <p role="alert">{data.error}</p>
        ) : slug ? (
          item && <ArticleDetail item={item} />
        ) : (
          <>
            <ArticleList items={data.items} />
            <Pagination
              page={page}
              pages={data.pagination?.pages || 0}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </main>
  );
}
