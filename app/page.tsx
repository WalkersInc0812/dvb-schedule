"use client";

import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const TopPage = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Icons.spinner className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
};

export default TopPage;
