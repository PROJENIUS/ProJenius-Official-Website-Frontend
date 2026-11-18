import { useEffect } from "react";

/* =============================================================================
   useScrollReveal
   -----------------------------------------------------------------------------
   One IntersectionObserver for every [data-reveal] element inside rootRef.

   - Entering the viewport (scrolling down OR up) sets data-revealed.
   - Leaving the viewport removes it, so the element animates again the next
     time it comes into view, from either direction.
   - A data attribute is used (not a class) so React re-renders that change a
     component's className never wipe the revealed state.
   - No scroll listeners and no animation loop: the visual transition is pure
     CSS (see the [data-reveal] rules of the page stylesheet), and reduced
     motion is handled there.

   Only elements present when the page mounts are observed, so put
   data-reveal on static wrappers rather than on asynchronously loaded items.
   ============================================================================= */

const VISIBLE_RATIO = 0.15;
const VISIBLE_PIXELS = 160; // tall elements count as visible after this much shows

export default function useScrollReveal(rootRef, selector = "[data-reveal]") {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const elements = Array.from(root.querySelectorAll(selector));

    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => { element.dataset.revealed = "true"; });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;
          const isVisible =
            entry.isIntersecting &&
            (entry.intersectionRatio >= VISIBLE_RATIO || entry.intersectionRect.height >= VISIBLE_PIXELS);

          if (isVisible) {
            element.dataset.revealed = "true";
          } else if (!entry.isIntersecting) {
            delete element.dataset.revealed;
          }
        });
      },
      { threshold: [0, VISIBLE_RATIO, 0.3], rootMargin: "0px 0px -6% 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    /* Content that appears later (e.g. "See all projects", a section that
       re-renders) is watched too, so it never stays hidden. */
    let mutations = null;
    if (typeof MutationObserver !== "undefined") {
      mutations = new MutationObserver((records) => {
        records.forEach((record) => {
          record.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;
            if (node.matches(selector)) observer.observe(node);
            node.querySelectorAll(selector).forEach((child) => observer.observe(child));
          });
        });
      });
      mutations.observe(root, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      if (mutations) mutations.disconnect();
    };
  }, [rootRef, selector]);
}
