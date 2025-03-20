import { Prisma, PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";

export async function seedStudents(db: PrismaClient) {
  const parents = await db.user.findMany({
    where: {
      role: "PARENT",
    },
  });
  const facilities = await db.facility.findMany();
  const schools = await db.school.findMany();
  const classes = await db.class.findMany();

  let students: Prisma.StudentCreateInput[] = [];
  parents.forEach((parent, index) => {
    const facility = facilities[randomInt(facilities.length)];
    const school = schools[randomInt(schools.length)];
    const classesBySchool = classes.filter((c) => c.schoolId === school.id);
    const class_ = classesBySchool[randomInt(classesBySchool.length)];
    students.push({
      name: `児童${index + 1}`,
      schoolEnrollmentAcademicYear: [2022, 2023, 2024][randomInt(3)],
      parent: {
        connect: {
          id: parent.id,
        },
      },
      facility: {
        connect: {
          id: facility.id,
        },
      },
      school: {
        connect: {
          id: school.id,
        },
      },
      classes: {
        connect: {
          id: class_.id,
        },
      },
    });

    // add second student to some few parents
    if (index % 25 === 0) {
      students.push({
        name: `児童${index + 1}の姉妹兄弟`,
        schoolEnrollmentAcademicYear: [2022, 2023, 2024][randomInt(3)],
        parent: {
          connect: {
            id: parent.id,
          },
        },
        facility: {
          connect: {
            id: facility.id,
          },
        },
        school: {
          connect: {
            id: school.id,
          },
        },
        classes: {
          connect: {
            id: class_.id,
          },
        },
      });
    }
  });

  for (const student of students) {
    await db.student.create({
      data: student,
    });
  }
}
