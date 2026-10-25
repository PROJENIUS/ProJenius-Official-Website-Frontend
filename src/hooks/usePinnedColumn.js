import { useEffect } from "react";

/* =============================================================================
   usePinnedColumn
   -----------------------------------------------------------------------------
   Keeps an element in view while the column it sits in scrolls past, like
   position: sticky. Sticky cannot work on this site (the global html/body
   overflow rule makes <body> the sticky container), so the element is
   switched between states through data-pin:

     "off"     media query does not match (normal flow)
     "before"  column has not reached the top yet (normal flow)
     "pinned"  fixed; --pin-top / --pin-left / --pin-width are set on it
     "after"   column bottom passed; place it at the bottom of the column

   The component's CSS turns these states into positions; the column needs
   position: relative and the element's height reserved (it already is when
   the column is a grid cell stretched to its row). Work runs only while the
   column is on screen.
   ============================================================================= */

export default function usePinnedColumn(columnRef, elementRef, { query = "(min-width: 1024px)", gap = 24 } = {}) {
  useEffect(() => {
    const column = columnRef.current;
    const element = elementRef.current;
    if (!column || !element || typeof window.matchMedia !== "function") return undefined;

    const media = window.matchMedia(query);
    let frame = 0;
    let visible = typeof IntersectionObserver === "undefined";

    const measure = () => {
      frame = 0;
      if (!media.matches) {
        element.dataset.pin = "off";
        return;
      }
      const offset =
        (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--pjds-nav-offset")) || 112) + gap;
      const rect = column.getBoundingClientRect();
      if (rect.top > offset) {
        element.dataset.pin = "before";
      } else if (rect.bottom < offset + element.offsetHeight) {
        element.dataset.pin = "after";
      } else {
        element.dataset.pin = "pinned";
        element.style.setProperty("--pin-top", `${offset}px`);
        element.style.setProperty("--pin-left", `${rect.left}px`);
        element.style.setProperty("--pin-width", `${rect.width}px`);
      }
    };

    const schedule = () => {
      if (visible && !frame) frame = window.requestAnimationFrame(measure);
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            measure();
          });
    observer?.observe(column);

    const resizer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    resizer?.observe(column);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener?.("change", measure);
    measure();

    return () => {
      observer?.disconnect();
      resizer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener?.("change", measure);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [columnRef, elementRef, query, gap]);
}
