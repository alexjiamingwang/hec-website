"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { useGuideCalendar } from "@/hooks/useGuideCalendar";
import type { CalendarDay } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function parseMonth(monthStr: string): { year: number; month: number } {
  return {
    year:  parseInt(monthStr.slice(0, 4)),
    month: parseInt(monthStr.slice(5, 7)),
  };
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Day of week (0=Sun) for the 1st of the given month */
function firstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

// ─── Status styles ────────────────────────────────────────────────────────────

function statusStyle(status: CalendarDay["status"]): React.CSSProperties {
  if (status === "booked") return { background: "var(--text-muted)", opacity: 0.45 };
  return { background: "var(--season-accent)", opacity: 1 }; // available
}

// ─── Component ────────────────────────────────────────────────────────────────

interface MonthCalendarProps {
  guideId: string;
  initialDays: CalendarDay[];
}

export function MonthCalendar({ guideId, initialDays }: MonthCalendarProps) {
  const t = useTranslations("team");
  const { days, month, loading, source, goToPrevMonth, goToNextMonth } =
    useGuideCalendar(guideId, initialDays);

  const { year, month: monthNum } = parseMonth(month);
  const totalDays  = daysInMonth(year, monthNum);
  const startDay   = firstDayOfWeek(year, monthNum);

  // Build a flat array: null = empty leading cell, number = day of month
  const cells = useMemo<(number | null)[]>(() => {
    const arr: (number | null)[] = Array(startDay).fill(null);
    for (let d = 1; d <= totalDays; d++) arr.push(d);
    // Pad to complete the last row
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [startDay, totalDays]);

  // Map day → status for quick lookup
  const statusByDay = useMemo(() => {
    const map = new Map<number, CalendarDay["status"]>();
    for (const d of days) map.set(d.date, d.status);
    return map;
  }, [days]);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === monthNum;

  const legendItems: { status: CalendarDay["status"]; label: string }[] = [
    { status: "available", label: t("available") },
    { status: "booked",    label: t("booked") },
  ];

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────────────── */}
      {/* Row 1: label + live badge */}
      <div className="flex items-center gap-2 mb-2">
        <p
          className="font-mono text-[0.6rem] tracking-[0.3em] uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          {t("availability")}
        </p>
        {source === "google" && (
          <span
            className="inline-flex items-center gap-1"
            title="Live from Google Calendar"
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--season-accent)" }}
            />
            <span
              className="font-mono text-[0.55rem] uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >live</span>
          </span>
        )}
      </div>

      {/* Row 2: month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPrevMonth}
          aria-label="Previous month"
          className="flex items-center justify-center w-6 h-6 rounded transition-colors duration-150 font-mono text-[0.6rem]"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          ◀
        </button>
        <span
          className="font-mono text-[0.65rem] tracking-wider text-center"
          style={{ color: "var(--text-secondary)" }}
        >
          {loading ? "···" : `${MONTH_NAMES[monthNum - 1]} ${year}`}
        </span>
        <button
          onClick={goToNextMonth}
          aria-label="Next month"
          className="flex items-center justify-center w-6 h-6 rounded transition-colors duration-150 font-mono text-[0.6rem]"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          ▶
        </button>
      </div>

      {/* ── Day-of-week header ──────────────────────────────────────── */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-center font-mono"
            style={{ fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* ── Day grid ────────────────────────────────────────────────── */}
      <div
        className={clsx(
          "grid grid-cols-7 gap-0.5 mb-4 transition-opacity duration-300",
          loading && "opacity-40"
        )}
      >
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const status = statusByDay.get(day) ?? "available";
          const isToday = isCurrentMonth && day === today.getDate();

          return (
            <div
              key={day}
              title={`${MONTH_NAMES[monthNum - 1]} ${day} — ${status}`}
              className="aspect-square rounded-sm flex items-center justify-center font-mono"
              style={{
                fontSize: "0.5rem",
                color: "rgba(0,0,0,0.55)",
                outline: isToday ? `2px solid var(--season-accent)` : undefined,
                outlineOffset: isToday ? "1px" : undefined,
                ...statusStyle(status),
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* ── Legend ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        {legendItems.map(({ status, label }) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={statusStyle(status)} />
            <span
              className="font-mono uppercase"
              style={{ fontSize: "0.55rem", color: "var(--text-muted)", letterSpacing: "0.05em" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
