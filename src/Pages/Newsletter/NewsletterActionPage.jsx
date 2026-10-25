import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API = (configuredApiBaseUrl || (import.meta.env.DEV ? "http://localhost:5000" : "")).replace(/\/+$/, "");
const confirmationRequests = new Map();

function confirmOnce(token) {
  if (!confirmationRequests.has(token)) {
    const request = fetch(`${API}/api/newsletter/confirm`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || "Could not confirm this subscription.");
        return body;
      });
    confirmationRequests.set(token, request);
    request.finally(() => setTimeout(() => confirmationRequests.delete(token), 1000)).catch(() => {});
  }
  return confirmationRequests.get(token);
}

export default function NewsletterAction({ mode }) {
  const location = useLocation(); const { subscriberId } = useParams(); const [state, setState] = useState("loading"); const [message, setMessage] = useState("Processing your request…");
  useEffect(() => {
    let active = true;
    const token = new URLSearchParams(location.search).get("token");
    if (!API || !token) {
      Promise.resolve().then(() => { if (active) { setState("error"); setMessage("This link is invalid or expired."); } });
      return () => { active = false; };
    }
    if (mode === "confirm") {
      confirmOnce(token).then((body) => { if (active) { setState("done"); setMessage(body.message); } }).catch((error) => { if (active) { setState("error"); setMessage(error.message); } });
    } else {
      Promise.resolve().then(() => { if (active) { setState("ready"); setMessage("Confirm that you want to stop receiving ProJenius newsletter emails."); } });
    }
    return () => { active = false; };
  }, [location.search, mode]);
  async function unsubscribe() { setState("loading"); try { const token = new URLSearchParams(location.search).get("token"); const response = await fetch(`${API}/api/newsletter/unsubscribe`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscriberId, token }) }); const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.error || "Could not unsubscribe."); setState("done"); setMessage(body.message); } catch (error) { setState("error"); setMessage(error.message); } }
  return <main className="pj-publishing"><div className="pj-publishing__wrap pj-publishing__action"><h1>{mode === "confirm" ? "Confirm your subscription" : "Newsletter preferences"}</h1><p role={state === "error" ? "alert" : "status"}>{message}</p>{mode === "unsubscribe" && state === "ready" && <button type="button" onClick={unsubscribe}>Unsubscribe</button>}</div></main>;
}
