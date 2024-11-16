import { db } from "@/db/drizzle";
import { stringToHslColor } from "./colors";
import { ownerTable, recordingsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const SERVER_URL = 'https://eth-network-server.fly.dev'

export async function syncServerRecordings() {
  const owner = await db
    .select()
    .from(ownerTable)
    .where(eq(ownerTable.id, 'owner'))
    .execute()

  const uid = owner[0].omiUserId

  const recordings = await fetch(SERVER_URL + `/memories?uid=${uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => data.data?.map((memory: any) => ({
      name: memory.title,
      color: stringToHslColor(memory.title),
      description: memory.summary,
      raw: memory,
    })))

  await db
    .insert(recordingsTable)
    .values(recordings)
    .execute()
    .catch(console.error)

  // todo: remove the records from the server
}