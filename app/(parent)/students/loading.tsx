import { Icons } from "@/components/icons";
import React from "react";

type Props = {};

const CalendarLoading = (props: Props) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Icons.spinner className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
};

export default CalendarLoading;
