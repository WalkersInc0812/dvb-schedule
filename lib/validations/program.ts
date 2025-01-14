import z from "zod";

export const programCreateSchema = z.object({
  name: z.string().min(1, "習い事名は必須です"),
  shortName: z.string().optional(),
});
export type ProgramCreateSchemaType = z.infer<typeof programCreateSchema>;

export const programUpdateSchema = z.object({
  name: z.string().min(1, "習い事名は必須です"),
  shortName: z.string().optional(),
});
export type ProgramUpdateSchemaType = z.infer<typeof programUpdateSchema>;

export const programDeleteSchema = z.object({});
export type ProgramDeleteSchemaType = z.infer<typeof programDeleteSchema>;
