import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("public course cards and purchase details show Premium only for an explicitly eligible course", async () => {
  const component = await readFile(new URL("../src/Components/Courses/ExploreOurCourses/ExploreOurCourses.jsx", import.meta.url), "utf8");
  const styles = await readFile(new URL("../src/Components/Courses/ExploreOurCourses/ExploreOurCourses.css", import.meta.url), "utf8");
  assert.match(component, /item\.premiumEligible === true && <span className="course-premium-badge">Premium eligible<\/span>/);
  assert.match(component, /course\.premiumEligible === true && <p className="course-premium-detail">Premium eligible<\/p>/);
  assert.match(styles, /\.course-premium-badge/);
  assert.match(styles, /\.course-premium-detail/);
});
