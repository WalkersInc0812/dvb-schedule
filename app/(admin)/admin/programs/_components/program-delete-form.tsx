"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ProgramWithFixedUsageDaysCount } from "@/lib/programs";
import {
  programDeleteSchema,
  ProgramDeleteSchemaType,
} from "@/lib/validations/program";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  program: ProgramWithFixedUsageDaysCount;
  onSuccess?: () => void;
  onError?: () => void;
};

const ProgramDeleteForm = ({ program, onSuccess, onError }: Props) => {
  const router = useRouter();

  const form = useForm<ProgramDeleteSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(programDeleteSchema),
  });

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/programs/${program.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete program");
      }

      toast({
        title: "習い事を削除しました",
        description: "テーブルから削除されます",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "習い事の削除に失敗しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>習い事名</FormLabel>
          <Input disabled value={program.name} />
        </FormItem>

        <FormItem>
          <FormLabel>習い事名(省略形)</FormLabel>
          <Input disabled value={program.shortName ?? ""} />
        </FormItem>

        <p className="text-[20px] font-bold text-center">
          本当にこの習い事を削除しますか？
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
          習い事を削除する
        </Button>
      </form>
    </Form>
  );
};

export default ProgramDeleteForm;
