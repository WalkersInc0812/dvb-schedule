"use client";

import { toast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const CalendarHeader = (props: Props) => {
  const router = useRouter();

  return (
    <div className="bg-primary text-primary-foreground h-[56px] text-[20px] font-medium">
      <div className="max-w-md flex justify-between items-center h-full mx-auto p-[16px]">
        {process.env.NEXT_PUBLIC_SITE_NAME}
        <p
          onClick={async () => {
            await signOut({
              redirect: false,
            });
            router.push(window.location.origin);
            toast({
              title: "ログアウトしました",
            });
          }}
          className="cursor-pointer text-[16px]"
        >
          ログアウト
        </p>
      </div>
    </div>
  );
};

export default CalendarHeader;
