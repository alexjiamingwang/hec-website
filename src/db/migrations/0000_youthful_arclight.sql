CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"whatsapp" text,
	"skill_level" text,
	"notes" text,
	"guide_requested" text,
	"rate_context" jsonb,
	"status" text DEFAULT 'new' NOT NULL,
	"contacted_at" timestamp
);
