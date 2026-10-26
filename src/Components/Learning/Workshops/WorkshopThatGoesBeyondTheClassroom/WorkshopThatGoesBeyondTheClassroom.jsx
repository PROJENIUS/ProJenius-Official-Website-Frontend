import { Link } from "react-router-dom";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import HeroBackdrop from "../../../Common/HeroPhotoStack/HeroBackdrop.jsx";
import HeroPhotoStack from "../../../Common/HeroPhotoStack/HeroPhotoStack.jsx";
import { heroPhotos } from "../../../Common/HeroPhotoStack/heroPhotos.js";
import sessionPhoto from "../../../../assets/About/Achievements/Achievements_3.webp";
import prototypePhoto from "../../../../assets/About/Achievements/Achievements_4.webp";
import classroomPhoto from "../../../../assets/About/Achievements/Achievements_6.webp";
import certificatePhoto from "../../../../assets/About/Achievements/Achievements_1.webp";
import "./WorkshopThatGoesBeyondTheClassroom.css";

/* =========================================================
   WORKSHOP HERO
   Left: pill, typed heading, intro, actions, audience notes.
   Right: the shared rotating photo stack; a session photo is
   faded behind the navy. Photos: src/assets/Heroes/workshop/
   (see its README); the real photos below are used until
   photos are added there.
========================================================= */

const HERO_PHRASES = ["Beyond the Classroom", "Into Real Projects", "Into Hands-On Labs"];

const HERO = heroPhotos("workshop", {
  backdrop: sessionPhoto,
  cards: [
    { image: prototypePhoto, category: "Hands-On", title: "Students exploring a working prototype" },
    { image: sessionPhoto, category: "Workshop", title: "A hands-on session in progress" },
    { image: classroomPhoto, category: "Classroom", title: "Explaining concepts in the classroom" },
    { image: certificatePhoto, category: "Recognition", title: "Certificate presentation" },
  ],
});

export default function WorkshopHero() {
  return (
    <section className="wh-hero">
      <HeroBackdrop image={HERO.backdrop} />
      <div className="wh-container">
        {/* LEFT */}
        <div className="wh-left">
          <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Workshops &amp; Training</p>
          <h1 className="wh-title" data-reveal="up" data-reveal-delay="1">
            <span className="wh-title-static">Workshops That Go</span>
            <TypedPhrase tone="dark" phrases={HERO_PHRASES} />
          </h1>
          <p className="wh-desc" data-reveal="up" data-reveal-delay="2">
            Hands-on technology workshops designed to help students explore,
            experiment, build, and experience emerging technologies through
            practical learning.
          </p>

          {/* Both buttons used to be <button>s with no action. */}
          <div className="wh-actions" data-reveal="up" data-reveal-delay="3">
            <a href="#workshop-areas" className="wh-btn wh-btn-primary">
              Explore Workshops
            </a>
            <Link to="/contact?type=workshop" className="wh-btn wh-btn-outline">
              Host a Workshop
            </Link>
          </div>

          <div className="wh-audience" data-reveal="up" data-reveal-delay="4">
            <div>
              <p className="wh-audience-title">For students</p>
              <p>Learn a technology, then build something with it.</p>
            </div>
            <div>
              <p className="wh-audience-title">For institutions</p>
              <p>A practical technology session designed around your students.</p>
            </div>
          </div>
        </div>

        {/* RIGHT: rotating photos from real workshops */}
        <div className="wh-right" data-reveal="right" data-reveal-delay="2">
          <HeroPhotoStack
            items={HERO.cards}
            label="Photos from ProJenius workshops"
            badge={{ title: "Hands-on, every time", text: "Workshops by ProJenius" }}
          />
        </div>
      </div>
    </section>
  );
}