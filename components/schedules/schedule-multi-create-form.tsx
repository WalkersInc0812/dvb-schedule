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
import { format, parse } from "date-fns";
import { ja } from "date-fns/locale";
import { hourOptions, minuteOptions } from "./utils";
import { MealSetting } from "@prisma/client";
import { cn } from "@/lib/utils";

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
    resolver: zodResolver(scheduleMultiCreateSchema),
    defaultValues: {
      studentId,
      dates: dates.map((date) => ({
        start: date,
        end: date,
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
              <FormLabel>開始時間</FormLabel>
              <div className="flex gap-1 items-center">
                <Select
                  onValueChange={(value) => {
                    field.value.forEach((date) => {
                      date.start.setHours(parseInt(value));
                    });
                  }}
                  defaultValue={field.value[0].start.getHours().toString()}
                >
                  <FormControl className="min-w-16">
                    <SelectTrigger>
                      <SelectValue className="w-10" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hourOptions.map((hour, i) => (
                      <SelectItem key={`${i}-${hour}`} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                時
                <Select
                  onValueChange={(value) => {
                    field.value.forEach((date) => {
                      date.start.setMinutes(parseInt(value));
                    });
                  }}
                  defaultValue={field.value[0].start.getMinutes().toString()}
                >
                  <FormControl className="min-w-16">
                    <SelectTrigger>
                      <SelectValue className="w-10" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {minuteOptions.map((minute, i) => (
                      <SelectItem key={`${i}-${minute}`} value={minute}>
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
              <FormLabel>終了時間</FormLabel>
              <div className="flex gap-1 items-center">
                <Select
                  onValueChange={(value) => {
                    field.value.forEach((date) => {
                      date.end.setHours(parseInt(value));
                    });
                  }}
                  defaultValue={field.value[0].end.getHours().toString()}
                >
                  <FormControl className="min-w-16">
                    <SelectTrigger>
                      <SelectValue className="w-10" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hourOptions.map((hour, i) => (
                      <SelectItem key={`${i}-${hour}`} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                時
                <Select
                  onValueChange={(value) => {
                    field.value.forEach((date) => {
                      date.end.setMinutes(parseInt(value));
                    });
                  }}
                  defaultValue={field.value[0].end.getMinutes().toString()}
                >
                  <FormControl className="min-w-16">
                    <SelectTrigger>
                      <SelectValue className="w-10" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {minuteOptions.map((minute, i) => (
                      <SelectItem key={`${i}-${minute}`} value={minute}>
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
                  placeholder="先生に伝えたいことを入力してください。"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          この内容で予定を登録する
        </Button>
      </form>
    </Form>
  );
};
