import "./TechnologiesCovered.css";

import htmlLogo from "../../../assets/Internship/Technologies/html.svg";
import cssLogo from "../../../assets/Internship/Technologies/css.svg";
import javascriptLogo from "../../../assets/Internship/Technologies/javascript.svg";
import reactLogo from "../../../assets/Internship/Technologies/react.svg";
import nodeLogo from "../../../assets/Internship/Technologies/node.svg";
import expressLogo from "../../../assets/Internship/Technologies/express.svg";
import mongodbLogo from "../../../assets/Internship/Technologies/mongodb.svg";
import pythonLogo from "../../../assets/Internship/Technologies/python.svg";
import githubLogo from "../../../assets/Internship/Technologies/github.svg";
import postmanLogo from "../../../assets/Internship/Technologies/postman.svg";

/* =========================================================
   TECHNOLOGIES COVERED
   Internship technology carousel data
========================================================= */

const technologies = [
  {
    name: "HTML",
    logo: htmlLogo,
  },
  {
    name: "CSS",
    logo: cssLogo,
  },
  {
    name: "JavaScript",
    logo: javascriptLogo,
  },
  {
    name: "React JS",
    logo: reactLogo,
  },
  {
    name: "Node.js",
    logo: nodeLogo,
  },
  {
    name: "Express.js",
    logo: expressLogo,
  },
  {
    name: "MongoDB",
    logo: mongodbLogo,
  },
  {
    name: "Python",
    logo: pythonLogo,
  },
  {
    name: "GitHub",
    logo: githubLogo,
  },
  {
    name: "Postman",
    logo: postmanLogo,
  },
];

/* =========================================================
   TECHNOLOGIES COVERED COMPONENT
========================================================= */

const TechnologiesCovered = () => {
  return (
    <section
      className="pj-internship-tech"
      aria-labelledby="pj-internship-tech-title"
    >
      {/* =====================================================
          SECTION HEADER
      ===================================================== */}
      <div className="pj-internship-tech__container">
        <div className="pj-internship-tech__heading">
          <span className="pj-internship-tech__badge">
            TECHNOLOGIES COVERED
          </span>

          <h2
            id="pj-internship-tech-title"
            className="pj-internship-tech__title"
          >
            Tools Used in{" "}
            <span className="pj-internship-tech__title-highlight">
              Real Development
            </span>
          </h2>

          <div
            className="pj-internship-tech__line"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* =====================================================
          TECHNOLOGY CAROUSEL
      ===================================================== */}
      <div
        className="pj-internship-tech__carousel"
        aria-label="Technologies covered during the internship"
      >
        <div className="pj-internship-tech__track">
          {/* PRIMARY TECHNOLOGY LIST */}
          <ul className="pj-internship-tech__list">
            {technologies.map((technology) => (
              <li
                className="pj-internship-tech__card"
                key={technology.name}
              >
                <img
                  src={technology.logo}
                  alt=""
                  className="pj-internship-tech__logo"
                  aria-hidden="true"
                />

                <span className="pj-internship-tech__name">
                  {technology.name}
                </span>
              </li>
            ))}
          </ul>

          {/* =================================================
              DUPLICATE LIST
              Used only for the seamless infinite animation.
          ================================================= */}
          <ul
            className="pj-internship-tech__list"
            aria-hidden="true"
          >
            {technologies.map((technology) => (
              <li
                className="pj-internship-tech__card"
                key={`duplicate-${technology.name}`}
              >
                <img
                  src={technology.logo}
                  alt=""
                  className="pj-internship-tech__logo"
                  aria-hidden="true"
                />

                <span className="pj-internship-tech__name">
                  {technology.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TechnologiesCovered;