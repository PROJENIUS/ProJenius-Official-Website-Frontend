import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import Navbar from "./Components/Common/Navbar/Navbar.jsx";
import Footer from "./Components/Common/Footer/Footer.jsx";

const HomePage = lazy(() => import("./Pages/Home/HomePage.jsx"));
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
const ProductsPage = lazy(() => import("./Pages/Products/ProductsPage.jsx"));
const JoinOurTeamPage = lazy(() => import("./Pages/JoinOurTeamPage.jsx"));

function LegacyBlogArticle() {
  const { slug } = useParams();
  return <Navigate replace to={`/news-insights/blog/${encodeURIComponent(slug || "")}`} />;
}

const COMPANY_DISPLAY_NAME = "ProJenius Innovation Technology";
const ROUTE_TITLES = {
  "/": `${COMPANY_DISPLAY_NAME} | Technology Solutions & Training`,
  "/about": `About Us | ${COMPANY_DISPLAY_NAME}`,
  "/contact": `Contact Us | ${COMPANY_DISPLAY_NAME}`,
  "/services/development": `Software Development | ${COMPANY_DISPLAY_NAME}`,
  "/services/hardware-embedded-systems": `Hardware & Embedded Systems | ${COMPANY_DISPLAY_NAME}`,
  "/services/rapid-prototyping": `Rapid Prototyping | ${COMPANY_DISPLAY_NAME}`,
  "/services/pcb-design-fabrication": `PCB Design & Fabrication | ${COMPANY_DISPLAY_NAME}`,
  "/products": `Products | ${COMPANY_DISPLAY_NAME}`,
  "/services/courses": `Explore Courses | ${COMPANY_DISPLAY_NAME}`,
  "/services/courses/terms": `Course Terms & Refund Policy | ${COMPANY_DISPLAY_NAME}`,
  "/terms": `Terms & Conditions | ${COMPANY_DISPLAY_NAME}`,
  "/privacy-policy": `Privacy Policy | ${COMPANY_DISPLAY_NAME}`,
  "/services/internship": `Technology Internship | ${COMPANY_DISPLAY_NAME}`,
  "/services/career-guidance": `Career Guidance | ${COMPANY_DISPLAY_NAME}`,
  "/workshop": `Workshops & Training | ${COMPANY_DISPLAY_NAME}`,
  "/startup": `Startup & Innovation | ${COMPANY_DISPLAY_NAME}`,
  "/incubate/apply": `Apply for Incubation | ${COMPANY_DISPLAY_NAME}`,
  "/join-our-team": `Join Our Team | ${COMPANY_DISPLAY_NAME}`,
  "/news-insights": `News & Insights | ${COMPANY_DISPLAY_NAME}`,
  "/newsletter/confirm": `Newsletter Subscription | ${COMPANY_DISPLAY_NAME}`,
};

function RouteTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/news-insights/")) return;
    if (pathname.startsWith("/services/courses/receipt/")) {
      document.title = `Secure Course Receipt | ${COMPANY_DISPLAY_NAME}`;
      return;
    }
    if (pathname.startsWith("/services/courses/") && pathname !== "/services/courses/terms") return;
    document.title = pathname.startsWith("/newsletter/unsubscribe/")
      ? `Newsletter Preferences | ${COMPANY_DISPLAY_NAME}`
      : ROUTE_TITLES[pathname] || COMPANY_DISPLAY_NAME;
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
          <Route path="/services/internship" element={<InternshipsPage />} />
          <Route path="/services/career-guidance" element={<CareerGuidancePage />} />

          {/* OTHER PAGES */}
          <Route path="/workshop" element={<WorkshopsPage />} />
          <Route path="/startup" element={<StartupInnovationPage />} />
          {/* Incubation is a section of the Startup page */}
          <Route path="/incubate" element={<Navigate replace to="/startup#startup-incubate" />} />
          <Route path="/incubate/apply" element={<IncubateApplyPage />} />
          <Route path="/join-our-team" element={<JoinOurTeamPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/news-insights" element={<NewsInsightsPage />} />
          <Route path="/news-insights/:slug" element={<NewsInsightsPage />} />
          <Route path="/news-insights/:contentType/:slug" element={<NewsInsightsPage />} />
          <Route path="/blog" element={<Navigate replace to="/news-insights" />} />
          <Route path="/blog/:slug" element={<LegacyBlogArticle />} />
          <Route path="/newsletter/confirm" element={<NewsletterActionPage mode="confirm" />} />
          <Route path="/newsletter/unsubscribe/:subscriberId" element={<NewsletterActionPage mode="unsubscribe" />} />
        </Routes>
        <Footer />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
