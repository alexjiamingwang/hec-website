# HEC Blueprint — Living Project State

**Project:** Hokkaido Elite Club (HEC) — premium private mountain guiding website  
**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · next-intl v3.26.5 · framer-motion  
**Working directory:** `/Users/test/HEC`  
**Dev server:** `npm run dev` (port 3000)

---

## Completed Steps

### Step 1 — Project scaffold ✅
- Next.js 14 + TypeScript + Tailwind CSS + App Router initialised
- `src/` directory layout with `[locale]` dynamic segment for next-intl
- Custom Tailwind tokens: `obsidian`, `obsidian-50`, `obsidian-100`, `slate-hec`, `slate-dark`, `stark`, `stark-muted`, `winter-accent`, `summer-accent`
- Three Google fonts loaded via `next/font`: Playfair Display, DM Sans, DM Mono
- Global CSS with utility classes: `glass`, `section-container`, `hec-divider`, `accent-text`, `accent-bg`, `accent-border`, `grain` texture overlay
- `next-intl` middleware + `createNextIntlPlugin` configured in `next.config.mjs`
- `src/i18n.ts` — uses `requestLocale` API (v3.26.5 compat)
- Root `src/app/layout.tsx` is a minimal shell; all providers in `src/app/[locale]/layout.tsx`
- Proxy configured for Clash VPN: `http://127.0.0.1:49554`

### Step 2 — Hero Section ✅
- File: `src/components/hero/HeroSection.tsx`
- Full-screen gradient hero (season-tinted dark), `data-season` on `documentElement`
- `AnimatePresence mode="wait"` on headline/subheadline/tagline keyed to `season`
- EST. 2024 badge, Playfair Display headline, CTA scrolls to `#services`
- Scroll indicator at bottom

### Step 3 — Services + Rate Calculator ✅
- File: `src/components/services/ServicesSection.tsx`
- 6-card grid with staggered `whileInView` animation, AnimatePresence on season swap
- `useMessageResolver()` helper for dynamic i18n key lookup via `useMessages()`
- Rate Calculator winter-only (`{isWinter && <RateCalculator />}`)
- `RateCalculator.tsx` — custom `CustomDropdown` with CSS var styling, area/seasonality/duration/groupSize/specifiedInstructor inputs, JPY output (total only, no deposit shown)

### Step 4 — Team Section ✅
- Files: `src/components/team/TeamSection.tsx`, `GuideModal.tsx`
- **Carousel with peek effect**: center guide full-size; prev/next guides ghost-peek from sides (opacity 0.32, scale 0.87, clipped to 72px each side)
- Mibo Yu is first guide (first in `data/guides.ts`)
- Season-change resets carousel to index 0
- `GuideModal.tsx` — fully season-aware CSS vars, availability calendar, certifications, CTA → `openCheckout`
- Image error handling: `onError` hides broken `<img>`, shows gradient placeholder

### Step 5 — Gallery ✅
- File: `src/components/gallery/GallerySection.tsx`
- Carousel with directional slide animation (framer-motion, direction state)
- Click photo → Lightbox (fixed z-[200], `objectFit: contain`, ESC/arrow key nav, body scroll lock)
- `ArrowBtn` component, dot indicators, caption bar
- Season-change resets to photo 0
- Image error handling: `onError` hides broken img, shows `var(--surface-2)` background
- ⚠️ Winter photos (`winter-01.jpg` through `winter-08.jpg`) not yet provided — graceful gradient placeholder shown

### Step 6 — Checkout / Intake Modal ✅
- File: `src/components/checkout/CheckoutModal.tsx`
- Fully season-aware CSS vars (no hardcoded obsidian/dark classes)
- Pre-populated rate summary: area label, breakdown, total, deposit (30%)
- Inquiry form with focus-ring accent on inputs
- "Pay Deposit" button: Square link placeholder (TODO: add real Square link)
- Success state on form submit
- ESC key + body scroll lock while open

### Step 7 — SEO / Metadata ✅
- File: `src/app/[locale]/layout.tsx`
- `generateMetadata()` (async, locale-aware) replacing static `metadata` export
- EN / JA / ZH title + description per locale
- `alternates.canonical` + `alternates.languages` hreflang links
- OpenGraph + Twitter card meta
- `robots: { index: true, follow: true }`

---

## Data Files — Current State

| File | Status |
|------|--------|
| `data/pricing.ts` | ✅ Real JPY pricing, `calculateRate()`, `formatYen()`, `CANCELLATION_POLICY` |
| `data/gallery.ts` | ✅ 8 winter + 12 summer entries; winter srcs reference missing files (graceful fallback) |
| `data/guides.ts` | ✅ Mibo Yu first; all 5 guides with real certs; `mockCalendar()` for availability |
| `data/services.ts` | ✅ 6 winter + 6 summer services (SUP, kayak, boat charter, coastal, concierge, photography) |

---

## Components — Current State

| File | Status |
|------|--------|
| `src/components/hero/HeroSection.tsx` | ✅ Complete |
| `src/components/navbar/Navbar.tsx` | ✅ Complete — logo, left-aligned nav links, icons-only SeasonToggle |
| `src/components/navbar/SeasonToggle.tsx` | ✅ Complete — icons-only, 64px track |
| `src/components/navbar/LanguageSwitcher.tsx` | ✅ Adapts via CSS summer overrides |
| `src/components/services/ServicesSection.tsx` | ✅ Complete |
| `src/components/services/RateCalculator.tsx` | ✅ Complete — custom dropdowns, JPY, winter-only |
| `src/components/team/TeamSection.tsx` | ✅ Complete — peek carousel, Mibo first |
| `src/components/team/GuideModal.tsx` | ✅ Complete — season-aware CSS vars |
| `src/components/gallery/GallerySection.tsx` | ✅ Complete — carousel + lightbox |
| `src/components/checkout/CheckoutModal.tsx` | ✅ Complete — season-aware CSS vars |
| `src/context/CheckoutContext.tsx` | ✅ Complete — `RateResult` from `data/pricing.ts` |
| `src/context/SeasonContext.tsx` | ✅ Complete — `data-season` attribute |
| `src/types/index.ts` | ✅ Complete |

