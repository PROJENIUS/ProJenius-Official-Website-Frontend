/* Helpers shared by CinematicHero and HeroPanels. */

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Scroll to an in-page section, leaving room for the fixed navbar, and keep
   React Router's history state when updating the hash. */
export function scrollToHash(event, hash) {
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  event.preventDefault();
  const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--pjds-nav-offset")) || 96;
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY - offset - 16,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
  window.history.replaceState(window.history.state, "", hash);
}
