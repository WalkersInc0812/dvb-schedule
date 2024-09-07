"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { buttonVariants } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [role, setRole] = useState("STAFF");
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      role,
    });

    if (result && result.ok) {
      if (role === "PARENT") {
        router.push("/calendar");
      } else if (role === "STAFF") {
        router.push("/admin/schedules");
      }
    } else {
      console.error(result?.error);
      setError("Invalid role");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div
        className={cn("flex items-center justify-between gap-2", className)}
        {...props}
      >
        <Select required defaultValue="STAFF">
          <SelectTrigger>
            <SelectValue placeholder="職員" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STAFF">職員</SelectItem>
            <SelectItem value="PARENT">保護者</SelectItem>
          </SelectContent>
        </Select>
        <p className="min-w-fit">として</p>
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Login
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
