import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// ─── Drizzle client ──────────────────────────────────────────────────────────
// Uses Neon's HTTP driver — works in Vercel Edge + Node runtimes, no connection
// pool to manage, ideal for serverless. For higher-throughput needs later, swap
// to `drizzle-orm/neon-serverless` with WebSocket pooling.
//
// `DATABASE_URL` lives in .env.local (server-only, never exposed to the browser).

if (!process.env.DATABASE_URL) {
  // Don't crash at module-load on Vercel during build if the var is missing —
  // the build doesn't actually use the DB. Throwing happens only on real use.
  // (Once boss greenlights, set DATABASE_URL on Vercel before deploy.)
}

const sql = neon(process.env.DATABASE_URL ?? "");

export const db = drizzle(sql, { schema });
export { schema };
