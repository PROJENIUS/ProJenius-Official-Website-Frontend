import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("course reviews and ratings are based on published review data", async () => {
  const detail = await readFile(new URL("../src/Components/Learning/Courses/CourseDetail/CourseDetail.jsx", import.meta.url), "utf8");
  const catalog = await readFile(new URL("../src/Components/Learning/Courses/CourseCatalog/CourseCatalog.jsx", import.meta.url), "utf8");
  assert.match(detail, /const ratingCount = reviews\.length/);
  assert.match(detail, /ratingAverage != null && ratingCount > 0/);
  assert.match(catalog, /item\.rating != null && item\.reviewCount > 0/);
  assert.doesNotMatch(detail + catalog, /2,310 reviews|12,480 already enrolled|4\.8/);
});

test("course descriptions are rendered through the safe rich-text allow-list", async () => {
  const detail = await readFile(new URL("../src/Components/Learning/Courses/CourseDetail/CourseDetail.jsx", import.meta.url), "utf8");
  assert.match(detail, /function renderSafeCourseHtml\(html\)/);
  assert.match(detail, /const RICH_TEXT_TAGS = new Set/);
  assert.match(detail, /RICH_TEXT_DROP_TAGS\.has\(tag\)/);
  assert.doesNotMatch(detail, /dangerouslySetInnerHTML/);
});
