"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { SeasonToggle } from "./SeasonToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useSeason } from "@/context/SeasonContext";
import type { Locale } from "@/types";

interface NavbarProps {
  locale: Locale;
}

const NAV_LINKS = [
  { label: "services", href: "#services" },
  { label: "team",     href: "#team" },
  { label: "gallery",  href: "#gallery" },
] as const;

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const { isWinter } = useSeason();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToServices = () => {
    setMenuOpen(false);
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50",
        "h-[72px] flex items-center",
        "transition-all duration-500 ease-hec",
        scrolled
          ? "glass border-b shadow-2xl shadow-black/40"
          : "bg-gradient-to-b from-black/50 to-transparent border-b border-transparent"
      )}
      style={{ borderColor: scrolled ? "var(--border-subtle)" : "transparent" }}
    >
      <div className="section-container w-full flex items-center justify-between gap-6">

        {/* ── LEFT: Logo + Nav links ─────────────────────────────────────────── */}
        <div className="flex items-center gap-8">

          {/* Logo — transparent PNG, CSS filter flips strokes white (winter) or keeps dark (summer) */}
          <a href="#" aria-label="Hokkaido Elite Club" className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-clean.png"
              alt="Hokkaido Elite Club"
              style={{
                height: 62,
                width: "auto",
                // Winter dark bg → invert black strokes to white
                // Summer light bg → strokes stay dark, no filter needed
                filter: isWinter ? "invert(1) brightness(1.8)" : "none",
                transition: "filter 0.5s ease",
              }}
            />
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="font-body text-sm transition-colors duration-200 relative group"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                  {t(label as keyof ReturnType<typeof t>)}
                  {/* Underline accent */}
                  <span
                    className={clsx(
                      "absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full",
                      "transition-all duration-300 ease-hec",
                      isWinter ? "bg-winter-accent" : "bg-summer-accent"
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── RIGHT: Season toggle + Language + Inquire ─────────────────────── */}
        <div className="flex items-center gap-3">

          {/* Season toggle — always visible */}
          <SeasonToggle />

          {/* Language switcher — desktop */}
          <div className="hidden md:block">
            <LanguageSwitcher currentLocale={locale} />
          </div>

          {/* Inquire button — desktop, scrolls to services */}
          <button
            onClick={scrollToServices}
            className={clsx(
              "hidden md:inline-flex items-center gap-2",
              "font-mono text-xs tracking-widest uppercase",
              "px-5 py-2 rounded-sm",
              "border transition-all duration-300 ease-hec",
              "bg-transparent hover:text-obsidian",
              isWinter
                ? "border-winter-accent text-winter-accent hover:bg-winter-accent"
                : "border-summer-accent text-summer-accent hover:bg-summer-accent"
            )}
          >
            {t("inquire")}
          </button>

          {/* Cart button — desktop placeholder */}
          <button
            aria-label="Cart"
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-sm border transition-all duration-300 ease-hec"
            style={{ borderColor: "var(--border-mid)", color: "var(--text-secondary)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--season-accent)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--season-accent)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-mid)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1h2l1.5 7h7.5l1.5-5H4.5" />
              <circle cx="6.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
              <circle cx="12" cy="13.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </button>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col gap-1.5 p-1"
          >
            <span
              className={clsx("block h-px w-6 transition-all duration-300", menuOpen && "rotate-45 translate-y-[7px]")}
              style={{ background: "var(--text-primary)" }}
            />
            <span
              className={clsx("block h-px w-4 transition-all duration-300", menuOpen && "opacity-0 w-0")}
              style={{ background: "var(--text-secondary)" }}
            />
            <span
              className={clsx("block h-px w-6 transition-all duration-300", menuOpen && "-rotate-45 -translate-y-[7px]")}
              style={{ background: "var(--text-primary)" }}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────────────────── */}
      <div
        className={clsx(
          "absolute top-full left-0 right-0 md:hidden",
          "glass border-b",
          "overflow-hidden transition-all duration-400 ease-hec",
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="section-container py-4 flex flex-col gap-3">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-body py-2 border-b transition-colors"
              style={{ color: "var(--text-secondary)", borderColor: "var(--border-subtle)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {t(label as keyof ReturnType<typeof t>)}
            </a>
          ))}

          <div className="flex items-center justify-between pt-2">
            <LanguageSwitcher currentLocale={locale} />
            <div className="flex items-center gap-2">
              {/* Cart placeholder — mobile */}
              <button
                aria-label="Cart"
                className="flex items-center justify-center w-9 h-9 rounded-sm border transition-all duration-300"
                style={{ borderColor: "var(--border-mid)", color: "var(--text-secondary)" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 1h2l1.5 7h7.5l1.5-5H4.5" />
                  <circle cx="6.5" cy="13.5" r="1" fill="currentColor" stroke="none" />
                  <circle cx="12" cy="13.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </button>
              <button
                onClick={scrollToServices}
                className={clsx(
                  "font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-sm border",
                  "transition-all duration-300",
                  isWinter
                    ? "border-winter-accent text-winter-accent hover:bg-winter-accent hover:text-obsidian"
                    : "border-summer-accent text-summer-accent hover:bg-summer-accent hover:text-obsidian"
                )}
              >
                {t("inquire")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
