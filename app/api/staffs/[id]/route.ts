import { db } from "@/lib/db";
import { checkIsStaff, getCurrentUser } from "@/lib/session";
import { staffUpdateSchema } from "@/lib/validations/staff";
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
    const payload = staffUpdateSchema.parse(body);

    await db.user.update({
      where: { id: context.params.id },
      data: {
        name: payload.name,
        email: payload.email,
      },
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

    await db.user.update({
      where: { id: context.params.id },
      data: {
        deletedAt: new Date(),
      },
    });

    return new Response(null, { status: 200 });
  } catch (e) {
    console.error(e);

    return new Response(null, { status: 500 });
  }
}
