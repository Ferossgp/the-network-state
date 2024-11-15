import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ownerTable = sqliteTable('owner', {
  id: text().primaryKey(),
  name: text().notNull(),
  preferences: text({ mode: 'json' }).default(sql`('{}')`),
})