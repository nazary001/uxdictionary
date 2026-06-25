"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES, SITE_NAME } from "@/lib/config";

const NAV_LINKS = [
  ...CATEGORIES.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
  { href: "/experts", label: "Experts" },
  { href: "/glossary", label: "Glossary" },
];

function Logo() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-2.5"
      aria-label={`${SITE_NAME} — home`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-pine font-display text-base font-bold text-white shadow-[0_0_16px_rgba(109,94,252,0.55)] transition-shadow group-hover:shadow-[0_0_22px_rgba(109,94,252,0.85)]">
        U
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-ink">
        UX <span className="text-marker">Dictionary</span>
      </span>
    </Link>
  );
}

function SearchForm({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <form action="/search" role="search" className="flex w-full items-center gap-2">
      <input
        type="search"
        name="q"
        required
        autoFocus={autoFocus}
        placeholder="Search the dictionary…"
        aria-label="Search articles"
        className="field"
      />
      <button type="submit" className="btn-pine shrink-0">
        Search
      </button>
    </form>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close the menus on navigation ("adjust state during render" pattern —
  // https://react.dev/learn/you-might-not-need-an-effect).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 text-white backdrop-blur-md supports-[backdrop-filter]:bg-paper/70">
      {/* Masthead: logo + search / menu controls */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Logo />

        <div className="flex items-center gap-2">
          <form
            action="/search"
            role="search"
            className="hidden items-center gap-2 md:flex"
          >
            <input
              type="search"
              name="q"
              required
              placeholder="Search…"
              aria-label="Search articles"
              className="field !py-1.5 w-40 text-sm lg:w-56"
            />
            <button type="submit" className="btn-pine !py-1.5 text-sm">
              Search
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setSearchOpen((v) => !v);
              setMenuOpen(false);
            }}
            aria-expanded={searchOpen}
            aria-controls="header-search-panel"
            aria-label={searchOpen ? "Close search" : "Open search"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-moss transition-colors hover:bg-white/5 hover:text-ink md:hidden"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.8-3.8" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => {
              setMenuOpen((v) => !v);
              setSearchOpen(false);
            }}
            aria-expanded={menuOpen}
            aria-controls="header-menu-panel"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg transition-colors hover:bg-white/5 lg:hidden"
          >
            <span
              className={`h-[2px] w-5 bg-ink transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span className={`h-[2px] w-5 bg-ink ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`h-[2px] w-5 bg-ink transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Category bar — its own row, mono labels with an indigo glow indicator. */}
      <nav
        aria-label="Sections"
        className="hidden border-t border-line lg:block"
      >
        <ul className="mx-auto flex max-w-6xl items-stretch justify-between px-2 sm:px-4">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href} className="flex-1">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative block px-2 py-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    active ? "text-marker" : "text-moss hover:text-ink"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-pine transition-opacity ${
                      active
                        ? "opacity-100 shadow-[0_0_10px_rgba(109,94,252,0.8)]"
                        : "opacity-0"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {searchOpen && (
        <div id="header-search-panel" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <SearchForm autoFocus />
          </div>
        </div>
      )}

      {menuOpen && (
        <nav
          id="header-menu-panel"
          aria-label="Mobile"
          className="border-t border-line lg:hidden"
        >
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href} className="border-b border-line last:border-b-0">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`block py-3 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors ${
                      active ? "text-marker" : "text-moss hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
