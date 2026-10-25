/* =========================================================
   HOME V2 — DESIGN PREVIEW (/preview/home-v2)
   A proposed new homepage in the "ProJenius Lab" design system.
   Not linked from the navigation and marked noindex; the live
   homepage is unchanged until this design is approved.
========================================================= */

import { useEffect, useRef } from "react";

import V2Hero from "../../Components/HomeV2/V2Hero/V2Hero.jsx";
import V2Marquee from "../../Components/HomeV2/V2Marquee/V2Marquee.jsx";
import V2Divisions from "../../Components/HomeV2/V2Divisions/V2Divisions.jsx";
import V2Proof from "../../Components/HomeV2/V2Proof/V2Proof.jsx";
import V2Work from "../../Components/HomeV2/V2Work/V2Work.jsx";
import V2Process from "../../Components/HomeV2/V2Process/V2Process.jsx";
import V2Contact from "../../Components/HomeV2/V2Contact/V2Contact.jsx";
import useScrollReveal from "../../hooks/useScrollReveal.js";
import "../../styles/pages/HomeV2Page.css";

/* Keep the preview out of search results. */
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);
}

export default function HomeV2Page() {
  const pageRef = useRef(null);
  useNoIndex();
  useScrollReveal(pageRef);

  return (
    <main ref={pageRef} className="pjv2">
      <V2Hero />
      <V2Marquee />
      <V2Divisions />
      <V2Proof />
      <V2Work />
      <V2Process />
      <V2Contact />
    </main>
  );
}
