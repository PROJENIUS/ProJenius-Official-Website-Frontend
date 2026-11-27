import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "./Breadcrumbs.css";

/* =============================================================================
   BREADCRUMBS — "Home › Solutions › Software Development"
   items: [{ label, to }] from the home page to the current page (the last
   item is the current page and is not a link; a middle item without `to`,
   such as "Solutions", is plain text). Also adds the matching
   schema.org BreadcrumbList to the page head, which Google shows in search
   results. tone: "dark" on navy sections (default), "light" on light ones.
   ============================================================================= */

const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL || "https://pro-jenius-official-website-fronten.vercel.app").replace(/\/+$/, "");

export default function Breadcrumbs({ items, tone = "dark", className = "" }) {
  const key = items.map((item) => item.label).join(">");

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.breadcrumbs = "true";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items
        .filter((item, index) => item.to || index === items.length - 1)
        .map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: `${SITE_ORIGIN}${item.to || window.location.pathname}`,
        })),
    });
    document.head.appendChild(script);
    return () => script.remove();
    // The list is identified by its labels; re-run only when they change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <nav className={`pj-crumbs pj-crumbs--${tone}${className ? ` ${className}` : ""}`} aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label}>
              {last ? <span aria-current="page">{item.label}</span> : item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
              {!last && <ChevronRight size={14} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
