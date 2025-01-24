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
import { getStudentById } from "@/lib/students2";
import { getStudentsByParentId } from "@/lib/students2";

export const dynamic = "force-dynamic";

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

  useEffect(() => {
    startTransition(async () => {
      const students = await getStudentsByParentId({ parentId: user.id });
      setStudents(students);

      if (!params.id) {
        return;
      }
      const student = await getStudentById({ id: params.id });
      setStudent(student);
    });
  }, [user, params.id]);

  return (
    <div className="bg-primary text-primary-foreground h-[56px] text-[20px] font-medium">
      <div className="max-w-md flex justify-between items-center h-full mx-auto p-[16px]">
        {process.env.NEXT_PUBLIC_SITE_NAME}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-primary text-[12px]">
              <div>
                <p>{user.name}</p>
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
                    className="cursor-pointer"
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
                className="cursor-pointer text-destructive"
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
