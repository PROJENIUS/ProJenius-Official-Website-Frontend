import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { normalizeApiBase, resolveApiUrl } from "../src/utils/apiUrl.js";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("News & Insights routes compose the current list and article modules", async () => {
  const [app, page, content, list, article] = await Promise.all([
    readSource("../src/App.jsx"),
    readSource("../src/Pages/NewsInsights/NewsInsightsPage.jsx"),
    readSource("../src/Components/NewsInsights/NewsInsightsContent/NewsInsightsContent.jsx"),
    readSource("../src/Components/NewsInsights/NewsList.jsx"),
    readSource("../src/Components/NewsInsights/NewsArticle.jsx"),
  ]);
  assert.match(app, /path="\/news-insights" element=\{<NewsInsightsPage \/>\}/);
  assert.match(page, /<NewsInsightsContent \/>/);
  assert.match(content, /<NewsList \/>/);
  assert.match(content, /<NewsArticle key=/);
  assert.match(list, /getJson\("\/api\/news\/categories"\)/);
  assert.match(list, /getJson\(`\/api\/news/);
  assert.match(article, /encodeURIComponent\(slug\)/);
});

test("article metadata sets canonical and social metadata for article routes", async () => {
  const metadata = await readSource("../src/Components/NewsInsights/ArticleMetadata.jsx");
  assert.match(metadata, /meta\[property="og:title"\]/);
  assert.match(metadata, /meta\[property="og:description"\]/);
  assert.match(metadata, /meta\[property="og:url"\]/);
  assert.match(metadata, /meta\[property="og:image"\]/);
  assert.match(metadata, /link\[rel="canonical"\]/);
});

test("public API URL resolution avoids duplicated prefixes and production localhost", () => {
  const base = normalizeApiBase("https://api.projenius.in/api/", false);
  assert.equal(base, "https://api.projenius.in");
  assert.equal(resolveApiUrl("/api/news/assets/image.jpg", base), "https://api.projenius.in/api/news/assets/image.jpg");
  assert.equal(normalizeApiBase("http://localhost:5000", false), "");
  assert.doesNotMatch(resolveApiUrl("http://localhost:5000/api/news/image.jpg", "", "https://projenius.in"), /localhost/i);
});

test("article embeds use privacy-enhanced YouTube and sandboxed external video providers", async () => {
  const article = await readSource("../src/Components/NewsInsights/NewsArticle.jsx");
  assert.match(article, /youtube-nocookie\.com\/embed/);
  assert.match(article, /player\.vimeo\.com\/video/);
  assert.match(article, /loading="lazy"/);
});
