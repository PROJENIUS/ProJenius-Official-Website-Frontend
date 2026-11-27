import { useEffect } from "react";

/* Adds one schema.org JSON-LD block to the page head while mounted (Google
   reads it for rich results). Pass null to add nothing. */
export default function useJsonLd(data) {
  const text = data ? JSON.stringify(data) : "";
  useEffect(() => {
    if (!text) return undefined;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = text;
    document.head.appendChild(script);
    return () => script.remove();
  }, [text]);
}
