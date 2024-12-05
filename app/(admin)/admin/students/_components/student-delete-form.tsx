"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { StudentWithParntAndFacilityAndSchoolAndClasses } from "@/lib/students";
import {
  studentDeleteSchema,
  StudentDeleteSchemaType,
} from "@/lib/validations/student";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  student: StudentWithParntAndFacilityAndSchoolAndClasses;
  onSuccess?: () => void;
  onError?: () => void;
};

const StudentDeleteForm = ({ student, onSuccess, onError }: Props) => {
  const router = useRouter();

  const form = useForm<StudentDeleteSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(studentDeleteSchema),
  });

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/students/${student.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      toast({
        title: "児童を削除しました",
        description: "テーブルから削除されます",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "児童の削除に失敗しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>児童氏名</FormLabel>
          <Input disabled value={student.name} />
        </FormItem>

        <FormItem>
          <FormLabel>学校</FormLabel>
          <Input disabled value={student.school.name} />
        </FormItem>

        <FormItem>
          <FormLabel>教室</FormLabel>
          <Input disabled value={student.facility.name} />
        </FormItem>

        <p className="text-[20px] font-bold text-center">
          本当に児童を削除しますか？
        </p>

        <Button
          type="submit"
          className="w-full"
          variant="destructive"
          disabled={
            !form.formState.isValid ||
            form.formState.isLoading ||
            form.formState.isSubmitting
          }
        >
          {(form.formState.isLoading || form.formState.isSubmitting) && (
            <Icons.spinner className="animate-spin mr-2 w-4 h-4" />
          )}
          児童を削除する
        </Button>
      </form>
    </Form>
  );
};

export default StudentDeleteForm;
