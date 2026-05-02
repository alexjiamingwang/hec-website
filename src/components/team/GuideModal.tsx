"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCheckout } from "@/context/CheckoutContext";
import { useSeason } from "@/context/SeasonContext";
import type { Guide, CalendarDay } from "@/types";

// ─── Calendar ─────────────────────────────────────────────────────────────────

function CalendarGrid({ days }: { days: CalendarDay[] }) {
  const t = useTranslations("team");

  const statusStyle = (status: CalendarDay["status"]): React.CSSProperties => {
    switch (status) {
      case "available": return { background: "var(--season-accent)", opacity: 1 };
      case "booked":    return { background: "var(--text-muted)", opacity: 0.4 };
      case "pending":   return { background: "#F59E0B", opacity: 0.75 };
      case "off":       return { background: "var(--surface-3)", border: "1px solid var(--border-subtle)" };
    }
  };

  const legendItems: { status: CalendarDay["status"]; label: string }[] = [
    { status: "available", label: t("available") },
    { status: "booked",    label: t("booked") },
    { status: "pending",   label: t("pending") },
    { status: "off",       label: t("off") },
  ];

  return (
    <div>
      <p
        className="font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-3"
        style={{ color: "var(--text-muted)" }}
      >
        {t("availability")}
      </p>

      <div className="grid grid-cols-10 gap-1 mb-4">
        {days.map((day) => (
          <div
            key={day.date}
            title={`Day ${day.date} — ${day.status}`}
            className="aspect-square rounded-sm flex items-center justify-center font-mono"
            style={{
              fontSize: "0.5rem",
              color: "rgba(0,0,0,0.5)",
              ...statusStyle(day.status),
            }}
          >
            {day.date}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {legendItems.map(({ status, label }) => (
          <div key={status} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={statusStyle(status)} />
            <span
              className="font-mono text-[0.6rem] tracking-wider uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface GuideModalProps {
  guide: Guide | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ guide, isOpen, onClose }: GuideModalProps) {
  const t = useTranslations("team");
  const { openCheckout } = useCheckout();
  const { isWinter } = useSeason();

  // Close on Escape key + lock scroll
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const certsToShow = guide
    ? (isWinter ? (guide.winterCertifications ?? guide.certifications) : (guide.summerCertifications ?? guide.certifications))
    : [];

  const specialtiesToShow = guide
    ? (isWinter ? (guide.winterSpecialties ?? guide.specialties) : (guide.summerSpecialties ?? guide.specialties))
    : [];

  const handleInquire = () => {
    onClose();
    if (guide) setTimeout(() => openCheckout({ guide: guide.name }), 320);
  };

  return (
    <AnimatePresence>
      {isOpen && guide && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-xl z-50 flex flex-col overflow-y-auto"
            style={{
              background: "var(--surface-1)",
              borderLeft: "1px solid var(--border-subtle)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 z-10 transition-colors duration-200"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Photo */}
            <div
              className="relative w-full flex-shrink-0 overflow-hidden"
              style={{ height: "22rem", background: "var(--surface-2)" }}
            >
              {/* Gradient placeholder */}
              <div
                className="absolute inset-0"
                style={{
                  background: isWinter
                    ? "radial-gradient(ellipse at 50% 60%, #0d2535, #080A14)"
                    : "radial-gradient(ellipse at 50% 60%, #d4a87a, #8B5E3C)",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={guide.photo}
                alt={guide.name}
                className="absolute inset-0 w-full h-full object-cover object-top"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              {/* Full-height fade — barely visible at top, fully opaque at bottom */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom,
                    transparent 0%,
                    transparent 30%,
                    color-mix(in srgb, var(--surface-1) 20%, transparent) 55%,
                    color-mix(in srgb, var(--surface-1) 65%, transparent) 75%,
                    var(--surface-1) 100%)`,
                }}
              />
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col gap-7 flex-1">

              {/* Name + flag */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">{guide.flagEmoji}</span>
                  <span
                    className="font-mono text-xs tracking-widest uppercase"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {guide.nationality}
                  </span>
                </div>
                <h2
                  className="font-display text-3xl italic mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {guide.name}
                </h2>
                <p
                  className="text-sm italic"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {guide.tagline}
                </p>
              </div>

              {/* Bio */}
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {guide.bio}
              </p>

              {/* Certifications */}
              <div>
                <p
                  className="font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t("certifications")}
                </p>
                <ul className="flex flex-col gap-2">
                  {certsToShow.map((cert, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5" style={{ color: "var(--season-accent)" }}>✦</span>
                      <div>
                        <span style={{ color: "var(--text-primary)" }}>{cert.label}</span>
                        <span
                          className="ml-2 text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {cert.issuer}, {cert.year}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specialties */}
              <div>
                <p
                  className="font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t("specialties")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {specialtiesToShow.map((spec) => (
                    <span
                      key={spec}
                      className="font-mono text-[0.65rem] tracking-wider uppercase px-3 py-1"
                      style={{
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <p
                  className="font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t("languages")}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {guide.languages.join(" · ")}
                </p>
              </div>

              {/* Availability calendar */}
              <CalendarGrid days={guide.calendar} />

              {/* Divider */}
              <div style={{ borderTop: "1px solid var(--border-subtle)" }} />

              {/* Inquire CTA */}
              <button
                onClick={handleInquire}
                className="group relative w-full py-4 px-6 font-mono text-xs tracking-[0.25em] uppercase overflow-hidden transition-colors duration-300 mt-auto"
                style={{
                  border: "1px solid var(--season-accent)",
                  color: "var(--text-primary)",
                }}
              >
                <span
                  className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out"
                  style={{ background: "var(--season-accent)" }}
                />
                <span className="relative group-hover:text-obsidian transition-colors duration-300">
                  {t("inquireGuide")}
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
