import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  return session?.user;
}

export async function checkIsStaff() {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return ["STAFF", "SUPER_STAFF"].includes(user.role);
}

export async function checkIsParent() {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return user.role === "PARENT";
}
