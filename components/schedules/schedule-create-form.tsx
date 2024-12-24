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
import { hourOptions, minuteOptions, timeOptions } from "./utils";
import { cn } from "@/lib/utils";
import { Icons } from "../icons";
import { Input } from "../ui/input";
import { DevTool } from "@hookform/devtools";

type ScheduleCreateFormProps = {
  studentId: string;
  date: Date;
  mealServable: boolean;
  onSuccess?: () => void;
  onError?: () => void;
};
export const ScheduleCreateForm = ({
  studentId,
  date,
  mealServable,
  onSuccess,
  onError,
}: ScheduleCreateFormProps) => {
  const router = useRouter();

  const form = useForm<ScheduleSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      studentId,
      start: date,
      end: date,
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

  return (
    <>
      <Form {...form}>
        <p className="text-[20px] font-bold">
          {format(date, "PPP(E)", { locale: ja })}
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <datalist id="time-options">
            {timeOptions.map((time) => (
              <option key={time} value={time} />
            ))}
          </datalist>

          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>登園時間</FormLabel>
                <FormControl>
                  <Input
                    className="w-fit"
                    type="time"
                    list="time-options"
                    min="07:45"
                    max="19:30"
                    {...field}
                    value={format(field.value, "HH:mm")}
                    onChange={(e: any) => {
                      const date = field.value;
                      const [hours, minutes] = e.target.value.split(":");
                      date.setHours(parseInt(hours));
                      date.setMinutes(parseInt(minutes));
                      field.onChange(date);
                    }}
                  />
                </FormControl>
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
                <FormControl>
                  <Input
                    className="w-fit"
                    type="time"
                    list="time-options"
                    min="07:45"
                    max="19:30"
                    {...field}
                    value={format(field.value, "HH:mm")}
                    onChange={(e: any) => {
                      const date = field.value;
                      const [hours, minutes] = e.target.value.split(":");
                      date.setHours(parseInt(hours));
                      date.setMinutes(parseInt(minutes));
                      field.onChange(date);
                    }}
                  />
                </FormControl>
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
