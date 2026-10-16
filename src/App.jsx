import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./Components/Common/Navbar/Navbar";
import Footer from "./Components/Common/Footer/Footer";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";

import Development from "./Pages/Services/Development";
import Courses from "./Pages/Services/Courses";
import CourseTerms from "./Pages/Services/CourseTerms";
import CourseReceipt from "./Pages/Services/CourseReceipt";
import Internship from "./Pages/Services/Internship";
import CareerGuidancePage from "./Pages/Services/CareerGuidancePage";

import Workshop from "./Pages/Workshop";
import StartupSupporter from "./Pages/StartupSupporter";
import NewsInsights from "./Pages/NewsInsights";
import NewsletterAction from "./Pages/NewsletterAction";
import TermsAndConditions from "./Pages/Legal/TermsAndConditions/TermsAndConditions";
import PrivacyPolicy from "./Pages/Legal/PrivacyPolicy/PrivacyPolicy";

function LegacyBlogArticle() {
  const { slug } = useParams();
  return <Navigate replace to={`/news-insights/blog/${encodeURIComponent(slug || "")}`} />;
}

const COMPANY_DISPLAY_NAME = "ProJenius Innovation Technology";
const ROUTE_TITLES = {
  "/": `${COMPANY_DISPLAY_NAME} | Technology Solutions & Training`,
  "/about": `About Us | ${COMPANY_DISPLAY_NAME}`,
  "/contact": `Contact Us | ${COMPANY_DISPLAY_NAME}`,
  "/services/development": `Technology Development Services | ${COMPANY_DISPLAY_NAME}`,
  "/services/courses": `Explore Courses | ${COMPANY_DISPLAY_NAME}`,
  "/services/courses/terms": `Course Terms & Refund Policy | ${COMPANY_DISPLAY_NAME}`,
  "/terms": `Terms & Conditions | ${COMPANY_DISPLAY_NAME}`,
  "/privacy-policy": `Privacy Policy | ${COMPANY_DISPLAY_NAME}`,
  "/services/internship": `Technology Internship | ${COMPANY_DISPLAY_NAME}`,
  "/services/career-guidance": `Career Guidance | ${COMPANY_DISPLAY_NAME}`,
  "/workshop": `Workshops & Training | ${COMPANY_DISPLAY_NAME}`,
  "/startup": `Startup Support | ${COMPANY_DISPLAY_NAME}`,
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

function App() {
  return (
    <BrowserRouter>
      <RouteTitle />
      <Navbar />

      <Routes>
        {/* MAIN PAGES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* SERVICES */}
        <Route path="/services/development" element={<Development />} />
        <Route path="/services/courses" element={<Courses />} />
        <Route path="/services/courses/:slug" element={<Courses />} />
        <Route path="/services/courses/terms" element={<CourseTerms />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/services/courses/receipt/:token" element={<CourseReceipt />} />
        <Route path="/services/internship" element={<Internship />} />
        <Route path="/services/career-guidance" element={<CareerGuidancePage />} />

        {/* OTHER PAGES */}
        <Route path="/workshop" element={<Workshop />} />
        <Route path="/startup" element={<StartupSupporter />} />
        <Route path="/join-our-team" element={<div>Join Our Team</div>} />
        <Route path="/news-insights" element={<NewsInsights />} />
        <Route path="/news-insights/:slug" element={<NewsInsights />} />
        <Route path="/news-insights/:contentType/:slug" element={<NewsInsights />} />
        <Route path="/blog" element={<Navigate replace to="/news-insights" />} />
        <Route path="/blog/:slug" element={<LegacyBlogArticle />} />
        <Route path="/newsletter/confirm" element={<NewsletterAction mode="confirm" />} />
        <Route path="/newsletter/unsubscribe/:subscriberId" element={<NewsletterAction mode="unsubscribe" />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
