import { db } from "@/lib/db";
import { checkIsScheduleOwner } from "@/lib/schedules";
import { checkIsParent, checkIsStaff, getCurrentUser } from "@/lib/session";
import { scheduleUpdateSchema } from "@/lib/validations/schedule";
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
    const isParent = await checkIsParent();
    if (isStaff) {
      // ok
    } else if (isParent) {
      const isScheduleOwner = await checkIsScheduleOwner({
        scheduleId: context.params.id,
        parentId: user.id,
      });
      if (!isScheduleOwner) {
        return new Response(null, { status: 400 });
      }
    } else {
      return new Response(null, { status: 400 });
    }

    const body = await req.json();
    const payload = scheduleUpdateSchema.parse({
      ...body,
      start: new Date(body.start),
      end: new Date(body.end),
    });

    await db.schedule.update({
      where: {
        id: context.params.id,
      },
      data: {
        start: payload.start,
        end: payload.end,
        meal: payload.meal,
        attendance: payload.attendance,
        notes: payload.notes,
        logs: {
          create: {
            userId: user.id,
            operation: "UPDATE",
          },
        },
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

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
    const isParent = await checkIsParent();
    if (isStaff) {
      // ok
    } else if (isParent) {
      const isScheduleOwner = await checkIsScheduleOwner({
        scheduleId: context.params.id,
        parentId: user.id,
      });
      if (!isScheduleOwner) {
        return new Response(null, { status: 400 });
      }
    } else {
      return new Response(null, { status: 400 });
    }

    await db.schedule.update({
      where: {
        id: context.params.id,
      },
      data: {
        deletedAt: new Date(),
        logs: {
          create: {
            userId: user.id,
            operation: "DELETE",
          },
        },
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
