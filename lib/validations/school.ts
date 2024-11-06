import z from "zod";

export const schoolCreateSchema = z.object({
  name: z.string().min(1, "学校名は必須です"),
});
export type SchoolCreateSchemaType = z.infer<typeof schoolCreateSchema>;

export const schoolUpdateSchema = z.object({
  name: z.string().min(1, "学校名は必須です"),
});
export type SchoolUpdateSchemaType = z.infer<typeof schoolUpdateSchema>;
