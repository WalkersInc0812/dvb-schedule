"use client";

import { Button } from "@/components/ui/button";
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
import {
  schoolCreateSchema,
  SchoolCreateSchemaType,
} from "@/lib/validations/school";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const SchoolCreateForm = ({ onSuccess, onError }: Props) => {
  const router = useRouter();

  const form = useForm<SchoolCreateSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(schoolCreateSchema),
  });

  const handleSubmit = async (data: SchoolCreateSchemaType) => {
    try {
      const response = await fetch(`/api/schools`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create school");
      }

      toast({
        title: "学校を新規登録しました",
        description: "テーブルに表示されます",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "学校の新規登録に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>学校名</FormLabel>
              <FormControl>
                <Input {...field} placeholder="学校名を入力してください" />
              </FormControl>
              <FormMessage />
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
          この内容で学校情報を登録する
        </Button>
      </form>
    </Form>
  );
};
