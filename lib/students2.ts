"use server";

import { db } from "./db";

export async function getStudents() {
  const students = await db.student.findMany();
  return students;
}
