import { useRef } from "react";
import { useParams } from "react-router-dom";

import ExploreOurCourses from "../../../Components/Learning/Courses/ExploreOurCourses/ExploreOurCourses.jsx";
import useScrollReveal from "../../../hooks/useScrollReveal.js";
import "../../../styles/pages/LearningPages.css";

/* /services/courses (hero → catalogue → doubts → reviews) and
   /services/courses/:slug (course detail). */
export default function Courses() {
  const { slug } = useParams();
  const pageRef = useRef(null);
  useScrollReveal(pageRef);
  return (
    <main ref={pageRef} className={slug ? "pjcd-main" : "pjl-page pjl-courses"}>
      <ExploreOurCourses />
    </main>
  );
}
