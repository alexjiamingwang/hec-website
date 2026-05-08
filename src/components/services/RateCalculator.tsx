"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCheckout } from "@/context/CheckoutContext";
import {
  calculateMultiDayRate,
  formatYen,
  type PricingArea,
  type PricingGroupSize,
  type PricingDuration,
} from "../../../data/pricing";
import { DateRangePopover, type DateRangeValue } from "./DateRangePopover";

// ─── Location → Area mapping ──────────────────────────────────────────────────

interface LocationOption {
  value: string;
  label: string;
  area: PricingArea;
  [key: string]: unknown;
}

interface LocationGroup {
  group: string;
  options: LocationOption[];
}

const LOCATION_GROUPS: LocationGroup[] = [
  {
    group: "Sapporo Area",
    options: [
      { value: "teine",   label: "Teine",   area: "sapporo" },
      { value: "kokusai", label: "Kokusai", area: "sapporo" },
      { value: "moiwa",   label: "Moiwa",   area: "sapporo" },
    ],
  },
  {
    group: "Outside Sapporo",
    options: [
      { value: "niseko",    label: "Niseko",    area: "outside-sapporo" },
      { value: "kiroro",    label: "Kiroro",    area: "outside-sapporo" },
      { value: "rusutsu",   label: "Rusutsu",   area: "outside-sapporo" },
      { value: "asarigawa", label: "Asarigawa", area: "outside-sapporo" },
      { value: "furano",    label: "Furano",    area: "outside-sapporo" },
      { value: "tomamu",    label: "Tomamu",    area: "outside-sapporo" },
      { value: "sahoro",    label: "Sahoro",    area: "outside-sapporo" },
    ],
  },
];

const ALL_LOCATIONS: LocationOption[] = LOCATION_GROUPS.flatMap((g) => g.options);

type LocationValue = string;

// ─── Simple flat options ──────────────────────────────────────────────────────

const DURATION_OPTIONS = [
  { value: "3hr" as PricingDuration, label: "3 Hours" },
  { value: "6hr" as PricingDuration, label: "6 Hours" },
  { value: "7hr" as PricingDuration, label: "7 Hours" },
];

const GROUP_OPTIONS = [
  { value: "1-4" as PricingGroupSize, label: "1–4 people" },
  { value: "5"   as PricingGroupSize, label: "5 people" },
  { value: "6"   as PricingGroupSize, label: "6 people" },
];

// ─── Custom Dropdown ──────────────────────────────────────────────────────────

interface DropdownOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

interface DropdownGroup {
  group: string;
  options: DropdownOption[];
}

