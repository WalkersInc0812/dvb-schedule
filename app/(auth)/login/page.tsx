import { Metadata } from "next";
import { UserAuthForm } from "@/components/user-auth-form";
import { db } from "@/lib/db";
import SignIn from "./_components/sign-in";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

async function getAllUsersByRole(role: string) {
  return await db.user.findMany({
    where: {
      role: role,
    },
  });
}

export default async function LoginPage() {
  const parents = await getAllUsersByRole("PARENT");
  const staffs = await getAllUsersByRole("STAFF");

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">ログイン</h1>
        </div>
        <SignIn />
        {/* TODO: only local after v1.0 */}
        <UserAuthForm parents={parents} staffs={staffs} />
      </div>
    </div>
  );
}
