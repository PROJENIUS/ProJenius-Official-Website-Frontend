import { useEffect, useState } from "react";
import { Wifi, WifiOff, X } from "lucide-react";
import "./NetworkStatus.css";

/* Tells visitors when the connection drops and what still works, and
   registers the offline service worker in production builds. Shown as a
   small pill at the bottom of the screen, so it never covers the menu.
   The offline note can be closed; it comes back if the connection drops
   again. */
export default function NetworkStatus() {
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [backOnline, setBackOnline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let timer;
    const goOffline = () => { setOnline(false); setBackOnline(false); setDismissed(false); };
    const goOnline = () => { setOnline(true); setBackOnline(true); window.clearTimeout(timer); timer = window.setTimeout(() => setBackOnline(false), 3000); };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    return () => { window.clearTimeout(timer); window.removeEventListener("offline", goOffline); window.removeEventListener("online", goOnline); };
  }, []);

  if ((online && !backOnline) || (!online && dismissed)) return null;
  return (
    <div className={`pj-net${online ? " is-online" : ""}`} role="status" aria-live="polite">
      <span className="pj-net__icon" aria-hidden="true">{online ? <Wifi size={17} /> : <WifiOff size={17} />}</span>
      <span className="pj-net__text">
        {online ? (
          <strong>You're back online.</strong>
        ) : (
          <>
            <strong>You're offline.</strong> Pages you've opened still work; forms will send once you reconnect.
          </>
        )}
      </span>
      {!online && (
        <button type="button" className="pj-net__close" onClick={() => setDismissed(true)} aria-label="Hide this message">
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
