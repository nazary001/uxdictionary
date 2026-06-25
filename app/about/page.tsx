import Link from "next/link";
import { CATEGORIES, SITE_NAME } from "@/lib/config";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About Us",
  description: `What ${SITE_NAME} is, how we write our essays and definitions, and the editorial principles behind the glossary.`,
  path: "/about",
});

const PRINCIPLES = [
  {
    title: "Definitions you can actually use",
    text: "Every glossary entry leads with a plain, jargon-free meaning, then shows how the term plays out in real product work — not a textbook footnote.",
  },
  {
    title: "Show the craft, not just the theory",
    text: "We pair concepts with concrete examples, patterns and trade-offs, so a definition turns into something you can apply in your next design review.",
  },
  {
    title: "Independent and opinionated",
    text: "We have points of view about good and bad design, and we say so. No vendor decides what lands on the page or how a tool gets described.",
  },
  {
    title: "Kept current",
    text: "Language, tooling and best practice in design move fast. We revisit entries and essays and stamp them with the date they were last reviewed.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="reveal rule-double pb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          About <span className="u-marker">{SITE_NAME}</span>
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-moss">
          We&apos;re an independent design publication and a living glossary —
          for the people who research, design and build digital products, and
          for everyone trying to make sense of the language around them.
        </p>
      </header>

      <section className="reveal reveal-2 mt-10 space-y-5 leading-relaxed">
        <p>
          Design has a vocabulary problem. Terms like affordance, information
          architecture, design token and heuristic evaluation get thrown around
          in critiques and job specs, but the meanings drift, overlap and
          collect jargon until they stop being useful.
        </p>
        <p>
          {SITE_NAME} exists to fix that. We write clear definitions that say
          what a term actually means, essays that go deeper on the ideas behind
          good UX and UI, and practical breakdowns of patterns, research methods
          and design systems — so the words you use map to the work you do.
        </p>
      </section>

      <section aria-labelledby="sections-heading" className="reveal reveal-3 mt-12">
        <h2
          id="sections-heading"
          className="rule-double pb-3 font-display text-2xl font-semibold"
        >
          What we publish
        </h2>
        <ul className="mt-6 space-y-4">
          {CATEGORIES.map((c, i) => (
            <li key={c.slug} className="flex gap-4">
              <span className="font-display text-lg font-semibold text-pine">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p>
                <Link
                  href={`/category/${c.slug}`}
                  className="font-semibold text-pine hover:underline"
                >
                  {c.name}
                </Link>{" "}
                <span className="text-moss">— {c.blurb}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="principles-heading" className="reveal reveal-4 mt-12">
        <h2
          id="principles-heading"
          className="rule-double pb-3 font-display text-2xl font-semibold"
        >
          How we work
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="border border-line bg-card p-5">
              <h3 className="font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-moss">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="rule-dotted mt-12 pt-6 text-sm leading-relaxed text-moss">
        Want to know who writes the entries? Meet{" "}
        <Link href="/experts" className="text-pine underline">
          our contributors
        </Link>
        , or{" "}
        <Link href="/contact" className="text-pine underline">
          send the desk a message
        </Link>
        .
      </p>
    </div>
  );
}