---

## Message Files — Current State

All three locales (`en.json`, `ja.json`, `zh.json`) are up to date with:
- Calculator keys (title, season/area/duration/group labels, specifiedInstructor, peak/regular dates)
- Summer service keys (sup, seaKayaking, boatCharter, coastal, concierge, photography)
- Team section keys (availability, certifications, specialties, languages, inquireGuide, calendar statuses)

---

## Pricing Structure (reference)

**Source:** Official 2025–2026 price sheet (JPY, per group)

| Area | Season | Group | 3hr | 6hr | 7hr |
|------|--------|-------|-----|-----|-----|
| Sapporo | Regular | 1-4 | ¥60,000 | ¥80,000 | ¥95,000 |
| Sapporo | Regular | 5 | ¥75,000 | ¥95,000 | ¥110,000 |
| Sapporo | Regular | 6 | ¥90,000 | ¥110,000 | ¥125,000 |
| Sapporo | Peak | 1-4 | ¥80,000 | ¥100,000 | ¥115,000 |
| Sapporo | Peak | 5 | ¥95,000 | ¥115,000 | ¥130,000 |
| Sapporo | Peak | 6 | ¥110,000 | ¥130,000 | ¥145,000 |
| Outside Sapporo | Regular | 1-4 | ¥80,000 | ¥100,000 | ¥115,000 |
| Outside Sapporo | Regular | 5 | ¥95,000 | ¥115,000 | ¥130,000 |
| Outside Sapporo | Regular | 6 | ¥110,000 | ¥130,000 | ¥145,000 |
| Outside Sapporo | Peak | 1-4 | ¥100,000 | ¥120,000 | ¥135,000 |
| Outside Sapporo | Peak | 5 | ¥115,000 | ¥135,000 | ¥150,000 |
| Outside Sapporo | Peak | 6 | ¥130,000 | ¥150,000 | ¥165,000 |

Specified instructor surcharge: +¥10,000  
Deposit: 30% of total  
Peak season: Dec 15–Jan 12 & Jan 24–Feb 25  
Regular season: Nov 20–Dec 14 | Jan 13–23 | Feb 26–season end

---

## Guide Roster

| Guide | Order | Seasons | Languages | Key Skills |
|-------|-------|---------|-----------|------------|
| Mibo Yu (Jianyun) | 1st | Winter + Summer | ZH/JP/EN | SUP/kayak/boat charter, SIA/SAJ L4 ski examiner |
| Kai Nakamura | 2nd | Winter | JP/EN | Niseko/Rusutsu backcountry, powder specialist |
| Sasha Volkov | 3rd | Winter + Summer | EN/RU | Technical backcountry, multi-day traverses |
| Chen Wei | 4th | Winter | ZH/JP/EN | Snow science briefings, Mandarin-speaking groups |
| Emma Larsen | 5th | Summer | EN/NO/JP | Photography tours, wildlife, Daisetsuzan/Shiretoko |

---

## Public Assets

- `/public/images/gallery/summer-01.jpg` through `summer-12.jpg` — 12 summer photos ✅
- `/public/images/gallery/winter-01.jpg` through `winter-08.jpg` — ⚠️ MISSING (no source material in `/website_material/照片及视频/` — only summer folder present)
- `/public/images/team/mibo-yu.jpg` — ✅ real photo
- `/public/images/team/kai-nakamura.jpg`, `sasha-volkov.jpg`, `chen-wei.jpg`, `emma-larsen.jpg` — ⚠️ MISSING (gradient placeholder renders instead)

---

## Remaining Tasks

1. **Square payment link** — replace `href="#"` in `CheckoutModal.tsx` Pay Deposit button with real Square checkout URL (user to provide)
2. **Winter gallery photos** — no source material available; user needs to supply 8 winter photos → copy to `/public/images/gallery/winter-01.jpg` through `winter-08.jpg`
3. **Team photos** — user needs to supply photos for Kai, Sasha, Chen Wei, Emma → copy to `/public/images/team/<guide-id>.jpg`
4. **Visual QA** — open `http://localhost:3000/en`, verify winter + summer modes, EN/JA/ZH, all sections

---

## Known Working Patterns

- **next-intl v3.26.5:** Use `requestLocale` in `i18n.ts`, NOT the deprecated `{ locale }` param
- **Season CSS:** `data-season` attribute on `document.documentElement` (set in `SeasonContext.tsx`). Summer overrides live in `globals.css` `[data-season="summer"]` blocks
- **CSS specificity trick:** `[data-season="summer"] .bg-obsidian` (0,2,0) beats Tailwind `.bg-obsidian` (0,1,0) — covers legacy Tailwind class usage
- **Season-aware dynamic styles:** Use inline `style` props with `var(--season-accent)`, `var(--text-primary)` etc. for hover states and JS-driven colors
- **i18n in client components:** Use `useMessages()` + dot-path traversal helper (not `useTranslations()` for dynamic keys)
- **File writes:** Always `Read` before `Write`/`Edit` in any session
- **npm proxy:** Clash VPN → `http://127.0.0.1:49554` (set via `npm config`)
- **Carousel peek pattern:** Overflow-hidden stage with absolute left/right clip zones (PEEK px wide) anchoring ghost cards; center card area = `inset: 0 PEEK 0 PEEK`
