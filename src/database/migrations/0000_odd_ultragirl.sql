CREATE TABLE IF NOT EXISTS "combinations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"element_a" varchar NOT NULL,
	"element_b" varchar NOT NULL,
	"result" varchar NOT NULL,
	"emoji" varchar NOT NULL,
	"language" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
