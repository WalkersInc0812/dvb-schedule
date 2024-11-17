// TODO: 動作確認

"use client";

import { Button } from "@/components/ui/button";
import {
  studentEditSchema,
  StudentEditSchemaType,
} from "@/lib/validations/student";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import React, { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Icons } from "../icons";
import {
  Class,
  Facility,
  FixedUsageDayOfWeek,
  School,
  Student,
} from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { searchClasses } from "../../lib/classes";
import { getMonth, getYear } from "date-fns";
import {
  calculateEnrollmentAcademicYear,
  calculateGrade,
  StudentWithParntAndFacilityAndSchoolAndClasses,
} from "@/lib/students";
import FixedUsageDayOfWeeksFormField from "./fixed-usage-day-of-weeks-form-field";
import ClassesFormField from "./classes-form-field";
import { DevTool } from "@hookform/devtools";

type Props = {
  student: StudentWithParntAndFacilityAndSchoolAndClasses;
  studentFixedUsageDayOfWeeks: FixedUsageDayOfWeek[];
  facilities: Facility[];
  schools: School[];
  onSuccess?: () => void;
  onError?: () => void;
};

const StudentEditForm = ({
  student,
  studentFixedUsageDayOfWeeks,
  facilities,
  schools,
  onSuccess,
  onError,
}: Props) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isPending, startTransition] = useTransition();

  console.log(student);

  const router = useRouter();

  const form = useForm<StudentEditSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(studentEditSchema),
    defaultValues: {
      parent: {
        name: student.parent.name ?? undefined,
        email: student.parent.email,
      },
      name: student.name,
      facilityId: student.facilityId,
      schoolId: student.schoolId,
      grade: calculateGrade(student.schoolEnrollmentAcademicYear),
      classes: [1, 2, 3, 4, 5, 6].map((grade) =>
        student.classes.find((c) => c.grade === grade)
      ),
      fixedUsageDayOfWeeks: studentFixedUsageDayOfWeeks.map((f) => ({
        year: f.month.split("-")[0],
        month: f.month.split("-")[1],
        dayOfWeek: f.dayOfWeek,
        startTime: f.startTime ?? undefined,
        endTime: f.endTime ?? undefined,
        needPickup: f.needPickup,
        program1: {
          programId: f.program1Id ?? undefined,
          startTime: f.program1StartTime ?? undefined,
          endTime: f.program1EndTime ?? undefined,
        },
        program2: {
          programId: f.program2Id ?? undefined,
          startTime: f.program2StartTime ?? undefined,
          endTime: f.program2EndTime ?? undefined,
        },
      })),
    },
  });

  const onSubmit = async (data: StudentEditSchemaType) => {
    try {
      const response = await fetch("/api/students/${student.id}", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      toast({
        title: "利用者を更新しました",
        description: "利用者一覧に表示されます。",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "利用者の更新に失敗しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="parent.name"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>保護者氏名</FormLabel>
                <FormControl>
                  <Input
                    placeholder="保護者氏名を入力してください"
                    {...field}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parent.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <Input
                    placeholder="メールアドレスを入力してください"
                    {...field}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>児童氏名</FormLabel>
                <FormControl>
                  <Input
                    placeholder="児童氏名を入力してください"
                    {...field}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"facilityId"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>教室</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger onBlur={field.onBlur}>
                      <SelectValue placeholder="教室を選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"schoolId"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>学校</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.resetField("grade");
                    form.resetField("classes");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger onBlur={field.onBlur}>
                      <SelectValue placeholder="学校を選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"grade"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>学年</FormLabel>
                <Select
                  disabled={!form.getValues("schoolId")}
                  defaultValue={field.value.toString()}
                  onValueChange={(value) => {
                    field.onChange(Number(value));
                    form.resetField("classes");
                  }}
                >
                  <FormControl>
                    <SelectTrigger onBlur={field.onBlur}>
                      <SelectValue placeholder="学年を選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                {field.value && (
                  <p>
                    入学年度: {calculateEnrollmentAcademicYear(field.value)}年
                  </p>
                )}
              </FormItem>
            )}
          />

          <ClassesFormField form={form} />

          <Button
            type="submit"
            className="w-full"
            disabled={
              !form.formState.isValid ||
              form.formState.isLoading ||
              form.formState.isSubmitting
            }
          >
            {form.formState.isLoading ||
              (form.formState.isSubmitting && (
                <Icons.spinner className="animate-spin mr-2 w-4 h-4" />
              ))}
            更新
          </Button>
        </form>
      </Form>

      <DevTool control={form.control} />
    </>
  );
};

export default StudentEditForm;
