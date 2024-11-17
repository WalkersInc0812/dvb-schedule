// TODO: 動作確認

import { StudentEditSchemaType } from "@/lib/validations/student";
import React, { useEffect, useState, useTransition } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Label } from "../ui/label";
import { searchClasses } from "@/lib/classes";
import { Class } from "@prisma/client";
import { calculateEnrollmentAcademicYear } from "@/lib/students";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { FormControl, FormField, FormItem } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

type Props = {
  form: UseFormReturn<StudentEditSchemaType>;
};

const ClassesFormField = ({ form }: Props) => {
  const {
    fields: classes,
    update,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "classes",
  });

  console.log(classes);

  const [isPending, startTransition] = useTransition();

  const schoolId = form.watch("schoolId");
  const grade = form.watch("grade");
  const enrollmentAcademicYear = calculateEnrollmentAcademicYear(grade);
  const currentAcademicYear = calculateEnrollmentAcademicYear(1);
  const [classes1st, setClasses1st] = useState<Class[]>([]);
  const [classes2nd, setClasses2nd] = useState<Class[]>([]);
  const [classes3rd, setClasses3rd] = useState<Class[]>([]);
  const [classes4th, setClasses4th] = useState<Class[]>([]);
  const [classes5th, setClasses5th] = useState<Class[]>([]);
  const [classes6th, setClasses6th] = useState<Class[]>([]);

  useEffect(() => {
    console.log("hogehoge-");
  }, [schoolId]);

  useEffect(() => {
    startTransition(async () => {
      /**
       * TODO: refactor
       * - [ ] schoolIdだけでとってきて、ここで整形する
       */
      const _classes1st = await searchClasses({
        schoolId,
        academicYear: currentAcademicYear - grade + 1, // 2024 - 3 + 1 = 2022
        grade: 1,
      });
      setClasses1st(_classes1st);
      const _classes2nd = await searchClasses({
        schoolId,
        academicYear: currentAcademicYear - grade + 2, // 2024 - 3 + 2 = 2023
        grade: 2,
      });
      setClasses2nd(_classes2nd);
      const _classes3rd = await searchClasses({
        schoolId,
        academicYear: currentAcademicYear - grade + 3, // 2024 - 3 + 3 = 2024
        grade: 3,
      });
      setClasses3rd(_classes3rd);
      const _classes4th = await searchClasses({
        schoolId,
        academicYear: currentAcademicYear - grade + 4, // 2024 - 3 + 4 = 2025
        grade: 4,
      });
      setClasses4th(_classes4th);
      const _classes5th = await searchClasses({
        schoolId,
        academicYear: currentAcademicYear - grade + 5, // 2024 - 3 + 5 = 2026
        grade: 5,
      });
      setClasses5th(_classes5th);
      const _classes6th = await searchClasses({
        schoolId,
        academicYear: currentAcademicYear - grade + 6, // 2024 - 3 + 6 = 2027
        grade: 6,
      });
      setClasses6th(_classes6th);
    });
  }, [schoolId, grade]);

  return (
    <>
      <Label>クラス</Label>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center px-2">学年</TableHead>
            <TableHead className="text-center px-2">クラス</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="text-center">
          {Array.from({ length: 6 }).map((_, i) => {
            const grade = i + 1;
            const class_ = classes.find((class_) => class_.grade === grade);
            return (
              <div key={i}>
                <TableCell>{grade}年</TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`classes.${i}.id`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          disabled={classes.length === 0 || isPending}
                          defaultValue={class_?.id}
                        >
                          <FormControl>
                            <SelectTrigger onBlur={field.onBlur}>
                              <SelectValue placeholder="クラスを選択してください" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {classes1st.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                            <SelectSeparator />
                            {/* TODO: 追加ボタン */}
                            {/* TODO: リセットボタン */}
                            <Button
                              className="w-full py-1.5"
                              variant="secondary"
                              size="sm"
                              onClick={() => remove(i)}
                            >
                              リセット
                            </Button>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </TableCell>
              </div>
            );
          })}
        </TableBody>
      </Table>
      {Array.from({ length: 6 }).map((_, i) => {
        const _grade = i + 1;
        const class_ = classes.find((class_) => class_.grade === _grade);
        return (
          <div key={i}>
            {class_ && (
              <>
                <p>{class_.grade}年</p>
                <p>{class_.name}</p>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export default ClassesFormField;
