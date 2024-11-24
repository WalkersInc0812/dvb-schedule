import { Prisma } from "@prisma/client";
import { db } from "./db";

export type SchoolWithClassesAndStudentsCount = Prisma.SchoolGetPayload<{
  include: {
    classes: {
      include: {
        _count: {
          select: {
            students: true;
          };
        };
      };
    };
  };
}>;
export async function getSchoolsWithClasses(): Promise<
  SchoolWithClassesAndStudentsCount[]
> {
  const schools = await db.school.findMany({
    include: {
      classes: {
        where: {
          deletedAt: null,
        },
        include: {
          _count: {
            select: {
              students: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return schools;
}

export async function getSchools() {
  const schools = await db.school.findMany();

  return schools;
}
