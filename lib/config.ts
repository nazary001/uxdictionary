export const SITE_NAME = "UX Dictionary";
export const SITE_TAGLINE = "Design, decoded.";
export const SITE_DESCRIPTION =
  "UX Dictionary is a design publication and living glossary — essays, patterns and clear definitions on UX, UI, research and design systems for people who craft digital products.";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://uxdictionary.io"
).replace(/\/+$/, "");

export interface CategoryDef {
  slug: string;
  name: string;
  blurb: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "ux-design",
    name: "UX Design",
    blurb:
      "Flows, usability, information architecture and the craft of making products easy to use.",
  },
  {
    slug: "ui-visual",
    name: "UI & Visual",
    blurb:
      "Layout, color, typography and components — the visual language of interfaces.",
  },
  {
    slug: "research",
    name: "UX Research",
    blurb:
      "User research, usability testing, personas and turning insight into better design.",
  },
  {
    slug: "design-systems",
    name: "Design Systems",
    blurb:
      "Tokens, components, documentation and scaling design across a product.",
  },
  {
    slug: "craft-career",
    name: "Craft & Career",
    blurb:
      "Process, collaboration, portfolios and growing as a designer.",
  },
];

export function getCategory(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryIndex(slug: string): string {
  const i = CATEGORIES.findIndex((c) => c.slug === slug);
  return String(i + 1).padStart(2, "0");
}
