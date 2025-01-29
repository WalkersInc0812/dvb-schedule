"use client";

import { toast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const AdminHeader = (props: Props) => {
  const router = useRouter();

  return (
    <div className="bg-primary text-primary-foreground h-[56px] flex items-center justify-between px-[72px] top-0 z-50 sticky">
      <p className="text-[20px] font-medium">
        {process.env.NEXT_PUBLIC_SITE_NAME}【管理者画面】
      </p>
      <div className="space-x-[40px] text-[16px] text-bold">
        {/* <Link href="/admin">ホーム</Link> */}
        <Link href="/admin/schedules">予定管理</Link>
        <Link href="/admin/students">利用者管理</Link>
        <Link href="/admin/schools">学校管理</Link>
        <Link href="/admin/programs">習い事管理</Link>
        <Link href="/admin/facilities">教室管理</Link>
        <Link href="/admin/staffs">職員管理</Link>
        <Link href="/admin/tools">ツール</Link>
        <span
          onClick={async () => {
            await signOut({
              redirect: false,
            });
            router.push(window.location.origin);
            toast({
              title: "ログアウトしました",
            });
          }}
          className="cursor-pointer"
        >
          ログアウト
        </span>
      </div>
    </div>
  );
};

export default AdminHeader;
