/* =============================================================================
   SITE LINKS — the one list of public pages and linkable sections
   -----------------------------------------------------------------------------
   Adding a page or a section? Add it here and everything follows:
     • the browser tab title (App.jsx)
     • sitemap.xml for Google (generated at build, see vite.config.js)
     • /site-links.json, which the admin panel reads, so the new page appears
       in Admin → Home Hero → button "Opens" without any admin change
   test/siteLinks.test.js fails if a <Route> in App.jsx is missing here or a
   section id below no longer exists on its page.

   Plain data only: this file is also read by vite.config.js in Node.
   ============================================================================= */

export const COMPANY_DISPLAY_NAME = "ProJenius Innovation Technology";

/* path      the route in App.jsx
   label     short name, used in the admin link list
   title     browser tab title, when it should differ from "<label> | Company"
   sitemap   listed for Google
   link      offered as a button destination in the admin panel */
export const SITE_PAGES = [
  { path: "/", label: "Home", title: "Software, IoT & Embedded Company in Madurai | ProJenius", sitemap: true, link: true },
  { path: "/about", label: "About Us", sitemap: true, link: true },
  { path: "/services/development", label: "Software Development", sitemap: true, link: true },
  { path: "/services/hardware-embedded-systems", label: "Hardware & Embedded Systems", sitemap: true, link: true },
  { path: "/services/pcb-design-fabrication", label: "PCB Design & Fabrication", sitemap: true, link: true },
  { path: "/services/rapid-prototyping", label: "Rapid Prototyping", sitemap: true, link: true },
  { path: "/services/courses", label: "Courses", title: `Explore Courses | ${COMPANY_DISPLAY_NAME}`, sitemap: true, link: true },
  { path: "/services/internship", label: "Internships", title: `Technology Internship | ${COMPANY_DISPLAY_NAME}`, sitemap: true, link: true },
  { path: "/workshop", label: "Workshops", title: `Workshops & Training | ${COMPANY_DISPLAY_NAME}`, sitemap: true, link: true },
  { path: "/services/career-guidance", label: "Career Guidance", sitemap: true, link: true },
  { path: "/startup", label: "Startup & Innovation", sitemap: true, link: true },
  { path: "/incubate/apply", label: "Apply for Incubation", sitemap: true, link: true },
  { path: "/products", label: "Products", sitemap: true, link: true },
  { path: "/news-insights", label: "News & Insights", sitemap: true, link: true },
  { path: "/join-our-team", label: "Join Our Team", sitemap: true, link: true },
  { path: "/join-our-team/apply", label: "Apply for a Job", title: "Apply for a Job | ProJenius Innovation Technology", sitemap: true, link: true },
  { path: "/contact", label: "Contact Us", sitemap: true, link: true },
  { path: "/services/courses/terms", label: "Live Training Refund Policy", sitemap: true, link: false },
  { path: "/terms", label: "Terms & Conditions", sitemap: true, link: false },
  { path: "/privacy-policy", label: "Privacy Policy", sitemap: true, link: false },
  { path: "/cookie-policy", label: "Cookie Policy", sitemap: true, link: false },
  // Redirects to /startup#startup-incubate; kept for its title only.
  { path: "/incubate", label: "Startup Incubation", sitemap: false, link: false },
  { path: "/newsletter/confirm", label: "Newsletter Subscription", sitemap: false, link: false },
];

/* Places inside a page a button can jump to. `id` must exist on that page. */
export const SITE_SECTIONS = [
  { to: "#home-services", id: "home-services", label: "Home · Our Services" },
  { to: "#home-training", id: "home-training", label: "Home · Our Training Program" },
  { to: "#home-updates", id: "home-updates", label: "Home · Highlights & Updates" },
  { to: "#home-products", id: "home-products", label: "Home · Products & Innovations" },
  { to: "#home-projects", id: "home-projects", label: "Home · Our Projects" },
  { to: "#home-achievements", id: "home-achievements", label: "Home · Achievements & Recognition" },
  { to: "/services/courses#course-catalog", id: "course-catalog", label: "Courses · Course catalogue" },
  { to: "/services/internship#internship-domains", id: "internship-domains", label: "Internships · Domains" },
  { to: "/startup#startup-incubate", id: "startup-incubate", label: "Startup · Incubate at ProJenius" },
  { to: "/join-our-team#open-roles", id: "open-roles", label: "Join Our Team · Open roles" },
  { to: "/contact?type=general#pj-contact-help", id: "pj-contact-help", label: "Contact · General enquiry" },
  { to: "/contact?type=partnership#pj-contact-help", id: "pj-contact-help", label: "Contact · Partnership enquiry" },
];

/** Tab titles by path, for App.jsx. */
export const ROUTE_TITLES = Object.fromEntries([
  ...SITE_PAGES.map((page) => [page.path, page.title || `${page.label} | ${COMPANY_DISPLAY_NAME}`]),
  ["/404", `Page Not Found | ${COMPANY_DISPLAY_NAME}`],
]);

/** What /site-links.json serves: sections first, then pages A–Z. */
export function buildSiteLinks() {
  const pages = SITE_PAGES.filter((page) => page.link).map((page) => ({ label: page.label, to: page.path }));
  return {
    version: 1,
    links: [...SITE_SECTIONS.map(({ to, label }) => ({ label, to })), ...pages.sort((a, b) => a.label.localeCompare(b.label))],
  };
}

export function buildSitemap(origin) {
  const base = origin.replace(/\/+$/, "");
  const urls = SITE_PAGES.filter((page) => page.sitemap).map((page) => `  <url><loc>${base}${page.path}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}
