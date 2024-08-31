"use client";

import { signOut } from "next-auth/react";
import React from "react";

type Props = {};

const CalendarHeader = (props: Props) => {
  return (
    <div className="bg-primary text-primary-foreground h-[56px] text-[20px] font-medium">
      <div className="max-w-md flex justify-between items-center h-full mx-auto p-[16px]">
        {process.env.NEXT_PUBLIC_SITE_NAME}
        <p
          onClick={async () => await signOut()}
          className="cursor-pointer text-[16px]"
        >
          ログアウト
        </p>
      </div>
    </div>
  );
};

export default CalendarHeader;
