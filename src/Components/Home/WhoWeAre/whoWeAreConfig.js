/* =============================================================================
   WHO WE ARE — CONFIGURATION
   -----------------------------------------------------------------------------
   WHO_WE_ARE_VIDEO_URL
   The ProJenius introduction video. Any normal YouTube link works:
   https://www.youtube.com/watch?v=…, https://youtu.be/…, or an /embed/… or
   /shorts/… link. It currently holds the video that was already on the
   previous homepage (published on the official ProJenius channel). Set it to
   "" to hide the player.

   WHO_WE_ARE_STATS
   Figures carried over unchanged from the previous homepage's Who We Are
   statistics panel. Update them here whenever the verified numbers change.
   ============================================================================= */

export const WHO_WE_ARE_VIDEO_URL = "https://www.youtube.com/watch?v=1adzVmNh078";

export const WHO_WE_ARE_VIDEO_TITLE = "ProJenius introduction video";

export const WHO_WE_ARE_STATS = [
  { value: 1000, suffix: "+", label: "Satisfied Clients" },
  { value: 30, suffix: "+", label: "Projects Delivered" },
  { value: 2, suffix: "+", label: "Years of Excellence" },
];
