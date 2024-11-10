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
import { addDays, isSameMonth, isSameYear, parse } from "date-fns";
import ScheduleEditablePeriodsFormControlContent from "./schedule-editable-periods-form-control-content";
import { AnnouncementsFormControlContent } from "./announcements-form-control-content";

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
      announcements: facility.announcements.map((announcement) => ({
        id: announcement.id,
        content: announcement.content,
        displayStartMonth: parse(
          announcement.displayStartMonth,
          "yyyy-MM",
          new Date()
        ),
        displayEndMonth: parse(
          announcement.displayEndMonth,
          "yyyy-MM",
          new Date()
        ),
      })),
      scheduleEditablePeriods: facility.scheduleEditablePeriods.map(
        (period) => ({
          targetMonth: parse(period.targetMonth, "yyyy-MM", new Date()),
          fromDate: parse(period.fromDate, "yyyy-MM-dd", new Date()),
          toDate: parse(period.toDate, "yyyy-MM-dd", new Date()),
        })
      ),
      mealSettingActiveDates: facility.mealSettings.flatMap((mealSetting) => {
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
          name="announcements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>お知らせ</FormLabel>
              <FormControl>
                <AnnouncementsFormControlContent
                  announcements={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduleEditablePeriods"
          render={({ field }) => (
            <FormItem>
              <FormLabel>予定の編集可能な期間</FormLabel>
              <FormControl>
                <ScheduleEditablePeriodsFormControlContent
                  scheduleEditablePeriods={field.value}
                  onSelect={({ month, dates }) => {
                    const period = field.value.find((period) => {
                      return (
                        isSameYear(period.targetMonth, month) &&
                        isSameMonth(period.targetMonth, month)
                      );
                    });

                    if (
                      typeof period !== "undefined" &&
                      typeof dates === "undefined"
                    ) {
                      // すでに同じ月の設定があり、datesがundefinedの場合は削除
                      field.onChange(
                        field.value.filter((p) => {
                          return !(
                            isSameYear(p.targetMonth, month) &&
                            isSameMonth(p.targetMonth, month)
                          );
                        })
                      );
                    } else if (
                      typeof period !== "undefined" &&
                      typeof dates !== "undefined"
                    ) {
                      // すでに同じ月の設定があり、datesがある場合は更新
                      field.onChange(
                        field.value.map((p) => {
                          if (
                            isSameYear(p.targetMonth, month) &&
                            isSameMonth(p.targetMonth, month)
                          ) {
                            return {
                              ...p,
                              fromDate: dates?.from,
                              toDate: dates?.to,
                            };
                          }

                          return p;
                        })
                      );
                    } else if (
                      typeof period === "undefined" &&
                      typeof dates !== "undefined"
                    ) {
                      // 無い場合は新しく追加
                      field.onChange([
                        ...field.value,
                        {
                          targetMonth: month,
                          fromDate: dates.from,
                          toDate: dates.to || dates.from,
                        },
                      ]);
                    } else {
                      // それ以外は何もしない
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mealSettingActiveDates"
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
          disabled={
            !form.formState.isValid ||
            form.formState.isLoading ||
            form.formState.isSubmitting
          }
        >
          {(form.formState.isLoading || form.formState.isSubmitting) && (
            <Icons.spinner className="animate-spin mr-2 w-4 h-4" />
          )}
          この内容で教室情報を変更する
        </Button>
      </form>
    </Form>
  );
};
