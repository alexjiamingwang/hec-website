# CLAUDE.md — Employee Handbook

Read this file at the start of every session before touching any code.

---

## Tech Stack

- **Framework:** Next.js 14 App Router (`src/` directory layout, `[locale]` dynamic segment)
- **Styling:** Tailwind CSS with custom design tokens (see `tailwind.config.ts`)
- **Language:** TypeScript (strict)
- **i18n:** next-intl v3.26.5 — uses `requestLocale` API (NOT the deprecated `{ locale }` param)
- **Animation:** framer-motion (AnimatePresence, motion, whileInView)
- **Fonts:** Playfair Display (display), DM Sans (body), DM Mono (mono)

## Data Layer

- **No databases.** All data lives in local `.ts` files under `/data/`.
- `/data/pricing.ts` — real JPY pricing table, `calculateRate()`, `formatYen()`
- `/data/gallery.ts` — 8 winter + 12 summer gallery images
- `/data/guides.ts` — 5 guides (Kai, Sasha, Mibo, Chen Wei, Emma)
- `/data/services.ts` — 6 winter + 6 summer services (i18n key references)
- Message files: `/messages/en.json`, `/messages/ja.json`, `/messages/zh.json`

## Safety Rules

1. **No compound bash commands** — never use `cd` combined with write or delete operations.
2. **Always use absolute file paths** for every file operation.
3. **Read before Write** — the Write tool requires the file to have been Read first in the same conversation.
4. **Ask before `npm install`** — confirm with user before adding any new package.

## Process

1. Explain logic in plain English before writing code.
2. Make changes in small, focused edits — one concern per edit.
3. After every successful task, update `h-e-c-blueprint.md` with the latest progress.

## Key Patterns

### Season-aware CSS
`SeasonContext` sets `data-season` attribute on `document.documentElement`. CSS uses `[data-season="winter"]` / `[data-season="summer"]` selectors. Use `var(--season-accent)` for accent colour.

### i18n key resolution in client components
Use `useMessages()` from next-intl and traverse the nested object with dot-path splitting. See `ServicesSection.tsx` `useMessageResolver()` helper.

### Checkout flow
`CheckoutContext` → `openCheckout({ rate, guide })` → `CheckoutModal` slides in from right. Rate data is `RateResult` from `data/pricing.ts`.

### Routing
next-intl middleware + `createNextIntlPlugin` in `next.config.mjs`. All pages live under `src/app/[locale]/`. Root `src/app/layout.tsx` is a minimal shell that just returns `children`.
