import type { GalleryImage } from "@/types";

export const galleryImages: GalleryImage[] = [
  // ── Winter ────────────────────────────────────────────────────────────────
  { id: "w1",  src: "/images/gallery/winter-01.jpg", alt: "Niseko deep powder face shot",         caption: "Face shot season — Niseko",             season: "winter" },
  { id: "w2",  src: "/images/gallery/winter-02.jpg", alt: "Backcountry traverse above cloud line", caption: "Above the clouds — Kiroro traverse",     season: "winter" },
  { id: "w3",  src: "/images/gallery/winter-03.jpg", alt: "Tree skiing in Furano birch forest",    caption: "Birch lines — Furano",                   season: "winter" },
  { id: "w4",  src: "/images/gallery/winter-04.jpg", alt: "Guide checking snowpack with probe",    caption: "Snowpack analysis — pre-tour ritual",    season: "winter" },
  { id: "w5",  src: "/images/gallery/winter-05.jpg", alt: "Sunrise boot pack Rusutsu",             caption: "First light boot pack — Rusutsu",        season: "winter" },
  { id: "w6",  src: "/images/gallery/winter-06.jpg", alt: "Client dropping into steep chute",      caption: "Committing to the line",                 season: "winter" },
  { id: "w7",  src: "/images/gallery/winter-07.jpg", alt: "Traditional ryokan after a big day",    caption: "Rest and recovery — Niseko Ryokan",      season: "winter" },
  { id: "w8",  src: "/images/gallery/winter-08.jpg", alt: "Teine resort overview in morning fog",  caption: "Teine dawn — Sapporo below",             season: "winter" },

  // ── Summer ────────────────────────────────────────────────────────────────
  { id: "s1",  src: "/images/gallery/summer-01.jpg", alt: "Stand-up paddleboarding on Shakotan Peninsula",        caption: "Crystal water SUP — Shakotan",           season: "summer" },
  { id: "s2",  src: "/images/gallery/summer-02.jpg", alt: "Sea kayaking through coastal sea caves",               caption: "Sea cave passage — Shakotan coast",      season: "summer" },
  { id: "s3",  src: "/images/gallery/summer-03.jpg", alt: "Private boat charter on the Sea of Japan",             caption: "Open water charter — Sea of Japan",      season: "summer" },
  { id: "s4",  src: "/images/gallery/summer-04.jpg", alt: "Instructor demonstrating paddle technique on calm sea", caption: "Paddle form — morning glass",            season: "summer" },
  { id: "s5",  src: "/images/gallery/summer-05.jpg", alt: "Group SUP session in crystal-clear Shakotan bay",      caption: "Group SUP — Shakotan bay",               season: "summer" },
  { id: "s6",  src: "/images/gallery/summer-06.jpg", alt: "Dramatic Shakotan sea cliffs from kayak",              caption: "Cape Kamui cliffs — from the water",     season: "summer" },
  { id: "s7",  src: "/images/gallery/summer-07.jpg", alt: "Panoramic view of Shakotan Peninsula coastline",       caption: "Shakotan Peninsula — midsummer",         season: "summer" },
  { id: "s8",  src: "/images/gallery/summer-08.jpg", alt: "Sea kayaking at golden hour on the Hokkaido coast",    caption: "Golden hour paddle — Hokkaido coast",    season: "summer" },
  { id: "s9",  src: "/images/gallery/summer-09.jpg", alt: "Board and gear preparation on rocky Shakotan beach",   caption: "Pre-launch ritual — Shakotan",           season: "summer" },
  { id: "s10", src: "/images/gallery/summer-10.jpg", alt: "Snorkelling in the gin-clear waters of Shakotan",      caption: "Underwater clarity — Shakotan",          season: "summer" },
  { id: "s11", src: "/images/gallery/summer-11.jpg", alt: "Mibo leading a coastal exploration tour",              caption: "Coastal guide — Mibo Yu",                season: "summer" },
  { id: "s12", src: "/images/gallery/summer-12.jpg", alt: "Group on boat charter with Cape Kamui in background",  caption: "Boat charter — Cape Kamui backdrop",     season: "summer" },
];

export const getGalleryBySeason = (season: "winter" | "summer") =>
  galleryImages.filter((img) => img.season === season);
