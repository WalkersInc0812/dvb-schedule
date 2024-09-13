import { Icons } from "@/components/icons";
import React from "react";

type Props = {};

const AdminLoading = (props: Props) => {
  return (
    <div className="w-full h-screen translate-y-[-56px] flex items-center justify-center">
      <Icons.spinner className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
};

export default AdminLoading;
