"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount } from "@/lib/facilities";
import {
  facilityDeleteSchema,
  FacilityDeleteSchemaType,
} from "@/lib/validations/facility";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

type Props = {
  facility: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncementAndStudentsCount;
  onSuccess?: () => void;
  onError?: () => void;
};

const FacilityDeleteForm = ({ facility, onSuccess, onError }: Props) => {
  const router = useRouter();

  const form = useForm<FacilityDeleteSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(facilityDeleteSchema),
  });

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/facilities/${facility.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete facility");
      }

      toast({
        title: "教室を削除しました",
        description: "テーブルから削除されます",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "教室の削除に失敗しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>教室名</FormLabel>
          <Input
            type="text"
            value={facility.name}
            disabled
            className="w-full"
          />
        </FormItem>

        <FormItem>
          <FormLabel>生徒数</FormLabel>
          <Input
            type="number"
            value={facility._count.students}
            disabled
            className="w-full"
          />
        </FormItem>

        <p className="text-[20px] font-bold text-center">
          本当にこの教室を削除しますか？
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
          教室を削除する
        </Button>
      </form>
    </Form>
  );
};

export default FacilityDeleteForm;
