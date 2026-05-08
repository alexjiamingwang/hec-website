"use client";

/**
 * DateRangePopover
 * ─────────────────
 * A styled date-range picker built on react-day-picker v9.
 *
 * Features:
 * - Two-month side-by-side calendar (single month on small screens)
 * - Disables past dates and off-season dates
 * - Subtly tints peak-season days; selected range is solid accent colour
 * - Nav arrows positioned at far left and far right of the full calendar
 * - Reset + Done buttons; Done fires onCommit so parent can gate the total
 * - Closes on outside click
 */

import { useRef, useEffect, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { classifyDate } from "../../../data/pricing";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DateRangeValue {
  from?: Date;
  to?:   Date;
}

interface DateRangePopoverProps {
  value:     DateRangeValue;
  onChange:  (v: DateRangeValue) => void;
  onReset:   () => void;
  /** Called when the user clicks Done — parent should commit this value for rate calc */
  onCommit:  (v: DateRangeValue) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateDisplay(value: DateRangeValue): string {
  const { from, to } = value;
  if (!from) return "Select dates";
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const fromStr = from.toLocaleDateString("en-US", opts);
  if (!to || to.getTime() === from.getTime()) {
    return from.toLocaleDateString("en-US", { weekday: "short", ...opts });
  }
  const toStr = to.toLocaleDateString("en-US", opts);
  return `${fromStr} → ${toStr}`;
}

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function isDateDisabled(date: Date): boolean {
  if (date < TODAY) return true;
  return classifyDate(date) === "off-season";
}

function isPeakDay(date: Date): boolean {
  return classifyDate(date) === "peak";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DateRangePopover({ value, onChange, onReset, onCommit }: DateRangePopoverProps) {
  const [open, setOpen] = useState(false);
  const [numMonths, setNumMonths] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);

  // Respond to screen width for single vs dual month
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setNumMonths(mq.matches ? 2 : 1);
    const handler = (e: MediaQueryListEvent) => setNumMonths(e.matches ? 2 : 1);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Default calendar start: current month, or November if we're in the off-season
  const defaultMonth = (() => {
    const now = new Date();
    const m = now.getMonth() + 1;
    if (m >= 4 && m <= 10) return new Date(now.getFullYear(), 10, 1); // Nov
    return new Date(now.getFullYear(), now.getMonth(), 1);
  })();

  const hasSelection = !!(value.from);
  const displayText  = formatDateDisplay(value);

  const handleDone = () => {
    onCommit(value);
    setOpen(false);
  };

  const handleReset = () => {
    onReset();
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      {/* Label */}
      <label
        className="font-mono text-[0.65rem] tracking-[0.3em] uppercase"
        style={{ color: "var(--text-secondary)" }}
      >
        Dates
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left flex items-center justify-between px-4 py-3 text-sm transition-all duration-200"
        style={{
          background:  "var(--surface-3)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: open ? "var(--season-accent)" : "var(--border-subtle)",
          color:       hasSelection ? "var(--text-primary)" : "var(--text-muted)",
        }}
      >
        <span className="truncate">{displayText}</span>
        {hasSelection ? (
          <span
            className="ml-2 flex-shrink-0 text-xs opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "var(--text-secondary)", fontSize: "0.7rem" }}
            onMouseDown={(e) => { e.stopPropagation(); onReset(); }}
            title="Clear dates"
          >
            ✕
          </span>
        ) : (
          <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>▾</span>
        )}
      </button>

      {/* Popover panel */}
      {open && (
        <div
          className="absolute z-50 mt-1"
          style={{
            top:       "100%",
            left:      0,
            background: "var(--surface-3)",
            border:    "1px solid var(--season-accent)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
            minWidth:  "min(98vw, 660px)",
          }}
        >
          {/* ── DayPicker styles ───────────────────────────────────────── */}
          <style>{`
            /* Base */
            .rdp-root {
              --rdp-accent-color:      var(--season-accent);
              position: relative;
              padding: 20px 16px 8px;
              font-family: var(--font-body, sans-serif);
              font-size: 0.8rem;
              color: var(--text-primary);
            }

            /* ── Navigation: absolute, arrows at far left and far right ── */
            .rdp-nav {
              position: absolute;
              top: 20px;
              left: 16px;
              right: 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              pointer-events: none;
              z-index: 1;
              height: 24px;
            }
            .rdp-button_previous,
            .rdp-button_next {
              pointer-events: all;
              background: var(--text-primary);
              color: var(--surface-1);
              border: none;
              cursor: pointer;
              font-size: 1rem;
              line-height: 1;
              width: 24px; height: 24px;
              display: flex; align-items: center; justify-content: center;
              transition: background 0.15s;
            }
            .rdp-button_previous:hover,
            .rdp-button_next:hover { background: var(--season-accent); color: var(--surface-1); }

            /* Months container */
            .rdp-months {
              display: flex;
              gap: 24px;
              flex-wrap: wrap;
            }

            /* Month caption — centred, sits at the same level as the nav arrows */
            .rdp-month_caption {
              text-align: center;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: var(--font-mono, monospace);
              font-size: 0.65rem;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: var(--text-secondary);
              margin-bottom: 10px;
            }

            /* Weekday row */
            .rdp-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 4px; }
            .rdp-weekday  { text-align: center; font-family: var(--font-mono, monospace); font-size: 0.6rem; color: var(--text-muted); padding: 4px 0; letter-spacing: 0.1em; }

            /* Weeks / day cells */
            .rdp-weeks { display: flex; flex-direction: column; gap: 2px; }
            .rdp-week  { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
            .rdp-day   { text-align: center; }
            .rdp-day_button {
              width: 34px; height: 34px;
              border-radius: 0; border: none; background: none;
              cursor: pointer;
              color: var(--text-primary);
              font-size: 0.78rem;
              transition: background 0.1s, color 0.1s;
              display: flex; align-items: center; justify-content: center;
              margin: 0 auto;
            }
            .rdp-day_button:hover:not([disabled]) {
              background: var(--surface-2);
              color: var(--text-primary);
            }

            /* Disabled (past or off-season) */
            .rdp-day_button[disabled] { color: var(--text-muted); opacity: 0.25; cursor: default; }

            /* ── Selected range: ALL days in range use the solid accent colour ── */
            .rdp-selected .rdp-day_button {
              background: var(--season-accent) !important;
              color: var(--surface-1) !important;
            }
            /* Start and end: same solid accent (already covered above, kept for clarity) */
            .rdp-range_start .rdp-day_button,
            .rdp-range_end   .rdp-day_button {
              background: var(--season-accent) !important;
              color: var(--surface-1) !important;
            }

            /* Peak tint: only on UN-selected peak days */
            .rdp-day.rdp-peak:not(.rdp-selected) .rdp-day_button:not([disabled]) {
              background: color-mix(in srgb, var(--season-accent) 12%, transparent);
            }

            /* Today indicator dot */
            .rdp-today:not(.rdp-selected) .rdp-day_button::after {
              content: "";
              display: block;
              width: 3px; height: 3px;
              border-radius: 50%;
              background: var(--season-accent);
              margin: 0 auto;
              position: relative;
              top: 1px;
            }
          `}</style>

          <DayPicker
            mode="range"
            numberOfMonths={numMonths}
            defaultMonth={defaultMonth}
            selected={value as DateRange}
            onSelect={(range) => onChange({ from: range?.from, to: range?.to })}
            disabled={isDateDisabled}
            modifiers={{ peak: isPeakDay }}
            modifiersClassNames={{ peak: "rdp-peak" }}
            showOutsideDays={false}
          />

          {/* Footer */}
          <div
            className="flex justify-end gap-3 px-4 pb-4 pt-2"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <button
              type="button"
              onClick={handleReset}
              className="font-mono text-[0.65rem] tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-150"
              style={{
                color:      "var(--text-secondary)",
                border:     "1px solid var(--border-subtle)",
                background: "transparent",
              }}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleDone}
              className="font-mono text-[0.65rem] tracking-[0.2em] uppercase px-5 py-2 transition-colors duration-150"
              style={{
                color:      "var(--surface-1)",
                background: "var(--season-accent)",
                border:     "1px solid var(--season-accent)",
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
