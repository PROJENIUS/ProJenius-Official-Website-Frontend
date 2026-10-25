import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("general legal routes use separate pages and preserve course terms", async () => {
  const app = await readSource("../src/App.jsx");

  assert.match(app, /path="\/terms" element=\{<TermsAndConditionsPage \/>\}/);
  assert.match(app, /path="\/privacy-policy" element=\{<PrivacyPolicyPage \/>\}/);
  assert.match(app, /path="\/services\/courses\/terms" element=\{<CourseTermsPage \/>\}/);
  assert.match(app, /"\/terms": `Terms & Conditions/);
  assert.match(app, /"\/privacy-policy": `Privacy Policy/);
});

test("legal routes share a layout and fetch document content", async () => {
  const [terms, privacy, layout, sidebar, view, api] = await Promise.all([
    readSource("../src/Pages/Legal/TermsAndConditionsPage.jsx"),
    readSource("../src/Pages/Legal/PrivacyPolicyPage.jsx"),
    readSource("../src/Components/Legal/LegalLayout/LegalLayout.jsx"),
    readSource("../src/Components/Legal/LegalSidebar/LegalSidebar.jsx"),
    readSource("../src/Components/Legal/LegalDocumentView/LegalDocumentView.jsx"),
    readSource("../src/utils/legalDocuments.js"),
  ]);

  assert.match(terms, /<LegalDocumentView documentKey="terms" \/>/);
  assert.match(privacy, /<LegalDocumentView documentKey="privacy-policy" \/>/);
  assert.doesNotMatch(terms + privacy, /LAST_UPDATED|Terms describe|This Privacy Policy explains/);
  assert.match(layout, /<LegalSidebar \/>/);
  assert.match(sidebar, /to: "\/terms"/);
  assert.match(sidebar, /to: "\/privacy-policy"/);
  assert.match(sidebar, /Terms &amp; Policies/);
  assert.match(sidebar, /aria-expanded=\{mobileOpen\}/);
  assert.match(sidebar, /isActive/);
  assert.match(view, /fetchLegalDocument\(documentKey/);
  assert.match(view, /role="status"/);
  assert.match(view, /role="alert"/);
  assert.doesNotMatch(view, /dangerouslySetInnerHTML/);
  assert.match(api, /\/api\/legal\//);
  assert.match(api, /Cache-Control|cache: "no-store"/);
});

test("legal layout clears the fixed navbar and styles adapt to narrow screens", async () => {
  const [layout, sidebar, content] = await Promise.all([
    readSource("../src/Components/Legal/LegalLayout/LegalLayout.css"),
    readSource("../src/Components/Legal/LegalSidebar/LegalSidebar.css"),
    readSource("../src/Components/Legal/LegalDocumentView/LegalDocumentView.css"),
  ]);

  assert.match(layout, /grid-template-columns:[^;]*minmax\(0, 1fr\)/);
  assert.match(layout, /padding-top: 104px/);
  assert.match(layout, /padding-top: 70px/);
  assert.match(layout, /@media \(max-width: 760px\)/);
  assert.match(sidebar, /@media \(max-width: 760px\)/);
  assert.match(content, /overflow-wrap: anywhere/);

  const coursePage = await readSource("../src/Pages/Legal/CourseTermsPage.jsx");
  assert.match(coursePage, /<CourseTermsContent \/>/);
  assert.doesNotMatch(coursePage, /fetch\(|useEffect|course-terms-page/);

  const publicApi = await readSource("../src/utils/legalDocuments.js");
  assert.match(publicApi, /key === "course-terms"[\s\S]*?"\/api\/courses\/terms"/);
});
