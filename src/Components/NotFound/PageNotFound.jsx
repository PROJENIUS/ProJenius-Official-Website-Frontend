import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "./PageNotFound.css";

export default function PageNotFound() {
  return (
    <section className="pj-not-found" aria-labelledby="pj-not-found-title">
      <div className="pj-not-found__content">
        <p className="pj-not-found__eyebrow">404 · PAGE NOT FOUND</p>
        <h1 id="pj-not-found-title">This page isn’t here.</h1>
        <p className="pj-not-found__description">
          The address may have changed, or the link may be incomplete. Head back to the homepage or contact our team for help.
        </p>
        <div className="pj-not-found__actions">
          <Link className="pj-not-found__button pj-not-found__button--primary" to="/">
            <ArrowLeft size={17} aria-hidden="true" /> Go to homepage
          </Link>
          <Link className="pj-not-found__button pj-not-found__button--secondary" to="/contact">
            Contact ProJenius <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
