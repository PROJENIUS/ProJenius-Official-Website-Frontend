import { useEffect } from "react";

import { articleHref, assetUrl, coverOf } from "./newsApi.js";
import useJsonLd from "../../hooks/useJsonLd.js";

/* Page title, description, canonical link and Open Graph tags for an article
   (or the listing when item is null); restored when the page changes. */

function setMeta(selector, create, attr, value) {
  let element = document.head.querySelector(selector);
  const created = !element;
  if (!element) {
    element = create();
    document.head.append(element);
  }
  const previous = element.getAttribute(attr) || "";
  element.setAttribute(attr, value);
  return () => (created ? element.remove() : element.setAttribute(attr, previous));
}

const named = (name) => () => Object.assign(document.createElement("meta"), { name });
const property = (prop) => () => {
  const m = document.createElement("meta");
  m.setAttribute("property", prop);
  return m;
};

const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL || "https://pro-jenius-official-website-fronten.vercel.app").replace(/\/+$/, "");

const ORGANIZATION = { "@type": "Organization", name: "ProJenius Innovation Technology", url: SITE_ORIGIN, logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/ProJenius_Logo.svg` } };

export default function ArticleMetadata({ item }) {
  /* NewsArticle / BlogPosting data for Google (headline, image, dates, author). */
  useJsonLd(item ? {
    "@context": "https://schema.org",
    "@type": item.contentType === "blog" ? "BlogPosting" : "NewsArticle",
    headline: (item.seo?.title || item.title || "").slice(0, 110),
    description: item.seo?.description || item.summary || "",
    image: [coverOf(item) ? assetUrl(coverOf(item)) : `${SITE_ORIGIN}/og-image.png`],
    datePublished: item.publishedAt,
    dateModified: item.updatedAt || item.publishedAt,
    author: item.author?.name && !/projenius/i.test(item.author.name) ? { "@type": "Person", name: item.author.name } : ORGANIZATION,
    publisher: ORGANIZATION,
    mainEntityOfPage: new URL(articleHref(item), SITE_ORIGIN).href,
  } : null);
  useEffect(() => {
    const previousTitle = document.title;
    const description = item?.seo?.description || item?.summary || "Company news, technology insights and innovation updates from ProJenius.";
    const title = item ? `${item.seo?.title || item.title} | ProJenius Innovation Technology` : "News & Insights | ProJenius Innovation Technology";
    const path = item ? articleHref(item) : "/news-insights";
    // Fall back to the site share image so link previews always show ProJenius branding.
    const image = coverOf(item) ? assetUrl(coverOf(item)) : `${SITE_ORIGIN}/og-image.png`;

    document.title = title;
    const restore = [
      setMeta('meta[name="description"]', named("description"), "content", description),
      setMeta('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), "href", new URL(path, SITE_ORIGIN).href),
      setMeta('meta[property="og:title"]', property("og:title"), "content", title),
      setMeta('meta[property="og:description"]', property("og:description"), "content", description),
      setMeta('meta[property="og:type"]', property("og:type"), "content", item ? "article" : "website"),
      setMeta('meta[property="og:url"]', property("og:url"), "content", new URL(path, SITE_ORIGIN).href),
      setMeta('meta[property="og:image"]', property("og:image"), "content", image),
      setMeta('meta[name="twitter:title"]', named("twitter:title"), "content", title),
      setMeta('meta[name="twitter:description"]', named("twitter:description"), "content", description),
    ];
    return () => {
      document.title = previousTitle;
      restore.forEach((fn) => fn());
    };
  }, [item]);
  return null;
}
