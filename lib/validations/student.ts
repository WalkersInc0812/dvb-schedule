import z from "zod";

const regex = {
  term: /^\d{4}-\d{1}$/,
  time: /^\d{2}:\d{2}$/,
};

export const studentCreateSchema = z.object({
  parent: z.object({
    name: z.string().min(1, "保護者氏名を入力してください"),
    email: z
      .string()
      .min(1, "メールアドレスを入力してください")
      .email("メールアドレスの形式を正しく入力してください"),
  }),
  facilityId: z.string().min(1, "教室を選択してください"),
  schoolId: z.string().min(1, "学校を選択してください"),
  grade: z
    .number()
    .int()
    .gte(1, "学年を1~6年で選択してください")
    .lte(6, "学年を1~6年で選択してください"),
  classId: z.string().min(1, "クラスを選択してください"),
  name: z.string().min(1, "児童氏名を入力してください"),
  fixedUsageDayOfWeeks: z.array(
    z.object({
      term: z.string().regex(regex.term),
      dayOfWeek: z.number().int().gte(1).lte(5),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      needPickup: z.boolean().default(false),
      program1: z
        .object({
          programId: z.string().optional(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
        })
        .optional(),
      program2: z
        .object({
          programId: z.string().optional(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
        })
        .optional(),
    })
  ),
});
export type StudentCreateSchemaType = z.infer<typeof studentCreateSchema>;

export const studentEditSchema = z.object({
  parent: z.object({
    name: z.string().min(1, "保護者氏名を入力してください"),
    email: z
      .string()
      .min(1, "メールアドレスを入力してください")
      .email("メールアドレスの形式を正しく入力してください"),
  }),
  facilityId: z.string().min(1, "教室を選択してください"),
  schoolId: z.string().min(1, "学校を選択してください"),
  grade: z
    .number()
    .int()
    .gte(1, "学年を1~6年で選択してください")
    .lte(6, "学年を1~6年で選択してください"),
  classes: z.array(
    z.object({
      id: z.string().min(1, "クラスを選択してください"),
    })
  ),
  name: z.string().min(1, "児童氏名を入力してください"),
  fixedUsageDayOfWeeks: z.array(
    z.object({
      year: z.string().regex(/^\d{4}$/),
      month: z.string().regex(/^\d{2}$/),
      dayOfWeek: z.number().int().gte(1).lte(5),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      needPickup: z.boolean().default(false),
      program1: z
        .object({
          programId: z.string().optional(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
        })
        .optional(),
      program2: z
        .object({
          programId: z.string().optional(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
        })
        .optional(),
    })
  ),
});
export type StudentEditSchemaType = z.infer<typeof studentEditSchema>;
