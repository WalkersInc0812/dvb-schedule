import { db } from "./db";

export async function getSchools() {
  const schools = await db.school.findMany();

  return schools;
}
