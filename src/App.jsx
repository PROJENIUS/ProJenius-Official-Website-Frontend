import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

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

function LegacyBlogArticle() {
  const { slug } = useParams();
  return <Navigate replace to={`/news-insights/blog/${encodeURIComponent(slug || "")}`} />;
}

function App() {
  return (
    <BrowserRouter>
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
