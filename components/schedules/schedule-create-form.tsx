"use client";

import { Button } from "@/components/ui/button";
import { scheduleSchema, ScheduleSchemaType } from "@/lib/validations/schedule";
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
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { format, setHours, setMinutes } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import { DevTool } from "@hookform/devtools";
import { useTime } from "./use-time";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ScheduleCreateFormProps = {
  studentId: string;
  date: Date;
  mealServable: boolean;
  onSuccess?: () => void;
  onError?: () => void;
  startTransition?: React.TransitionStartFunction;
};
export const ScheduleCreateForm = ({
  studentId,
  date,
  mealServable,
  onSuccess,
  onError,
  startTransition,
}: ScheduleCreateFormProps) => {
  const router = useRouter();

  const form = useForm<ScheduleSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      studentId,
      start: setMinutes(setHours(date, 7), 45),
      end: setMinutes(setHours(date, 7), 45),
      meal: false,
      notes: "",
    },
  });

  const onSubmit = async (data: ScheduleSchemaType) => {
    try {
      const response = await fetch(`/api/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: data.studentId,
          start: data.start.toISOString(),
          end: data.end.toISOString(),
          meal: data.meal,
          notes: data.notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create schedule");
      }

      toast({
        title: "予定を登録しました",
        description: "カレンダーに表示されます。",
      });

      onSuccess?.();

      if (startTransition) {
        startTransition(() => {
          router.refresh();
        });
      } else {
        router.refresh();
      }
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

  const {
    hourOptions: endHourOptions,
    hour: endHour,
    changeHour: changeEndHour,
    minuteOptions: endMinuteOptions,
    minute: endMinute,
    changeMinute: changeEndMinute,
    minuteOptionClassValue: endMinuteOptionClassValue,
  } = useTime(
    () => form.getValues("end"),
    (value: Date) => form.setValue("end", value)
  );

  return (
    <>
      <Form {...form}>
        <p className="text-[20px] font-bold">
          {format(date, "PPP(E)", { locale: ja })}
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="start"
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

          <FormField
            control={form.control}
            name="end"
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
                    <SelectContent>
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
                    <SelectContent>
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
                <FormLabel className={cn(!mealServable && "text-gray-400")}>
                  給食の有無 {!mealServable && "※この日は給食はありません"}
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!mealServable}
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

      {/* <DevTool control={form.control} /> */}
    </>
  );
};
