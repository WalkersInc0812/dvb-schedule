import z from "zod";

export const studentCreateSchema = z.object({
  parent: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
  facilityId: z.string().min(1),
  schoolId: z.string().min(1),
  grade: z.number().int().min(1).max(6),
  classId: z.string().min(1),
  name: z.string().min(1),
});
export type StudentCreateSchemaType = z.infer<typeof studentCreateSchema>;
