"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { Student } from "@prisma/client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { UserId, UserRole } from "@/types/next-auth";
import { User } from "next-auth";
import { getStudentById, getStudentsByParentId } from "@/lib/students2";

type Props = {
  user: User & {
    id: UserId;
    role: UserRole;
  };
};

const CalendarHeader = ({ user }: Props) => {
  const params = useParams<{ id: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  // 職員の場合の処理
  useEffect(() => {
    if (!["STAFF", "SUPER_STAFF"].includes(user.role)) {
      return;
    }

    startTransition(async () => {
      const student = await getStudentById({ id: params.id });
      if (student) {
        setStudents([student]);
      }
    });
  }, [user, params.id]);

  // 親の場合の処理
  useEffect(() => {
    if (user.role !== "PARENT") {
      return;
    }

    startTransition(async () => {
      const students = await getStudentsByParentId({ parentId: user.id });
      setStudents(students);
    });
  }, [user]);

  // studentsから児童を取得
  useEffect(() => {
    startTransition(async () => {
      const student = students.find((student) => student.id === params.id);
      if (!student) {
        return;
      }
      setStudent(student);
    });
  }, [students, params.id]);

  return (
    <div className="bg-primary text-primary-foreground h-[56px] text-[20px] font-medium top-0 z-50 sticky">
      <div className="max-w-md flex justify-between items-center h-full mx-auto p-[16px]">
        {process.env.NEXT_PUBLIC_SITE_NAME}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-primary text-[12px]">
              <div>
                <p>
                  {user.name}
                  {["STAFF", "SUPER_STAFF"].includes(user.role) && " (職員)"}
                </p>
                <p>{student?.name}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-fit">
            {students.length > 1 &&
              students.map((student) => (
                <DropdownMenuItem key={student.id}>
                  <p
                    onClick={() => {
                      router.push(`/students/${student.id}`);
                    }}
                    className="cursor-pointer w-full"
                  >
                    {student.name}
                  </p>
                </DropdownMenuItem>
              ))}
            <DropdownMenuItem>
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
                className="cursor-pointer text-destructive w-full"
              >
                ログアウト
              </p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CalendarHeader;
