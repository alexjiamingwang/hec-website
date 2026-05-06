import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { guides } from "@data/guides";
import type { CalendarDay } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Build a mock CalendarDay array for the given month/year using the guide's static mock */
function mockMonthCalendar(year: number, month: number): CalendarDay[] {
  const days = daysInMonth(year, month);
  return Array.from({ length: days }, (_, i) => {
    const date = i + 1;
    if (date % 7 === 0) return { date, status: "off" };
    return { date, status: "available" };
  });
}

/** Map Google Calendar events to per-day status */
function buildCalendarDays(
  year: number,
  month: number,
  events: GoogleEvent[]
): CalendarDay[] {
  const days = daysInMonth(year, month);
  const statusMap = new Map<number, CalendarDay["status"]>();

  for (const event of events) {
    const start = event.start?.date ?? event.start?.dateTime?.slice(0, 10);
    const end   = event.end?.date   ?? event.end?.dateTime?.slice(0, 10);
    if (!start) continue;

    const title = (event.summary ?? "").toLowerCase();
    let status: CalendarDay["status"] = "booked";
    if (title.includes("pending") || event.status === "tentative") status = "pending";
    if (title.includes("off") || title.includes("unavailable") || title.includes("block")) status = "off";

    // Walk from start date to end date (exclusive for all-day Google events)
    const startDate = new Date(start + "T00:00:00");
    const endDate   = end ? new Date(end + "T00:00:00") : new Date(startDate.getTime() + 86400000);

    const cur = new Date(startDate);
    while (cur < endDate) {
      if (cur.getFullYear() === year && cur.getMonth() + 1 === month) {
        const day = cur.getDate();
        // Don't downgrade an existing booked day to pending
        const existing = statusMap.get(day);
        if (!existing || existing === "available") {
          statusMap.set(day, status);
        }
      }
      cur.setDate(cur.getDate() + 1);
    }
  }

  return Array.from({ length: days }, (_, i) => {
    const date = i + 1;
    return { date, status: statusMap.get(date) ?? "available" };
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface GoogleEventDateTime {
  date?: string;       // all-day event: "YYYY-MM-DD"
  dateTime?: string;   // timed event:   ISO 8601
}

interface GoogleEvent {
  summary?: string;
  status?: string;
  start?: GoogleEventDateTime;
  end?: GoogleEventDateTime;
}

interface GoogleCalendarResponse {
  items?: GoogleEvent[];
  error?: { message: string };
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: { guideId: string } }
) {
  const { guideId } = params;
  const monthParam  = req.nextUrl.searchParams.get("month"); // "YYYY-MM"

  // Resolve month/year (default: current month)
  const now   = new Date();
  const year  = monthParam ? parseInt(monthParam.slice(0, 4)) : now.getFullYear();
  const month = monthParam ? parseInt(monthParam.slice(5, 7)) : now.getMonth() + 1;
  const monthStr = `${year}-${String(month).padStart(2, "0")}`;

  // Find guide
  const guide = guides.find((g) => g.id === guideId);
  if (!guide) {
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }

  const apiKey    = process.env.GOOGLE_CALENDAR_API_KEY;
  const calendarId = guide.calendarId;

  // ── Fall back to mock if no calendar connected ─────────────────────────────
  if (!calendarId || !apiKey) {
    return NextResponse.json({
      days:   guide.calendar,   // static mock from guides.ts
      month:  monthStr,
      source: "mock",
    });
  }

  // ── Fetch from Google Calendar API ────────────────────────────────────────
  const timeMin = encodeURIComponent(new Date(`${year}-${String(month).padStart(2, "0")}-01T00:00:00Z`).toISOString());
  const lastDay = daysInMonth(year, month);
  const timeMax = encodeURIComponent(new Date(`${year}-${String(month).padStart(2, "0")}-${lastDay}T23:59:59Z`).toISOString());

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`
    + `?key=${apiKey}`
    + `&timeMin=${timeMin}`
    + `&timeMax=${timeMax}`
    + `&singleEvents=true`
    + `&orderBy=startTime`
    + `&maxResults=100`;

  try {
    const res  = await fetch(url, { next: { revalidate: 60 } }); // 60s cache
    const data = (await res.json()) as GoogleCalendarResponse;

    if (!res.ok || data.error) {
      console.error("[calendar route] Google API error:", data.error?.message ?? res.status);
      // Graceful fallback — never break the UI
      return NextResponse.json({
        days:   mockMonthCalendar(year, month),
        month:  monthStr,
        source: "mock",
      });
    }

    const days = buildCalendarDays(year, month, data.items ?? []);
    return NextResponse.json({ days, month: monthStr, source: "google" });

  } catch (err) {
    console.error("[calendar route] fetch error:", err);
    return NextResponse.json({
      days:   mockMonthCalendar(year, month),
      month:  monthStr,
      source: "mock",
    });
  }
}
