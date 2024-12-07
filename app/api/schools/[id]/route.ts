import { db } from "@/lib/db";
import { checkIsStaff, getCurrentUser } from "@/lib/session";
import { schoolUpdateSchema } from "@/lib/validations/school";
import { Class } from "@prisma/client";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(null, { status: 403 });
    }

    const isStaff = await checkIsStaff();
    if (!isStaff) {
      return new Response(null, { status: 400 });
    }

    const body = await req.json();
    const payload = schoolUpdateSchema.parse(body);

    const makeClassKey = (
      c: Pick<Class, "schoolId" | "academicYear" | "grade" | "name">
    ) => `${c.schoolId}-${c.academicYear}-${c.grade}-${c.name}`;

    const classes = await db.class.findMany({
      where: { schoolId: context.params.id },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    const classesForCreate = payload.classes.filter((c) => {
      const key = makeClassKey({ ...c, schoolId: context.params.id });
      return !classes.some(
        (pc) => makeClassKey({ ...pc, schoolId: context.params.id }) === key
      );
    });

    const classesForUpdate = classes.filter((c) => {
      const key = makeClassKey(c);
      return payload.classes.some(
        (pc) => makeClassKey({ ...pc, schoolId: context.params.id }) === key
      );
    });

    const classesForDelete = classes.filter((c) => {
      const key = makeClassKey(c);
      return !payload.classes.some(
        (pc) => makeClassKey({ ...pc, schoolId: context.params.id }) === key
      );
    });

    for (const class_ of classesForDelete) {
      if (class_._count.students > 0) {
        throw new Error("クラスに生徒が所属しているため削除できません");
      }
    }

    await db.$transaction(
      async (tx) => {
        await tx.school.update({
          where: { id: context.params.id },
          data: {
            name: payload.name,
          },
        });

        await Promise.all([
          ...classesForCreate.map(({ _count, ...class_ }) =>
            tx.class.create({
              data: {
                ...class_,
                schoolId: context.params.id,
              },
            })
          ),
          ...classesForUpdate.map((class_) =>
            tx.class.update({
              where: {
                id: class_.id,
              },
              data: {
                name: class_.name,
                deletedAt: null,
              },
            })
          ),
          ...classesForDelete.map((class_) =>
            tx.class.update({
              where: {
                id: class_.id,
              },
              data: {
                deletedAt: new Date(),
              },
            })
          ),
        ]);
      },
      {
        maxWait: 5000,
        timeout: 10000,
      }
    );

    return new Response(null, { status: 200 });
  } catch (e) {
    console.error(e);

    if (e instanceof z.ZodError) {
      return new Response(JSON.stringify(e.errors), { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
}

// 論理削除
export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response(null, { status: 403 });
    }

    const isStaff = await checkIsStaff();
    if (!isStaff) {
      return new Response(null, { status: 400 });
    }

    await db.school.update({
      where: { id: context.params.id },
      data: {
        deletedAt: new Date(),
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
