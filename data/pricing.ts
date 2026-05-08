/**
 * REAL PRICING DATA — 2025–2026 Season
 * Source: Hokkaido Elite Snow Academy official price sheet (EN/JA/ZH)
 *
 * Currency: JPY (¥). Per-group price — not per person.
 * Includes: instructor's lift ticket, transport, accommodation.
 * Excludes: students' equipment rental, lift ticket, transport, accommodation.
 *
 * Peak season:   Dec 15, 2025 – Jan 12, 2026  |  Jan 24 – Feb 25, 2026
 * Regular season: Nov 20 – Dec 14, 2025  |  Jan 13–23, 2026  |  Feb 26 – season end
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type PricingArea      = "sapporo" | "outside-sapporo";
export type PricingSeasonality = "regular" | "peak";
export type PricingGroupSize = "1-4" | "5" | "6";
export type PricingDuration  = "3hr" | "6hr" | "7hr";

export interface PricingEntry {
  area:        PricingArea;
  seasonality: PricingSeasonality;
  groupSize:   PricingGroupSize;
  "3hr":       number;   // ¥
  "6hr":       number;   // ¥ — includes 1-hr lunch break
  "7hr":       number;   // ¥ — includes 1-hr lunch break; backcountry uses this
}

export interface RateInput {
  area:                PricingArea;
  seasonality:         PricingSeasonality;
  groupSize:           PricingGroupSize;
  duration:            PricingDuration;
  specifiedInstructor?: boolean;  // +¥10,000
}

export interface RateResult {
  basePrice:  number;   // ¥
  surcharge:  number;   // ¥  (0 unless specified instructor)
  total:      number;   // ¥
  deposit:    number;   // ¥  (30%)
  breakdown:  string;
  areaLabel:  string;
}

// ─── Pricing table ────────────────────────────────────────────────────────────

export const pricingTable: PricingEntry[] = [
  // ── Sapporo Area (Teine / Kokusai / Moiwa) ───────────────────────────────
  { area: "sapporo", seasonality: "regular", groupSize: "1-4", "3hr":  60000, "6hr":  80000, "7hr":  95000 },
  { area: "sapporo", seasonality: "regular", groupSize: "5",   "3hr":  75000, "6hr":  95000, "7hr": 110000 },
  { area: "sapporo", seasonality: "regular", groupSize: "6",   "3hr":  90000, "6hr": 110000, "7hr": 125000 },
  { area: "sapporo", seasonality: "peak",    groupSize: "1-4", "3hr":  80000, "6hr": 100000, "7hr": 115000 },
  { area: "sapporo", seasonality: "peak",    groupSize: "5",   "3hr":  95000, "6hr": 115000, "7hr": 130000 },
  { area: "sapporo", seasonality: "peak",    groupSize: "6",   "3hr": 110000, "6hr": 130000, "7hr": 145000 },

  // ── Outside Sapporo (Niseko / Kiroro / Rusutsu / Asarigawa / Furano / Tomamu / Sahoro) ──
  { area: "outside-sapporo", seasonality: "regular", groupSize: "1-4", "3hr":  80000, "6hr": 100000, "7hr": 115000 },
  { area: "outside-sapporo", seasonality: "regular", groupSize: "5",   "3hr":  95000, "6hr": 115000, "7hr": 130000 },
  { area: "outside-sapporo", seasonality: "regular", groupSize: "6",   "3hr": 110000, "6hr": 130000, "7hr": 145000 },
  { area: "outside-sapporo", seasonality: "peak",    groupSize: "1-4", "3hr": 100000, "6hr": 120000, "7hr": 135000 },
  { area: "outside-sapporo", seasonality: "peak",    groupSize: "5",   "3hr": 115000, "6hr": 135000, "7hr": 150000 },
  { area: "outside-sapporo", seasonality: "peak",    groupSize: "6",   "3hr": 130000, "6hr": 150000, "7hr": 165000 },
];

// ─── Surcharges ───────────────────────────────────────────────────────────────
export const SPECIFIED_INSTRUCTOR_SURCHARGE = 10000; // ¥10,000

// ─── Deposit ──────────────────────────────────────────────────────────────────
export const DEPOSIT_PERCENTAGE = 0.30; // 30%

// ─── Season date labels ───────────────────────────────────────────────────────
export const PEAK_SEASON_LABEL    = "Dec 15–Jan 12 & Jan 24–Feb 25";
export const REGULAR_SEASON_LABEL = "Nov 20–Dec 14 | Jan 13–23 | Feb 26–season end";

// ─── Programmatic season ranges ───────────────────────────────────────────────
// Month/day only — year-agnostic so they apply every winter season.
// Update these if the official season dates shift.

export type DayClassification = "peak" | "regular" | "off-season";

/** Peak season windows (inclusive, month/day). */
export const PEAK_RANGES: { start: { m: number; d: number }; end: { m: number; d: number } }[] = [
  { start: { m: 12, d: 15 }, end: { m: 1,  d: 12 } },  // Dec 15 → Jan 12
  { start: { m: 1,  d: 24 }, end: { m: 2,  d: 25 } },  // Jan 24 → Feb 25
];

