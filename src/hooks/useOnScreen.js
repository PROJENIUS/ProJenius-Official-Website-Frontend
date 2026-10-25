import { useEffect, useState } from "react";

/* True while the referenced element intersects the viewport. Used to pause
   timers and scroll work for sections the visitor cannot see. Without
   IntersectionObserver support it reports true (work runs as before). */
export default function useOnScreen(ref, rootMargin = "0px") {
  const [isOnScreen, setIsOnScreen] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting), { rootMargin });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return isOnScreen;
}
