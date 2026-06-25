import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/config";
import { getAllTerms, type Term } from "@/lib/terms";

export const metadata: Metadata = {
  title: "UX Glossary",
  description:
    "A living glossary of UX, UI, research and design-systems terms — clear, jargon-free definitions for people who craft digital products.",
  alternates: { canonical: `${SITE_URL}/glossary` },
  openGraph: {
    type: "website",
    title: "UX Glossary",
    description:
      "A living glossary of UX, UI, research and design-systems terms — clear, jargon-free definitions for people who craft digital products.",
    url: `${SITE_URL}/glossary`,
  },
};

function groupByLetter(terms: Term[]): { letter: string; items: Term[] }[] {
  const groups = new Map<string, Term[]>();
  for (const t of terms) {
    const first = t.term.trim().charAt(0).toUpperCase();
    const letter = /[A-Z]/.test(first) ? first : "#";
    const bucket = groups.get(letter);
    if (bucket) bucket.push(t);
    else groups.set(letter, [t]);
  }
  return [...groups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([letter, items]) => ({ letter, items }));
}

export default function GlossaryPage() {
  const terms = getAllTerms();
  const groups = groupByLetter(terms);
  const letters = groups.map((g) => g.letter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="reveal max-w-2xl">
        <p className="tag-cap">Glossary</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          The UX Dictionary glossary
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-moss">
          A living glossary of {terms.length} terms across UX, UI, research and
          design systems — clear definitions for the words designers actually
          use. Pick a letter, or browse the full A–Z below.
        </p>
      </header>

      <nav
        aria-label="Jump to letter"
        className="reveal reveal-2 mt-8 flex flex-wrap gap-2"
      >
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-line bg-card px-2 text-sm font-semibold text-ink transition-colors hover:border-pine hover:text-pine"
          >
            {letter}
          </a>
        ))}
      </nav>

      <div className="reveal reveal-3 mt-12 space-y-12">
        {groups.map(({ letter, items }) => (
          <section
            key={letter}
            id={`letter-${letter}`}
            aria-labelledby={`heading-${letter}`}
            className="scroll-mt-24"
          >
            <h2
              id={`heading-${letter}`}
              className="font-display text-2xl font-bold tracking-tight text-pine"
            >
              {letter}
            </h2>
            <div className="rule-double mb-6" />
            <ul className="grid gap-4 sm:grid-cols-2">
              {items.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/${t.slug}`}
                    className="card-lift group block h-full border border-line bg-card p-5"
                  >
                    <span className="block font-display text-lg font-bold leading-snug text-ink group-hover:text-pine">
                      {t.term}
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-moss">
                      {t.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