/** Full operating season window (inclusive). Dates outside are "off-season". */
export const SEASON_WINDOW = {
  start: { m: 11, d: 20 },  // Nov 20
  end:   { m: 3,  d: 31 },  // Mar 31
};

/** Returns true if (m, d) falls within a range. Handles year-wrap (e.g. Dec→Jan). */
function inMonthDayRange(
  m: number,
  d: number,
  range: { start: { m: number; d: number }; end: { m: number; d: number } }
): boolean {
  // Convert month-day to a comparable integer (mmdd)
  const val   = m * 100 + d;
  const start = range.start.m * 100 + range.start.d;
  const end   = range.end.m   * 100 + range.end.d;

  if (start <= end) {
    // Normal range (e.g. Jan 24 → Feb 25)
    return val >= start && val <= end;
  } else {
    // Wraps year-end (e.g. Dec 15 → Jan 12): val >= Dec15 OR val <= Jan12
    return val >= start || val <= end;
  }
}

/**
 * Classify a calendar date as peak, regular, or off-season.
 *
 * @example
 *   classifyDate(new Date(2026, 0, 10)) // → "peak"   (Jan 10 is in Dec15–Jan12)
 *   classifyDate(new Date(2026, 0, 15)) // → "regular" (Jan 13–23)
 *   classifyDate(new Date(2026, 4, 1))  // → "off-season" (May)
 */
export function classifyDate(date: Date): DayClassification {
  const m = date.getMonth() + 1;  // 1-based
  const d = date.getDate();

  for (const range of PEAK_RANGES) {
    if (inMonthDayRange(m, d, range)) return "peak";
  }
  if (inMonthDayRange(m, d, SEASON_WINDOW)) return "regular";
  return "off-season";
}

// ─── Multi-day rate types ─────────────────────────────────────────────────────

export interface MultiDayRateInput {
  area:                PricingArea;
  groupSize:           PricingGroupSize;
  duration:            PricingDuration;
  specifiedInstructor?: boolean;
  startDate:           Date;
  endDate:             Date;  // inclusive; equals startDate for single-day bookings
}

export interface MultiDayRateResult {
  totalDays:          number;
  peakDays:           number;
  regularDays:        number;
  offSeasonDays:      number;   // > 0 → booking spans off-season (invalid)
  peakRatePerDay:     number;   // single-day peak rate for this area/group/duration
  regularRatePerDay:  number;   // single-day regular rate
  peakSubtotal:       number;   // peakDays × peakRatePerDay
  regularSubtotal:    number;   // regularDays × regularRatePerDay
  surcharge:          number;   // specified-instructor fee (one-time, not per-day)
  total:              number;
  deposit:            number;   // 30% of total
  areaLabel:          string;
  // Legacy RateResult-compatible fields so CheckoutModal doesn't need adapting
  basePrice:          number;   // = peakSubtotal + regularSubtotal
  breakdown:          string;   // human-readable, e.g. "3 peak × ¥100,000 + 2 regular × ¥80,000"
}

/**
 * Calculate a multi-day booking rate.
 * Returns null when:
 *   - startDate > endDate
 *   - any day in the range is off-season
 *   - no pricing entry found for the given area/group/duration
 *
 * @example
 *   // Jan 10–15, 2026:  Jan10=peak, Jan11=peak, Jan12=peak, Jan13=regular, Jan14=regular, Jan15=regular
 *   // → 3 peak days + 3 regular days
 */
