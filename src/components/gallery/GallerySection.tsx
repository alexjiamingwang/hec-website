"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSeasonData } from "@/hooks/useSeasonData";
import type { GalleryImage } from "@/types";

// ─── Slide variants ───────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ─── Arrow button ─────────────────────────────────────────────────────────────

function ArrowBtn({
  dir,
  onClick,
  large = false,
}: {
  dir: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
  large?: boolean;
}) {
  const size = large ? 56 : 48;
  return (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Previous" : "Next"}
      className="carousel-arrow flex-shrink-0"
      style={{ width: size, height: size }}
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

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: GalleryImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);
  const [direction, setDirection] = useState(1);

  const go = useCallback(
    (dir: 1 | -1, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setDirection(dir);
      setCurrent((i) => (i + dir + images.length) % images.length);
    },
    [images.length]
  );

  // ESC / arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [go, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const image = images[current];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: "rgba(0,0,0,0.94)" }}
      onClick={onClose}
    >
      {/* Close button */}
      <div className="flex justify-between items-center px-6 py-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <p className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-white/50">
          {String(current + 1).padStart(2, "0")}
          <span className="mx-1.5 opacity-40">/</span>
          {String(images.length).padStart(2, "0")}
        </p>
        <button
          onClick={onClose}
          className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors duration-200 flex items-center gap-2"
        >
          Close
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 2l10 10M12 2L2 12" />
          </svg>
        </button>
      </div>

      {/* Photo + arrows */}
      <div
        className="flex-1 flex items-center justify-center gap-4 px-4 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <ArrowBtn dir="left" onClick={(e) => go(-1, e)} large />

        {/* Image container — object-contain so full photo is visible */}
        <div className="flex-1 flex items-center justify-center min-h-0 h-full overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={`lb-${current}`}
              custom={direction}
              variants={{
                enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
                center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
                exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.3 } }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              src={image.src}
              alt={image.alt}
              draggable={false}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </AnimatePresence>
        </div>

        <ArrowBtn dir="right" onClick={(e) => go(1, e)} large />
      </div>

      {/* Caption */}
      <div className="flex-shrink-0 px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.p
            key={`lb-caption-${current}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/40"
          >
            {image.caption || image.alt}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────

export function GallerySection() {
  const t = useTranslations("gallery");
  const { gallery, season } = useSeasonData();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);

  // Reset to first photo when season changes
  useEffect(() => {
    setCurrent(0);
    setDirection(1);
  }, [season]);

  const go = useCallback(
    (dir: 1 | -1, e?: React.MouseEvent) => {
      e?.stopPropagation();
      setDirection(dir);
      setCurrent((i) => (i + dir + gallery.length) % gallery.length);
    },
    [gallery.length]
  );

  // Keyboard navigation (when lightbox is closed)
  useEffect(() => {
    if (lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [go, lightboxOpen]);

  const openLightbox = (index: number) => {
    setLightboxStart(index);
    setLightboxOpen(true);
  };

  const image = gallery[current];

  return (
    <>
      <section
        id="gallery"
        className="py-[var(--section-padding-y)] border-t"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        {/* ── Section header ───────────────────────────────────────────────── */}
        <div className="section-container mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="hec-divider mb-5 block" />
            <h2
              className="font-display text-4xl md:text-5xl italic mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t("sectionTitle")}
            </h2>
            <p className="text-base max-w-md" style={{ color: "var(--text-secondary)" }}>
              {t("sectionSubtitle")}
            </p>
          </motion.div>
        </div>

        {/* ── Carousel ─────────────────────────────────────────────────────── */}
        <div className="section-container">
          {/* Photo stage — click to open lightbox */}
          <div
            className="relative overflow-hidden cursor-zoom-in"
            style={{ height: "clamp(320px, 62vh, 680px)" }}
            onClick={() => openLightbox(current)}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${season}-${current}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <div
                  className="absolute inset-0"
                  style={{ background: "var(--surface-1)" }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  className="absolute inset-0 w-full h-full object-contain"
                  draggable={false}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />

                {/* "Click to expand" hint */}
                <div className="absolute bottom-4 right-4 glass px-3 py-1.5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "white", opacity: 0.7 }}>
                    <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" />
                  </svg>
                  <span className="font-mono text-[0.55rem] tracking-widest uppercase text-white/60">View full</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Arrows — stop propagation so click on arrow doesn't open lightbox */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-4 z-10">
              <div className="pointer-events-auto">
                <ArrowBtn dir="left" onClick={(e) => go(-1, e)} />
              </div>
              <div className="pointer-events-auto">
                <ArrowBtn dir="right" onClick={(e) => go(1, e)} />
              </div>
            </div>

            {/* Expand icon overlay (top-right) */}
            <div className="absolute top-4 right-4 z-10 pointer-events-none">
              <div
                className="px-2.5 py-1.5 flex items-center gap-1.5"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
                  <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" />
                </svg>
                <span className="font-mono text-[0.55rem] tracking-widest uppercase text-white/60">expand</span>
              </div>
            </div>
          </div>

          {/* ── Bottom row: caption + counter ──────────────────────────────── */}
          <div className="flex items-start justify-between mt-5 gap-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={`caption-${season}-${current}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="font-mono text-[0.65rem] tracking-[0.2em] uppercase leading-snug max-w-lg"
                style={{ color: "var(--text-muted)" }}
              >
                {image.caption || image.alt}
              </motion.p>
            </AnimatePresence>

            <p
              className="font-mono text-[0.65rem] tracking-[0.25em] uppercase flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              {String(current + 1).padStart(2, "0")}
              <span className="mx-1.5 opacity-40">/</span>
              {String(gallery.length).padStart(2, "0")}
            </p>
          </div>

          {/* ── Dot indicators ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                aria-label={`Go to photo ${i + 1}`}
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
        </div>
      </section>

      {/* ── Lightbox ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={gallery}
            startIndex={lightboxStart}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
