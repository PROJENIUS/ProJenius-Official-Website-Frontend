import { useEffect } from "react";

/* =============================================================================
   useSectionProgress
   -----------------------------------------------------------------------------
   For a tall "track" element:

   --p          CSS variable on the track: 0 when its top reaches the viewport
                top, 1 when its bottom reaches the viewport bottom. The page
                CSS turns it into motion, so React never re-renders per frame.
   data-pin     "before" | "pinned" | "after" on the track. The site's global
                html/body overflow-x rule makes <body> a scroll container
                (one that never scrolls), so position: sticky never sticks;
                sections pin
                their stage with position: fixed while data-pin="pinned"
                (absolute at the top before, at the bottom after).

   Work happens only while the track is on screen: one rect read per
   animation frame during scroll, nothing otherwise.
   ============================================================================= */

export default function useSectionProgress(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let frame = 0;
    let visible = typeof IntersectionObserver === "undefined";

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : rect.top < 0 ? 1 : 0;
      const pin = rect.top > 0 ? "before" : rect.bottom < window.innerHeight ? "after" : "pinned";
      el.style.setProperty("--p", progress.toFixed(4));
      if (el.dataset.pin !== pin) el.dataset.pin = pin;
    };

    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(measure);
    };

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) schedule();
            else measure(); // settle on before/after when it leaves the screen
          });
    observer?.observe(el);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    measure();

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}