export function calculateMultiDayRate(input: MultiDayRateInput): MultiDayRateResult | null {
  const { area, groupSize, duration, specifiedInstructor, startDate, endDate } = input;

  if (startDate > endDate) return null;

  // Look up per-day rates from the pricing table
  const peakEntry    = pricingTable.find(e => e.area === area && e.seasonality === "peak"    && e.groupSize === groupSize);
  const regularEntry = pricingTable.find(e => e.area === area && e.seasonality === "regular" && e.groupSize === groupSize);
  if (!peakEntry || !regularEntry) return null;

  const peakRatePerDay    = peakEntry[duration];
  const regularRatePerDay = regularEntry[duration];

  // Iterate start→end inclusive, counting day types
  let peakDays = 0, regularDays = 0, offSeasonDays = 0;
  const cursor = new Date(startDate);
  cursor.setHours(12, 0, 0, 0);  // noon to avoid DST edge-cases
  const last = new Date(endDate);
  last.setHours(12, 0, 0, 0);

  while (cursor <= last) {
    const cls = classifyDate(cursor);
    if      (cls === "peak")       peakDays++;
    else if (cls === "regular")    regularDays++;
    else                           offSeasonDays++;
    cursor.setDate(cursor.getDate() + 1);
  }

  if (offSeasonDays > 0) return null;

  const totalDays      = peakDays + regularDays;
  const peakSubtotal   = peakDays    * peakRatePerDay;
  const regularSubtotal = regularDays * regularRatePerDay;
  const basePrice      = peakSubtotal + regularSubtotal;
  const surcharge      = specifiedInstructor ? SPECIFIED_INSTRUCTOR_SURCHARGE : 0;
  const total          = basePrice + surcharge;
  const deposit        = Math.round(total * DEPOSIT_PERCENTAGE);

  // Build a human-readable breakdown string
  const AREA_LABELS: Record<PricingArea, string> = {
    "sapporo":         "Sapporo Area (Teine / Kokusai / Moiwa)",
    "outside-sapporo": "Outside Sapporo (Niseko / Kiroro / Rusutsu / Furano…)",
  };

  let breakdown: string;
  if (peakDays === 0) {
    breakdown = `${regularDays} regular ${regularDays === 1 ? "day" : "days"} × ${formatYen(regularRatePerDay)}`;
  } else if (regularDays === 0) {
    breakdown = `${peakDays} peak ${peakDays === 1 ? "day" : "days"} × ${formatYen(peakRatePerDay)}`;
  } else {
    breakdown = `${peakDays} peak × ${formatYen(peakRatePerDay)} + ${regularDays} regular × ${formatYen(regularRatePerDay)} = ${formatYen(basePrice)}`;
  }

  return {
    totalDays,
    peakDays,
    regularDays,
    offSeasonDays,
    peakRatePerDay,
    regularRatePerDay,
    peakSubtotal,
    regularSubtotal,
    surcharge,
    total,
    deposit,
    areaLabel: AREA_LABELS[area],
    basePrice,
    breakdown,
  };
}

// ─── Cancellation policy ──────────────────────────────────────────────────────
export const CANCELLATION_POLICY = [
  { window: "0–14 days before / no-show", charge: "100%" },
  { window: "15–21 days before",          charge: "50%"  },
  { window: "22–30 days before",          charge: "30%"  },
  { window: "31+ days before",            charge: "Free" },
];

// ─── Calculator ───────────────────────────────────────────────────────────────

const DURATION_LABELS: Record<PricingDuration, string> = {
  "3hr": "3 Hours (9:00–12:00 or 13:00–16:00)",
  "6hr": "6 Hours incl. lunch",
  "7hr": "7 Hours incl. lunch",
};

const GROUP_LABELS: Record<PricingGroupSize, string> = {
  "1-4": "1–4 people",
  "5":   "5 people",
  "6":   "6 people",
};

const AREA_LABELS: Record<PricingArea, string> = {
  "sapporo":        "Sapporo Area (Teine / Kokusai / Moiwa)",
  "outside-sapporo": "Outside Sapporo (Niseko / Kiroro / Rusutsu / Furano…)",
};

export function calculateRate(input: RateInput): RateResult | null {
  const entry = pricingTable.find(
    (e) =>
      e.area        === input.area &&
      e.seasonality === input.seasonality &&
      e.groupSize   === input.groupSize
  );
  if (!entry) return null;

  const basePrice = entry[input.duration];
  const surcharge = input.specifiedInstructor ? SPECIFIED_INSTRUCTOR_SURCHARGE : 0;
  const total     = basePrice + surcharge;
  const deposit   = Math.round(total * DEPOSIT_PERCENTAGE);

  const parts = [
    `${DURATION_LABELS[input.duration]}, ${GROUP_LABELS[input.groupSize]}`,
    input.specifiedInstructor
      ? `+ Specified instructor (¥${SPECIFIED_INSTRUCTOR_SURCHARGE.toLocaleString()})`
      : null,
  ].filter(Boolean) as string[];

  return {
    basePrice,
    surcharge,
    total,
    deposit,
    breakdown: parts.join(" · "),
    areaLabel: AREA_LABELS[input.area],
  };
}

export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString("en-US")}`;
}
