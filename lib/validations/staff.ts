import z from "zod";

export const staffCreateSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("メールアドレスを正しく入力してください"),
});
export type StaffCreateSchemaType = z.infer<typeof staffCreateSchema>;

export const staffUpdateSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("メールアドレスを正しく入力してください"),
});
export type StaffUpdateSchemaType = z.infer<typeof staffUpdateSchema>;

export const staffDeleteSchema = z.object({});
export type StaffDeleteSchemaType = z.infer<typeof staffDeleteSchema>;
