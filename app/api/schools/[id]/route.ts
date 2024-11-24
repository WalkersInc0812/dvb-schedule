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

    await db.$transaction(async (tx) => {
      await tx.school.update({
        where: { id: context.params.id },
        data: {
          name: payload.name,
        },
      });

      const makeClassKey = (
        c: Pick<Class, "schoolId" | "academicYear" | "grade" | "name">
      ) => `${c.schoolId}-${c.academicYear}-${c.grade}-${c.name}`;

      const classes = await tx.class.findMany({
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
      for (const { _count, ...class_ } of classesForCreate) {
        await tx.class.create({
          data: {
            ...class_,
            schoolId: context.params.id,
          },
        });
      }

      const classesForUpdate = classes.filter((c) => {
        const key = makeClassKey(c);
        return payload.classes.some(
          (pc) => makeClassKey({ ...pc, schoolId: context.params.id }) === key
        );
      });
      for (const class_ of classesForUpdate) {
        await tx.class.update({
          where: {
            id: class_.id,
          },
          data: {
            name: class_.name,
            deletedAt: null,
          },
        });
      }

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

        await tx.class.update({
          where: {
            id: class_.id,
          },
          data: {
            deletedAt: new Date(),
          },
        });
      }
    });

    return new Response(null, { status: 200 });
  } catch (e) {
    console.error(e);

    if (e instanceof z.ZodError) {
      return new Response(JSON.stringify(e.errors), { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
}
