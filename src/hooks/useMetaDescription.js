import { useEffect } from "react";

/* Sets a page-specific <meta name="description"> while the page is mounted and
   restores the site default from index.html when the page unmounts. */
export default function useMetaDescription(content) {
  useEffect(() => {
    if (!content) return undefined;

    const updates = [
      ['meta[name="description"]', { name: "description" }],
      ['meta[property="og:description"]', { property: "og:description" }],
      ['meta[name="twitter:description"]', { name: "twitter:description" }],
    ];
    const restore = updates.map(([selector, attributes]) => {
      let meta = document.querySelector(selector);
      const created = !meta;
      if (!meta) {
        meta = document.createElement("meta");
        Object.assign(meta, attributes);
        document.head.appendChild(meta);
      }
      const previous = meta.getAttribute("content");
      meta.setAttribute("content", content);
      return () => {
        if (created) meta.remove();
        else if (previous !== null) meta.setAttribute("content", previous);
      };
    });
    return () => {
      restore.forEach((reset) => reset());
    };
  }, [content]);
}
