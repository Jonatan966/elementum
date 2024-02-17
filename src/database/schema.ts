import { languages } from "@/app/i18n/settings";
import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const combinations = pgTable("combinations", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  elementA: varchar("element_a").notNull(),
  elementB: varchar("element_b").notNull(),
  result: varchar("result").notNull(),
  emoji: varchar("emoji").notNull(),
  language: varchar("language", { enum: languages }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
