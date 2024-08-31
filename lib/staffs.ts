import { db } from "./db";

export async function getStaffs() {
  const staffs = await db.user.findMany({
    where: {
      role: {
        in: ["STAFF", "SUPER_STAFF"],
      },
    },
  });
  return staffs;
}
