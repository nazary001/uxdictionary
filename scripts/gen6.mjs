/**
 * Generates UX/UI design articles for UX Dictionary via the Gemini API and writes
 * scripts/articles.json in the shape seed6.mjs consumes.
 *
 * Run:  GEMINI_API_KEY=... node scripts/gen6.mjs
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const KEY = process.env.GEMINI_API_KEY ?? "";
if (!KEY) { console.error("GEMINI_API_KEY not set"); process.exit(1); }
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;

const TOPICS = [
  { slug: "what-is-ux-design", category: "ux-design", imageQuery: "ux design wireframe", topic: "What Is UX Design? A Clear Definition and Why It Matters" },
  { slug: "information-architecture-basics", category: "ux-design", imageQuery: "user flow diagram", topic: "Information Architecture Basics: Structuring Content People Can Find" },
  { slug: "visual-hierarchy-in-ui", category: "ui-visual", imageQuery: "ui design screen", topic: "Visual Hierarchy in UI: Guiding the Eye Through an Interface" },
  { slug: "color-and-contrast-in-interfaces", category: "ui-visual", imageQuery: "color palette design", topic: "Color and Contrast in Interfaces: A Practical, Accessible Guide" },
  { slug: "how-to-run-a-usability-test", category: "research", imageQuery: "usability testing lab", topic: "How to Run a Usability Test Without a Lab or a Big Budget" },
  { slug: "personas-that-actually-help", category: "research", imageQuery: "persona board", topic: "Personas That Actually Help: Turning Research Into Design Decisions" },
  { slug: "what-are-design-tokens", category: "design-systems", imageQuery: "figma design tokens", topic: "What Are Design Tokens? The Building Blocks of a Design System" },
  { slug: "documenting-a-component-library", category: "design-systems", imageQuery: "design system components", topic: "Documenting a Component Library So People Actually Use It" },
  { slug: "building-a-ux-portfolio", category: "craft-career", imageQuery: "designer portfolio", topic: "Building a UX Portfolio: Showing Process, Not Just Pretty Screens" },
  { slug: "design-critique-that-works", category: "craft-career", imageQuery: "design team collaboration", topic: "Design Critique That Works: Better Feedback, Better Products" },
];

const schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["h2", "p", "ul"] },
          text: { type: "string" },
          items: { type: "array", items: { type: "string" } },
        },
        required: ["type"],
      },
    },
  },
  required: ["title", "description", "tags", "sections"],
};

function prompt(t) {
  return `You are writing for UX Dictionary, an independent UX/UI design publication (topics: UX design, UI & visual design, UX research, design systems, design craft & career).
Write a thorough, accurate, plain-language article for the "${t.category}" category on the topic: "${t.topic}".
Audience: designers and product people — practitioners who want clear, useful guidance, not fluff.

Requirements:
- 700-1000 words total.
- Begin with 1-2 intro paragraphs (type "p") BEFORE any heading.
- Then 4-6 "h2" sections, each followed by 1-3 "p" paragraphs.
- Include at least one "ul" bulleted list with 3-6 concrete items.
- Neutral, factual, evergreen. Do NOT invent specific tool prices, brand claims presented as fact, or made-up statistics. Speak in ranges and general guidance.
- A "title" (you may refine the topic into a clean headline).
- A "description": a compelling meta description, ~150 characters, no clickbait.
- "tags": 4-6 short lowercase tags.
- "sections": ordered array. type "h2"=heading (use "text"), "p"=paragraph (use "text"), "ul"=bullet list (use "items").
Return ONLY JSON matching the schema.`;
}

async function generate(t) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt(t) }] }],
      generationConfig: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.7 },
    }),
    signal: AbortSignal.timeout(120000),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(body?.error ?? body)?.slice(0, 200)}`);
  const text = body?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("empty response");
  const a = JSON.parse(text);
  // basic shape guard
  if (!a.title || !Array.isArray(a.sections) || a.sections.length < 3) throw new Error("malformed article");
  return a;
}

async function main() {
  const out = [];
  for (const t of TOPICS) {
    process.stdout.write(`Generating "${t.slug}" ... `);
    try {
      const a = await generate(t);
      out.push({
        article: { title: a.title, slug: t.slug, description: a.description, tags: a.tags ?? [], sections: a.sections },
        category: t.category,
        imageQuery: t.imageQuery,
      });
      const words = a.sections.filter((s) => s.text).reduce((n, s) => n + s.text.split(/\s+/).length, 0);
      console.log(`ok (${a.sections.length} sections, ~${words} words)`);
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
    }
  }
  const path = resolve(import.meta.dirname, "articles.json");
  writeFileSync(path, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${out.length}/${TOPICS.length} articles to ${path}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
