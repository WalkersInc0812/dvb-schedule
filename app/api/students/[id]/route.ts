import { db } from "@/lib/db";
import { checkIsStaff, getCurrentUser } from "@/lib/session";
import { calculateEnrollmentAcademicYear } from "@/lib/students";
import { studentEditSchema } from "@/lib/validations/student";
import { z } from "zod";

export const maxDuration = 60;

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

// ここがDB実装
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
    const payload = studentEditSchema.parse(body);
    const parents = await db.user.findMany({
      where: {
        students: {
          some: {
            id: context.params.id,
          },
        },
      },
    });

    await db.$transaction(
      async (tx) => {
        // parents.idがDBにあればupdate
        // parents.idがDBになければcreate
        // payload.parents.idが無いがpayload.parents.emailがDB上にあれば接続
        // DBにあるのにpayloadに無ければ接続解除

        // 学生の親のIDの配列を取得
        const existingParentIds = parents.map((parent) => parent.id);
        // payloadの親のIDの配列を取得
        const payloadParentIds = payload.parents
          .map((parent) => parent.id)
          .filter((id) => id !== undefined) as string[];

        // 更新または作成する親の処理
        for (const parent of payload.parents) {
          if (parent.id) {
            // 更新
            await tx.user.update({
              where: { id: parent.id },
              data: {
                name: parent.name,
                email: parent.email,
                students: {
                  connect: { id: context.params.id },
                },
              },
            });
          } else {
            // IDがない場合、メールアドレスで検索
            const existingParent = await tx.user.findUnique({
              where: { email: parent.email },
            });

            if (existingParent) {
              // メールアドレスが存在する場合、接続
              await tx.user.update({
                where: { id: existingParent.id },
                data: {
                  name: parent.name,
                  students: {
                    connect: { id: context.params.id },
                  },
                },
              });
              payloadParentIds.push(existingParent.id);
            } else {
              // 作成
              const createdParent = await tx.user.create({
                data: {
                  name: parent.name,
                  email: parent.email,
                  students: {
                    connect: { id: context.params.id },
                  },
                },
              });
              payloadParentIds.push(createdParent.id);
            }
          }
        }

        // 接続解除の処理
        for (const existingParentId of existingParentIds) {
          if (!payloadParentIds.includes(existingParentId)) {
            await tx.user.update({
              where: { id: existingParentId },
              data: {
                students: {
                  disconnect: { id: context.params.id },
                },
              },
            });
          }
        }

        await tx.student.update({
          where: { id: context.params.id },
          data: {
            name: payload.name,
            schoolId: payload.schoolId,
            facilityId: payload.facilityId,
            schoolEnrollmentAcademicYear: calculateEnrollmentAcademicYear(
              payload.grade
            ),
            classes: {
              set: payload.classes.map((class_) => ({ id: class_.id })),
            },
          },
        });

        await tx.fixedUsageDayOfWeek.deleteMany({
          where: { studentId: context.params.id },
        });

        const fixedUsageDayOfWeeksData = payload.fixedUsageDayOfWeeks.map(
          (fixedUsageDayOfWeek) => {
            const month = `${fixedUsageDayOfWeek.year}-${fixedUsageDayOfWeek.month}`;
            return {
              studentId: context.params.id,
              month,
              dayOfWeek: fixedUsageDayOfWeek.dayOfWeek,
              startTime: fixedUsageDayOfWeek.startTime || undefined,
              endTime: fixedUsageDayOfWeek.endTime || undefined,
              needPickup: fixedUsageDayOfWeek.needPickup,
              program1Id: fixedUsageDayOfWeek.program1?.programId || undefined,
              program1StartTime:
                fixedUsageDayOfWeek.program1?.startTime || undefined,
              program1EndTime:
                fixedUsageDayOfWeek.program1?.endTime || undefined,
              program2Id: fixedUsageDayOfWeek.program2?.programId || undefined,
              program2StartTime:
                fixedUsageDayOfWeek.program2?.startTime || undefined,
              program2EndTime:
                fixedUsageDayOfWeek.program2?.endTime || undefined,
              program3Id: fixedUsageDayOfWeek.program3?.programId || undefined,
              program3StartTime:
                fixedUsageDayOfWeek.program3?.startTime || undefined,
              program3EndTime:
                fixedUsageDayOfWeek.program3?.endTime || undefined,
            };
          }
        );

        await tx.fixedUsageDayOfWeek.createMany({
          data: fixedUsageDayOfWeeksData,
        });
      },
      {
        maxWait: 2000 * 2.5 * 2,
        timeout: 10000 * 2 * 2,
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

// 論地削除
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

    await db.student.update({
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
