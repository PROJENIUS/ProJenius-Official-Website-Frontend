import { useEffect } from "react";

/* Sets a page-specific <meta name="description"> while the page is mounted and
   restores the site default from index.html when the page unmounts. */
export default function useMetaDescription(content) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    if (!meta || !content) return undefined;
    const previous = meta.getAttribute("content");
    meta.setAttribute("content", content);
    return () => {
      if (previous !== null) meta.setAttribute("content", previous);
    };
  }, [content]);
}
