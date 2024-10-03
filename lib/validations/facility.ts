import z from "zod";

export const facilityUpdateSchema = z.object({
  name: z.string().min(1),
  announcements: z.array(
    z.object({
      content: z.string().min(1),
      displayStartMonth: z.date(),
      displayEndMonth: z.date(),
    })
  ),
  scheduleEditablePeriods: z.array(
    z.object({
      targetMonth: z.date(),
      fromDate: z.date(),
      toDate: z.date(),
    })
  ),
  mealSettingActiveDates: z.array(z.date()),
});
export type FacilityUpdateSchemaType = z.infer<typeof facilityUpdateSchema>;
