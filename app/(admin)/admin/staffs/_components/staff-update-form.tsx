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
  staffUpdateSchema,
  StaffUpdateSchemaType,
} from "@/lib/validations/staff";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { User } from "@prisma/client";

type Props = {
  staff: User;
  onSuccess?: () => void;
  onError?: () => void;
};

export const StaffUpdateForm = ({ staff, onSuccess, onError }: Props) => {
  const router = useRouter();

  const form = useForm<StaffUpdateSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(staffUpdateSchema),
    defaultValues: {
      name: staff.name ?? undefined,
      email: staff.email ?? undefined,
    },
  });

  const handleSubmit = async (data: StaffUpdateSchemaType) => {
    try {
      const response = await fetch(`/api/staffs/${staff.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update staff");
      }

      toast({
        title: "職員情報を変更しました",
        description: "テーブルに表示されます",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "職員情報の変更に失敗しました",
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
          この内容で職員情報を変更する
        </Button>
      </form>
    </Form>
  );
};
