import z from "zod";

export const scheduleSchema = z.object({
  studentId: z.string(),
  start: z.date(),
  end: z.date(),
  meal: z.boolean(),
  notes: z.string().optional(),
});
export type ScheduleSchemaType = z.infer<typeof scheduleSchema>;

export const scheduleMultiCreateSchema = z.object({
  studentId: z.string(),
  dates: z.array(
    z.object({
      start: z.date(),
      end: z.date(),
    })
  ),
  meal: z.boolean(),
  notes: z.string().optional(),
});
export type ScheduleMultiCreateSchemaType = z.infer<
  typeof scheduleMultiCreateSchema
>;

export const scheduleUpdateSchema = z.object({
  start: z.date(),
  end: z.date(),
  meal: z.boolean(),
  notes: z.string().optional(),
});
export type ScheduleUpdateSchemaType = z.infer<typeof scheduleUpdateSchema>;

export const scheduleMultiUpdateSchema = z.object({
  ids: z.array(z.string()),
  start: z.date(),
});
export type ScheduleMultiUpdateSchemaType = z.infer<
  typeof scheduleMultiUpdateSchema
>;
