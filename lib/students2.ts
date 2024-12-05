"use server";

import { db } from "./db";

export async function getStudents() {
  const students = await db.student.findMany({
    where: {
      deletedAt: null,
    },
  });
  return students;
}
