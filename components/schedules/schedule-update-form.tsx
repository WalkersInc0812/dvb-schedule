"use client";

import { Button } from "@/components/ui/button";
import {
  ScheduleUpdateSchemaType,
  scheduleUpdateSchema,
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
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Schedule } from "@prisma/client";
import { hourOptions, minuteOptions } from "./utils";

type ScheduleUpdateFormProps = {
  schedule: Schedule;
  onSuccess?: () => void;
  onError?: () => void;
};
export const ScheduleUpdateForm = ({
  schedule,
  onSuccess,
  onError,
}: ScheduleUpdateFormProps) => {
  const router = useRouter();

  const form = useForm<ScheduleUpdateSchemaType>({
    resolver: zodResolver(scheduleUpdateSchema),
    defaultValues: {
      start: schedule.start,
      end: schedule.end,
      meal: schedule.meal,
      attendance: schedule.attendance,
      notes: schedule.notes ?? "",
    },
  });

  const onSubmit = async (data: ScheduleUpdateSchemaType) => {
    try {
      const response = await fetch(`/api/schedules/${schedule.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: data.start.toISOString(),
          end: data.end.toISOString(),
          meal: data.meal,
          attendance: data.attendance,
          notes: data.notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create schedule");
      }

      toast({
        title: "予定を変更しました",
        description: "カレンダーに表示されます。",
      });

      onSuccess?.();

      router.refresh();
    } catch (error) {
      onError?.();

      console.error(error);
      toast({
        title: "予定の変更に失敗しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <p className="text-[20px] font-bold">
        {format(schedule.start, "PPP(E)", { locale: ja })}
      </p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="start"
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col items-start">
              <p>{fieldState.error?.message}</p>
              <FormLabel>開始時間</FormLabel>
              <div className="flex gap-1 items-center">
                <Select
                  onValueChange={(value) => {
                    const date = field.value;
                    date.setHours(parseInt(value));
                    field.onChange(date);
                  }}
                  defaultValue={field.value.getHours().toString()}
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
                    const date = field.value;
                    date.setMinutes(parseInt(value));
                    field.onChange(date);
                  }}
                  defaultValue={field.value.getMinutes().toString()}
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
          name="end"
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col items-start">
              <p>{fieldState.error?.message}</p>
              <FormLabel>終了時間</FormLabel>
              <div className="flex gap-1 items-center">
                <Select
                  onValueChange={(value) => {
                    const date = field.value;
                    date.setHours(parseInt(value));
                    field.onChange(date);
                  }}
                  defaultValue={field.value.getHours().toString()}
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
                    const date = field.value;
                    date.setMinutes(parseInt(value));
                    field.onChange(date);
                  }}
                  defaultValue={field.value.getMinutes().toString()}
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
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col items-start">
              <p>{fieldState.error?.message}</p>
              <FormLabel>給食の有無</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col items-start">
              <p>{fieldState.error?.message}</p>
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
          この内容で予定を変更する
        </Button>
      </form>
    </Form>
  );
};
