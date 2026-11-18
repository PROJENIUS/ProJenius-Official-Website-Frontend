/* Plain-text body parser (see NewsParts.jsx). */

export const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function parseBody(text = "") {
  return String(text)
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim());
      if (/^##\s+/.test(block) && lines.length === 1) {
        const textValue = block.replace(/^##\s+/, "");
        return { kind: "h2", text: textValue, id: slugify(textValue) };
      }
      if (/^###\s+/.test(block) && lines.length === 1) return { kind: "h3", text: block.replace(/^###\s+/, "") };
      if (/^##\s+/.test(lines[0])) {
        const textValue = lines[0].replace(/^##\s+/, "");
        return [{ kind: "h2", text: textValue, id: slugify(textValue) }, { kind: "p", text: lines.slice(1).join("\n") }];
      }
      if (lines.every((l) => /^[-*]\s+/.test(l))) return { kind: "ul", items: lines.map((l) => l.replace(/^[-*]\s+/, "")) };
      if (lines.every((l) => /^\d+[.)]\s+/.test(l))) return { kind: "ol", items: lines.map((l) => l.replace(/^\d+[.)]\s+/, "")) };
      if (lines.every((l) => /^>\s?/.test(l))) return { kind: "quote", text: lines.map((l) => l.replace(/^>\s?/, "")).join(" ") };
      return { kind: "p", text: block };
    })
    .flat();
}

