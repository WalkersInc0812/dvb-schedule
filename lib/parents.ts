"use server";

import { db } from "./db";

export async function getParents() {
  const parents = await db.user.findMany({
    where: {
      role: "PARENT",
    },
  });
  return parents;
}
