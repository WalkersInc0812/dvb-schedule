"use client";

import { Button } from "@/components/ui/button";
import {
  scheduleMultiCreateSchema,
  ScheduleMultiCreateSchemaType,
} from "@/lib/validations/schedule";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { format, parse, setHours, setMinutes } from "date-fns";
import { ja } from "date-fns/locale";
import { MealSetting } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import { useTime } from "./use-time";

type Props = {
  studentId: string;
  dates: Date[];
  mealSettings: MealSetting[];
  onSuccess?: () => void;
  onError?: () => void;
};
export const ScheduleMultiCreateForm = ({
  studentId,
  dates,
  mealSettings,
  onSuccess,
  onError,
}: Props) => {
  const router = useRouter();

  const form = useForm<ScheduleMultiCreateSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(scheduleMultiCreateSchema),
    defaultValues: {
      studentId,
      dates: dates.map((date) => ({
        start: setMinutes(setHours(date, 7), 45),
        end: setMinutes(setHours(date, 7), 45),
      })),
      meal: false,
      notes: "",
    },
  });

  const onSubmit = async (data: ScheduleMultiCreateSchemaType) => {
    try {
      const response = await fetch(`/api/schedules/multi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create schedules");
      }

      toast({
        title: `${dates.length}件の予定を登録しました`,
        description: "カレンダーに表示されます。",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "予定の登録に失敗しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  const mealServableDates = dates.filter((date) => {
    // TODO: 境界値のチェック
    // TODO: timezoneのチェック
    const servable = !!mealSettings.find(
      (mealSetting) =>
        parse(mealSetting.activeFromDate, "yyyy-MM-dd", new Date()) <= date &&
        date <= parse(mealSetting.activeToDate, "yyyy-MM-dd", new Date())
    );

    return servable;
  });

  const {
    hourOptions: startHourOptions,
    hour: startHour,
    changeHour: changeStartHour,
    minuteOptions: startMinuteOptions,
    minute: startMinute,
    changeMinute: changeStartMinute,
    minuteOptionClassValue: startMinuteOptionClassValue,
  } = useTime(
    () => form.getValues("dates")[0].start,
    (value: Date) => {
      form.getValues("dates").forEach((date) => {
        let newDate = date.start;
        newDate.setHours(value.getHours());
        newDate.setMinutes(value.getMinutes());
        date.start = newDate;
      });
    }
  );

  const {
    hourOptions: endHourOptions,
    hour: endHour,
    changeHour: changeEndHour,
    minuteOptions: endMinuteOptions,
    minute: endMinute,
    changeMinute: changeEndMinute,
    minuteOptionClassValue: endMinuteOptionClassValue,
  } = useTime(
    () => form.getValues("dates")[0].end,
    (value: Date) => {
      form.getValues("dates").forEach((date) => {
        let newDate = date.end;
        newDate.setHours(value.getHours());
        newDate.setMinutes(value.getMinutes());
        date.end = newDate;
      });
    }
  );

  return (
    <Form {...form}>
      <p className="text-[20px] font-bold mb-6">{dates.length}件の予定を追加</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem className="flex flex-col items-start">
          <FormLabel>日付</FormLabel>
          <p>
            {dates
              .map((date) => format(date, "M/d", { locale: ja }))
              .join(", ")}
          </p>
        </FormItem>

        <FormField
          control={form.control}
          name="dates"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
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
                  <SelectContent className="max-h-40">
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
                  <SelectContent className="max-h-40">
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

        <FormField
          control={form.control}
          name="dates"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>お迎え時間</FormLabel>
              <div className="flex gap-1 items-center">
                <Select
                  onValueChange={changeEndHour}
                  value={endHour.toString()}
                >
                  <FormControl className="min-w-16">
                    <SelectTrigger onBlur={field.onBlur}>
                      <SelectValue className="w-10" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-40">
                    {endHourOptions.map((hour, i) => (
                      <SelectItem key={`${i}-${hour}`} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                時
                <Select
                  onValueChange={changeEndMinute}
                  value={endMinute.toString()}
                >
                  <FormControl className="min-w-16">
                    <SelectTrigger onBlur={field.onBlur}>
                      <SelectValue className="w-10" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-40">
                    {endMinuteOptions.map((minute, i) => (
                      <SelectItem
                        key={`${i}-${minute}`}
                        value={minute}
                        className={cn(endMinuteOptionClassValue(minute))}
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

        <FormField
          control={form.control}
          name="meal"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel
                className={cn(
                  mealServableDates.length === 0 && "text-gray-400"
                )}
              >
                給食の有無{" "}
                {mealServableDates.length === 0
                  ? "※この期間は給食はありません"
                  : `※${mealServableDates
                      .map((d) => format(d, "MM/dd"))
                      .join(", ")}のみ`}
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={mealServableDates.length === 0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>備考</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="職員へのご連絡事項がある場合内容を入力してください"
                  className="resize-none"
                  {...field}
                />
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
          この内容で予定を登録する
        </Button>
      </form>
    </Form>
  );
};
