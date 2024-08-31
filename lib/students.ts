import { db } from "./db";
import { differenceInYears, parse, isBefore } from "date-fns";

export async function getStudentsByParentId({
  parentId,
}: {
  parentId: string;
}) {
  const students = await db.student.findMany({
    where: {
      parentId,
    },
  });
  return students;
}

export function calculateGrade(enrollmentYear: number) {
  // 現在の日付を取得
  const currentDate = new Date();

  // 入学年度の4月1日の日付を作成
  const enrollmentDate = parse(
    `${enrollmentYear}-04-01`,
    "yyyy-MM-dd",
    new Date()
  );

  // 現在の日付と入学日の年数差を計算
  let grade = differenceInYears(currentDate, enrollmentDate);

  // 現在の日付が4月1日より前の場合、学年を1つ減らす
  const currentYear = currentDate.getFullYear();
  const newSchoolYearStart = parse(
    `${currentYear}-04-01`,
    "yyyy-MM-dd",
    new Date()
  );

  if (isBefore(currentDate, newSchoolYearStart)) {
    grade -= 1;
  }

  // 学年が0以下の場合は1年生とする
  grade = Math.max(grade, 1);

  return grade;
}
