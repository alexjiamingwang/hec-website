import type { Guide, CalendarDay } from "@/types";

// Helper: generate a mock 30-day calendar (binary: booked or available)
function mockCalendar(bookedDays: number[]): CalendarDay[] {
  return Array.from({ length: 30 }, (_, i) => {
    const date = i + 1;
    return { date, status: bookedDays.includes(date) ? "booked" : "available" };
  });
}

export const guides: Guide[] = [
  // ── Mibo first — face of both seasons ─────────────────────────────────────
  {
    id: "mibo-yu",
    name: "Mibo Yu",
    nationality: "Chinese",
    flagEmoji: "🇨🇳",
    tagline: "Powder to Ocean. Two Seasons, One Guide.",
    bio: "Jianyun Yu — known universally as Mibo — is Hokkaido's rare four-season specialist. Holding elite ski instructor credentials alongside marine guide licences, she bridges HEC's winter and summer programmes with seamless fluency. In winter, Mibo leads technical ski sessions on Niseko and Teine using her SIA/SAJ L4 Examiner precision. Come summer, she captains private boat charters and leads SUP and sea kayaking expeditions along the Shakotan Peninsula's startlingly clear waters. Her breadth of certification—across snow, sea, and wilderness first aid—makes her the team's most versatile guide and the natural first choice for Chinese-speaking clients.",
    seasons: ["winter", "summer"],
    certifications: [
      { label: "HBGA Level 1", issuer: "Hokkaido Backcountry Guides Association", year: 2021 },
      { label: "SIA/SAJ Ski Instructor L4 Examiner", issuer: "Ski Industries America / Ski Association of Japan", year: 2022 },
      { label: "WMAJ / WAFA / LNT Level 1", issuer: "Wilderness Medical Associates Japan", year: 2022 },
      { label: "ACA SUP Level 2 / Kayak Level 1", issuer: "American Canoe Association", year: 2023 },
      { label: "First-Class Small Boat License", issuer: "Japan Ministry of Land, Infrastructure, Transport and Tourism", year: 2023 },
      { label: "NAUI Scuba Diver", issuer: "National Association of Underwater Instructors", year: 2023 },
    ],
    winterCertifications: [
      { label: "HBGA Level 1", issuer: "Hokkaido Backcountry Guides Association", year: 2021 },
      { label: "SIA/SAJ Ski Instructor L4 Examiner", issuer: "Ski Industries America / Ski Association of Japan", year: 2022 },
      { label: "WMAJ / WAFA / LNT Level 1", issuer: "Wilderness Medical Associates Japan", year: 2022 },
    ],
    summerCertifications: [
      { label: "ACA SUP Level 2 / Kayak Level 1", issuer: "American Canoe Association", year: 2023 },
      { label: "First-Class Small Boat License", issuer: "Japan Ministry of Land, Infrastructure, Transport and Tourism", year: 2023 },
      { label: "NAUI Scuba Diver", issuer: "National Association of Underwater Instructors", year: 2023 },
      { label: "WMAJ / WAFA / LNT Level 1", issuer: "Wilderness Medical Associates Japan", year: 2022 },
    ],
    specialties: ["SUP & Sea Kayaking", "Private Boat Charter", "Ski Technical Coaching", "Shakotan Peninsula", "Mandarin-Speaking Groups"],
    winterSpecialties: ["Ski Technical Coaching", "Backcountry Guiding", "Niseko / Teine Terrain", "Mandarin-Speaking Groups"],
    summerSpecialties: ["SUP & Sea Kayaking", "Private Boat Charter", "Shakotan Peninsula", "Mandarin-Speaking Groups"],
    photo: "/images/team/mibo-yu.jpg",
    languages: ["Chinese", "Japanese", "English"],
    calendar: mockCalendar([5, 6, 12, 13, 19, 25, 26, 29, 30]),
    calendarId: process.env.NEXT_PUBLIC_MIBO_CALENDAR_ID,
  },
  {
    id: "kai-nakamura",
    name: "Kai Nakamura",
    nationality: "Japanese",
    flagEmoji: "🇯🇵",
    tagline: "Powder Architect. Niseko Native.",
    bio: "Born in Kutchan, Kai grew up chasing the notorious Hokkaido powder that now draws the world to his backyard. With over 15 seasons guiding in Niseko and Rusutsu, he has an encyclopedic knowledge of micro-terrain features, storm patterns, and the hidden lines that don't appear on any trail map. Kai holds dual certifications in avalanche safety and speaks English fluently after five seasons guiding for international clientele.",
    seasons: ["winter"],
    certifications: [
      { label: "JMGA Ski Guide", issuer: "Japan Mountain Guides Association", year: 2016 },
      { label: "AIARE Level 2", issuer: "American Institute for Avalanche Research", year: 2018 },
      { label: "Wilderness First Responder", issuer: "NOLS", year: 2019 },
    ],
    specialties: ["Deep Powder Backcountry", "Terrain Analysis", "Niseko / Rusutsu"],
    photo: "/images/team/kai-nakamura.jpg",
    languages: ["Japanese", "English"],
    calendar: mockCalendar([3, 4, 5, 10, 11, 17, 18, 22, 23, 24, 28]),
  },
  {
    id: "sasha-volkov",
    name: "Sasha Volkov",
    nationality: "Russian-Canadian",
    flagEmoji: "🇨🇦",
    tagline: "Technical Lines. Zero Margin for Error.",
    bio: "Raised in the Chugach Range and trained in the Canadian Rockies, Sasha brings a mountaineer's precision to ski guiding. He came to Hokkaido in 2019 and immediately recognised Kiroro and Furano's underrated backcountry potential. His speciality is multi-day traverses and technical off-piste analysis for expert-level clients who want more than a powder day—they want an expedition. Sasha holds full ACMG certification and is an certified avalanche professional.",
    seasons: ["winter", "summer"],
    certifications: [
      { label: "ACMG Ski Guide", issuer: "Association of Canadian Mountain Guides", year: 2015 },
      { label: "CAA Industry Member", issuer: "Canadian Avalanche Association", year: 2016 },
      { label: "Swift Water Rescue", issuer: "Rescue 3 International", year: 2020 },
    ],
    specialties: ["Technical Backcountry", "Multi-Day Traverses", "Kiroro / Furano", "Alpine Summer Trekking"],
    photo: "/images/team/sasha-volkov.jpg",
    languages: ["English", "Russian"],
    calendar: mockCalendar([1, 2, 8, 9, 14, 15, 20, 21, 26, 27]),
  },
  {
    id: "chen-wei",
    name: "Chen Wei",
    nationality: "Taiwanese-Japanese",
    flagEmoji: "🇹🇼",
    tagline: "Snow Science. Data-Driven Lines.",
    bio: "Chen Wei holds a degree in atmospheric science from Tohoku University, which gives his guiding a genuinely technical dimension that most clients find revelatory. He pioneered HEC's snow science briefing—a pre-tour session using actual snowpack data, weather modelling, and terrain mapping that transforms a powder day into an educational expedition. His language skills make him the team's primary guide for Mandarin-speaking clients across all locations.",
    seasons: ["winter"],
    certifications: [
      { label: "JMGA Ski Guide", issuer: "Japan Mountain Guides Association", year: 2019 },
      { label: "AIARE Level 2", issuer: "American Institute for Avalanche Research", year: 2020 },
      { label: "B.Sc. Atmospheric Science", issuer: "Tohoku University", year: 2014 },
    ],
    specialties: ["Snow Science Briefings", "Tech Analysis", "Niseko / Rusutsu", "Mandarin-Speaking Groups"],
    photo: "/images/team/chen-wei.jpg",
    languages: ["Mandarin", "Japanese", "English"],
    calendar: mockCalendar([2, 3, 9, 10, 16, 17, 23, 24]),
  },
  {
    id: "emma-larsen",
    name: "Emma Larsen",
    nationality: "Norwegian",
    flagEmoji: "🇳🇴",
    tagline: "Alpine Summer. Wildflower Highlands.",
    bio: "Emma arrived in Hokkaido for a single winter season and never left. A former competitive telemark skier from Bergen, she discovered Hokkaido's summer alpine landscape and pivoted into year-round guiding. Emma leads HEC's summer programme across Daisetsuzan and Shiretoko, where her botanical knowledge and wildlife expertise create an entirely different kind of premium experience. She is also a certified mountain photographer and leads the team's photography guiding packages.",
    seasons: ["summer"],
    certifications: [
      { label: "UIAGM Mountain Guide", issuer: "International Federation of Mountain Guides", year: 2017 },
      { label: "Wilderness First Aid", issuer: "WMA International", year: 2022 },
      { label: "Nature Photography Guide", issuer: "Photography Tour Pro", year: 2021 },
    ],
    specialties: ["Summer Alpine", "Wildlife & Flora", "Daisetsuzan / Shiretoko", "Photography Tours"],
    photo: "/images/team/emma-larsen.jpg",
    languages: ["English", "Norwegian", "Japanese (conversational)"],
    calendar: mockCalendar([4, 5, 11, 12, 18, 19, 25, 26]),
  },
];

export const getGuidesBySeason = (season: "winter" | "summer") =>
  guides.filter((g) => g.seasons.includes(season));

export const getGuideById = (id: string) =>
  guides.find((g) => g.id === id) ?? null;
