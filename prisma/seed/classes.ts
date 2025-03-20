import { Prisma, PrismaClient } from "@prisma/client";

export async function seedClasses(db: PrismaClient) {
  const schools = await db.school.findMany();
  const academicYears = [2023, 2024];
  const grades = [1, 2, 3, 4, 5, 6];
  const classNumber = [1, 2, 3];

  let classes: Prisma.ClassCreateInput[] = [];
  schools.forEach((school) => {
    academicYears.forEach((academicYear) => {
      grades.forEach((grade) => {
        classNumber.forEach((number) => {
          classes.push({
            academicYear: academicYear,
            name: `${grade}-${number}`,
            grade: grade,
            school: {
              connect: {
                id: school.id,
              },
            },
          });
        });
      });
    });
  });

  for (const class_ of classes) {
    await db.class.create({
      data: class_,
    });
  }
}
