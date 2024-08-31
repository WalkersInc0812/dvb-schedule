"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const TopPage = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin");
  }, []);

  return <div>TopPage</div>;
};

export default TopPage;
