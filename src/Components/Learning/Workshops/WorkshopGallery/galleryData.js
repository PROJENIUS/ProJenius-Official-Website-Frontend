/* =============================================================================
   WORKSHOP GALLERY — DATA
   -----------------------------------------------------------------------------
   PHOTOS
     The list below holds real ProJenius workshop photos already in the
     project. To add more, either:
       - drop the file into src/assets/Workshops/Gallery/ (it is picked up
         automatically; the file name becomes the caption), or
       - import it here and add { image, caption, place } to PHOTOS.
     caption  what is happening (shown on the tile and in the viewer)
     place    optional: college / city / date
     cropTop  optional: true hides the bottom of the photo on its tile (for
              example a GPS-camera stamp); the viewer still shows it whole

   VIDEOS
     Add YouTube videos as { youtubeId, caption, place }. youtubeId is the
     part after "v=" in a YouTube link (or after "youtu.be/" / "shorts/").
     The "Videos" filter appears only when at least one video is listed.
   ============================================================================= */

import groupSessionPhoto from "../../../../assets/About/Achievements/Achievements_5.webp";
import studentsSessionPhoto from "../../../../assets/About/Achievements/Achievements_3.webp";
import handsOnPhoto from "../../../../assets/About/Achievements/Achievements_4.webp";
import classroomPhoto from "../../../../assets/About/Achievements/Achievements_6.webp";
import certificatePhotoOne from "../../../../assets/About/Achievements/Achievements_1.webp";
import certificatePhotoTwo from "../../../../assets/About/Achievements/Achievements_2.webp";

const PHOTOS = [
  { image: handsOnPhoto, caption: "Students exploring a working prototype" },
  { image: classroomPhoto, caption: "Explaining concepts in the classroom" },
  { image: studentsSessionPhoto, caption: "Students during a hands-on session" },
  { image: groupSessionPhoto, caption: "Workshop group after the session", place: "Chennai", cropTop: true },
  { image: certificatePhotoOne, caption: "Certificate presentation" },
  { image: certificatePhotoTwo, caption: "Recognising participants" },
];

const VIDEOS = [
  // { youtubeId: "XXXXXXXXXXX", caption: "IoT workshop highlights", place: "College name" },
];

// Photos dropped into src/assets/Workshops/Gallery/, captioned from the file name.
const DROPPED_PHOTOS = Object.entries(
  import.meta.glob("../../../../assets/Workshops/Gallery/*.{webp,jpg,jpeg,png,avif}", {
    eager: true,
    import: "default",
  })
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, image]) => {
    const words = path.split("/").pop().replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
    return { image, caption: words.charAt(0).toUpperCase() + words.slice(1) };
  });

export const GALLERY_ITEMS = [
  ...PHOTOS.map((item) => ({ ...item, type: "photo" })),
  ...DROPPED_PHOTOS.map((item) => ({ ...item, type: "photo" })),
  ...VIDEOS.map((item) => ({
    ...item,
    type: "video",
    image: `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`,
  })),
].map((item, index) => ({ ...item, id: `wg-${index}` }));
