import { db } from "@/lib/db";
import { checkIsStaff, getCurrentUser } from "@/lib/session";
import { staffCreateSchema } from "@/lib/validations/staff";
import { z } from "zod";

export async function POST(req: Request) {
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
    const payload = staffCreateSchema.parse(body);

    await db.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        role: "STAFF",
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
