import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

// ─── Leads ────────────────────────────────────────────────────────────────────
// One row per inquiry-form submission. Mirrors `InquiryForm` in src/types/index.ts
// plus operational fields (`status`, `contactedAt`) for future admin use.
//
// NOTE: This table exists but is NOT yet written to. Wiring the form to insert
// rows is a future task — see the plan's "Future-Activation Checklist".

export const leads = pgTable("leads", {
  id:             serial("id").primaryKey(),
  createdAt:      timestamp("created_at").defaultNow().notNull(),

  // Submitted by the user (matches InquiryForm)
  name:           text("name").notNull(),
  email:          text("email").notNull(),
  whatsapp:       text("whatsapp"),
  skillLevel:     text("skill_level"),  // "beginner" | "intermediate" | "advanced" | "expert"
  notes:          text("notes"),

  // Context captured from the checkout flow at submission time
  guideRequested: text("guide_requested"),         // optional — from openCheckout({ guide })
  rateContext:    jsonb("rate_context"),           // optional — RateResult snapshot

  // Operational fields (managed by future admin UI)
  status:         text("status").default("new").notNull(),  // "new" | "contacted" | "booked" | "lost"
  contactedAt:    timestamp("contacted_at"),
});

export type Lead       = typeof leads.$inferSelect;
export type NewLead    = typeof leads.$inferInsert;
