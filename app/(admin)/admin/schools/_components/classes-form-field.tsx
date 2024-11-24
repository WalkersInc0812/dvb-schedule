import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SchoolUpdateSchemaType } from "@/lib/validations/school";
import { getMonth, getYear } from "date-fns";
import React from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<SchoolUpdateSchemaType>;
};

const ClassesFormField = ({ form }: Props) => {
  // academicYearForAdd
  const currentAcademicYear =
    getMonth(new Date()) < 4 ? getYear(new Date()) - 1 : getYear(new Date());
  const defaultAcademicYearForAdd = currentAcademicYear;
  const academicYearForAddOptions = Array.from({ length: 10 }).map(
    // 前後5年分の年度を生成
    // 2024 - 5 + 0 => 2019, 2024 - 5 + 9 => 2028
    (_, i) => defaultAcademicYearForAdd - 5 + i
  );
  const [academicYearForAdd, setAcademicYearForAdd] = React.useState(
    defaultAcademicYearForAdd
  );

  // gradeForAdd
  const defaultGradeForAdd = 1;
  const gradeOptions = Array.from({ length: 6 }).map((_, i) => i + 1);
  const [gradeForAdd, setGradeForAdd] = React.useState(defaultGradeForAdd);

  const {
    fields: classFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "classes",
  });

  return (
    <div className="space-y-1">
      <Label>クラス</Label>

      <div className="flex gap-2">
        <div className="flex gap-0.5 items-center">
          <Select
            value={academicYearForAdd.toString()}
            onValueChange={(value) => setAcademicYearForAdd(Number(value))}
          >
            <SelectTrigger className="h-8 w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {academicYearForAddOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p>年度</p>
        </div>

        <div className="flex gap-0.5 items-center">
          <Select
            value={gradeForAdd.toString()}
            onValueChange={(value) => setGradeForAdd(Number(value))}
          >
            <SelectTrigger className="h-8 w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gradeOptions.map((grade) => (
                <SelectItem key={grade} value={grade.toString()}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p>年</p>
        </div>
      </div>

      <div className="space-y-1">
        {classFields.map((classField, index) => (
          <FormField
            key={classField.id}
            control={form.control}
            name={`classes.${index}.name`}
            render={({ field }) => (
              <FormItem
                className={cn(
                  (classField.academicYear !== academicYearForAdd ||
                    classField.grade !== gradeForAdd) &&
                    "hidden"
                )}
              >
                <FormControl>
                  <div className="flex gap-1 items-center">
                    <p>{classField.academicYear}年度</p>
                    <p>{classField.grade}年</p>
                    <Input
                      {...field}
                      placeholder="クラス名を入力してください"
                      className="w-fit"
                    />
                    {/* 削除ボタン */}
                    <Button
                      type="button"
                      variant={"outline"}
                      size={"sm"}
                      onClick={() => {
                        remove(index);
                      }}
                      disabled={classField._count.students > 0}
                    >
                      <Icons.trash className="mr-2 w-4 h-4" />
                      削除
                    </Button>
                    <small>(生徒数: {classField._count.students}人)</small>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* 追加ボタン */}
        <Button
          type="button"
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            append({
              name: `${gradeForAdd}-?`,
              academicYear: academicYearForAdd,
              grade: gradeForAdd,
              _count: {
                students: 0,
              },
            });
          }}
        >
          <Icons.circlePlus className="mr-2 w-4 h-4" />
          追加
        </Button>
      </div>
    </div>
  );
};

export default ClassesFormField;
