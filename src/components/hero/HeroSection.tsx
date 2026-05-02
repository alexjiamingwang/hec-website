"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSeason } from "@/context/SeasonContext";

export function HeroSection() {
  const { season, isWinter } = useSeason();
  const t = useTranslations("hero");
  const s = isWinter ? "winter" : "summer";

  // Season-aware hero text — dark for summer light mode, light for winter dark mode
  const heroPrimary   = isWinter ? "#F5F5F0" : "#1C1410";
  const heroSecondary = isWinter ? "rgba(245,245,240,0.65)" : "rgba(28,20,16,0.68)";
  const heroDim       = isWinter ? "rgba(245,245,240,0.38)" : "rgba(28,20,16,0.40)";

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  // Track whether video has loaded
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setVideoLoaded(false);
    if (videoRef.current) videoRef.current.load();
  }, [season]);

  // ── Season gradient backgrounds ───────────────────────────────────────────
  // Winter: deep navy
  const winterGradient =
    "radial-gradient(ellipse 130% 90% at 20% 70%, #0d2535 0%, #060c14 50%), " +
    "radial-gradient(ellipse 60% 50% at 80% 10%, #091a27 0%, transparent 60%)";

  // Summer: warm coastal light cream — will be replaced by video
  const summerGradient =
    "linear-gradient(150deg, #FAFAF7 0%, #F6F3EE 50%, #EDE8DF 100%)";

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Gradient background ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${season}`}
          className="absolute inset-0"
          style={{ background: isWinter ? winterGradient : summerGradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        />
      </AnimatePresence>

      {/* ── Video background ─────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: videoLoaded ? (isWinter ? 0.7 : 0.88) : 0,
          transition: videoLoaded ? "opacity 1.4s ease" : "opacity 0.9s ease",
        }}
        autoPlay
        muted
        loop
        playsInline
        onCanPlayThrough={() => setVideoLoaded(true)}
        onError={() => setVideoLoaded(false)}
      >
        <source src={`/videos/${season}-hero.mp4`} type="video/mp4" />
      </video>

      {/* ── Cinematic overlays ───────────────────────────────────────────────── */}
      {/* Winter: deep left-side vignette + top darkening */}
      {isWinter && <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.50), transparent 65%)" }} />}
      {isWinter && <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25), transparent 45%)" }} />}
      {/* Summer: soft vignette to keep text readable over bright footage */}
      {!isWinter && <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(246,243,238,0.45), transparent 70%)" }} />}
      {!isWinter && <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(246,243,238,0.20), transparent 50%)" }} />}
      {/* Bottom — fades to the page background colour so the next section feels seamless */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "45%",
          background: isWinter
            ? "linear-gradient(to bottom, transparent, #10121C)"
            : "linear-gradient(to bottom, transparent, #F6F3EE)",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center section-container pt-[calc(var(--navbar-h)+2rem)] pb-8">

        {/* EST. badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          className="mb-6"
        >
          <span
            className="font-mono text-xs tracking-[0.45em] uppercase"
            style={{ color: "var(--season-accent)" }}
          >
            {t(`${s}.badge` as Parameters<typeof t>[0])}
          </span>
        </motion.div>

        {/* Main headline */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`headline-${season}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ delay: 0.25, duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display leading-[1.02] tracking-tight mb-2"
            style={{
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              color: heroPrimary,
            }}
          >
            {t(`${s}.headline`)}
          </motion.h1>
        </AnimatePresence>

        {/* Sub-headline */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`sub-${season}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase mb-7"
            style={{ color: heroSecondary }}
          >
            {t(`${s}.subheadline`)}
          </motion.p>
        </AnimatePresence>

        {/* Accent divider */}
        <motion.span
          className="hec-divider mb-7"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.55, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />

        {/* Tagline */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`tagline-${season}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-base md:text-lg max-w-lg leading-relaxed mb-10"
            style={{ color: heroSecondary }}
          >
            {t(`${s}.tagline`)}
          </motion.p>
        </AnimatePresence>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
        >
          <button
            onClick={scrollToServices}
            className="group relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden font-mono text-xs tracking-[0.25em] uppercase transition-colors duration-300"
            style={{
              border: "1px solid var(--season-accent)",
              color: heroPrimary,
            }}
          >
            {/* Slide-fill on hover */}
            <span
              className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out"
              style={{ background: "var(--season-accent)" }}
            />
            <span className="relative group-hover:text-obsidian transition-colors duration-300">
              {t(`${s}.cta`)}
            </span>
            <span className="relative text-[0.6rem] group-hover:text-obsidian transition-colors duration-300">→</span>
          </button>
        </motion.div>
      </div>

      {/* ── Scroll indicator — uses season-aware color since it sits in the fade zone */}
      <motion.div
        className="relative z-10 flex flex-col items-center pb-10 gap-2 self-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        <span
          className="font-mono text-[0.65rem] tracking-[0.35em] uppercase"
          style={{ color: heroDim }}
        >
          Scroll
        </span>
        <div
          className="w-px h-10"
          style={{ background: `linear-gradient(to bottom, ${heroDim}, transparent)` }}
        />
      </motion.div>
    </section>
  );
}
