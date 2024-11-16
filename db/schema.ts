import { InferSelectModel, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ColorValue } from "react-native";

export const ownerTable = sqliteTable("owner", {
  id: text().primaryKey(),
  name: text().notNull(),
  omiUserId: text().notNull(),
  preferences: text({ mode: "json" }).default(sql`('{}')`),
});

export const contactTable = sqliteTable("contacts", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  color: text().notNull().$type<ColorValue>(),
  headline: text(),
  description: text(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  raw: text({ mode: "json" }).$type<RawMemory>(),
});

export type Contact = InferSelectModel<typeof contactTable>;

export const notesTable = sqliteTable("notes", {
  id: int().primaryKey({ autoIncrement: true }),
  note: text().notNull(),
  contactId: int().references(() => contactTable.id),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
});

export const recordingsTable = sqliteTable("recordings", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text().notNull(),
  color: text().notNull().$type<ColorValue>(),
  createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  raw: text({ mode: "json" }).$type<RawMemory>(),
});

interface RawMemory {
  id: number;
  uid: string;
  memory_id: string;
  title: string;
  transcript: string;
  checksum: string;
  tx_hash: string;
  created_at: string;
  stored_at: string;
  name: string;
  summary: string;
  headline: string;
}
