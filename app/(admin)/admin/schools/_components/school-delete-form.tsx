"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { SchoolWithClassesAndStudentsCount } from "@/lib/schools";
import {
  schoolDeleteSchema,
  SchoolUpdateSchemaType,
} from "@/lib/validations/school";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  school: SchoolWithClassesAndStudentsCount;
  onSuccess?: () => void;
  onError?: () => void;
};

const SchoolDeleteForm = ({ school, onSuccess, onError }: Props) => {
  const router = useRouter();

  const form = useForm<SchoolUpdateSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(schoolDeleteSchema),
  });

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/schools/${school.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete school");
      }

      toast({
        title: "学校を削除しました",
        description: "テーブルから削除されます",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "学校の削除に失敗しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>学校名</FormLabel>
          <Input disabled value={school.name} />
        </FormItem>

        <FormItem>
          <FormLabel>学校のクラス数</FormLabel>
          <Input disabled value={school.classes.length} />
        </FormItem>

        <FormItem>
          <FormLabel>学校の生徒数</FormLabel>
          <Input
            disabled
            value={school.classes.reduce(
              (acc, curr) => acc + curr._count.students,
              0
            )}
          />
        </FormItem>

        <p className="text-[20px] font-bold text-center">
          本当にこの学校を削除しますか？
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
          学校を削除する
        </Button>
      </form>
    </Form>
  );
};

export default SchoolDeleteForm;
