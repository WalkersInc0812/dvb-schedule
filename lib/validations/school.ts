import z from "zod";

export const schoolCreateSchema = z.object({
  name: z.string().min(1, "学校名は必須です"),
});
export type SchoolCreateSchemaType = z.infer<typeof schoolCreateSchema>;

export const schoolUpdateSchema = z.object({
  name: z.string().min(1, "学校名は必須です"),
  classes: z.array(
    z.object({
      name: z.string().min(1, "クラス名は必須です"),
      academicYear: z.number().int().min(1, "学年は必須です"),
      grade: z
        .number()
        .int()
        .gte(1, "学年を1~6年で選択してください")
        .lte(6, "学年を1~6年で選択してください"),
      _count: z.object({
        students: z.number(),
      }),
    })
  ),
});
export type SchoolUpdateSchemaType = z.infer<typeof schoolUpdateSchema>;

export const schoolDeleteSchema = z.object({});
export type SchoolDeleteSchemaType = z.infer<typeof schoolDeleteSchema>;
