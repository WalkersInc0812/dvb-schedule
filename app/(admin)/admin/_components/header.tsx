"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

type Props = {};

const AdminHeader = (props: Props) => {
  return (
    <div className="bg-primary text-primary-foreground h-[56px] flex items-center justify-between px-[72px]">
      <p className="text-[20px] font-medium">
        {process.env.NEXT_PUBLIC_SITE_NAME}【管理者画面】
      </p>
      <div className="space-x-[40px] text-[16px] text-bold">
        {/* <Link href="/admin">ホーム</Link> */}
        <Link href="/admin/schedules">予定管理</Link>
        {/* <Link href="/admin/parents">保護者管理</Link> */}
        {/* <Link href="/admin/students">児童管理</Link> */}
        {/* <Link href="/admin/staffs">職員管理</Link> */}
        {/* <Link href="/admin/schools">学校管理</Link> */}
        {/* <Link href="/admin/facilities">教室管理</Link> */}
        <Link href="/admin/metrics">メトリクス</Link>
        <span onClick={async () => await signOut()} className="cursor-pointer">
          ログアウト
        </span>
      </div>
    </div>
  );
};

export default AdminHeader;