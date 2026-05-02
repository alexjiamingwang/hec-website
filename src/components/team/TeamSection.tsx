"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSeasonData } from "@/hooks/useSeasonData";
import { useSeason } from "@/context/SeasonContext";
import { useCheckout } from "@/context/CheckoutContext";
import { GuideModal } from "./GuideModal";
import type { Guide } from "@/types";

// ─── Slide variants ───────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "55%" : "-55%",
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-55%" : "55%",
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ─── Arrow button ─────────────────────────────────────────────────────────────

function ArrowBtn({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Previous guide" : "Next guide"}
      className="carousel-arrow flex-shrink-0"
      style={{ width: 48, height: 48 }}
    >
      {dir === "left" ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 14L6 9l5-5" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 4l5 5-5 5" />
        </svg>
      )}
    </button>
  );
}

// ─── Guide card ───────────────────────────────────────────────────────────────

function GuideCard({ guide, onClick, ghost = false }: { guide: Guide; onClick: () => void; ghost?: boolean }) {
  const { isWinter } = useSeason();
  const displaySpecialties = isWinter
    ? (guide.winterSpecialties ?? guide.specialties)
    : (guide.summerSpecialties ?? guide.specialties);

  return (
    <div
      onClick={ghost ? undefined : onClick}
      className={`relative overflow-hidden glass-light transition-all duration-300 ${ghost ? "" : "group cursor-pointer hover:border-[var(--season-accent)]/30"}`}
      style={{ borderColor: "var(--border-subtle)" }}
    >
      {/* Photo — tall portrait */}
      <div className="relative overflow-hidden" style={{ height: "clamp(340px, 50vh, 520px)" }}>
        {/* Background placeholder */}
        <div className="absolute inset-0" style={{ background: "var(--surface-2)" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={guide.photo}
          alt={guide.name}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ${ghost ? "" : "group-hover:scale-105"}`}
          draggable={false}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        {/* Bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Name overlay */}
        <div className="absolute bottom-0 inset-x-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              <h3
                className="font-display text-3xl italic mb-0.5"
                style={{ color: "#F5F5F0", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
              >
                {guide.name}
              </h3>
              <p
                className="font-mono text-[0.65rem] tracking-[0.3em] uppercase"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {guide.nationality}
              </p>
            </div>
            <span className="text-3xl">{guide.flagEmoji}</span>
          </div>
        </div>
      </div>

      {/* Info panel — hidden on ghost cards */}
      {!ghost && (
        <div className="p-6">
          <p className="text-sm mb-5 leading-relaxed italic" style={{ color: "var(--text-secondary)" }}>
            "{guide.tagline}"
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {displaySpecialties.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="font-mono text-[0.6rem] tracking-wider uppercase px-2.5 py-1 border"
                style={{ color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}
              >
                {spec}
              </span>
            ))}
          </div>

          <div
            className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300"
            style={{ color: "var(--season-accent)" }}
          >
            <span className="font-mono text-[0.6rem] tracking-[0.25em] uppercase">View Profile</span>
            <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function TeamSection() {
  const t = useTranslations("team");
  const { guides, season } = useSeasonData();
  const { openCheckout } = useCheckout();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [PEEK, setPEEK] = useState(72);

  useEffect(() => {
    const updatePeek = () => setPEEK(window.innerWidth < 640 ? 0 : 72);
    updatePeek();
    window.addEventListener("resize", updatePeek);
    return () => window.removeEventListener("resize", updatePeek);
  }, []);

  // Reset when season changes
  useEffect(() => {
    setCurrent(0);
    setDirection(1);
  }, [season]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setCurrent((i) => (i + dir + guides.length) % guides.length);
    },
    [guides.length]
  );

  const openGuide = (guide: Guide) => {
    setSelectedGuide(guide);
    setModalOpen(true);
  };

  const closeGuide = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedGuide(null), 350);
  };

  const guide = guides[current];
  const prevGuide = guides[(current - 1 + guides.length) % guides.length];
  const nextGuide = guides[(current + 1) % guides.length];

  return (
    <>
      <section
        id="team"
        className="py-[var(--section-padding-y)] border-t"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="section-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-14"
          >
            <span className="hec-divider mb-5 block" />
            <h2
              className="font-display text-4xl md:text-5xl italic mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t("sectionTitle")}
            </h2>
            <p className="text-base max-w-lg" style={{ color: "var(--text-secondary)" }}>
              {t("sectionSubtitle")}
            </p>
          </motion.div>

          {/* ── Carousel ─────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-4">

            {/* Left arrow */}
            <ArrowBtn dir="left" onClick={() => go(-1)} />

            {/* Stage — overflow hidden clips the peek cards */}
            <div
              className="relative flex-1 overflow-hidden"
              style={{ minHeight: "clamp(480px, 68vh, 700px)" }}
            >
              {/* ── Left peek (previous guide) ──────────────────────────────── */}
              <div
                className="absolute top-0 left-0 bottom-0 pointer-events-none z-10 overflow-hidden"
                style={{ width: PEEK }}
              >
                {/* Card is anchored to the RIGHT edge of this clip zone */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "clamp(260px, 40vw, 400px)",
                    opacity: 0.32,
                    transform: "scale(0.87)",
                    transformOrigin: "right top",
                  }}
                >
                  <GuideCard guide={prevGuide} onClick={() => {}} ghost />
                </div>
                {/* Fade toward center */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to right, var(--surface-1) 10%, transparent 100%)",
                  }}
                />
              </div>

              {/* ── Center card (animated) ───────────────────────────────────── */}
              <div
                className="absolute top-0 bottom-0"
                style={{ left: PEEK, right: PEEK }}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`${season}-${guide?.id}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                  >
                    <div className="max-w-md mx-auto">
                      {guide && (
                        <GuideCard guide={guide} onClick={() => openGuide(guide)} />
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Right peek (next guide) ──────────────────────────────────── */}
              <div
                className="absolute top-0 right-0 bottom-0 pointer-events-none z-10 overflow-hidden"
                style={{ width: PEEK }}
              >
                {/* Card is anchored to the LEFT edge of this clip zone */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "clamp(260px, 40vw, 400px)",
                    opacity: 0.32,
                    transform: "scale(0.87)",
                    transformOrigin: "left top",
                  }}
                >
                  <GuideCard guide={nextGuide} onClick={() => {}} ghost />
                </div>
                {/* Fade toward center */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to left, var(--surface-1) 10%, transparent 100%)",
                  }}
                />
              </div>
            </div>

            {/* Right arrow */}
            <ArrowBtn dir="right" onClick={() => go(1)} />
          </div>

          {/* ── Dots + counter ────────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              {guides.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  aria-label={`View ${g.name}`}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === current ? "20px" : "6px",
                    height: "6px",
                    background: i === current ? "var(--season-accent)" : "var(--text-muted)",
                    opacity: i === current ? 1 : 0.4,
                  }}
                />
              ))}
            </div>

            <p
              className="font-mono text-[0.65rem] tracking-[0.3em] uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              {String(current + 1).padStart(2, "0")}
              <span className="mx-1.5 opacity-40">/</span>
              {String(guides.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      </section>

      <GuideModal guide={selectedGuide} isOpen={modalOpen} onClose={closeGuide} />
    </>
  );
}
