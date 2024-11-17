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
  staffCreateSchema,
  StaffCreateSchemaType,
} from "@/lib/validations/staff";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const StaffCreateForm = ({ onSuccess, onError }: Props) => {
  const router = useRouter();

  const form = useForm<StaffCreateSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(staffCreateSchema),
  });

  const handleSubmit = async (data: StaffCreateSchemaType) => {
    try {
      const response = await fetch(`/api/staffs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create staff");
      }

      toast({
        title: "職員を新規登録しました",
        description: "テーブルに表示されます",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "職員の新規登録に失敗しました",
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
              <FormLabel>名前</FormLabel>
              <FormControl>
                <Input {...field} placeholder="名前を入力してください" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="メールアドレスを入力してください"
                />
              </FormControl>
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
          {(form.formState.isLoading || form.formState.isSubmitting) && (
            <Icons.spinner className="animate-spin mr-2 w-4 h-4" />
          )}
          この内容で職員情報を登録する
        </Button>
      </form>
    </Form>
  );
};
