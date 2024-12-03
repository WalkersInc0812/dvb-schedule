"use client";

import { Button } from "@/components/ui/button";
import {
  studentCreateSchema,
  StudentCreateSchemaType,
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
import { Class, Facility, School } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { searchClasses } from "../../lib/classes";
import { getMonth, getYear } from "date-fns";
import { calculateEnrollmentAcademicYear } from "@/lib/students";

type Props = {
  facilities: Facility[];
  schools: School[];
  onSuccess?: () => void;
  onError?: () => void;
};

const StudentCreateForm = ({
  facilities,
  schools,
  onSuccess,
  onError,
}: Props) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<StudentCreateSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(studentCreateSchema),
    defaultValues: {
      parent: {
        name: "",
        email: "",
      },
      name: "",
      facilityId: "",
      schoolId: "",
      grade: undefined,
    },
  });

  const onSubmit = async (data: StudentCreateSchemaType) => {
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create student");
      }

      toast({
        title: "利用者を登録しました",
        description: "利用者一覧に表示されます。",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "利用者の登録に失敗しました",
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
                <FormLabel>保護者メールアドレス</FormLabel>
                <FormControl>
                  <Input
                    placeholder="保護者メールアドレスを入力してください"
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
                  onValueChange={(value) => {
                    field.onChange(Number(value));

                    const now = new Date();
                    const year = getYear(now);
                    const month = getMonth(now);
                    const academicYear = year - (month + 1 <= 3 ? 1 : 0);
                    startTransition(async () => {
                      const newClasses = await searchClasses({
                        schoolId: form.getValues("schoolId"),
                        academicYear,
                        grade: Number(value),
                      });
                      setClasses(newClasses);
                    });
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
            登録
          </Button>
        </form>
      </Form>

      {/* <DevTool control={form.control} /> */}
    </>
  );
};

export default StudentCreateForm;
