import { useRef } from "react";
import { useParams } from "react-router-dom";

import ExploreOurCourses from "../../../Components/Learning/Courses/ExploreOurCourses/ExploreOurCourses.jsx";
import useScrollReveal from "../../../hooks/useScrollReveal.js";
import useMetaDescription from "../../../hooks/useMetaDescription.js";
import "../../../styles/pages/LearningPages.css";

/* /services/courses (hero → catalogue → doubts → reviews) and
   /services/courses/:slug (course detail). */
export default function Courses() {
  const { slug } = useParams();
  const pageRef = useRef(null);
  useMetaDescription(slug ? undefined : "Explore hands-on technology courses from ProJenius in Madurai, including software development, AI, data science and practical project training.");
  useScrollReveal(pageRef);
  return (
    <main ref={pageRef} className={slug ? "pjcd-main" : "pjl-page pjl-courses"}>
      <ExploreOurCourses />
    </main>
  );
}
