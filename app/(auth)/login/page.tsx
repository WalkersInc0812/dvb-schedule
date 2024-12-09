import { Metadata } from "next";
import { UserAuthForm } from "@/components/user-auth-form";
import { db } from "@/lib/db";
import SignIn from "./_components/sign-in";
import Image from "next/image";

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
    <div className="container flex h-screen w-screen flex-col items-center justify-center gap-10">
      <Image
        src="/logo@4x.png"
        alt=""
        width={1200}
        height={480}
        className="max-w-[300px] w-full"
      />
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <SignIn />

        {/* {process.env.NODE_ENV === "development" && ( */}
        <UserAuthForm parents={parents} staffs={staffs} />
        {/* )} */}
      </div>
    </div>
  );
}
