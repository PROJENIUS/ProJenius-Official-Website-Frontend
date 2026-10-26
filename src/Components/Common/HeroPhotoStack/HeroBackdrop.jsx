import "./HeroBackdrop.css";

/* =============================================================================
   HERO BACKDROP — a real photo faded under the navy hero, the same look as
   the Products / Startup heroes (ServiceHero backdrop). Decorative only.

   Place it as a direct child of a hero that is position: relative with
   isolation: isolate; it sits behind the hero content (z-index -1) and
   above the hero's own background colour.
   ============================================================================= */

export default function HeroBackdrop({ image }) {
  if (!image) return null;
  return (
    <div className="pj-hero-photo" aria-hidden="true">
      <img src={image} alt="" decoding="async" fetchPriority="high" />
    </div>
  );
}
