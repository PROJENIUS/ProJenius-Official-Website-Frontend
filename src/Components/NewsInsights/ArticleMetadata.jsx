import { useEffect } from "react";

import { articleHref, assetUrl, coverOf } from "./newsApi.js";

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

export default function ArticleMetadata({ item }) {
  useEffect(() => {
    const previousTitle = document.title;
    const description = item?.seo?.description || item?.summary || "Company news, technology insights and innovation updates from ProJenius.";
    const title = item ? `${item.seo?.title || item.title} | ProJenius Innovation Technology` : "News & Insights | ProJenius Innovation Technology";
    const path = item ? articleHref(item) : "/news-insights";
    const image = coverOf(item) ? assetUrl(coverOf(item)) : "";

    document.title = title;
    const restore = [
      setMeta('meta[name="description"]', named("description"), "content", description),
      setMeta('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), "href", `${window.location.origin}${path}`),
      setMeta('meta[property="og:title"]', property("og:title"), "content", title),
      setMeta('meta[property="og:description"]', property("og:description"), "content", description),
      setMeta('meta[property="og:type"]', property("og:type"), "content", item ? "article" : "website"),
      setMeta('meta[property="og:image"]', property("og:image"), "content", image),
    ];
    return () => {
      document.title = previousTitle;
      restore.forEach((fn) => fn());
    };
  }, [item]);
  return null;
}
