import z from "zod";

export const studentCreateSchema = z.object({
  parent: z
    .object({
      id: z.string().min(1, "保護者を選択してください"),
    })
    .or(
      z.object({
        name: z.string().min(1, "保護者氏名を入力してください"),
        email: z
          .string()
          .min(1, "メールアドレスを入力してください")
          .email("メールアドレスの形式を正しく入力してください"),
      })
    ),
  // 初回登録時から2名保護者登録できたほうがいい？
  parent2: z
    .object({
      id: z.string().min(1, "保護者(2人目)を選択してください").nullable(),
    })
    .or(
      z.object({
        name: z
          .string()
          .min(1, "保護者氏名(2人目)を入力してください")
          .nullable(),
        email: z
          .string()
          .min(1, "メールアドレス(2人目)を入力してください")
          .email("メールアドレスの形式を正しく入力してください")
          .nullable(),
      })
    ),
  facilityId: z.string().min(1, "教室を選択してください"),
  schoolId: z.string().min(1, "学校を選択してください"),
  grade: z
    .number()
    .int()
    .gte(1, "学年を1~6年で選択してください")
    .lte(6, "学年を1~6年で選択してください"),
  name: z.string().min(1, "児童氏名を入力してください"),
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
  parent2: z.object({
    name: z.string().min(1, "保護者氏名(2人目)を入力してください").nullable(),
    email: z
      .string()
      .min(1, "メールアドレス(2人目)を入力してください")
      .email("メールアドレスの形式を正しく入力してください")
      .nullable(),
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
      id: z.string().optional(),
      academicYear: z.number().int(),
      grade: z.number().int().gte(1).lte(6),
      name: z.string(),
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
      program3: z
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

export const studentDeleteSchema = z.object({});
export type StudentDeleteSchemaType = z.infer<typeof studentDeleteSchema>;
