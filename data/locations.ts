import type { Location } from "@/types";

export const locations: Location[] = [
  // ── Winter Resorts ────────────────────────────────────────────────────────
  {
    id: "niseko",
    name: "Niseko",
    nameJa: "ニセコ",
    nameZh: "二世谷",
    season: "winter",
    region: "Shiribeshi",
  },
  {
    id: "rusutsu",
    name: "Rusutsu",
    nameJa: "ルスツ",
    nameZh: "留寿都",
    season: "winter",
    region: "Shiribeshi",
  },
  {
    id: "teine",
    name: "Sapporo Teine",
    nameJa: "札幌テイネ",
    nameZh: "札幌手稲",
    season: "winter",
    region: "Sapporo",
  },
  {
    id: "kiroro",
    name: "Kiroro",
    nameJa: "キロロ",
    nameZh: "基罗罗",
    season: "winter",
    region: "Akaigawa",
  },
  {
    id: "furano",
    name: "Furano",
    nameJa: "富良野",
    nameZh: "富良野",
    season: "winter",
    region: "Sorachi",
  },
  // ── Summer Areas ─────────────────────────────────────────────────────────
  {
    id: "daisetsuzan",
    name: "Daisetsuzan",
    nameJa: "大雪山",
    nameZh: "大雪山",
    season: "summer",
    region: "Kamikawa",
  },
  {
    id: "shiretoko",
    name: "Shiretoko Peninsula",
    nameJa: "知床半島",
    nameZh: "知床半岛",
    season: "summer",
    region: "Shari",
  },
  {
    id: "tokachidake",
    name: "Tokachidake",
    nameJa: "十勝岳",
    nameZh: "十胜岳",
    season: "summer",
    region: "Kamikawa",
  },
];

export const getLocationsBySeason = (season: "winter" | "summer") =>
  locations.filter((l) => l.season === season);
