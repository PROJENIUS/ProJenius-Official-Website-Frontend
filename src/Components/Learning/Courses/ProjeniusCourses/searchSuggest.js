/* "Did you mean…?" for the course search: closest word from course titles,
   categories and skills, by edit distance. */
function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const temp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = temp;
    }
  }
  return row[b.length];
}

export function suggestSearch(query, courses) {
  const words = String(query || "").toLowerCase().split(/\s+/).filter((w) => w.length >= 3);
  if (!words.length) return "";
  const vocabulary = new Set();
  for (const c of courses || []) {
    for (const text of [c.title, c.category, ...(c.skills || [])]) {
      String(text || "").toLowerCase().split(/[^a-z0-9+#]+/).filter((w) => w.length >= 3).forEach((w) => vocabulary.add(w));
    }
  }
  let changed = false;
  const fixed = words.map((word) => {
    if (vocabulary.has(word)) return word;
    let best = word, bestScore = Infinity;
    for (const v of vocabulary) {
      const d = distance(word, v);
      if (d < bestScore && d <= Math.max(1, Math.floor(word.length / 3))) { best = v; bestScore = d; }
    }
    if (best !== word) changed = true;
    return best;
  });
  return changed ? fixed.join(" ") : "";
}
