import CoursesHero from "../../../Components/Learning/Courses/CoursesHero/CoursesHero.jsx";
import ExploreOurCourses from "../../../Components/Learning/Courses/ExploreOurCourses/ExploreOurCourses.jsx";
import { useParams } from "react-router-dom";


export default function Courses() {
  const { slug } = useParams();
  return (
    <>
      {!slug && <CoursesHero />}
      <ExploreOurCourses />
    </>
  );
}