function CustomDropdown({
  label,
  value,
  onChange,
  options,
  groups,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options?: DropdownOption[];
  groups?: readonly DropdownGroup[];
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const allOptions = options ?? groups?.flatMap((g) => g.options) ?? [];
  const selectedOption = allOptions.find((o) => o.value === value);

  const renderOption = (opt: DropdownOption) => (
    <button
      key={opt.value}
      type="button"
      onMouseEnter={() => setHovered(opt.value)}
      onMouseLeave={() => setHovered(null)}
      onClick={() => { onChange(opt.value); setOpen(false); }}
      className="w-full text-left px-4 py-2.5 text-sm font-body transition-colors duration-100"
      style={{
        color:
          opt.value === value
            ? "var(--season-accent)"
            : hovered === opt.value
            ? "var(--text-primary)"
            : "var(--text-secondary)",
        background:
          opt.value === value
            ? "color-mix(in srgb, var(--season-accent) 8%, var(--surface-3))"
            : hovered === opt.value
            ? "var(--surface-2)"
            : "transparent",
      }}
    >
      {opt.label}
      {opt.value === value && (
        <span className="float-right" style={{ color: "var(--season-accent)" }}>✓</span>
      )}
    </button>
  );

  return (
    <div ref={ref} className="relative flex flex-col gap-2">
      <label
        className="font-mono text-[0.65rem] tracking-[0.3em] uppercase"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left flex items-center justify-between px-4 py-3 text-sm transition-all duration-200"
        style={{
          background: "var(--surface-3)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: open ? "var(--season-accent)" : "var(--border-subtle)",
          color: "var(--text-primary)",
        }}
      >
        <span>{selectedOption?.label ?? "Select…"}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.97 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              transformOrigin: "top",
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 50,
              background: "var(--surface-3)",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "var(--season-accent)",
              borderTop: "none",
              maxHeight: "260px",
              overflowY: "auto",
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
            }}
          >
            {options && options.map(renderOption)}
            {groups &&
              groups.map((grp) => (
                <div key={grp.group}>
                  <div
                    className="px-4 py-2 font-mono text-[0.6rem] tracking-[0.3em] uppercase"
                    style={{
                      color: "var(--season-accent)",
                      borderBottom: "1px solid var(--border-subtle)",
                      background: "var(--surface-2)",
                    }}
                  >
                    {grp.group}
                  </div>
                  {grp.options.map(renderOption)}
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Rate Calculator ──────────────────────────────────────────────────────────

export function RateCalculator() {
  const t = useTranslations("services.calculator");
  const { openCheckout } = useCheckout();

  const [location,            setLocation]            = useState<LocationValue>("niseko");
  // dateRange: live selection shown in the picker trigger button
  const [dateRange,           setDateRange]           = useState<DateRangeValue>({});
  // committedRange: locked in when user clicks Done — drives the rate total
  const [committedRange,      setCommittedRange]      = useState<DateRangeValue>({});
  const [duration,            setDuration]            = useState<PricingDuration>("6hr");
  const [groupSize,           setGroupSize]           = useState<PricingGroupSize>("1-4");
  const [specifiedInstructor, setSpecifiedInstructor] = useState(false);

  // Derive pricing area from selected location
  const area: PricingArea =
    ALL_LOCATIONS.find((l) => l.value === location)?.area ?? "outside-sapporo";

  // Rate is calculated from the COMMITTED range (only updates when Done is clicked)
  const startDate = committedRange.from;
  const endDate   = committedRange.to ?? committedRange.from;

  const result = useMemo(() => {
    if (!startDate || !endDate) return null;
    return calculateMultiDayRate({
      area,
      groupSize,
      duration,
      specifiedInstructor,
      startDate,
      endDate,
    });
  }, [area, groupSize, duration, specifiedInstructor, startDate, endDate]);

  // null result with committed dates = off-season dates crept in (defensive)
  const hasOffSeason = !!(startDate && endDate && result === null);

  // Clear both live selection and committed range
  const handleReset = () => {
    setDateRange({});
    setCommittedRange({});
  };

  const handleProceed = () => {
    if (!result) return;
    openCheckout({ rate: result });
  };

  return (
    <div
      className="p-8 md:p-10"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Title */}
      <div className="mb-8">
        <span className="hec-divider mb-4 block" />
        <h3
          className="font-display text-2xl md:text-3xl italic mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {t("title")}
        </h3>
      </div>

      {/* Controls grid — Season dropdown replaced by DateRangePopover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Location */}
        <CustomDropdown
          label="Location"
          value={location}
          onChange={(v) => setLocation(v as LocationValue)}
          groups={LOCATION_GROUPS}
        />

        {/* Date range picker */}
        <DateRangePopover
          value={dateRange}
          onChange={setDateRange}
          onReset={handleReset}
          onCommit={(v) => setCommittedRange(v)}
        />

        {/* Duration */}
        <CustomDropdown
          label="Duration"
          value={duration}
          onChange={(v) => setDuration(v as PricingDuration)}
          options={DURATION_OPTIONS}
        />

        {/* Group size */}
        <CustomDropdown
          label="Group Size"
          value={groupSize}
          onChange={(v) => setGroupSize(v as PricingGroupSize)}
          options={GROUP_OPTIONS}
        />
      </div>

      {/* Specified instructor */}
      <label className="flex items-center gap-3 cursor-pointer mb-8 w-fit group">
        <span
          className="w-5 h-5 border flex items-center justify-center transition-colors duration-200 flex-shrink-0"
          style={{
            background:  specifiedInstructor ? "var(--season-accent)" : "var(--surface-3)",
            borderColor: specifiedInstructor ? "var(--season-accent)" : "var(--border-mid)",
          }}
        >
          {specifiedInstructor && (
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
              <path
                d="M1 4L4 7L10 1"
                stroke="var(--surface-1)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <input
          type="checkbox"
          checked={specifiedInstructor}
          onChange={(e) => setSpecifiedInstructor(e.target.checked)}
          className="sr-only"
        />
        <span
          className="font-mono text-[0.7rem] tracking-[0.2em] uppercase transition-colors duration-200"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("specifiedInstructor")}
        </span>
      </label>

      {/* Season date reference */}
      <div className="mb-8 flex flex-col gap-1">
        <p className="font-mono text-[0.6rem] tracking-wider" style={{ color: "var(--text-muted)" }}>
          <span className="mr-1.5" style={{ color: "var(--season-accent)" }}>●</span>
          Peak season: Dec 15–Jan 12 &amp; Jan 24–Feb 25
        </p>
        <p className="font-mono text-[0.6rem] tracking-wider" style={{ color: "var(--text-muted)" }}>
          <span className="mr-1.5" style={{ color: "var(--text-muted)" }}>●</span>
          Regular season: Nov 20–Dec 14 | Jan 13–23 | Feb 26–season end
        </p>
      </div>

      {/* Result area */}
      <div
        className="pt-8"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        {/* No dates committed yet */}
        {!committedRange.from && (
          <p
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            {t("pickDatesPrompt")}
          </p>
        )}

        {/* Off-season warning */}
        {hasOffSeason && (
          <p
            className="font-mono text-xs tracking-wider"
            style={{ color: "color-mix(in srgb, var(--season-accent) 80%, var(--text-muted))" }}
          >
            ⚠ {t("offSeasonNote")}
          </p>
        )}

        {/* Total + CTA */}
        {result && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p
                className="font-mono text-[0.6rem] tracking-[0.3em] uppercase mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Total
              </p>
              <p
                className="font-display text-5xl md:text-6xl"
                style={{ color: "var(--text-primary)", lineHeight: 1 }}
              >
                {formatYen(result.total)}
              </p>
              {/* Day-by-day breakdown */}
              <p
                className="font-mono text-[0.6rem] tracking-wider mt-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {result.breakdown}
              </p>
              <p
                className="font-mono text-[0.6rem] tracking-wider mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                per group
                {result.surcharge > 0 && " · specified instructor +¥10,000"}
              </p>
            </div>

            {/* Proceed CTA */}
            <button
              onClick={handleProceed}
              className="group relative px-8 py-4 font-mono text-xs tracking-[0.25em] uppercase overflow-hidden border transition-colors duration-300 flex-shrink-0"
              style={{
                borderColor: "var(--season-accent)",
                color: "var(--text-primary)",
              }}
            >
              <span
                className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out"
                style={{ background: "var(--season-accent)" }}
              />
              <span className="relative group-hover:text-obsidian transition-colors duration-300">
                {t("proceed")}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
