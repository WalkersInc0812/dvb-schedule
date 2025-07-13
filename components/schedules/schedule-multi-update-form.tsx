import {
  scheduleMultiUpdateSchema,
  ScheduleMultiUpdateSchemaType,
} from "@/lib/validations/schedule";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schedule } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "../ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { useTime } from "./use-time";
import { cn } from "@/lib/utils";
import { zonedTimeToUtc } from "date-fns-tz";

type Props = {
  schedules: Schedule[];
  onSuccess?: () => void;
  onError?: () => void;
};
const ScheduleMultiUpdateForm = ({ schedules, onSuccess, onError }: Props) => {
  const router = useRouter();

  const form = useForm<ScheduleMultiUpdateSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(scheduleMultiUpdateSchema),
    defaultValues: {
      ids: schedules.map((schedule) => schedule.id),
      start: schedules[0].start,
    },
  });

  const onSubmit = async (data: ScheduleMultiUpdateSchemaType) => {
    try {
      // Convert JST dates to UTC properly to avoid timezone shift
      const timeZone = "Asia/Tokyo";
      const dataWithUtcDate = {
        ...data,
        start: zonedTimeToUtc(data.start, timeZone),
      };
      
      const response = await fetch(`/api/schedules/multi`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithUtcDate),
      });

      if (!response.ok) {
        throw new Error("Failed to update schedules");
      }

      toast({
        title: `${schedules.length}件の予定を更新しました`,
        description: "カレンダーに表示されます",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "予定の更新に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      });
    }
  };

  const {
    hourOptions: startHourOptions,
    hour: startHour,
    changeHour: changeStartHour,
    minuteOptions: startMinuteOptions,
    minute: startMinute,
    changeMinute: changeStartMinute,
    minuteOptionClassValue: startMinuteOptionClassValue,
  } = useTime(
    () => form.getValues("start"),
    (value: Date) => form.setValue("start", value)
  );

  return (
    <Form {...form}>
      <p className="text-[20px] font-bold mb-6">
        選択された{schedules.length}件の予定を変更
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="start"
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col items-start">
              <p>{fieldState.error?.message}</p>
              <FormLabel>登園時間</FormLabel>
              <div className="flex gap-1 items-center">
                <Select
                  onValueChange={changeStartHour}
                  value={startHour.toString()}
                >
                  <FormControl className="min-w-16">
                    <SelectTrigger onBlur={field.onBlur}>
                      <SelectValue className="w-10" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {startHourOptions.map((hour, i) => (
                      <SelectItem key={`${i}-${hour}`} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                時
                <Select
                  onValueChange={changeStartMinute}
                  value={startMinute.toString()}
                >
                  <FormControl className="min-w-16">
                    <SelectTrigger onBlur={field.onBlur}>
                      <SelectValue className="w-10" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {startMinuteOptions.map((minute, i) => (
                      <SelectItem
                        key={`${i}-${minute}`}
                        value={minute}
                        className={cn(startMinuteOptionClassValue(minute))}
                      >
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                分
              </div>
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
          この内容で予定を変更する
        </Button>
      </form>
    </Form>
  );
};

export default ScheduleMultiUpdateForm;
