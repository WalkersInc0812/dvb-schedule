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

export async function getStudentById({ id }: { id: string }) {
  const student = await db.student.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });
  return student;
}

export async function getStudentsByParentId({
  parentId,
}: {
  parentId: string;
}) {
  const students = await db.student.findMany({
    where: {
      parents: {
        some: {
          id: parentId,
        },
      },
      deletedAt: null,
    },
  });
  return students;
}
