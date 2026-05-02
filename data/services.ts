import type { Service } from "@/types";

export const services: Service[] = [
  // ── Winter Services ───────────────────────────────────────────────────────
  {
    id: "winter-tech-analysis",
    icon: "📡",
    titleKey: "services.winter.techAnalysis.title",
    descriptionKey: "services.winter.techAnalysis.description",
    season: "winter",
  },
  {
    id: "winter-backcountry",
    icon: "🏔",
    titleKey: "services.winter.backcountry.title",
    descriptionKey: "services.winter.backcountry.description",
    season: "winter",
  },
  {
    id: "winter-concierge",
    icon: "✦",
    titleKey: "services.winter.concierge.title",
    descriptionKey: "services.winter.concierge.description",
    season: "winter",
  },
  {
    id: "winter-deep-powder",
    icon: "❄️",
    titleKey: "services.winter.deepPowder.title",
    descriptionKey: "services.winter.deepPowder.description",
    season: "winter",
  },
  {
    id: "winter-safety",
    icon: "🛡",
    titleKey: "services.winter.safety.title",
    descriptionKey: "services.winter.safety.description",
    season: "winter",
  },
  {
    id: "winter-photography",
    icon: "📷",
    titleKey: "services.winter.photography.title",
    descriptionKey: "services.winter.photography.description",
    season: "winter",
  },
  // ── Summer Services ───────────────────────────────────────────────────────
  {
    id: "summer-sup",
    icon: "🏄",
    titleKey: "services.summer.sup.title",
    descriptionKey: "services.summer.sup.description",
    season: "summer",
  },
  {
    id: "summer-sea-kayaking",
    icon: "🚣",
    titleKey: "services.summer.seaKayaking.title",
    descriptionKey: "services.summer.seaKayaking.description",
    season: "summer",
  },
  {
    id: "summer-boat-charter",
    icon: "⛵",
    titleKey: "services.summer.boatCharter.title",
    descriptionKey: "services.summer.boatCharter.description",
    season: "summer",
  },
  {
    id: "summer-coastal",
    icon: "🌊",
    titleKey: "services.summer.coastal.title",
    descriptionKey: "services.summer.coastal.description",
    season: "summer",
  },
  {
    id: "summer-concierge",
    icon: "✦",
    titleKey: "services.summer.concierge.title",
    descriptionKey: "services.summer.concierge.description",
    season: "summer",
  },
  {
    id: "summer-photography",
    icon: "📷",
    titleKey: "services.summer.photography.title",
    descriptionKey: "services.summer.photography.description",
    season: "summer",
  },
];

export const getServicesBySeason = (season: "winter" | "summer") =>
  services.filter((s) => s.season === season);
