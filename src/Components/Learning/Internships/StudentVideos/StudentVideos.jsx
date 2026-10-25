import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Video } from "lucide-react";

import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";
import "./StudentVideos.css";

/* =========================================================
   STUDENT STORIES — student video testimonials.
   -----------------------------------------------------------
   HOW TO ADD A VIDEO
   Upload the video to YouTube (a normal video or a Short),
   then fill one entry below:
     youtubeId  the id from the link, e.g. for
                https://youtu.be/AbC123xyz or
                https://www.youtube.com/shorts/AbC123xyz
                the id is "AbC123xyz"
     name       the student's name
     detail     college, track or batch (one short line)
   An entry with an empty youtubeId shows a "Video coming
   soon" card. Each card shows the YouTube thumbnail and only
   loads the player when it is clicked, so the page stays fast.
========================================================= */

const STUDENT_VIDEOS = [
    { youtubeId: "", name: "Student name", detail: "Internship track" },
    { youtubeId: "", name: "Student name", detail: "Internship track" },
    { youtubeId: "", name: "Student name", detail: "Internship track" },
    { youtubeId: "", name: "Student name", detail: "Internship track" },
];

function VideoCard({ video, index }) {
    const [playing, setPlaying] = useState(false);

    if (!video.youtubeId) {
        return (
            <li className="pj-student-videos__card pj-student-videos__card--soon">
                <div className="pj-student-videos__frame">
                    <span className="pj-student-videos__soon-icon" aria-hidden="true">
                        <Video size={30} strokeWidth={1.6} />
                    </span>
                    <span className="pj-student-videos__soon-text">Video coming soon</span>
                </div>
                <p className="pj-student-videos__caption">
                    <span>Story {String(index + 1).padStart(2, "0")}</span>
                </p>
            </li>
        );
    }

    return (
        <li className="pj-student-videos__card">
            <div className="pj-student-videos__frame">
                {playing ? (
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                        title={`${video.name}, ${video.detail}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                ) : (
                    <button type="button" className="pj-student-videos__play" onClick={() => setPlaying(true)}>
                        <img
                            src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
                            alt=""
                            loading="lazy"
                            decoding="async"
                        />
                        <span className="pj-student-videos__play-icon" aria-hidden="true">
                            <Play size={26} fill="currentColor" strokeWidth={0} />
                        </span>
                        <span className="pjds-sr-only">Play video: {video.name}, {video.detail}</span>
                    </button>
                )}
            </div>
            <p className="pj-student-videos__caption">
                <strong>{video.name}</strong>
                <span>{video.detail}</span>
            </p>
        </li>
    );
}

const StudentVideos = () => {
    const trackRef = useRef(null);

    const scrollByCard = (direction) => {
        const track = trackRef.current;
        if (!track) return;
        const card = track.querySelector(".pj-student-videos__card");
        const step = card ? card.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
        track.scrollBy({ left: direction * step, behavior: "smooth" });
    };

    return (
        <section id="student-stories" className="pj-student-videos" aria-labelledby="pj-student-videos-title">
            <div className="pj-student-videos__container">
                <header className="pj-student-videos__header">
                    <div>
                        <p className="pjds-eyebrow pjds-eyebrow--on-dark" data-reveal="up">Student Stories</p>
                        <h2 id="pj-student-videos-title" data-reveal="up" data-reveal-delay="1">
                            <span className="pj-student-videos__title-static">Hear It From</span>
                            <TypedPhrase tone="dark" phrases={["Our Interns", "Our Students", "Real Learners"]} />
                        </h2>
                        <p className="pj-student-videos__intro" data-reveal="up" data-reveal-delay="2">
                            Students share what they built, what they learned and where it took them.
                        </p>
                    </div>
                    <div className="pj-student-videos__controls" data-reveal="up" data-reveal-delay="2">
                        <button type="button" onClick={() => scrollByCard(-1)} aria-label="Previous videos">
                            <ChevronLeft size={22} aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => scrollByCard(1)} aria-label="Next videos">
                            <ChevronRight size={22} aria-hidden="true" />
                        </button>
                    </div>
                </header>

                <ul ref={trackRef} className="pj-student-videos__track" data-reveal="up" data-reveal-delay="3">
                    {STUDENT_VIDEOS.map((video, index) => (
                        <VideoCard key={video.youtubeId || `soon-${index}`} video={video} index={index} />
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default StudentVideos;
