import z from "zod";

export const scheduleSchema = z.object({
  studentId: z.string(),
  start: z.date(),
  end: z.date(),
  meal: z.boolean(),
  attendance: z.boolean(),
  notes: z.string().optional(),
});
export type ScheduleSchemaType = z.infer<typeof scheduleSchema>;

export const scheduleUpdateSchema = z.object({
  start: z.date(),
  end: z.date(),
  meal: z.boolean(),
  attendance: z.boolean(),
  notes: z.string().optional(),
});
export type ScheduleUpdateSchemaType = z.infer<typeof scheduleUpdateSchema>;
