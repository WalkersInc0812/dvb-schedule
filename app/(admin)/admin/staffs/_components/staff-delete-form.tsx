"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  staffDeleteSchema,
  StaffDeleteSchemaType,
} from "@/lib/validations/staff";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  staff: User;
  onSuccess?: () => void;
  onError?: () => void;
};

const StaffDeleteForm = ({ staff, onSuccess, onError }: Props) => {
  const router = useRouter();

  const form = useForm<StaffDeleteSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(staffDeleteSchema),
  });

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/staffs/${staff.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete staff");
      }

      toast({
        title: "職員を削除しました",
        description: "テーブルから削除されます",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "職員の削除に失敗しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>名前</FormLabel>
          <Input value={staff.name ?? undefined} disabled />
        </FormItem>

        <FormItem>
          <FormLabel>メールアドレス</FormLabel>
          <Input value={staff.email ?? undefined} disabled />
        </FormItem>

        <p className="text-[20px] font-bold text-center">
          本当に職員を削除しますか？
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
          職員を削除する
        </Button>
      </form>
    </Form>
  );
};

export default StaffDeleteForm;
