import { Prisma } from "@prisma/client";
import { db } from "./db";
import { getYear, getMonth } from "date-fns";

export type StudentWithParntAndFacilityAndSchoolAndClasses =
  Prisma.StudentGetPayload<{
    include: {
      parents: true;
      facility: true;
      school: true;
      classes: true;
      schedules: true;
    };
  }>;
export async function getStudents(): Promise<
  StudentWithParntAndFacilityAndSchoolAndClasses[]
> {
  const today = new Date();
  const thisMonthFirstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
  const monthAfterNextFirstDay = new Date(
    today.getFullYear(),
    today.getMonth() + 2,
    1,
    0,
    0,
    0,
    0
  );
  const students = await db.student.findMany({
    include: {
      parents: true,
      facility: true,
      school: true,
      classes: {
        orderBy: {
          name: "asc",
        },
      },
      schedules: {
        where: {
          start: {
            gte: thisMonthFirstDay,
            lt: monthAfterNextFirstDay,
          },
          deletedAt: null,
        },
      },
    },
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
    },
  });
  return students;
}

export function calculateGrade(enrollmentYear: number) {
  // 現在の日付を取得
  const now = new Date();
  const nowYear = getYear(now);
  const nowMonth = getMonth(now);

  // 現在の年と入学年の差を取得
  const diffYear = nowYear - enrollmentYear;

  // 現在が4月以降の場合は1学年増やす
  let grade = diffYear;
  if (nowMonth + 1 >= 4) {
    grade += 1;
  }

  return grade;
}

export function calculateEnrollmentAcademicYear(grade: number) {
  // 現在の日付を取得
  const now = new Date();
  const nowYear = getYear(now);
  const nowMonth = getMonth(now);

  // 学年と現在日時から入学年度を計算する
  // ただし、4月1日が年度開始日であることに注意
  const schoolEnrollmentAcademicYear =
    nowYear - (nowMonth < 3 ? 1 : 0) - (grade - 1);

  return schoolEnrollmentAcademicYear;
}
