// ─── Season ──────────────────────────────────────────────────────────────────
export type Season = "winter" | "summer";

// ─── Locale ──────────────────────────────────────────────────────────────────
export type Locale = "en" | "ja" | "zh";

// ─── Services ────────────────────────────────────────────────────────────────
export interface Service {
  id: string;
  icon: string;             // emoji or icon name
  titleKey: string;         // i18n key
  descriptionKey: string;
  season: Season;
}

// ─── Locations ───────────────────────────────────────────────────────────────
export interface Location {
  id: string;
  name: string;
  nameJa: string;
  nameZh: string;
  season: Season;
  region: string;
}

// ─── Pricing ─────────────────────────────────────────────────────────────────
// Full pricing types live in data/pricing.ts — only lightweight aliases here.
export type SeasonalityType = "peak" | "regular";

// ─── Team / Guides ───────────────────────────────────────────────────────────
export interface Certification {
  label: string;
  issuer: string;
  year: number;
}

export interface CalendarDay {
  date: number;              // 1–30/31
  status: "available" | "booked" | "pending" | "off";
}

export interface Guide {
  id: string;
  name: string;
  nationality: string;
  flagEmoji: string;
  tagline: string;
  bio: string;
  seasons: Season[];
  certifications: Certification[];
  winterCertifications?: Certification[];
  summerCertifications?: Certification[];
  specialties: string[];
  winterSpecialties?: string[];
  summerSpecialties?: string[];
  photo: string;
  calendar: CalendarDay[];
  languages: string[];
  calendarId?: string;        // Google Calendar ID — if absent, falls back to mock data
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  season: Season;
}

// ─── Inquiry / Checkout ──────────────────────────────────────────────────────
export interface InquiryForm {
  name: string;
  email: string;
  whatsapp: string;
  skillLevel: "beginner" | "intermediate" | "advanced" | "expert";
  notes?: string;
}
