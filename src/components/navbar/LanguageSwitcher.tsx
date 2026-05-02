"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { clsx } from "clsx";
import type { Locale } from "@/types";

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "ja", label: "日本語",   flag: "🇯🇵" },
  { code: "zh", label: "简体中文", flag: "🇨🇳" },
];

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (locale: Locale) => {
    setOpen(false);
    const segments = pathname.split("/");
    segments[1] = locale;
    // scroll: false preserves the user's current scroll position after locale swap
    router.push(segments.join("/") || "/", { scroll: false });
  };

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={clsx(
          "flex items-center gap-1.5",
          "border border-white/10 rounded px-2.5 py-1.5",
          "hover:border-white/25 transition-colors duration-200"
        )}
      >
        <span className="text-lg leading-none">{current.flag}</span>
        <svg
          className={clsx("w-2.5 h-2.5 transition-transform duration-200", open && "rotate-180")}
          viewBox="0 0 10 6"
          fill="currentColor"
          style={{ color: "var(--text-secondary)" }}
        >
          <path d="M0 0l5 6 5-6H0z" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <ul
            role="listbox"
            className={clsx(
              "absolute right-0 top-[calc(100%+8px)] z-50 min-w-[140px]",
              "glass rounded-lg overflow-hidden",
              "border border-white/10 shadow-xl shadow-black/60"
            )}
          >
            {LOCALES.map((locale) => (
              <li key={locale.code}>
                <button
                  role="option"
                  aria-selected={locale.code === currentLocale}
                  onClick={() => handleSelect(locale.code)}
                  className={clsx(
                    "w-full text-left px-4 py-2.5 flex items-center gap-3",
                    "transition-colors duration-150 font-body text-sm",
                    locale.code === currentLocale
                      ? "bg-white/5"
                      : "hover:bg-white/5"
                  )}
                  style={{ color: locale.code === currentLocale ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  <span className="text-lg leading-none">{locale.flag}</span>
                  {locale.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
