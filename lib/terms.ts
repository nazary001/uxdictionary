import termsData from "@/data/terms.json";

export type Related = { slug: string; title: string };

export type Term = {
  slug: string;
  term: string;
  metaTitle: string;
  description: string;
  author: string;
  updated: string;
  intro: string;
  bodyHtml: string;
  related: Related[];
  contributor: string;
};

const terms = termsData as Term[];

/** All glossary terms, sorted alphabetically by display name. */
export function getAllTerms(): Term[] {
  return [...terms].sort((a, b) => a.term.localeCompare(b.term));
}

export function getTerm(slug: string): Term | undefined {
  return terms.find((t) => t.slug === slug);
}

/** Lightweight shape for the homepage search/list (no heavy bodyHtml). */
export function getTermsForList(): { slug: string; term: string; intro: string }[] {
  return getAllTerms().map((t) => ({ slug: t.slug, term: t.term, intro: t.intro }));
}
