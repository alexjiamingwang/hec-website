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
