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
    where: {
      deletedAt: null,
    },
    include: {
      classes: {
        where: {
          deletedAt: null,
        },
        include: {
          _count: {
            select: {
              students: {
                where: {
                  deletedAt: null,
                },
              },
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
  const schools = await db.school.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      name: "asc",
    },
  });

  return schools;
}
