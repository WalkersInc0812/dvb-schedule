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
  facilityUpdateSchema,
  FacilityUpdateSchemaType,
} from "@/lib/validations/facility";
import { Input } from "../ui/input";
import { Icons } from "../icons";
import { FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement } from "@/lib/facilities";
import { Calendar } from "../ui/calendar";
import { addDays, parse } from "date-fns";

type Props = {
  facility: FacilityWithMealSettingAndScheduleEditablePeriodAndAnnouncement;
  onSuccess?: () => void;
  onError?: () => void;
};

export const FacilityUpdateForm = ({ facility, onSuccess, onError }: Props) => {
  const router = useRouter();

  const form = useForm<FacilityUpdateSchemaType>({
    resolver: zodResolver(facilityUpdateSchema),
    defaultValues: {
      name: facility.name,
      activeDates: facility.mealSettings.flatMap((mealSetting) => {
        const activeFromDate = parse(
          mealSetting.activeFromDate,
          "yyyy-MM-dd",
          new Date()
        );
        const activeToDate = parse(
          mealSetting.activeToDate,
          "yyyy-MM-dd",
          new Date()
        );

        const days = [];
        for (let i = activeFromDate; i <= activeToDate; i = addDays(i, 1)) {
          days.push(i);
        }

        return days;
      }),
    },
  });

  const onSubmit = async (data: FacilityUpdateSchemaType) => {
    try {
      const response = await fetch(`/api/facilities/${facility.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update facility");
      }

      toast({
        title: "教室情報を変更しました",
        description: "カレンダーに表示されます",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "教室情報の変更に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>教室名</FormLabel>
              <FormControl>
                <Input placeholder="教室名を入力して下さい" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activeDates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>給食の受付</FormLabel>
              <FormControl>
                <Calendar
                  mode="multiple"
                  className="rounded-md border w-fit"
                  selected={field.value}
                  onSelect={(dates) => {
                    field.onChange(dates);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || form.formState.isLoading}
        >
          {form.formState.isLoading && (
            <Icons.spinner className="mr-2 w-4 h-4 animate-spin" />
          )}
          この内容で教室情報を変更する
        </Button>
      </form>
    </Form>
  );
};
