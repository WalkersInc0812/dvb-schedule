"use client";

import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const dynamic = "force-dynamic";

type Props = {};

const AdminPage = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/schedules");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-screen translate-y-[-56px] flex items-center justify-center">
      <Icons.spinner className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
};

export default AdminPage;
