import { StudentEditSchemaType } from "@/lib/validations/student";
import React, { useEffect, useTransition } from "react";
import {
  useFieldArray,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
import { Label } from "../ui/label";
import { searchClasses } from "@/lib/classes";
import { Class } from "@prisma/client";
import { calculateEnrollmentAcademicYear } from "@/lib/students";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Icons } from "../icons";

type Props = {
  form: UseFormReturn<StudentEditSchemaType>;
  classFieldArray: UseFieldArrayReturn<StudentEditSchemaType, "classes", "key">;
};

const ClassesFormField = ({ form, classFieldArray }: Props) => {
  const { fields: classes, append, remove } = classFieldArray;

  const [isPending, startTransition] = useTransition();

  const schoolId = form.watch("schoolId");
  const grade = form.watch("grade");
  const currentAcademicYear = calculateEnrollmentAcademicYear(1);

  // gradeForAdd
  const gradeOptions = Array.from({ length: 6 }).map((_, i) => i + 1);
  const [gradeForAdd, setGradeForAdd] = React.useState<number | undefined>(
    undefined
  );

  // classForAdd
  const [classOptions, setClassOptions] = React.useState<Class[][]>([]);
  const [classIdForAdd, setClassIdForAdd] = React.useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    startTransition(async () => {
      /**
       * TODO: refactor
       * - [ ] schoolIdだけでとってきて、ここで整形する
       */
      const classDataPromises = Array.from({ length: 6 }, (_, index) =>
        searchClasses({
          schoolId,
          academicYear: currentAcademicYear - grade + (index + 1), // 2024 - 3 + (0 + 1) = 2022
          grade: index + 1,
        })
      );

      const classData = await Promise.all(classDataPromises);

      setClassOptions(classData);
    });
  }, []);

  return (
    <div className="space-y-1">
      <Label>クラス</Label>

      <div className="space-y-1">
        {classes.map((class_, i) => (
          <div key={class_.key} className="flex gap-1 items-center">
            <p>
              {class_.grade}年次: {class_.name}
            </p>

            <Button
              type="button"
              variant={"outline"}
              size={"sm"}
              onClick={() => remove(i)}
              className="h-8"
            >
              <Icons.trash className="mr-2 w-4 h-4" />
              削除
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-1 items-center">
        <div className="flex gap-0.5 items-center">
          <Select
            value={gradeForAdd?.toString()}
            disabled={classOptions.length === 0 || isPending}
            onValueChange={(value) => setGradeForAdd(Number(value))}
          >
            <SelectTrigger className="h-8 w-fit">
              {isPending ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SelectValue placeholder="学年" />
              )}
            </SelectTrigger>
            <SelectContent>
              {gradeOptions
                .filter((grade) => classes.every((c) => c.grade !== grade))
                .map((grade) => (
                  <SelectItem key={grade} value={grade.toString()}>
                    {grade}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <p>年</p>
        </div>

        <Select
          onValueChange={(value) => setClassIdForAdd(value)}
          disabled={classOptions.length === 0 || isPending}
        >
          <SelectTrigger className="h-8 w-fit">
            {isPending ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <SelectValue placeholder="クラス" />
            )}
          </SelectTrigger>
          <SelectContent>
            {gradeForAdd &&
              classOptions[gradeForAdd - 1].map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            <SelectSeparator />
            <p className="text-xs">
              クラスが無い場合は、学校管理からクラスを追加してください
            </p>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant={"outline"}
          size={"sm"}
          className="h-8"
          disabled={
            typeof gradeForAdd === "undefined" ||
            typeof classIdForAdd === "undefined" ||
            isPending
          }
          onClick={() => {
            if (
              typeof gradeForAdd === "undefined" ||
              typeof classIdForAdd === "undefined"
            ) {
              return;
            }

            const classForAdd = classOptions[gradeForAdd - 1].find(
              (c) => c.id === classIdForAdd
            );
            if (typeof classForAdd === "undefined") {
              return;
            }

            append({
              id: classForAdd.id,
              name: classForAdd.name,
              academicYear: classForAdd.academicYear,
              grade: classForAdd.grade,
            });

            setGradeForAdd(undefined);
            setClassIdForAdd(undefined);
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
