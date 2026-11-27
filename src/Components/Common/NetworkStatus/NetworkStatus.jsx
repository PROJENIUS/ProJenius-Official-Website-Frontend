import { useEffect, useState } from "react";
import "./NetworkStatus.css";

/* Tells visitors when the connection drops and what still works, and
   registers the offline service worker in production builds. */
export default function NetworkStatus() {
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [backOnline, setBackOnline] = useState(false);

  useEffect(() => {
    const goOffline = () => { setOnline(false); setBackOnline(false); };
    const goOnline = () => { setOnline(true); setBackOnline(true); setTimeout(() => setBackOnline(false), 3000); };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    return () => { window.removeEventListener("offline", goOffline); window.removeEventListener("online", goOnline); };
  }, []);

  if (online && !backOnline) return null;
  return (
    <div className={`pj-net ${online ? "is-online" : ""}`} role="status" aria-live="polite">
      {online
        ? "You're back online."
        : "You're offline. Pages you've opened still work; forms and payments will work again when you reconnect. Nothing has been sent."}
    </div>
  );
}
