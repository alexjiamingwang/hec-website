import { config } from "dotenv";
config({ path: ".env.local" });
import { defineConfig } from "drizzle-kit";

// Drizzle Kit config — used by `npm run db:generate` and `db:migrate`.
// Reads DATABASE_URL from .env.local automatically via dotenv.

export default defineConfig({
  schema:      "./src/db/schema.ts",
  out:         "./src/db/migrations",
  dialect:     "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict:  true,
});
