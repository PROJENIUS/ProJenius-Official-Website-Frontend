import { useRef } from "react";
import { useParams } from "react-router-dom";

import useScrollReveal from "../../../hooks/useScrollReveal.js";
import ArticleMetadata from "../ArticleMetadata.jsx";
import NewsList from "../NewsList.jsx";
import NewsArticle from "../NewsArticle.jsx";
import "../../../styles/pages/LearningPages.css";
import "./NewsInsightsContent.css";

/* =============================================================================
   NEWS & INSIGHTS
   /news-insights                         list (NewsList)
   /news-insights/:contentType/:slug      article (NewsArticle)
   /news-insights/:slug                   older links, read as news
   ============================================================================= */

export default function NewsInsightsContent() {
  const { slug, contentType } = useParams();
  const pageRef = useRef(null);
  useScrollReveal(pageRef);
  const type = contentType === "blog" ? "blog" : "news";

  return (
    <main ref={pageRef} className="pjl-page pjni-page">
      {slug ? (
        <NewsArticle key={`${type}/${slug}`} contentType={type} slug={slug} />
      ) : (
        <>
          <ArticleMetadata item={null} />
          <NewsList />
        </>
      )}
    </main>
  );
}
