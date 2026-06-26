import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/config";
import { getAllTerms, getTerm } from "@/lib/terms";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTerms().map((t) => ({ slug: t.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = getTerm(slug);
  if (!t) return { robots: { index: false } };
  return {
    title: t.metaTitle,
    description: t.description,
    authors: t.author ? [{ name: t.author }] : undefined,
    alternates: { canonical: `${SITE_URL}/${t.slug}` },
    openGraph: {
      type: "article",
      title: t.metaTitle,
      description: t.description,
      url: `${SITE_URL}/${t.slug}`,
    },
    twitter: {
      card: "summary",
      title: t.metaTitle,
      description: t.description,
    },
  };
}

export default async function TermPage({ params }: Props) {
  const { slug } = await params;
  const t = getTerm(slug);
  if (!t) notFound();

  const termUrl = `${SITE_URL}/${t.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${termUrl}#term`,
    name: t.term,
    description: t.description,
    inLanguage: "en",
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      "@id": `${SITE_URL}/glossary#termset`,
      name: "UX Dictionary glossary",
      url: `${SITE_URL}/glossary`,
    },
    url: termUrl,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Glossary", item: `${SITE_URL}/glossary` },
      { "@type": "ListItem", position: 3, name: t.term, item: termUrl },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-moss">
        <Link href="/" className="hover:text-pine">
          Home
        </Link>
        <span aria-hidden="true" className="mx-1.5">
          /
        </span>
        <Link href="/glossary" className="hover:text-pine">
          Glossary
        </Link>
        <span aria-hidden="true" className="mx-1.5">
          /
        </span>
        <span className="text-ink/70">{t.term}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0 max-w-[780px]">
          <header className="reveal">
            <p className="tag-cap">Glossary</p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {t.term}
            </h1>
            {t.intro && (
              <p className="mt-4 text-lg leading-relaxed text-moss">{t.intro}</p>
            )}
            {t.updated && (
              <p className="mt-4 text-xs text-moss">
                Updated {t.updated}
                {t.author ? ` · by ${t.author}` : ""}
              </p>
            )}
          </header>

          <div
            className="article-body reveal reveal-2 mt-8"
            dangerouslySetInnerHTML={{ __html: t.bodyHtml }}
          />

          {t.contributor && (
            <p className="rule-dotted mt-10 pt-6 text-sm text-moss">
              Contributed by{" "}
              <span className="font-semibold text-ink">{t.contributor}</span>
            </p>
          )}

          <div className="mt-8">
            <Link href="/glossary" className="btn-pine">
              ← Back to the glossary
            </Link>
          </div>
        </article>

        <aside aria-label="Related terms">
          <div className="card-lift sticky top-8 border border-line bg-card p-6">
            {t.related.length > 0 ? (
              <>
                <p className="tag-cap">Related terms</p>
                <ul className="mt-4 space-y-3">
                  {t.related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/${r.slug}`}
                        className="text-sm font-semibold text-ink hover:text-pine"
                      >
                        {r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="tag-cap">Keep exploring</p>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      href="/glossary"
                      className="text-sm font-semibold text-ink hover:text-pine"
                    >
                      Browse the full glossary
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
