import React, { useEffect, useTransition } from "react";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { timeOptions } from "../schedules/utils";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { Switch } from "../ui/switch";
import { Program } from "@prisma/client";
import { getPrograms } from "@/lib/programs";
import { StudentCreateSchemaType } from "@/lib/validations/student";
import { Input } from "../ui/input";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";

type Props = {
  form: UseFormReturn<StudentCreateSchemaType>;
};

const FixedUsageDayOfWeeksFormField = ({ form }: Props) => {
  const getCurrentAcademicYear = () => {
    const now = new Date();
    const year =
      now.getFullYear() <= 3 ? now.getFullYear() - 1 : now.getFullYear();
    return year;
  };

  const getCurrentTerm = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const termNum = month <= 3 ? 3 : month <= 7 ? 1 : 2;
    const term = termNum;
    return term;
  };

  const defaultValue = (key: string): any => {
    switch (key) {
      case "startTime":
        return undefined;
      case "endTime":
        return undefined;
      case "needPickup":
        return false;
      case "program":
        return undefined;
      case "programId":
        return undefined;
      case "programStartTime":
        return undefined;
      case "programEndTime":
        return undefined;
      default:
        return undefined;
    }
  };

  const defaultFixedUsageDay = (
    year: number,
    term: number,
    dayOfWeek: number
  ) => {
    return {
      term: `${year}-${term}`,
      dayOfWeek,
      startTime: defaultValue("startTime"),
      endTime: defaultValue("endTime"),
      needPickup: defaultValue("needPickup"),
      program1: defaultValue("program"),
      program2: defaultValue("program"),
    };
  };

  const [year, setYear] = React.useState<number>(getCurrentAcademicYear());
  const [term, setTerm] = React.useState<number>(getCurrentTerm());
  const yearTerm = `${year}-${term}`;
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [isPending, startTransition] = useTransition();

  const { fields, append, remove, update } = useFieldArray({
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
   * 初回マウント時、すべてのtermのfieldsをappendする
   */
  useEffect(() => {
    // なぜか来年の3学期が2回追加されてしまうので、削除する
    // remove(Array.from({ length: 5 })); // TODO: 検証中

    Array.from({ length: 3 }).forEach((_, yearI) => {
      // 去年と今年と来年
      const year = getCurrentAcademicYear() + yearI - 1;

      Array.from({ length: 3 }).forEach((_, termI) => {
        // 1, 2, 3学期
        const term = termI + 1;

        append([
          defaultFixedUsageDay(year, term, 1),
          defaultFixedUsageDay(year, term, 2),
          defaultFixedUsageDay(year, term, 3),
          defaultFixedUsageDay(year, term, 4),
          defaultFixedUsageDay(year, term, 5),
        ]);
      });
    });
  }, []);

  /**
   * currentFieldsを更新する
   */
  useEffect(() => {
    const newCurrentFields = fields
      .map((f, index) => ({ ...f, index }))
      .filter((f) => f.term === yearTerm);

    const newCurrentField1 = newCurrentFields.find((f) => f.dayOfWeek === 1);
    const newCurrentField2 = newCurrentFields.find((f) => f.dayOfWeek === 2);
    const newCurrentField3 = newCurrentFields.find((f) => f.dayOfWeek === 3);
    const newCurrentField4 = newCurrentFields.find((f) => f.dayOfWeek === 4);
    const newCurrentField5 = newCurrentFields.find((f) => f.dayOfWeek === 5);

    if (
      typeof newCurrentField1 === "undefined" ||
      typeof newCurrentField2 === "undefined" ||
      typeof newCurrentField3 === "undefined" ||
      typeof newCurrentField4 === "undefined" ||
      typeof newCurrentField5 === "undefined"
    ) {
      return;
    }

    setCurrentFields([
      newCurrentField1,
      newCurrentField2,
      newCurrentField3,
      newCurrentField4,
      newCurrentField5,
    ]);
  }, [
    fields, // 例えばfieldsが追加された場合に発火する
    yearTerm, // 年度、学期が変更された場合に発火する
  ]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <div className="flex gap-1 items-center">
          <Select
            value={year.toString()}
            onValueChange={(value) => setYear(Number(value))}
          >
            <SelectTrigger className="h-8 w-[84px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {/* 去年と今年と来年 */}
              {Array.from({ length: 3 }).map((_, i) => {
                const year = (getCurrentAcademicYear() + i - 1).toString();
                return (
                  <SelectItem key={i} value={year}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <span>年度</span>
        </div>

        <div className="flex gap-1 items-center">
          <Select
            value={term.toString()}
            onValueChange={(value) => setTerm(Number(value))}
          >
            <SelectTrigger className="h-8 w-[60px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {/* 1, 2, 3学期 */}
              {Array.from({ length: 3 }).map((_, i) => {
                const term = (i + 1).toString();
                return (
                  <SelectItem key={i} value={term}>
                    {term}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <span>学期</span>
        </div>
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
                          min="11:00"
                          max="22:00"
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
                          min="11:00"
                          max="22:00"
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
                          min="11:00"
                          max="22:00"
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
                          min="11:00"
                          max="22:00"
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
                          min="11:00"
                          max="22:00"
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
                          min="11:00"
                          max="22:00"
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
                  onClick={() =>
                    update(
                      field.index,
                      defaultFixedUsageDay(year, term, field.dayOfWeek)
                    )
                  }
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
