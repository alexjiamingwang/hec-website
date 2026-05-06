"use client";

import { useState, useEffect, useCallback } from "react";
import type { CalendarDay } from "@/types";

interface UseGuideCalendarResult {
  days: CalendarDay[];
  month: string;           // "YYYY-MM"
  loading: boolean;
  source: "google" | "mock";
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
}

function formatMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function addMonths(monthStr: string, delta: number): string {
  const year  = parseInt(monthStr.slice(0, 4));
  const month = parseInt(monthStr.slice(5, 7));
  const d = new Date(year, month - 1 + delta, 1);
  return formatMonth(d.getFullYear(), d.getMonth() + 1);
}

export function useGuideCalendar(
  guideId: string,
  initialDays: CalendarDay[]
): UseGuideCalendarResult {
  const now = new Date();
  const [month, setMonth]   = useState(() => formatMonth(now.getFullYear(), now.getMonth() + 1));
  const [days, setDays]     = useState<CalendarDay[]>(initialDays);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<"google" | "mock">("mock");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/calendar/${guideId}?month=${month}`)
      .then((r) => r.json())
      .then((data: { days: CalendarDay[]; month: string; source: "google" | "mock" }) => {
        if (!cancelled) {
          setDays(data.days);
          setSource(data.source);
        }
      })
      .catch(() => {
        if (!cancelled) setDays(initialDays);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideId, month]);

  const goToPrevMonth = useCallback(() => setMonth((m) => addMonths(m, -1)), []);
  const goToNextMonth = useCallback(() => setMonth((m) => addMonths(m, +1)), []);

  return { days, month, loading, source, goToPrevMonth, goToNextMonth };
}
