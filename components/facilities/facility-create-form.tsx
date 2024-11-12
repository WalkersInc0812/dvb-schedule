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
  facilityCreateSchema,
  FacilityCreateSchemaType,
} from "@/lib/validations/facility";
import { Input } from "../ui/input";
import { Icons } from "../icons";

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const FacilityCreateForm = ({ onSuccess, onError }: Props) => {
  const router = useRouter();

  const form = useForm<FacilityCreateSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(facilityCreateSchema),
  });

  const handleSubmit = async (data: FacilityCreateSchemaType) => {
    try {
      const response = await fetch(`/api/facilities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create facility");
      }

      toast({
        title: "教室を新規登録しました",
        description: "テーブルに表示されます",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "教室の新規登録に失敗しました",
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
              <FormLabel>教室名</FormLabel>
              <FormControl>
                <Input {...field} placeholder="教室名を入力してください" />
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
          {(form.formState.isLoading || form.formState.isSubmitting) && (
            <Icons.spinner className="animate-spin mr-2 w-4 h-4" />
          )}
          この内容で教室情報を登録する
        </Button>
      </form>
    </Form>
  );
};
