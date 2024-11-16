import { InferSelectModel, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ColorValue } from "react-native";

export const ownerTable = sqliteTable('owner', {
  id: text().primaryKey(),
  name: text().notNull(),
  preferences: text({ mode: 'json' }).default(sql`('{}')`),
})

export const contactTable = sqliteTable('contacts', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  color: text().notNull().$type<ColorValue>(),
  headline: text(),
  description: text(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
})

export type Contact = InferSelectModel<typeof contactTable>

export const notesTable = sqliteTable('notes', {
  id: int().primaryKey({ autoIncrement: true }),
  note: text().notNull(),
  contactId: int().references(() => contactTable.id),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
})
