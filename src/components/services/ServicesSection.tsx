"use client";

import { useMessages } from "next-intl";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useSeasonData } from "@/hooks/useSeasonData";
import { useSeason } from "@/context/SeasonContext";
import { RateCalculator } from "./RateCalculator";
import type { Service } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Resolve a dot-path key into the messages object (e.g. "services.winter.backcountry.title") */
function useMessageResolver() {
  const messages = useMessages() as Record<string, unknown>;
  return (path: string): string => {
    const result = path
      .split(".")
      .reduce(
        (obj: unknown, key) =>
          obj && typeof obj === "object" ? (obj as Record<string, unknown>)[key] : undefined,
        messages
      );
    return typeof result === "string" ? result : path;
  };
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({
  service,
  index,
  resolve,
}: {
  service: Service;
  index: number;
  resolve: (path: string) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      className="glass-light p-7 flex flex-col gap-4 group hover:border-[var(--season-accent)]/30 transition-colors duration-300"
    >
      {/* Icon */}
      <span className="text-3xl leading-none">{service.icon}</span>

      {/* Title */}
      <h3 className="font-display text-xl text-stark italic leading-tight group-hover:accent-text transition-colors duration-300">
        {resolve(service.titleKey)}
      </h3>

      {/* Divider */}
      <span className="hec-divider" />

      {/* Description */}
      <p className="text-slate-hec text-sm leading-relaxed flex-1">
        {resolve(service.descriptionKey)}
      </p>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function ServicesSection() {
  const t = useTranslations("services");
  const { services, season } = useSeasonData();
  const { isWinter } = useSeason();
  const resolve = useMessageResolver();

  return (
    <section
      id="services"
      className="py-[var(--section-padding-y)] border-t border-white/5"
    >
      <div className="section-container">
        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="hec-divider mb-5 block" />
          <h2 className="font-display text-4xl md:text-5xl text-stark italic mb-3">
            {t("sectionTitle")}
          </h2>
          <p className="text-slate-hec text-base max-w-lg">
            {t("sectionSubtitle")}
          </p>
        </motion.div>

        {/* ── Service cards grid ───────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={season}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
          >
            {services.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={i}
                resolve={resolve}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Rate Calculator — winter only ───────────────────────────────────── */}
        {isWinter && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
          >
            <RateCalculator />
          </motion.div>
        )}
      </div>
    </section>
  );
}
