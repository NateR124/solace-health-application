import db from "@/db";
import { advocates } from "@/db/schema";
import { advocateData } from "@/db/seed/advocates";
// import { toJsonbStringArray } from "@/db/seed/utils";

export async function POST() {
  await db.delete(advocates);

  const rows = advocateData.map(r => ({
    ...r,
    specialties: r.specialties,
  }));

  const records = await db.insert(advocates).values(rows).returning();
  return Response.json({ advocates: records });
}