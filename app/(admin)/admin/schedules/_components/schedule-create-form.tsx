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
import {
  format,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";
import { hourOptions, minuteOptions } from "@/components/schedules/utils";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DevTool } from "@hookform/devtools";
import { useEffect, useState, useTransition } from "react";
import { Student } from "@prisma/client";
import { getStudents } from "@/lib/students2";
import { ja } from "date-fns/locale";
import { formatCaption } from "@/components/format-caption";

type Props = {
  onSuccess?: () => void;
  onError?: () => void;
};

const ScheduleCreateForm = ({ onError, onSuccess }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [students, setStudents] = useState<Student[]>([]);

  const router = useRouter();

  const form = useForm<ScheduleSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      start: setMilliseconds(
        setSeconds(setMinutes(setHours(new Date(), 0), 0), 0),
        0
      ),
      end: setMilliseconds(
        setSeconds(setMinutes(setHours(new Date(), 0), 0), 0),
        0
      ),
      meal: false,
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
        description: "テーブルに表示されます。",
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

  useEffect(() => {
    startTransition(async () => {
      const students = await getStudents();
      setStudents(students);
    });
  }, []);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>児童</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger onBlur={field.onBlur}>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>日付</FormLabel>
                <FormControl>
                  <div className="flex gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-fit pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy年MM月dd日")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50 mb-0.5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          locale={ja}
                          formatters={{ formatCaption: formatCaption }}
                          weekStartsOn={1}
                          showOutsideDays={false}
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            const start = field.value ?? new Date();
                            const startHours = start.getHours();
                            const startMinutes = start.getMinutes();

                            const end = form.getValues("end") ?? start;
                            const endHours = end.getHours();
                            const endMinutes = end.getMinutes();

                            if (typeof date === "undefined") {
                              field.onChange(undefined);
                              form.resetField("end");
                            } else {
                              field.onChange(
                                setMilliseconds(
                                  setSeconds(
                                    setMinutes(
                                      setHours(date, startHours),
                                      startMinutes
                                    ),
                                    0
                                  ),
                                  0
                                )
                              );
                              form.setValue(
                                "end",
                                setMilliseconds(
                                  setSeconds(
                                    setMinutes(
                                      setHours(date, endHours),
                                      endMinutes
                                    ),
                                    0
                                  ),
                                  0
                                )
                              );
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>開始時間</FormLabel>
                <div className="flex gap-1 items-center">
                  <Select
                    onValueChange={(value) => {
                      const date = field.value ?? new Date();
                      date.setHours(parseInt(value));
                      field.onChange(date);
                    }}
                    defaultValue={field.value?.getHours().toString()}
                  >
                    <FormControl className="min-w-16">
                      <SelectTrigger onBlur={field.onBlur}>
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
                      const date = field.value ?? new Date();
                      date.setMinutes(parseInt(value));
                      field.onChange(date);
                    }}
                    defaultValue={field.value?.getMinutes().toString()}
                  >
                    <FormControl className="min-w-16">
                      <SelectTrigger onBlur={field.onBlur}>
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
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>終了時間</FormLabel>
                <div className="flex gap-1 items-center">
                  <Select
                    onValueChange={(value) => {
                      const date = field.value ?? new Date();
                      date.setHours(parseInt(value));
                      field.onChange(date);
                    }}
                    defaultValue={field.value?.getHours().toString()}
                  >
                    <FormControl className="min-w-16">
                      <SelectTrigger onBlur={field.onBlur}>
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
                      const date = field.value ?? new Date();
                      date.setMinutes(parseInt(value));
                      field.onChange(date);
                    }}
                    defaultValue={field.value?.getMinutes().toString()}
                  >
                    <FormControl className="min-w-16">
                      <SelectTrigger onBlur={field.onBlur}>
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
              <Loader2Icon className="animate-spin mr-2 w-4 h-4" />
            )}
            この内容で予定を登録する
          </Button>
        </form>
      </Form>

      <DevTool control={form.control} />
    </>
  );
};

export default ScheduleCreateForm;
