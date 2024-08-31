"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const AdminPage = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/parents");
  }, []);

  return <div>AdminPage</div>;
};

export default AdminPage;
