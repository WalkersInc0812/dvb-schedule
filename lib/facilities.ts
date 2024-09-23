import { db } from "./db";

export async function getFacilities() {
  const facilities = await db.facility.findMany();
  return facilities;
}
