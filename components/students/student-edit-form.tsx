"use client";

import { Button } from "@/components/ui/button";
import {
  studentEditSchema,
  StudentEditSchemaType,
} from "@/lib/validations/student";
import { useFieldArray, useForm } from "react-hook-form";
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

import React from "react";
import { Input } from "../ui/input";
import { Icons } from "../icons";
import { Facility, FixedUsageDayOfWeek, School, User } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  calculateEnrollmentAcademicYear,
  calculateGrade,
  StudentWithParntAndFacilityAndSchoolAndClasses,
} from "@/lib/students";
import ClassesFormField from "./classes-form-field";
import { DevTool } from "@hookform/devtools";
import FixedUsageDayOfWeeksFormField from "./fixed-usage-day-of-weeks-form-field";
import { nullable } from "zod";

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
  const router = useRouter();

  const form = useForm<StudentEditSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(studentEditSchema),
    defaultValues: {
      parents: student.parents.map((p) => ({
        id: p.id,
        name: p.name ?? undefined,
        email: p.email,
      })),
      name: student.name,
      facilityId: student.facilityId,
      schoolId: student.schoolId,
      grade: calculateGrade(student.schoolEnrollmentAcademicYear),
      classes: student.classes,
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

  const parentFieldArray = useFieldArray({
    control: form.control,
    name: "parents",
  });

  const classFieldArray = useFieldArray({
    control: form.control,
    name: "classes",
    keyName: "key",
  });

  const onSubmit = async (data: StudentEditSchemaType) => {
    try {
      const response = await fetch(`/api/students/${student.id}`, {
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
          <div>
            {parentFieldArray.fields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <FormField
                  control={form.control}
                  name={`parents.${index}.name`}
                  render={({ field: formField }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>保護者氏名</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="保護者氏名を入力してください"
                          {...formField}
                          onBlur={formField.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`parents.${index}.email`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="メールアドレスを入力してください"
                          {...formField}
                          onBlur={formField.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-2 flex justify-end">
                  {parentFieldArray.fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => parentFieldArray.remove(index)}
                      variant="outline"
                      size="sm"
                      className="w-fit"
                    >
                      <Icons.trash className="mr-2 w-4 h-4" />
                      上記の保護者を削除
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => parentFieldArray.append({ name: "", email: "" })}
              variant="outline"
              size="sm"
              className="w-full mt-1"
            >
              <Icons.circlePlus className="mr-2 w-4 h-4" />
              保護者を追加
            </Button>
          </div>

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
                <FormLabel>
                  学校{" "}
                  <small>※学校を変更すると、クラス情報がリセットされます</small>
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    classFieldArray.replace([]);
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
                <FormLabel>
                  学年{" "}
                  <small>※学年を変更すると、クラス情報がリセットされます</small>
                </FormLabel>
                <Select
                  disabled={!form.getValues("schoolId")}
                  defaultValue={field.value.toString()}
                  onValueChange={(value) => {
                    field.onChange(Number(value));
                    classFieldArray.replace([]);
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

          <ClassesFormField form={form} classFieldArray={classFieldArray} />

          <FixedUsageDayOfWeeksFormField form={form} />

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

      {/* <DevTool control={form.control} /> */}
    </>
  );
};

export default StudentEditForm;
