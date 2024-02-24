import { i18n } from "@/app/i18n/settings";
import { sql } from "drizzle-orm";
import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const combinations = pgTable(
  "combinations",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    elementA: varchar("element_a").notNull(),
    elementB: varchar("element_b").notNull(),
    result: varchar("result").notNull(),
    emoji: varchar("emoji").notNull(),
    language: varchar("language", { enum: i18n.locales }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    elementAIdx: index("element_a_idx").on(table.elementA),
    elementBIdx: index("element_b_idx").on(table.elementB),
  })
);
