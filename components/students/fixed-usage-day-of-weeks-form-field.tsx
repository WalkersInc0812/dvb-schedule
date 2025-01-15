import { StudentEditSchemaType } from "@/lib/validations/student";
import React, { useEffect, useTransition } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "../ui/select";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { timeOptions } from "../schedules/utils";
import { Program } from "@prisma/client";
import { getPrograms } from "@/lib/programs";
import { padZero } from "@/lib/utils";
import { toast } from "../ui/use-toast";

type Props = {
  form: UseFormReturn<StudentEditSchemaType>;
};

const FixedUsageDayOfWeeksFormField = ({ form }: Props) => {
  const getCurrentAcademicYear = () => {
    const now = new Date();
    const year =
      now.getFullYear() <= 3 ? now.getFullYear() - 1 : now.getFullYear();
    return year.toString();
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return padZero(now.getMonth() + 1, 2);
  };

  const defaultValue = (key: string): any => {
    switch (key) {
      case "startTime":
        return "";
      case "endTime":
        return "";
      case "needPickup":
        return false;
      case "program":
        return {
          programId: defaultValue("programId"),
          startTime: defaultValue("startTime"),
          endTime: defaultValue("endTime"),
        };
      case "programId":
        return "";
      case "programStartTime":
        return "";
      case "programEndTime":
        return "";
      default:
        return undefined;
    }
  };

  const defaultFixedUsageDay = (
    year: string,
    month: string,
    dayOfWeek: number
  ) => {
    return {
      year: year,
      month: month,
      dayOfWeek,
      startTime: defaultValue("startTime"),
      endTime: defaultValue("endTime"),
      needPickup: defaultValue("needPickup"),
      program1: defaultValue("program"),
      program2: defaultValue("program"),
      program3: defaultValue("program"),
    };
  };

  // formType
  type FormType = "month" | "period";
  const [formType, setFormType] = React.useState<FormType>("month");
  // formType: month
  const [year, setYear] = React.useState<string | undefined>();
  const [month, setMonth] = React.useState<string | undefined>();
  // formType: period
  const [periodUpdateLoading, setPeriodUpdateLoading] = React.useState(false);
  const [startPeriodYear, setStartPeriodYear] = React.useState<
    string | undefined
  >();
  const [startPeriodMonth, setStartPeriodMonth] = React.useState<
    string | undefined
  >();
  const [endPeriodYear, setEndPeriodYear] = React.useState<
    string | undefined
  >();
  const [endPeriodMonth, setEndPeriodMonth] = React.useState<
    string | undefined
  >();

  const [isPending, startTransition] = useTransition();

  const [programs, setPrograms] = React.useState<Program[]>([]);

  const { fields, append, update, replace } = useFieldArray({
    control: form.control,
    name: "fixedUsageDayOfWeeks",
  });

  type FieldWithIdAndIndex = (typeof fields)[number] & {
    index: number;
  };

  const [currentFields, setCurrentFields] = React.useState<
    FieldWithIdAndIndex[]
  >([]);

  useEffect(() => {
    startTransition(async () => {
      const programs = await getPrograms();
      setPrograms(programs);
    });
  }, []);

  /**
   * currentFieldsを更新する (formType=month)
   */
  useEffect(() => {
    if (formType !== "month") {
      return;
    }

    if (typeof year === "undefined" || typeof month === "undefined") {
      return;
    }

    const newCurrentFields = fields
      .map((f, index) => ({ ...f, index }))
      .filter((f) => f.year === year && f.month === month);

    const newCurrentField1 = newCurrentFields.find((f) => f.dayOfWeek === 1);
    const newCurrentField2 = newCurrentFields.find((f) => f.dayOfWeek === 2);
    const newCurrentField3 = newCurrentFields.find((f) => f.dayOfWeek === 3);
    const newCurrentField4 = newCurrentFields.find((f) => f.dayOfWeek === 4);
    const newCurrentField5 = newCurrentFields.find((f) => f.dayOfWeek === 5);

    if (typeof newCurrentField1 === "undefined") {
      append(defaultFixedUsageDay(year, month, 1));
    }
    if (typeof newCurrentField2 === "undefined") {
      append(defaultFixedUsageDay(year, month, 2));
    }
    if (typeof newCurrentField3 === "undefined") {
      append(defaultFixedUsageDay(year, month, 3));
    }
    if (typeof newCurrentField4 === "undefined") {
      append(defaultFixedUsageDay(year, month, 4));
    }
    if (typeof newCurrentField5 === "undefined") {
      append(defaultFixedUsageDay(year, month, 5));
    }

    const newCurrentFields_ = fields
      .map((f, index) => ({ ...f, index }))
      .filter((f) => f.year === year && f.month === month);

    const newCurrentField1_ = newCurrentFields_.find((f) => f.dayOfWeek === 1);
    const newCurrentField2_ = newCurrentFields_.find((f) => f.dayOfWeek === 2);
    const newCurrentField3_ = newCurrentFields_.find((f) => f.dayOfWeek === 3);
    const newCurrentField4_ = newCurrentFields_.find((f) => f.dayOfWeek === 4);
    const newCurrentField5_ = newCurrentFields_.find((f) => f.dayOfWeek === 5);

    if (
      typeof newCurrentField1_ === "undefined" ||
      typeof newCurrentField2_ === "undefined" ||
      typeof newCurrentField3_ === "undefined" ||
      typeof newCurrentField4_ === "undefined" ||
      typeof newCurrentField5_ === "undefined"
    ) {
      return;
    }

    setCurrentFields([
      newCurrentField1_,
      newCurrentField2_,
      newCurrentField3_,
      newCurrentField4_,
      newCurrentField5_,
    ]);
  }, [
    fields, // 例えばfieldsが追加された場合に発火する
    year, // 年が変更された場合に発火する
    month, // 月が変更された場合に発火する
    formType, // formTypeが変更された場合に発火する
  ]);

  /**
   * 「期間で一括設定」に切り替わったら、
   * 1. もしなければ、fixedUsageDayOfWeeks に year=0000, month=00, dayOfWeek=1~5 を追加する
   * 2. currentFields を year=0000, month=00, dayOfWeek=1~5 で更新する
   */
  useEffect(() => {
    if (formType !== "period") {
      return;
    }

    const newCurrentFields = fields
      .map((f, index) => ({ ...f, index }))
      .filter((f) => f.year === "0000" && f.month === "00");

    if (newCurrentFields.length === 0) {
      for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
        append(defaultFixedUsageDay("0000", "00", dayOfWeek));
      }
    }

    const newCurrentFields_ = fields
      .map((f, index) => ({ ...f, index }))
      .filter((f) => f.year === "0000" && f.month === "00");

    const newCurrentField1_ = newCurrentFields_.find((f) => f.dayOfWeek === 1);
    const newCurrentField2_ = newCurrentFields_.find((f) => f.dayOfWeek === 2);
    const newCurrentField3_ = newCurrentFields_.find((f) => f.dayOfWeek === 3);
    const newCurrentField4_ = newCurrentFields_.find((f) => f.dayOfWeek === 4);
    const newCurrentField5_ = newCurrentFields_.find((f) => f.dayOfWeek === 5);

    if (
      typeof newCurrentField1_ === "undefined" ||
      typeof newCurrentField2_ === "undefined" ||
      typeof newCurrentField3_ === "undefined" ||
      typeof newCurrentField4_ === "undefined" ||
      typeof newCurrentField5_ === "undefined"
    ) {
      return;
    }

    setCurrentFields([
      newCurrentField1_,
      newCurrentField2_,
      newCurrentField3_,
      newCurrentField4_,
      newCurrentField5_,
    ]);
  }, [formType, fields]);

  return (
    <div className="space-y-2">
      <Label>固定利用曜日</Label>

      <div className="flex gap-2 items-center">
        <Select
          value={formType}
          onValueChange={(value) => setFormType(value as FormType)}
        >
          <SelectTrigger className="h-8 w-fit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">月ごとの編集</SelectItem>
            <SelectItem value="period">期間で一括設定</SelectItem>
          </SelectContent>
        </Select>

        {formType === "month" && (
          <>
            <div className="flex gap-1 items-center">
              <Select value={year} onValueChange={(value) => setYear(value)}>
                <SelectTrigger className="h-8 w-[84px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* 去年と今年と来年 */}
                  {Array.from({ length: 3 }).map((_, i) => {
                    const year = (
                      Number(getCurrentAcademicYear()) +
                      i -
                      1
                    ).toString();
                    return (
                      <SelectItem key={i} value={year}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <span>年</span>
            </div>

            <div className="flex gap-1 items-center">
              <Select value={month} onValueChange={(value) => setMonth(value)}>
                <SelectTrigger className="h-8 w-[60px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* 1~12月 */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const month = padZero(i + 1, 2);
                    return (
                      <SelectItem key={i} value={month}>
                        {month}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <span>月</span>
            </div>
          </>
        )}

        {formType === "period" && (
          <>
            <div className="flex gap-1 items-center">
              <Select
                value={startPeriodYear}
                onValueChange={(value) => setStartPeriodYear(value)}
              >
                <SelectTrigger className="h-8 w-[84px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* 去年と今年と来年 */}
                  {Array.from({ length: 3 }).map((_, i) => {
                    const startPeriodYear = (
                      Number(getCurrentAcademicYear()) +
                      i -
                      1
                    ).toString();
                    return (
                      <SelectItem key={i} value={startPeriodYear}>
                        {startPeriodYear}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <span>年</span>
            </div>

            <div className="flex gap-1 items-center">
              <Select
                value={startPeriodMonth}
                onValueChange={(value) => setStartPeriodMonth(value)}
              >
                <SelectTrigger className="h-8 w-[60px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* 1~12月 */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const startPeriodMonth = padZero(i + 1, 2);
                    return (
                      <SelectItem key={i} value={startPeriodMonth}>
                        {startPeriodMonth}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <span>月</span>
            </div>

            <p>〜</p>

            <div className="flex gap-1 items-center">
              <Select
                value={endPeriodYear}
                onValueChange={(value) => setEndPeriodYear(value)}
              >
                <SelectTrigger className="h-8 w-[84px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* 去年と今年と来年 */}
                  {Array.from({ length: 3 }).map((_, i) => {
                    const endPeriodYear = (
                      Number(getCurrentAcademicYear()) +
                      i -
                      1
                    ).toString();
                    return (
                      <SelectItem key={i} value={endPeriodYear}>
                        {endPeriodYear}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <span>年</span>
            </div>

            <div className="flex gap-1 items-center">
              <Select
                value={endPeriodMonth}
                onValueChange={(value) => setEndPeriodMonth(value)}
              >
                <SelectTrigger className="h-8 w-[60px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {/* 1~12月 */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const endPeriodMonth = padZero(i + 1, 2);
                    return (
                      <SelectItem key={i} value={endPeriodMonth}>
                        {endPeriodMonth}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <span>月</span>
            </div>

            <Button
              type="button"
              variant={"outline"}
              size={"sm"}
              className="h-8"
              disabled={
                isPending ||
                typeof startPeriodYear === "undefined" ||
                typeof startPeriodMonth === "undefined" ||
                typeof endPeriodYear === "undefined" ||
                typeof endPeriodMonth === "undefined" ||
                periodUpdateLoading
              }
              onClick={() => {
                setPeriodUpdateLoading(true);

                // 0. バリデーションチェック
                // 0-1. 期間が設定されていない場合は何もしない
                if (
                  typeof startPeriodYear === "undefined" ||
                  typeof startPeriodMonth === "undefined" ||
                  typeof endPeriodYear === "undefined" ||
                  typeof endPeriodMonth === "undefined"
                ) {
                  return;
                }

                const startYear = Number(startPeriodYear);
                const startMonth = Number(startPeriodMonth);
                const endYear = Number(endPeriodYear);
                const endMonth = Number(endPeriodMonth);

                // 0-2. 終了年月が開始年月よりも前になっている場合はエラー
                if (
                  startYear > endYear ||
                  (startYear === endYear && startMonth > endMonth)
                ) {
                  toast({
                    title: "終了年月は開始年月よりも後にしてください",
                    variant: "destructive",
                  });
                  return;
                }

                // 1. get values
                let fixedUsageDayOfWeeks = form.getValues(
                  "fixedUsageDayOfWeeks"
                );

                // 1. remove values of startPeriod~endPeriod
                fixedUsageDayOfWeeks = fixedUsageDayOfWeeks.filter((f) => {
                  const year = Number(f.year);
                  const month = Number(f.month);
                  return !(
                    (year > startYear ||
                      (year === startYear && month >= startMonth)) &&
                    (year < endYear || (year === endYear && month <= endMonth))
                  );
                });

                // 2. add values with year=0000, month=00, dayOfWeek=1~5 for startPeriod~endPeriod
                const formValuesForAppend = fixedUsageDayOfWeeks.filter((f) => {
                  return f.year === "0000" && f.month === "00";
                });
                for (let year = startYear; year <= endYear; year++) {
                  for (
                    let month = year === startYear ? startMonth : 1;
                    month <= (year === endYear ? endMonth : 12);
                    month++
                  ) {
                    for (const formValue of formValuesForAppend) {
                      fixedUsageDayOfWeeks.push({
                        ...formValue,
                        year: year.toString(),
                        month: padZero(month, 2),
                      });
                    }
                  }
                }

                // 3. replace
                replace(fixedUsageDayOfWeeks);

                // 4. 「月ごとの編集」に切り替える
                setFormType("month");

                // 5. stateを更新する
                setYear(startPeriodYear);
                setMonth(startPeriodMonth);

                setPeriodUpdateLoading(false);
              }}
            >
              {periodUpdateLoading && (
                <Icons.spinner className="animate-spin mr-2 w-4 h-4" />
              )}
              一括設定
            </Button>
          </>
        )}
      </div>

      <Table className="text-[12px] mb-2">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center px-2">曜日</TableHead>
            <TableHead className="text-center px-2">月</TableHead>
            <TableHead className="text-center px-2">火</TableHead>
            <TableHead className="text-center px-2">水</TableHead>
            <TableHead className="text-center px-2">木</TableHead>
            <TableHead className="text-center px-2">金</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-center">
          <datalist id="time-options">
            {timeOptions.map((time) => (
              <option key={time} value={time} />
            ))}
          </datalist>

          <TableRow>
            <TableCell className="p-2">登園時間</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <FormField
                  control={form.control}
                  name={`fixedUsageDayOfWeeks.${field.index}.startTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="time"
                          list="time-options"
                          min="07:45"
                          max="19:30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="border-dashed">
            <TableCell className="p-2">お迎え時間</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <FormField
                  control={form.control}
                  name={`fixedUsageDayOfWeeks.${field.index}.endTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="time"
                          list="time-options"
                          min="07:45"
                          max="19:30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="p-2">学校へのお迎え</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <FormField
                  control={form.control}
                  name={`fixedUsageDayOfWeeks.${field.index}.needPickup`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="border-dashed bg-primary bg-opacity-5">
            <TableCell className="p-2">①</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <FormField
                  control={form.control}
                  name={`fixedUsageDayOfWeeks.${field.index}.program1.programId`}
                  render={({ field: f }) => (
                    <FormItem>
                      <Select onValueChange={f.onChange} defaultValue={f.value}>
                        <FormControl>
                          <SelectTrigger onBlur={f.onBlur}>
                            <SelectValue className="w-10" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programs.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.shortName || program.name}
                            </SelectItem>
                          ))}
                          <SelectSeparator />
                          <Button
                            className="w-full py-1.5"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              update(field.index, {
                                ...form.getValues(
                                  `fixedUsageDayOfWeeks.${field.index}`
                                ),
                                program1: defaultValue("program"),
                              })
                            }
                          >
                            リセット
                          </Button>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="bg-primary bg-opacity-5">
            <TableCell className="p-2">開始時間</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <FormField
                  control={form.control}
                  name={`fixedUsageDayOfWeeks.${field.index}.program1.startTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="time"
                          list="time-options"
                          min="07:45"
                          max="19:30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="bg-primary bg-opacity-5">
            <TableCell className="p-2">終了時間</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <FormField
                  control={form.control}
                  name={`fixedUsageDayOfWeeks.${field.index}.program1.endTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="time"
                          list="time-options"
                          min="07:45"
                          max="19:30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="border-dashed bg-primary bg-opacity-5">
            <TableCell className="p-2">②</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <FormField
                  control={form.control}
                  name={`fixedUsageDayOfWeeks.${field.index}.program2.programId`}
                  render={({ field: f }) => (
                    <FormItem>
                      <Select onValueChange={f.onChange} defaultValue={f.value}>
                        <FormControl>
                          <SelectTrigger onBlur={f.onBlur}>
                            <SelectValue className="w-10" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programs.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.shortName || program.name}
                            </SelectItem>
                          ))}
                          <SelectSeparator />
                          <Button
                            className="w-full py-1.5"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              update(field.index, {
                                ...form.getValues(
                                  `fixedUsageDayOfWeeks.${field.index}`
                                ),
                                program2: defaultValue("program"),
                              })
                            }
                          >
                            リセット
                          </Button>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="bg-primary bg-opacity-5">
            <TableCell className="p-2">開始時間</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <FormField
                  control={form.control}
                  name={`fixedUsageDayOfWeeks.${field.index}.program2.startTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="time"
                          list="time-options"
                          min="07:45"
                          max="19:30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="bg-primary bg-opacity-5">
            <TableCell className="p-2">終了時間</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <FormField
                  control={form.control}
                  name={`fixedUsageDayOfWeeks.${field.index}.program2.endTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="time"
                          list="time-options"
                          min="07:45"
                          max="19:30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="border-dashed bg-primary bg-opacity-5">
            <TableCell className="p-2">③</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <FormField
                  control={form.control}
                  name={`fixedUsageDayOfWeeks.${field.index}.program3.programId`}
                  render={({ field: f }) => (
                    <FormItem>
                      <Select onValueChange={f.onChange} defaultValue={f.value}>
                        <FormControl>
                          <SelectTrigger onBlur={f.onBlur}>
                            <SelectValue className="w-10" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programs.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.shortName || program.name}
                            </SelectItem>
                          ))}
                          <SelectSeparator />
                          <Button
                            className="w-full py-1.5"
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              update(field.index, {
                                ...form.getValues(
                                  `fixedUsageDayOfWeeks.${field.index}`
                                ),
                                program3: defaultValue("program"),
                              })
                            }
                          >
                            リセット
                          </Button>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="bg-primary bg-opacity-5">
            <TableCell className="p-2">開始時間</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <FormField
                  control={form.control}
                  name={`fixedUsageDayOfWeeks.${field.index}.program3.startTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="time"
                          list="time-options"
                          min="07:45"
                          max="19:30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow className="bg-primary bg-opacity-5">
            <TableCell className="p-2">終了時間</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <FormField
                  control={form.control}
                  name={`fixedUsageDayOfWeeks.${field.index}.program3.endTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="time"
                          list="time-options"
                          min="07:45"
                          max="19:30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell className="p-2">リセット</TableCell>
            {currentFields.map((field) => (
              <TableCell key={field.id} className="p-2">
                <Button
                  type="button"
                  variant={"outline"}
                  size={"icon"}
                  disabled={
                    formType === "month" &&
                    (typeof year === "undefined" ||
                      typeof month === "undefined")
                  }
                  onClick={() => {
                    const year_ = formType === "month" ? year : "0000";
                    const month_ = formType === "month" ? month : "00";
                    if (
                      typeof year_ === "undefined" ||
                      typeof month_ === "undefined"
                    ) {
                      return;
                    }

                    update(
                      field.index,
                      defaultFixedUsageDay(year_, month_, field.dayOfWeek)
                    );
                  }}
                >
                  <Icons.trash className="w-4 h-4" />
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default FixedUsageDayOfWeeksFormField;
