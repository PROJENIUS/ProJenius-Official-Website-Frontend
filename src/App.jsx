import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import Navbar from "./Components/Common/Navbar/Navbar.jsx";
import Footer from "./Components/Common/Footer/Footer.jsx";
import CookieNotice from "./Components/Common/CookieNotice/CookieNotice.jsx";
import NetworkStatus from "./Components/Common/NetworkStatus/NetworkStatus.jsx";
import MobileStickyCta from "./Components/Common/MobileStickyCta/MobileStickyCta.jsx";
import { COMPANY_DISPLAY_NAME, ROUTE_TITLES } from "./siteLinks.js";

const HomePage = lazy(() => import("./Pages/Home/HomePage.jsx"));
const NotFoundPage = lazy(() => import("./Pages/NotFound/NotFoundPage.jsx"));
const AboutPage = lazy(() => import("./Pages/About/AboutPage.jsx"));
const ContactPage = lazy(() => import("./Pages/Contact/ContactPage.jsx"));
const SoftwareDevelopmentPage = lazy(() => import("./Pages/Solutions/SoftwareDevelopment/SoftwareDevelopmentPage.jsx"));
const HardwareEmbeddedSystemsPage = lazy(() => import("./Pages/Solutions/HardwareEmbeddedSystems/HardwareEmbeddedSystemsPage.jsx"));
const RapidPrototypingPage = lazy(() => import("./Pages/Solutions/RapidPrototyping/RapidPrototypingPage.jsx"));
const PCBDesignFabricationPage = lazy(() => import("./Pages/Solutions/PCBDesignFabrication/PCBDesignFabricationPage.jsx"));
const CoursesPage = lazy(() => import("./Pages/Learning/Courses/CoursesPage.jsx"));
const CourseTermsPage = lazy(() => import("./Pages/Legal/CourseTermsPage.jsx"));
const CourseReceiptPage = lazy(() => import("./Pages/CourseReceipt/CourseReceiptPage.jsx"));
const InternshipsPage = lazy(() => import("./Pages/Learning/Internships/InternshipsPage.jsx"));
const CareerGuidancePage = lazy(() => import("./Pages/Learning/CareerGuidance/CareerGuidancePage.jsx"));
const WorkshopsPage = lazy(() => import("./Pages/Learning/Workshops/WorkshopsPage.jsx"));
const StartupInnovationPage = lazy(() => import("./Pages/StartupInnovation/StartupInnovationPage.jsx"));
const IncubateApplyPage = lazy(() => import("./Pages/Incubate/IncubateApplyPage.jsx"));
const NewsInsightsPage = lazy(() => import("./Pages/NewsInsights/NewsInsightsPage.jsx"));
const NewsletterActionPage = lazy(() => import("./Pages/Newsletter/NewsletterActionPage.jsx"));
const TermsAndConditionsPage = lazy(() => import("./Pages/Legal/TermsAndConditionsPage.jsx"));
const PrivacyPolicyPage = lazy(() => import("./Pages/Legal/PrivacyPolicyPage.jsx"));
const CookiePolicyPage = lazy(() => import("./Pages/Legal/CookiePolicyPage.jsx"));
const ProductsPage = lazy(() => import("./Pages/Products/ProductsPage.jsx"));
const JoinOurTeamPage = lazy(() => import("./Pages/JoinOurTeam/JoinOurTeamPage.jsx"));
const JoinApplyPage = lazy(() => import("./Pages/JoinOurTeam/JoinApplyPage.jsx"));
const JobOpeningPage = lazy(() => import("./Pages/JoinOurTeam/JobOpeningPage.jsx"));
/* Admin-only live preview of page heroes (never linked, not indexed). */
const HeroPreviewPage = lazy(() => import("./pageHeroes/HeroPreviewPage.jsx"));

function LegacyBlogArticle() {
  const { slug } = useParams();
  return <Navigate replace to={`/news-insights/blog/${encodeURIComponent(slug || "")}`} />;
}

/* Page titles live in siteLinks.js, the one list of public pages. */

/* Descriptions for routes whose page does not set its own (search snippets). */
const ROUTE_DESCRIPTIONS = {
  "/terms": "Terms and conditions for using the ProJenius Innovation Technology website, services, training programmes and payments.",
  "/privacy-policy": "How ProJenius Innovation Technology, Madurai, collects, uses, stores and protects personal information shared through our website and forms.",
  "/services/courses/terms": "Course registration terms and refund policy for ProJenius courses: payments, schedules, cancellations and how refunds are handled.",
  "/cookie-policy": "Cookie Policy for the ProJenius Innovation Technology website: essential storage, optional analytics, and cookies set by Razorpay, Google Maps and YouTube.",
  "/news-insights": "News and technology insights from ProJenius Innovation Technology, Madurai: company updates, events, workshops, AI, IoT and product development.",
  "/404": "This page could not be found. Explore ProJenius Innovation Technology services, courses, internships and workshops, or contact our team in Madurai.",
};

const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL || "https://pro-jenius-official-website-fronten.vercel.app").replace(/\/+$/, "");

function updateMeta(selector, create, attribute, value) {
  let node = document.querySelector(selector);
  if (!node) {
    node = create();
    document.head.appendChild(node);
  }
  node.setAttribute(attribute, value);
}

function RouteTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const dynamicContentRoute = pathname.startsWith("/news-insights/")
      || (pathname.startsWith("/services/courses/") && pathname !== "/services/courses/terms")
      || pathname.startsWith("/newsletter/unsubscribe/");
    const knownRoute = Boolean(ROUTE_TITLES[pathname])
      || pathname.startsWith("/news-insights")
      || pathname.startsWith("/services/courses/")
      || pathname.startsWith("/newsletter/unsubscribe/");
    const isNotFound = !knownRoute;

    if (!dynamicContentRoute) {
      document.title = pathname.startsWith("/services/courses/receipt/")
        ? `Secure Course Receipt | ${COMPANY_DISPLAY_NAME}`
        : pathname.startsWith("/newsletter/unsubscribe/")
          ? `Newsletter Preferences | ${COMPANY_DISPLAY_NAME}`
          : ROUTE_TITLES[pathname] || (isNotFound ? ROUTE_TITLES["/404"] : COMPANY_DISPLAY_NAME);
    }

    const canonical = new URL(pathname, SITE_ORIGIN).href;
    const noIndex = isNotFound
      || pathname.startsWith("/newsletter/")
      || pathname === "/incubate/apply"
      || pathname.startsWith("/services/courses/receipt/");
    updateMeta(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement("link"), { rel: "canonical" }),
      "href",
      canonical,
    );
    updateMeta(
      'meta[name="robots"]',
      () => Object.assign(document.createElement("meta"), { name: "robots" }),
      "content",
      noIndex ? "noindex,follow" : "index,follow",
    );
    if (!dynamicContentRoute) {
      updateMeta(
        'meta[property="og:title"]',
        () => Object.assign(document.createElement("meta"), { property: "og:title" }),
        "content",
        document.title,
      );
    }
    const routeDescription = ROUTE_DESCRIPTIONS[pathname] || (isNotFound ? ROUTE_DESCRIPTIONS["/404"] : "");
    if (routeDescription) {
      for (const [selector, attrs] of [['meta[name="description"]', { name: "description" }], ['meta[property="og:description"]', { property: "og:description" }], ['meta[name="twitter:description"]', { name: "twitter:description" }]]) {
        updateMeta(selector, () => Object.assign(document.createElement("meta"), attrs), "content", routeDescription);
      }
    }
    updateMeta(
      'meta[property="og:url"]',
      () => Object.assign(document.createElement("meta"), { property: "og:url" }),
      "content",
      canonical,
    );
  }, [pathname]);
  return null;
}

function RouteLoadingFallback() {
  const { pathname } = useLocation();
  const usesDarkHero = pathname === "/"
    || pathname === "/about"
    || pathname === "/startup"
    || pathname.startsWith("/incubate")
    || pathname === "/products"
    || pathname === "/join-our-team"
    || pathname === "/contact"
    || pathname === "/services/internship"
    || pathname.startsWith("/services/development")
    || pathname.startsWith("/services/hardware-embedded-systems")
    || pathname.startsWith("/services/rapid-prototyping")
    || pathname.startsWith("/services/pcb-design-fabrication");

  return (
    <main
      className={`pjds-route-loading${usesDarkHero ? " pjds-route-loading--dark" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      aria-busy="true"
    >
      <div className="pjds-route-loading__content">
        <div className="pjds-route-loading__brand" aria-hidden="true">
          <img src="/ProJenius_Logo.svg" alt="" width="44" height="44" />
          <span>Pro<span>Jenius</span></span>
        </div>
        <p className="pjds-route-loading__label">Preparing your page</p>
        <span className="pjds-route-loading__progress" aria-hidden="true" />
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RouteTitle />
      <Navbar />

      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          {/* MAIN PAGES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* SERVICES */}
          <Route path="/services/development" element={<SoftwareDevelopmentPage />} />
          <Route path="/services/hardware-embedded-systems" element={<HardwareEmbeddedSystemsPage />} />
          <Route path="/services/rapid-prototyping" element={<RapidPrototypingPage />} />
          <Route path="/services/pcb-design-fabrication" element={<PCBDesignFabricationPage />} />
          <Route path="/services/courses" element={<CoursesPage />} />
          <Route path="/services/courses/terms" element={<CourseTermsPage />} />
          <Route path="/services/courses/receipt/:token" element={<CourseReceiptPage />} />
          <Route path="/services/courses/:slug" element={<CoursesPage />} />
          <Route path="/terms" element={<TermsAndConditionsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/services/internship" element={<InternshipsPage />} />
          <Route path="/services/career-guidance" element={<CareerGuidancePage />} />

          {/* OTHER PAGES */}
          <Route path="/workshop" element={<WorkshopsPage />} />
          <Route path="/startup" element={<StartupInnovationPage />} />
          {/* Incubation is a section of the Startup page */}
          <Route path="/incubate" element={<Navigate replace to="/startup#startup-incubate" />} />
          <Route path="/incubate/apply" element={<IncubateApplyPage />} />
          <Route path="/join-our-team" element={<JoinOurTeamPage />} />
          <Route path="/join-our-team/apply" element={<JoinApplyPage />} />
          <Route path="/join-our-team/:slug" element={<JobOpeningPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/news-insights" element={<NewsInsightsPage />} />
          <Route path="/news-insights/:slug" element={<NewsInsightsPage />} />
          <Route path="/news-insights/:contentType/:slug" element={<NewsInsightsPage />} />
          <Route path="/blog" element={<Navigate replace to="/news-insights" />} />
          <Route path="/blog/:slug" element={<LegacyBlogArticle />} />
          <Route path="/newsletter/confirm" element={<NewsletterActionPage mode="confirm" />} />
          <Route path="/newsletter/unsubscribe/:subscriberId" element={<NewsletterActionPage mode="unsubscribe" />} />
          <Route path="/hero-preview/:key" element={<HeroPreviewPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Suspense>
      <CookieNotice />
      <NetworkStatus />
      <MobileStickyCta />
    </BrowserRouter>
  );
}

export default App;
